import { z } from 'zod';

export const restaurantFormSchema = z.object({
    name: z.string()
        .min(3, 'Tên quán ăn phải có ít nhất 3 ký tự')
        .max(100, 'Tên quán ăn không được quá 100 ký tự'),

    address: z.string()
        .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
        .max(200, 'Địa chỉ không được quá 200 ký tự'),

    wardId: z.coerce.number()
        .positive('Vui lòng chọn phường/xã'),

    latitude: z.number()
        .min(-90, 'Vĩ độ không hợp lệ')
        .max(90, 'Vĩ độ không hợp lệ'),

    longitude: z.number()
        .min(-180, 'Kinh độ không hợp lệ')
        .max(180, 'Kinh độ không hợp lệ'),

    mainImage: z.instanceof(File, { message: 'Vui lòng chọn ảnh chính' })
        .refine((file) => file.size <= 5 * 1024 * 1024, 'Ảnh phải nhỏ hơn 5MB')
        .refine((file) => file.type.startsWith('image/'), 'Chỉ chấp nhận file ảnh'),

    subImages: z.array(z.instanceof(File))
        .max(5, 'Tối đa 5 ảnh phụ')
        .refine(
            (files) => files.every(file => file.size <= 5 * 1024 * 1024),
            'Mỗi ảnh phải nhỏ hơn 5MB'
        )
        .refine(
            (files) => files.every(file => file.type.startsWith('image/')),
            'Chỉ chấp nhận file ảnh'
        ),

    tagIds: z.array(z.number())
        .min(1, 'Vui lòng chọn ít nhất 1 tag')
        .max(10, 'Tối đa 10 tags'),

    openingHours: z.record(z.string(), z.string())
        .refine(
            (hours) => Object.keys(hours).length > 0,
            'Vui lòng thêm ít nhất 1 giờ mở cửa'
        ),
});

export type RestaurantFormData = z.infer<typeof restaurantFormSchema>;
