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
  email: string
  fullName: string | null
  avatarUrl: string | null
  roles: string[]
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