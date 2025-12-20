import { useMutation, useQueryClient } from '@tanstack/react-query';
import { triggerTraining } from '@/services/recommendation';
import { toast } from 'sonner';

export const useTrainingTrigger = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: triggerTraining,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.data?.message || 'Training started successfully');
                // Invalidate related queries
                queryClient.invalidateQueries({ queryKey: ['training-status'] });
                queryClient.invalidateQueries({ queryKey: ['recommendation-health'] });
            } else {
                toast.error(response.message || 'Failed to start training');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to trigger training');
        },
    });
};
