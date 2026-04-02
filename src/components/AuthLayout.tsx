import { alpha } from '@mui/material/styles'
import { Box, Container, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '../theme/theme'

type AuthLayoutProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  const { primaryMain, secondaryMain, primaryLight, secondaryLight, primaryDark } = brandColors

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(18px)',
          },
          '&::before': {
            width: 320,
            height: 320,
            top: -90,
            left: -70,
            background:
              `radial-gradient(circle, ${alpha(primaryLight, 0.34)} 0%, ${alpha(primaryLight, 0)} 72%)`,
          },
          '&::after': {
            width: 360,
            height: 360,
            right: -110,
            bottom: -100,
            background:
              `radial-gradient(circle, ${alpha(secondaryLight, 0.26)} 0%, ${alpha(secondaryLight, 0)} 72%)`,
          },
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          py: { xs: 4, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ mb: 3.5 }}>
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
                display: 'grid',
                placeItems: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: `0 18px 32px ${alpha(primaryDark, 0.22)}`,
              }}
            >
              N
            </Box>
            <Typography variant="h6" fontWeight={700} letterSpacing="-0.03em">
              Narnix Auth
            </Typography>
          </Link>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              px: 1.75,
              py: 0.8,
              borderRadius: 999,
              bgcolor: alpha('#ffffff', 0.55),
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            Please do registration
          </Typography>
        </Stack>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 4, sm: 5 },
            bgcolor: alpha('#ffffff', 0.76),
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 30px 80px rgba(15, 23, 42, 0.12)',
          }}
        >
          <Box
            sx={{
              height: 10,
              background: `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 48%, ${secondaryMain} 100%)`,
            }}
          />
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          {children}
          {footer}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
