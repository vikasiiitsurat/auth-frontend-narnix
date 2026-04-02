import { useEffect, useState, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import LogoutControl from '../components/LogoutControl'
import TwoFactorToggle from '../components/TwoFactorToggle'
import { listSessions } from '../api/authApi'
import { useAuth } from '../context/useAuth'
import { brandColors } from '../theme/theme'
import type { SessionResponse } from '../types/auth'

export default function DashboardPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<SessionResponse[] | null>(null)
  const [sessionsError, setSessionsError] = useState<string | null>(null)
  const sessionCountLabel = sessions ? String(sessions.length) : '...'
  const twoFactorLabel = user?.twoFactorEnabled ? 'Enabled' : 'Off'
  const quickStats = [
    { label: 'Account role', value: user?.role ?? 'Member' },
    { label: 'Login 2FA', value: twoFactorLabel },
    { label: 'Active sessions', value: sessionCountLabel },
  ]

  useEffect(() => {
    let cancelled = false
    listSessions()
      .then((data) => {
        if (!cancelled) setSessions(data)
      })
      .catch(() => {
        if (!cancelled) setSessionsError('Could not load sessions.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 4, sm: 5 },
            background: `linear-gradient(135deg, ${alpha(brandColors.primaryDark, 0.96)} 0%, ${alpha(brandColors.secondaryMain, 0.96)} 42%, ${alpha(brandColors.primaryMain, 0.94)} 100%)`,
            color: 'common.white',
            p: { xs: 3, sm: 4 },
            mb: 3,
            boxShadow: `0 34px 88px ${alpha(brandColors.primaryDark, 0.2)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 280,
              height: 280,
              top: -110,
              right: -60,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.1),
            },
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={3}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  display: 'inline-flex',
                  px: 1.4,
                  py: 0.75,
                  borderRadius: 999,
                  bgcolor: alpha('#ffffff', 0.14),
                  border: `1px solid ${alpha('#ffffff', 0.14)}`,
                  mb: 1.75,
                }}
              >
                Secure account overview
              </Typography>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Dashboard
              </Typography>
              <Typography sx={{ color: alpha('#fdfefb', 0.88), maxWidth: 620 }}>
                Signed in as {user?.email ?? 'unknown user'}. Review your profile,
                tune security settings, and keep an eye on your active sessions.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.dark',
                  backgroundImage: 'none',
                  '&:hover': { bgcolor: alpha('#ffffff', 0.92) },
                }}
              >
                Home
              </Button>
              <LogoutControl variant="outlined" color="inherit" />
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
            mb: 3,
          }}
        >
          {quickStats.map((item) => (
            <Box
              key={item.label}
              sx={{
                p: 2.6,
                borderRadius: 4,
                bgcolor: alpha('#ffffff', 0.74),
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: `0 20px 45px ${alpha(brandColors.primaryDark, 0.08)}`,
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                {item.label}
              </Typography>
              <Typography variant="h5">{item.value}</Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1.25fr) minmax(0, 0.95fr)',
            },
            gap: 3,
            mb: 3,
          }}
        >
          <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            From <code>/api/users/me</code>
          </Typography>
          <Stack spacing={1}>
            <Typography>
              <strong>Name:</strong> {user?.fullName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user?.role ?? '-'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDateLabel(user?.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated: {formatDateLabel(user?.updatedAt)}
            </Typography>
          </Stack>
          <Divider sx={{ my: 2.5 }} />
          <TwoFactorToggle />
          </Paper>

          <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography variant="h6" gutterBottom>
              Password &amp; security
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Change your password or continue with the email reset flow.
            </Typography>
            <Stack spacing={1.5}>
              <Button
                component={RouterLink}
                to="/change-password"
                variant="contained"
                startIcon={<KeySvg />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Change password
              </Button>
              <Button
                component={RouterLink}
                to="/forgot-password"
                state={{ email: user?.email ?? '' }}
                variant="outlined"
                startIcon={<LockResetSvg />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Reset password via email
              </Button>
              <Button
                component={RouterLink}
                to="/reset-password"
                state={{ email: user?.email ?? '' }}
                variant="outlined"
                startIcon={<LockResetSvg />}
                sx={{ justifyContent: 'flex-start' }}
              >
                I have a reset code
              </Button>
            </Stack>
          </Paper>
        </Box>

        <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="error">
            Danger zone
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Permanently delete your account after confirming your email and
            password.
          </Typography>
          <Button
            component={RouterLink}
            to="/delete-account"
            variant="outlined"
            color="error"
            startIcon={<PersonOffSvg />}
          >
            Delete account
          </Button>
        </Paper>

        <Paper sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography variant="h6" gutterBottom>
            Active sessions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            From <code>/api/sessions</code>
          </Typography>
          {sessionsError && (
            <Typography color="error" variant="body2">
              {sessionsError}
            </Typography>
          )}
          {!sessionsError && sessions === null && (
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          )}
          {sessions && sessions.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No sessions returned.
            </Typography>
          )}
          {sessions && sessions.length > 0 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Device</TableCell>
                    <TableCell>Current</TableCell>
                    <TableCell>Last used</TableCell>
                    <TableCell>Expires</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.sessionId}>
                      <TableCell>{s.deviceId}</TableCell>
                      <TableCell>{s.current ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{formatDateLabel(s.lastUsedAt)}</TableCell>
                      <TableCell>{formatDateLabel(s.expiresAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">
          <Link component={RouterLink} to="/verify-email">
            Verify email
          </Link>
        </Typography>
      </Container>
    </Box>
  )
}

function formatDateLabel(value?: string | null) {
  if (!value) return '-'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        '& svg': { width: 20, height: 20 },
      }}
    >
      {children}
    </Box>
  )
}

function KeySvg() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M7 11V8a5 5 0 0110 0v3M5 11h14v10H5V11zM12 15v2" />
      </svg>
    </IconWrap>
  )
}

function LockResetSvg() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 11V8a8 8 0 1116 0v3M5 11h14v10H5V11zM12 15v2" />
        <path d="M9 3l2 2 4-4" strokeLinecap="round" />
      </svg>
    </IconWrap>
  )
}

function PersonOffSvg() {
  return (
    <IconWrap>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 20h16M8 11a4 4 0 108 0M3 4l18 18" strokeLinecap="round" />
      </svg>
    </IconWrap>
  )
}
