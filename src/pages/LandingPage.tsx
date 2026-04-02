import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import LogoutControl from '../components/LogoutControl'
import { useAuth } from '../context/useAuth'
import { brandColors } from '../theme/theme'

const flowSteps = [
  'Register with your name and email',
  'Enter the 6-digit code we send you',
  'Sign in and open your dashboard',
]

const featureCards = [
  {
    title: 'Layered protection',
    description:
      'Abuse-aware login and OTP flows designed to reduce risk without punishing real users.',
    icon: ShieldOutlinedIcon,
  },
  {
    title: 'Session control',
    description:
      'JWT access tokens with refresh rotation and tools to review active devices.',
    icon: LockOutlinedIcon,
  },
  {
    title: 'Built for production',
    description:
      'Email verification, password reset, and account recovery aligned with your API.',
    icon: DesktopWindowsOutlinedIcon,
  },
]

const primaryButtonSx = {
  minHeight: 56,
  px: 3.5,
  borderRadius: 2.5,
  fontSize: '1rem',
  fontWeight: 700,
  backgroundImage: `linear-gradient(135deg, ${brandColors.primaryMain} 0%, ${brandColors.secondaryMain} 100%)`,
  bgcolor: brandColors.primaryMain,
  boxShadow: `0 14px 30px ${alpha(brandColors.primaryDark, 0.2)}`,
  '&:hover': {
    backgroundImage: `linear-gradient(135deg, ${brandColors.secondaryMain} 0%, ${brandColors.primaryDark} 100%)`,
    bgcolor: brandColors.secondaryMain,
    boxShadow: `0 18px 32px ${alpha(brandColors.primaryDark, 0.26)}`,
  },
}

const secondaryButtonSx = {
  minHeight: 56,
  px: 3.5,
  borderRadius: 2.5,
  fontSize: '1rem',
  fontWeight: 700,
  color: brandColors.primaryDark,
  borderColor: alpha(brandColors.primaryDark, 0.24),
  backgroundColor: alpha('#ffffff', 0.56),
  '&:hover': {
    borderColor: alpha(brandColors.primaryDark, 0.4),
    backgroundColor: alpha('#ffffff', 0.84),
  },
}

