import { AxiosError } from 'axios'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { disableTwoFactor, enableTwoFactor } from '../api/authApi'
import { useAuth } from '../context/useAuth'
import { getApiErrorMessage } from '../lib/apiError'

export default function TwoFactorToggle() {
  const { user, refreshUser } = useAuth()
  const enabled = Boolean(user?.twoFactorEnabled)
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const enabledAtLabel = user?.twoFactorEnabledAt
    ? new Date(user.twoFactorEnabledAt).toLocaleString()
    : null

  const handleClose = () => {
    if (loading) return
    setOpen(false)
    setCurrentPassword('')
    setError(null)
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)
    if (currentPassword.length < 8 || currentPassword.length > 72) {
      setError('Enter your current password to confirm this change.')
      return
    }

    setLoading(true)
    try {
      const response = enabled
        ? await disableTwoFactor({ currentPassword })
        : await enableTwoFactor({ currentPassword })
      await refreshUser()
      setSuccess(response.message)
      setCurrentPassword('')
      setOpen(false)
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status
        if (status === 401) {
          setError(
            getApiErrorMessage(err, 'Current password is incorrect or expired.'),
          )
        } else {
          setError(getApiErrorMessage(err, 'Could not update login 2FA.'))
        }
      } else {
        setError('Could not update login 2FA.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Login 2FA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Require a 6-digit email code after password sign-in.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              variant="body2"
              color={enabled ? 'text.primary' : 'text.secondary'}
              fontWeight={enabled ? 600 : 400}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </Typography>
            <Switch
              checked={enabled}
              onChange={() => {
                setError(null)
                setOpen(true)
              }}
              color="primary"
            />
          </Stack>
        </Stack>

        {enabledAtLabel && (
          <Typography variant="caption" color="text.secondary">
            Enabled at {enabledAtLabel}
          </Typography>
        )}

        {success && <Alert severity="success">{success}</Alert>}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{enabled ? 'Disable login 2FA' : 'Enable login 2FA'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity={enabled ? 'warning' : 'info'}>
              {enabled
                ? 'Turning this off removes the extra OTP step during login.'
                : 'Turning this on adds an email OTP step after password login.'}
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Enter your current password to confirm this security change.
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              fullWidth
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={enabled ? 'error' : 'primary'}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : enabled ? (
              'Disable 2FA'
            ) : (
              'Enable 2FA'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
