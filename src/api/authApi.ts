import { apiClient } from './client'
import { getDeviceId } from '../lib/deviceId'
import type {
  AuthenticationResponse,
  DeleteAccountRequest,
  EmailVerificationStatusResponse,
  ForgotPasswordRequest,
  LoginRequest,
  GlobalLogoutResponse,
  LogoutRequest,
  PasswordChangeRequest,
  PasswordResetRequestResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationOtpRequest,
  ResetPasswordRequest,
  TwoFactorStatusResponse,
  TwoFactorUpdateRequest,
  SessionResponse,
  UserProfileResponse,
  VerifyEmailOtpRequest,
  VerifyLoginTwoFactorRequest,
} from '../types/auth'

export const registerUser = async (
  payload: RegisterRequest,
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>(
    '/api/auth/register',
    payload,
  )
  return data
}

export const login = async (
  payload: LoginRequest,
): Promise<AuthenticationResponse> => {
  const { data } = await apiClient.post<AuthenticationResponse>('/api/auth/login', {
    ...payload,
    deviceId: payload.deviceId ?? getDeviceId(),
  })
  return data
}

export const verifyLoginTwoFactor = async (
  payload: VerifyLoginTwoFactorRequest,
): Promise<AuthenticationResponse> => {
  const { data } = await apiClient.post<AuthenticationResponse>(
    '/api/auth/verify-login-2fa',
    payload,
  )
  return data
}

export const verifyEmailOtp = async (
  payload: VerifyEmailOtpRequest,
): Promise<EmailVerificationStatusResponse> => {
  const { data } = await apiClient.post<EmailVerificationStatusResponse>(
    '/api/auth/verify-email',
    {
      ...payload,
      deviceId: payload.deviceId ?? getDeviceId(),
    },
  )
  return data
}

export const resendVerificationOtp = async (
  payload: ResendVerificationOtpRequest,
): Promise<EmailVerificationStatusResponse> => {
  const { data } = await apiClient.post<EmailVerificationStatusResponse>(
    '/api/auth/resend-verification-otp',
    payload,
  )
  return data
}

export const forgotPassword = async (
  payload: ForgotPasswordRequest,
): Promise<PasswordResetRequestResponse> => {
  const { data } = await apiClient.post<PasswordResetRequestResponse>(
    '/api/auth/forgot-password',
    payload,
  )
  return data
}

export const resetPassword = async (
  payload: ResetPasswordRequest,
): Promise<void> => {
  await apiClient.post('/api/auth/reset-password', {
    ...payload,
    deviceId: payload.deviceId ?? getDeviceId(),
  })
}

export const changePassword = async (
  payload: PasswordChangeRequest,
): Promise<void> => {
  await apiClient.post('/api/auth/change-password', {
    ...payload,
    deviceId: payload.deviceId ?? getDeviceId(),
  })
}

export const enableTwoFactor = async (
  payload: TwoFactorUpdateRequest,
): Promise<TwoFactorStatusResponse> => {
  const { data } = await apiClient.post<TwoFactorStatusResponse>(
    '/api/users/me/2fa/enable',
    {
      ...payload,
      deviceId: payload.deviceId ?? getDeviceId(),
    },
  )
  return data
}

export const disableTwoFactor = async (
  payload: TwoFactorUpdateRequest,
): Promise<TwoFactorStatusResponse> => {
  const { data } = await apiClient.post<TwoFactorStatusResponse>(
    '/api/users/me/2fa/disable',
    {
      ...payload,
      deviceId: payload.deviceId ?? getDeviceId(),
    },
  )
  return data
}

export const deleteMyAccount = async (
  payload: DeleteAccountRequest,
): Promise<void> => {
  await apiClient.post('/api/users/me/delete-account', {
    ...payload,
    deviceId: payload.deviceId ?? getDeviceId(),
  })
}

export const logout = async (payload: LogoutRequest): Promise<void> => {
  await apiClient.post('/api/auth/logout', payload)
}

export const logoutAll = async (): Promise<GlobalLogoutResponse> => {
  const { data } = await apiClient.post<GlobalLogoutResponse>('/api/auth/logout-all')
  return data
}

export const fetchCurrentUser = async (): Promise<UserProfileResponse> => {
  const { data } = await apiClient.get<UserProfileResponse>('/api/users/me')
  return data
}

export const listSessions = async (): Promise<SessionResponse[]> => {
  const { data } = await apiClient.get<SessionResponse[]>('/api/sessions')
  return data
}
