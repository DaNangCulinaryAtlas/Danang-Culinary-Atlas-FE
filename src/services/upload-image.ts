import { ApiResponse } from '@/types/response';

export const uploadImageToCloudinary = async (file: File): Promise<ApiResponse<string>> => {
    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error('Cloudinary Config Missing:', {
                cloudName: cloudName ? 'SET' : 'MISSING',
                uploadPreset: uploadPreset ? 'SET' : 'MISSING',
                allEnvKeys: Object.keys(process.env).filter(k => k.includes('CLOUDINARY'))
            });
            throw new Error('Cloudinary configuration is missing. Please check environment variables.');
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
            const errorData = await response.json().catch(() => ({}));
            console.error('Cloudinary Upload Failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`Failed to upload image: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            success: true,
            data: data.secure_url,
            message: 'Image uploaded successfully'
        };
    } catch (error) {
        console.error('Upload Image Error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to upload image',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};
