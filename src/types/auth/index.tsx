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
  }
  export type TForgotPasswordAuth = {
    email: string
  }
  export type TResetPasswordAuth = {
    newPassword: string
    secretKey: string
 }