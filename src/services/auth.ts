import { AxiosError, AxiosResponse } from 'axios';
import instanceAxios from '@/helpers/axios';
import { API_ENDPOINTS } from '@/configs/api';
import {
  TLoginAuth,
  TSignUpAuth,
  TForgotPasswordAuth,
  TResetPasswordAuth,
  TChangePassword
} from '@/types/auth';
import { ApiResponse } from '@/types/response';

export const loginAuth = async (data: TLoginAuth): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.post(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    return {
      success: true,
      data: response.data,
      message: 'Login successful'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Login failed',
      error: axiosError.message
    };
  }
};

export const registerAuth = async (data: TSignUpAuth): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.post(
      API_ENDPOINTS.AUTH.SIGNUP,
      data
    );
    return {
      success: true,
      data: response.data,
      message: 'Registration successful'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Sign up failed',
      error: axiosError.message
    };
  }
};

export const forgotPasswordAuth = async (data: TForgotPasswordAuth): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return {
      success: true,
      data: response.data,
      message: 'Password reset email sent'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to send reset email',
      error: axiosError.message
    };
  }
};

export const resetPasswordAuth = async (data: TResetPasswordAuth): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return {
      success: true,
      data: response.data,
      message: 'Password reset successful'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Password reset failed',
      error: axiosError.message
    };
  }
};

export const changePasswordAuth = async (data: TChangePassword): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.patch(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
    return {
      success: true,
      data: response.data,
      message: 'Password changed successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to change password',
      error: axiosError.message
    };
  }
};

export const refreshTokenAuth = async (refreshToken: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse = await instanceAxios.post(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );

    // Backend returns: { data: { accessToken, refreshToken } }
    const responseData = response.data.data || response.data;
    return {
      success: true,
      data: {
        token: responseData.accessToken || responseData.token,
        refreshToken: responseData.refreshToken,
        ...responseData
      },
      message: 'Token refreshed successfully'
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to refresh token',
      error: axiosError.message
    };
  }
};