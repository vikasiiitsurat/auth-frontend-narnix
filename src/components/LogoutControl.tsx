import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../lib/apiError'

type LogoutControlProps = {
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  label?: string
}

export default function LogoutControl({
  variant = 'outlined',
  color = 'inherit',
  size = 'medium',
  label = 'Sign out',
}: LogoutControlProps) {
  const navigate = useNavigate()
  const { logout, logoutEverywhere } = useAuth()
  const [open, setOpen] = useState(false)
  const [loadingMode, setLoadingMode] = useState<'current' | 'all' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmGlobal, setConfirmGlobal] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  const requiredPhrase = 'LOGOUT ALL'

  const handleClose = () => {
    if (loadingMode) return
    setOpen(false)
    setError(null)
    setConfirmGlobal(false)
    setConfirmationText('')
  }

  const handleLogoutCurrent = async () => {
    setError(null)
    setLoadingMode('current')
    try {
      await logout()
      navigate('/', {
        replace: true,
        state: { flash: 'Signed out on this device.' },
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(getApiErrorMessage(err, 'Could not sign out right now.'))
      } else {
        setError('Could not sign out right now.')
      }
    } finally {
      setLoadingMode(null)
    }
  }

  const handleLogoutEverywhere = async () => {
    setError(null)
    setLoadingMode('all')
    try {
      const response = await logoutEverywhere()
      navigate('/', {
        replace: true,
        state: {
          flash:
            response.revokedSessions > 0
              ? `Signed out everywhere. ${response.revokedSessions} session(s) were revoked.`
              : 'Signed out everywhere.',
        },
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(
          getApiErrorMessage(err, 'Could not sign out on all devices right now.'),
        )
      } else {
        setError('Could not sign out on all devices right now.')
      }
    } finally {
      setLoadingMode(null)
    }
  }

  const canConfirmGlobal = confirmationText.trim().toUpperCase() === requiredPhrase

  return (
    <>
      <Button
        variant={variant}
        color={color}
        size={size}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Sign out</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {!confirmGlobal ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Choose whether you want to sign out only on this device or close
                  every active session for your account.
                </Typography>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    This device
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Signs you out here and keeps your other devices active.
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'error.light',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: 'rgba(220, 38, 38, 0.04)',
                  }}
                >
                  <Typography variant="subtitle2" color="error.main" gutterBottom>
                    All devices
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ends every active session for this account and invalidates
                    previously issued access tokens across your app instances.
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Alert severity="warning">
                  Global logout will sign you out on every device, not just this one.
                </Alert>
                <Typography variant="body2" color="text.secondary">
                  To prevent accidents, type <strong>{requiredPhrase}</strong> before
                  continuing.
                </Typography>
                <TextField
                  label="Confirmation phrase"
                  value={confirmationText}
                  onChange={(event) => setConfirmationText(event.target.value)}
                  autoFocus
                  fullWidth
                />
              </>
            )}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 0,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {!confirmGlobal ? (
            <>
              <Button
                onClick={handleClose}
                color="inherit"
                disabled={Boolean(loadingMode)}
              >
                Cancel
              </Button>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
               
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setError(null)
                    setConfirmGlobal(true)
                  }}
                  disabled={Boolean(loadingMode)}
                >
                  All devices
                </Button>
                 <Button
                  variant="outlined"
                  onClick={handleLogoutCurrent}
                  disabled={Boolean(loadingMode)}
                >
                  {loadingMode === 'current' ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    'This device'
                  )}
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  if (loadingMode) return
                  setConfirmGlobal(false)
                  setConfirmationText('')
                  setError(null)
                }}
                color="inherit"
                disabled={Boolean(loadingMode)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogoutEverywhere}
                disabled={!canConfirmGlobal || Boolean(loadingMode)}
              >
                {loadingMode === 'all' ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  'Confirm global logout'
                )}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
