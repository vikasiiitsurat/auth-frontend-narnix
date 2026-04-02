import { alpha, createTheme } from '@mui/material/styles'

export const brandColors = {
  primaryMain: '#69992e',
  primaryDark: '#284503',
  primaryLight: '#96bc62',
  secondaryMain: '#4f7423',
  secondaryDark: '#1e3202',
  secondaryLight: '#bfd891',
  pageBackground: '#f3f8ea',
  pageBackgroundDeep: '#e4eed1',
  paperBackground: '#fbfdf7',
  textPrimary: '#284503',
  textSecondary: '#5b6f40',
  surfaceWhite: '#ffffff',
}

const {
  primaryMain,
  primaryDark,
  primaryLight,
  secondaryMain,
  secondaryDark,
  secondaryLight,
  pageBackground,
  pageBackgroundDeep,
  paperBackground,
  textPrimary,
  textSecondary,
  surfaceWhite,
} = brandColors

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      dark: primaryDark,
      light: primaryLight,
      contrastText: '#f8fffd',
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
    },
    background: {
      default: pageBackground,
      paper: paperBackground,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    divider: alpha(primaryMain, 0.14),
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#15803d',
    },
  },
  typography: {
    fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontWeight: 800, letterSpacing: '-0.04em' },
    h3: { fontWeight: 700, letterSpacing: '-0.03em' },
    h4: { fontWeight: 700, letterSpacing: '-0.03em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          colorScheme: 'light',
        },
        body: {
          backgroundColor: pageBackground,
          backgroundImage: `
            radial-gradient(circle at top left, ${alpha(primaryLight, 0.3)}, transparent 26%),
            radial-gradient(circle at top right, ${alpha(secondaryLight, 0.24)}, transparent 24%),
            linear-gradient(180deg, ${paperBackground} 0%, ${pageBackground} 56%, ${pageBackgroundDeep} 100%)
          `,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
          boxShadow: 'none',
        },
        contained: {
          backgroundImage: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
          boxShadow: `0 18px 36px ${alpha(primaryDark, 0.18)}`,
          '&:hover': {
            boxShadow: `0 22px 44px ${alpha(primaryDark, 0.24)}`,
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha(surfaceWhite, 0.82),
          boxShadow: `0 20px 50px ${alpha('#0f172a', 0.08)}`,
          border: `1px solid ${alpha(primaryMain, 0.12)}`,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${alpha(primaryMain, 0.12)}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha(paperBackground, 0.96),
          border: `1px solid ${alpha(primaryMain, 0.14)}`,
          boxShadow: `0 28px 70px ${alpha('#0f172a', 0.14)}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha(primaryMain, 0.14),
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: alpha(primaryMain, 0.28),
          textUnderlineOffset: '0.18em',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: alpha(surfaceWhite, 0.86),
          transition: 'box-shadow 160ms ease, border-color 160ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(primaryMain, 0.18),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(primaryMain, 0.34),
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${alpha(primaryLight, 0.24)}`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryMain,
            borderWidth: 2,
          },
        },
        input: {
          paddingTop: 14,
          paddingBottom: 14,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: textPrimary,
          fontWeight: 700,
          backgroundColor: alpha(primaryMain, 0.06),
        },
      },
    },
  },
})
