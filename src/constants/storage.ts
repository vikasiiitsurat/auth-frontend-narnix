export const OTP_EMAIL_KEY = 'otp-email'
export const OTP_META_KEY = 'otp-meta'
export const AUTH_SESSION_KEY = 'auth_session'
export const LOGIN_2FA_EMAIL_KEY = 'login-2fa-email'
export const LOGIN_2FA_CHALLENGE_KEY = 'login-2fa-challenge'
export const LOGIN_2FA_META_KEY = 'login-2fa-meta'
export const LOGIN_2FA_REDIRECT_KEY = 'login-2fa-redirect'

export interface OtpMeta {
  otpExpiresInSeconds: number
  resendAvailableInSeconds: number
}

export interface StoredAuthSession {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
}
