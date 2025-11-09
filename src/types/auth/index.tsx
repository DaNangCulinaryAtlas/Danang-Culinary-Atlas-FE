export type TLoginAuth = {
  email: string
  password: string
}

export type TSignUpAuth = {
  email: string
  password: string
  role: string
}
export type TChangePassword = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
export type TForgotPasswordAuth = {
  email: string
}
export type TResetPasswordAuth = {
  newPassword: string
  secretKey: string
}

export type TUserProfile = {
  accountId: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  status: string
  dob: string | null
  gender: string | null
}

export type TUpdateProfile = {
  fullName?: string
  avatarUrl?: string
  dob?: string
  gender?: string
}