export default function LandingPage() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const flash = (location.state as { flash?: string })?.flash

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: brandColors.pageBackground,
        borderTop: `4px solid ${brandColors.primaryDark}`,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(12px)',
        },
        '&::before': {
          width: 520,
          height: 520,
          top: -180,
          left: 180,
            background:
            `radial-gradient(circle, ${alpha(brandColors.primaryLight, 0.24)} 0%, ${alpha(brandColors.primaryLight, 0)} 72%)`,
        },
        '&::after': {
          width: 580,
          height: 580,
          top: 140,
          right: -180,
          background:
            `radial-gradient(circle, ${alpha(brandColors.secondaryLight, 0.22)} 0%, ${alpha(brandColors.secondaryLight, 0)} 74%)`,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 3, md: 4 } }}>
        {flash && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {flash}
          </Alert>
        )}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: { xs: 5, md: 7 } }}
        >
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            alignItems="center"
            spacing={1.75}
            sx={{ textDecoration: 'none', color: 'text.primary' }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: 'common.white',
                bgcolor: brandColors.primaryMain,
                boxShadow: `0 14px 26px ${alpha(brandColors.primaryDark, 0.22)}`,
              }}
            >
              N
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.95rem' },
                fontWeight: 700,
                letterSpacing: '-0.04em',
              }}
            >
              Narnix Auth
            </Typography>
          </Stack>

          {!loading && user ? (
            <Stack direction="row" spacing={1.5}>
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: brandColors.primaryDark,
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: 'transparent', color: brandColors.primaryMain },
                }}
              >
                Dashboard
              </Button>
              <LogoutControl variant="contained" sx={primaryButtonSx} />
            </Stack>
          ) : (
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                sx={{
                  minWidth: 0,
                  px: 1,
                  color: brandColors.primaryDark,
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: 'transparent', color: brandColors.primaryMain },
                }}
              >
                Sign in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={primaryButtonSx}
              >
                Create account
              </Button>
            </Stack>
          )}
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.45fr) minmax(340px, 0.82fr)' },
            gap: { xs: 4, lg: 5 },
            alignItems: 'center',
            mb: { xs: 5, md: 7 },
          }}
        >
          <Box sx={{ maxWidth: 860 }}>
            <Typography
              component="h1"
              sx={{
                maxWidth: 820,
                mb: 2.5,
                fontSize: { xs: '3rem', sm: '4rem', lg: '4.7rem' },
                lineHeight: { xs: 1.02, sm: 1.03 },
                letterSpacing: '-0.07em',
                fontWeight: 650,
                color: brandColors.primaryDark,
              }}
            >
              Please do Authentication 
            </Typography>

            <Typography
              sx={{
                maxWidth: 740,
                mb: 4.5,
                fontSize: { xs: '1.2rem', md: '1.35rem' },
                lineHeight: 1.55,
                color: brandColors.textSecondary,
              }}
            >
              Register, verify your email with a one-time code, sign in, and you can manage
              your profile.
            </Typography>

            {!loading && user ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  variant="contained"
                  sx={primaryButtonSx}
                >
                  Open dashboard
                </Button>
                <LogoutControl variant="outlined" sx={secondaryButtonSx} />
              </Stack>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={primaryButtonSx}
                >
                  Get started
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={secondaryButtonSx}
                >
                  I already have an account
                </Button>
              </Stack>
            )}
          </Box>

          <Box
            sx={{
              justifySelf: { xs: 'stretch', lg: 'end' },
              borderRadius: '2rem',
              p: { xs: 3, sm: 4 },
              bgcolor: alpha('#ffffff', 0.82),
              border: `1px solid ${alpha(brandColors.primaryDark, 0.12)}`,
              boxShadow: `0 18px 40px ${alpha(brandColors.primaryDark, 0.12)}`,
              maxWidth: 560,
            }}
          >
            <Typography
              sx={{
                mb: 1.5,
                fontSize: '1.1rem',
                fontWeight: 500,
                color: brandColors.primaryMain,
              }}
            >
              Today&apos;s flow
            </Typography>
            <Box
              component="ol"
              sx={{
                m: 0,
                pl: '1.4rem',
                color: brandColors.textSecondary,
                fontSize: { xs: '1.2rem', sm: '1.3rem' },
                lineHeight: 1.6,
              }}
            >
              {flowSteps.map((step) => (
                <Box component="li" key={step}>
                  {step}
                </Box>
              ))}
            </Box>
            <Typography
              sx={{
                mt: 3.5,
                fontSize: { xs: '1.02rem', sm: '1.1rem' },
                lineHeight: 1.8,
                color: alpha(brandColors.textSecondary, 0.88),
              }}
            >
              Errors from the API (validation, conflicts, rate limits) surface
              inline, no silent failures.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {featureCards.map((item) => {
            const Icon = item.icon

            return (
              <Box
                key={item.title}
                sx={{
                  minHeight: 236,
                  borderRadius: '2rem',
                  p: { xs: 3, sm: 4 },
                  bgcolor: alpha('#ffffff', 0.84),
                  border: `1px solid ${alpha(brandColors.primaryDark, 0.12)}`,
                  boxShadow: `0 16px 34px ${alpha(brandColors.primaryDark, 0.08)}`,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    mb: 3.5,
                    bgcolor: alpha(brandColors.primaryLight, 0.24),
                    color: brandColors.primaryMain,
                  }}
                >
                  <Icon sx={{ fontSize: 32 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 1.5,
                    fontSize: { xs: '2rem', sm: '2.15rem' },
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    color: brandColors.primaryDark,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 360,
                    fontSize: '1rem',
                    lineHeight: 1.55,
                    color: brandColors.textSecondary,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
