import { ApiResponse } from '@/types/response';

export const uploadImageToCloudinary = async (file: File): Promise<ApiResponse<string>> => {
    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error('Cloudinary configuration is missing');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file');
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image size must be less than 5MB');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'images');

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();

        return {
            success: true,
            data: data.secure_url,
            message: 'Image uploaded successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to upload image',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
