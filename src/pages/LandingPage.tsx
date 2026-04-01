import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import LogoutControl from '../components/LogoutControl'
import { useAuth } from '../context/AuthContext'

const steps = [
  'Create an account',
  'Verify with the 6-digit code',
  'Sign in and manage your profile',
]

export default function LandingPage() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const flash = (location.state as { flash?: string })?.flash

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        {flash && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {flash}
          </Alert>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                bgcolor: 'text.primary',
                display: 'grid',
                placeItems: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              N
            </Box>
            <Typography variant="h6" fontWeight={700} letterSpacing="-0.03em">
              Narnix Auth
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            {!loading && user ? (
              <>
                <Button component={RouterLink} to="/dashboard" variant="contained">
                  Open dashboard
                </Button>
                <LogoutControl />
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit">
                  Sign in
                </Button>
                <Button component={RouterLink} to="/register" variant="contained">
                  Create account
                </Button>
              </>
            )}
          </Stack>
        </Stack>

        <Stack spacing={3}>
          <Box
            sx={{
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 2.5, sm: 4 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.1,
                mb: 2,
                maxWidth: 720,
              }}
            >
              Authentication for real users.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 620 }}
            >
              Sign up, verify email, sign in, reset passwords, and manage your
              account without extra visual clutter. The interface stays plain,
              fast, and easy to scan.
            </Typography>
          
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              p: 3,
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Flow
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 1.5 }}>
              {steps.map((step, index) => (
                <Box
                  key={step}
                  sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          
        </Stack>
      </Container>
    </Box>
  )
}
