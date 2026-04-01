import { Box, Container, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

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
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
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
                width: 36,
                height: 36,
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
          </Link>
        </Stack>

        <Box
          sx={{
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            p: { xs: 2.5, sm: 3.5 },
          }}
        >
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
      </Container>
    </Box>
  )
}
