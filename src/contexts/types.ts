export type ErrCallbackType = (err: any) => void

export type LoginParams = {
  email: string
  password: string
}

export type TUserAddresses = {
  address: string,
  city: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  middleName: string,
  isDefault: boolean,
}

export type LoginGoogleParams = {
  idToken: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: string
  role: string[]
  email: string
  fullName: string
  avatarUrl?: string

}

export type AuthValuesType = {
    loading: boolean
    logout: () => void
    user: UserDataType | null
    setLoading: (value: boolean) => void
    setUser: (value: UserDataType | null) => void
    login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
    loginGoogle: (params: LoginGoogleParams, errorCallback?: ErrCallbackType) => void
    loginFacebook: (params: LoginFacebookParams, errorCallback?: ErrCallbackType) => void
  }

export type LoginFacebookParams = {
  idToken: string
  rememberMe?: boolean
}