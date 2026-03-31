import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF7043', // Coral
      light: '#FFCCBC',
      dark: '#E64A19',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFE0B2', // Pastel Orange
      light: '#FFF3E0',
      dark: '#FFB74D',
    },
    background: {
      default: '#FFF8F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3D2C2C',
      secondary: '#6D5D5D',
    },
    success: {
      main: '#66BB6A',
    },
    warning: {
      main: '#FFA726',
    },
    error: {
      main: '#EF5350',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(255, 112, 67, 0.2)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#F4511E',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 8px 24px rgba(61, 44, 44, 0.05)',
          borderRadius: 16,
          border: '1px solid #FFF3E0',
        },
      },
    },
  },
});

export default theme;
