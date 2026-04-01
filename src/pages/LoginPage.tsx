import { AxiosError } from 'axios'
import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AuthLayout from '../components/AuthLayout'
import {
  LOGIN_2FA_CHALLENGE_KEY,
  LOGIN_2FA_EMAIL_KEY,
  LOGIN_2FA_META_KEY,
  LOGIN_2FA_REDIRECT_KEY,
} from '../constants/storage'
import { useAuth } from '../context/useAuth'
import { getApiErrorMessage } from '../lib/apiError'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    '/dashboard'
  const flashMessage = (location.state as { flash?: string })?.flash

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const pwdOk = password.length >= 8 && password.length <= 72
  const canSubmit = emailOk && pwdOk && !loading

  const clearTwoFactorChallenge = () => {
    sessionStorage.removeItem(LOGIN_2FA_EMAIL_KEY)
    sessionStorage.removeItem(LOGIN_2FA_CHALLENGE_KEY)
    sessionStorage.removeItem(LOGIN_2FA_META_KEY)
    sessionStorage.removeItem(LOGIN_2FA_REDIRECT_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    clearTwoFactorChallenge()
    if (!emailOk || !pwdOk) {
      setError('Enter a valid email and password (8-72 characters).')
      return
    }
    setLoading(true)
    try {
      const response = await login(email.trim(), password)
      if (response.twoFactorChallengeToken) {
        sessionStorage.setItem(LOGIN_2FA_EMAIL_KEY, email.trim())
        sessionStorage.setItem(
          LOGIN_2FA_CHALLENGE_KEY,
          response.twoFactorChallengeToken,
        )
        sessionStorage.setItem(
          LOGIN_2FA_META_KEY,
          JSON.stringify({
            otpExpiresInSeconds: response.twoFactorExpiresInSeconds ?? 300,
            resendAvailableInSeconds:
              response.twoFactorResendAvailableInSeconds ?? 0,
          }),
        )
        sessionStorage.setItem(LOGIN_2FA_REDIRECT_KEY, from)
        navigate('/login-2fa', { replace: true })
      } else if (response.accessToken && response.refreshToken) {
        clearTwoFactorChallenge()
        navigate(from, { replace: true })
      } else {
        setError(response.message || 'Could not complete sign-in.')
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status
        if (status === 401) {
          setError(getApiErrorMessage(err, 'Invalid email or password.'))
        } else if (status === 403) {
          setError(
            getApiErrorMessage(
              err,
              'Verify your email address before signing in.',
            ),
          )
        } else if (status === 423) {
          setError(
            getApiErrorMessage(
              err,
              'Your account is temporarily locked. Please wait and try again.',
            ),
          )
        } else if (status === 429) {
          setError(
            getApiErrorMessage(
              err,
              'Too many sign-in attempts. Please wait and try again.',
            ),
          )
        } else {
          setError(getApiErrorMessage(err))
        }
      } else {
        setError('Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your password. If login 2FA is enabled, we'll ask for a short email code next."
      footer={
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          New here?{' '}
          <Link component={RouterLink} to="/register" fontWeight={600}>
            Create an account
          </Link>
        </Typography>
      }
    >
      {flashMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {flashMessage}
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Box sx={{ textAlign: 'right' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
          </Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!canSubmit}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Sign in'
            )}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
