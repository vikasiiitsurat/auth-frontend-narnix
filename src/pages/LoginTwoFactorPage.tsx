import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
import { useAuth } from '../context/useAuth'
import {
  LOGIN_2FA_CHALLENGE_KEY,
  LOGIN_2FA_EMAIL_KEY,
  LOGIN_2FA_META_KEY,
  LOGIN_2FA_REDIRECT_KEY,
  type OtpMeta,
} from '../constants/storage'
import { getApiErrorMessage } from '../lib/apiError'

function readLoginTwoFactorMeta(): OtpMeta | null {
  try {
    const raw = sessionStorage.getItem(LOGIN_2FA_META_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OtpMeta
  } catch {
    return null
  }
}

export default function LoginTwoFactorPage() {
  const navigate = useNavigate()
  const { verifyLoginTwoFactor } = useAuth()
  const email = useMemo(() => sessionStorage.getItem(LOGIN_2FA_EMAIL_KEY) || '', [])
  const challengeToken = useMemo(
    () => sessionStorage.getItem(LOGIN_2FA_CHALLENGE_KEY) || '',
    [],
  )
  const redirectTo = useMemo(
    () => sessionStorage.getItem(LOGIN_2FA_REDIRECT_KEY) || '/dashboard',
    [],
  )
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
    const meta = readLoginTwoFactorMeta()
    return meta?.otpExpiresInSeconds ?? null
  })

  useEffect(() => {
    if (!challengeToken) {
      navigate('/login', { replace: true })
    }
  }, [challengeToken, navigate])

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return
    const id = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value === null || value <= 0) return value
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [secondsLeft])

  const otpOk = /^\d{6}$/.test(otp.trim())

  const clearChallenge = () => {
    sessionStorage.removeItem(LOGIN_2FA_CHALLENGE_KEY)
    sessionStorage.removeItem(LOGIN_2FA_EMAIL_KEY)
    sessionStorage.removeItem(LOGIN_2FA_META_KEY)
    sessionStorage.removeItem(LOGIN_2FA_REDIRECT_KEY)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!otpOk || !challengeToken) {
      setError('Enter the 6-digit code we sent to your email.')
      return
    }

    setLoading(true)
    try {
      await verifyLoginTwoFactor(challengeToken, otp.trim())
      clearChallenge()
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status
        if (status === 400) {
          setError(getApiErrorMessage(err, 'Invalid or expired login code.'))
        } else if (status === 429) {
          setError(
            getApiErrorMessage(
              err,
              'Too many attempts. Please wait before trying again.',
            ),
          )
        } else {
          setError(getApiErrorMessage(err, 'Could not verify login code.'))
        }
      } else {
        setError('Could not verify login code.')
      }
    } finally {
      setLoading(false)
    }
  }

  const otpHint =
    secondsLeft !== null && secondsLeft > 0
      ? `Code expires in ${Math.ceil(secondsLeft / 60)} min ${secondsLeft % 60}s`
      : 'If the code expires, go back and sign in again to request a new one.'

  return (
    <AuthLayout
      title="Confirm your sign-in"
      subtitle={
        email
          ? `Enter the 6-digit login code sent to ${email}.`
          : 'Enter the 6-digit login code sent to your email.'
      }
      footer={
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Need a new code?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600} onClick={clearChallenge}>
            Start sign-in again
          </Link>
        </Typography>
      }
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Login code"
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
            }
            inputProps={{
              inputMode: 'numeric',
              pattern: '\\d{6}',
              maxLength: 6,
              'aria-label': 'Six-digit login verification code',
            }}
            helperText={otpHint}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={!otpOk || loading}>
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Verify and continue'
            )}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  )
}
