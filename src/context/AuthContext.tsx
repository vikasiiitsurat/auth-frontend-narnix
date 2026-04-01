import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearPersistedSession,
  getRefreshToken,
  loadSessionFromStorage,
  persistSession,
} from '../api/client'
import * as authApi from '../api/authApi'
import { AUTH_SESSION_KEY } from '../constants/storage'
import { AuthContext, type AuthContextValue } from './auth-context'
import type {
  AuthenticationResponse,
  LoginResponse,
  UserProfileResponse,
} from '../types/auth'

function hasStoredSession() {
  return Boolean(localStorage.getItem(AUTH_SESSION_KEY))
}

function hasCompleteTokenSet(
  response: AuthenticationResponse,
): response is AuthenticationResponse &
  Required<
    Pick<
      LoginResponse,
      'accessToken' | 'refreshToken' | 'tokenType' | 'expiresInSeconds'
    >
  > {
  return Boolean(
    response.accessToken &&
      response.refreshToken &&
      response.tokenType &&
      typeof response.expiresInSeconds === 'number',
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileResponse | null>(null)
  const [loading, setLoading] = useState(() => hasStoredSession())

  const refreshUser = useCallback(async () => {
    const data = await authApi.fetchCurrentUser()
    setUser(data)
  }, [])

  const establishSession = useCallback(
    async (response: AuthenticationResponse) => {
      if (!hasCompleteTokenSet(response)) {
        throw new Error('Authentication did not return a complete session.')
      }

      const tokens: LoginResponse = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        tokenType: response.tokenType,
        expiresInSeconds: response.expiresInSeconds,
      }

      persistSession(tokens)
      try {
        await refreshUser()
      } catch (error) {
        clearPersistedSession()
        setUser(null)
        throw error
      }
    },
    [refreshUser],
  )

  useEffect(() => {
    if (!hasStoredSession()) return

    loadSessionFromStorage()
    let cancelled = false

    authApi.fetchCurrentUser()
      .then((data) => {
        if (!cancelled) {
          setUser(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearPersistedSession()
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login({ email, password })
      if (hasCompleteTokenSet(response)) {
        await establishSession(response)
      }
      return response
    },
    [establishSession],
  )

  const verifyLoginTwoFactor = useCallback(
    async (challengeToken: string, otp: string) => {
      const response = await authApi.verifyLoginTwoFactor({
        challengeToken,
        otp,
      })
      await establishSession(response)
    },
    [establishSession],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout({
        refreshToken: getRefreshToken() ?? undefined,
      })
    } catch {
      // still clear local session
    }
    clearPersistedSession()
    setUser(null)
  }, [])

  const logoutEverywhere = useCallback(async () => {
    const response = await authApi.logoutAll()
    clearPersistedSession()
    setUser(null)
    return response
  }, [])

  const clearSession = useCallback(() => {
    clearPersistedSession()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      verifyLoginTwoFactor,
      logout,
      logoutEverywhere,
      clearSession,
      refreshUser,
    }),
    [
      user,
      loading,
      login,
      verifyLoginTwoFactor,
      logout,
      logoutEverywhere,
      clearSession,
      refreshUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
