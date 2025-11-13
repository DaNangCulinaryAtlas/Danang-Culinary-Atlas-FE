import { z } from 'zod';

// =====================================================
// AUTH VALIDATION SCHEMAS
// =====================================================

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
        .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
        .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
    confirmPassword: z
        .string()
        .min(1, 'Xác nhận mật khẩu là bắt buộc'),
        role: z.enum(['USER', 'VENDOR']),
    agreeTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: 'Bạn phải đồng ý với điều khoản và điều kiện',
        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
});

export const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(1, 'Mật khẩu mới là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
        .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
        .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
    confirmPassword: z
        .string()
        .min(1, 'Xác nhận mật khẩu là bắt buộc'),
    secretKey: z
        .string()
        .min(1, 'Mã xác thực là bắt buộc'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: z
        .string()
        .min(1, 'Mật khẩu mới là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
        .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
        .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
    confirmPassword: z
        .string()
        .min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
});

// =====================================================
// PROFILE VALIDATION SCHEMAS
// =====================================================

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(1, 'Họ và tên là bắt buộc')
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
        .max(50, 'Họ và tên không được quá 50 ký tự')
        .optional(),
    avatarUrl: z
        .string()
        .url('URL ảnh không hợp lệ')
        .optional(),
    dob: z
        .string()
        .refine((date) => {
            if (!date) return true;
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 13 && age <= 120;
        }, {
            message: 'Bạn phải từ 13 tuổi trở lên',
        })
        .optional(),
    gender: z
        .enum(['MALE', 'FEMALE', 'OTHER'])
        .optional(),
});

// =====================================================
// TYPE INFERENCE
// =====================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
