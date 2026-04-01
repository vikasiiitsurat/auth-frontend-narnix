import { createContext } from 'react'
import type {
  AuthenticationResponse,
  GlobalLogoutResponse,
  UserProfileResponse,
} from '../types/auth'

export type AuthContextValue = {
  user: UserProfileResponse | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthenticationResponse>
  verifyLoginTwoFactor: (challengeToken: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  logoutEverywhere: () => Promise<GlobalLogoutResponse>
  clearSession: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
