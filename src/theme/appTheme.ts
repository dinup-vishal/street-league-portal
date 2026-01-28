/**
 * Material-UI Theme Configuration
 * Responsive design for mobile, tablet, and desktop
 */

import { createTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import type { Theme } from '@mui/material/styles';

// Color palette
const colorPalette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#dc004e',
    light: '#f73378',
    dark: '#9a0036',
  },
  success: {
    main: '#4caf50',
  },
  error: {
    main: '#f44336',
  },
  warning: {
    main: '#ff9800',
  },
  info: {
    main: '#2196f3',
  },
};

export const useAppTheme = (): Theme => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: colorPalette.primary,
          secondary: colorPalette.secondary,
          success: colorPalette.success,
          error: colorPalette.error,
          warning: colorPalette.warning,
          info: colorPalette.info,
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          h1: {
            fontSize: isMobile ? '1.75rem' : '2.5rem',
            fontWeight: 600,
            marginBottom: isMobile ? '0.5rem' : '1rem',
          },
          h2: {
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 600,
            marginBottom: isMobile ? '0.4rem' : '0.8rem',
          },
          h3: {
            fontSize: isMobile ? '1.25rem' : '1.75rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          body2: {
            fontSize: isMobile ? '0.8125rem' : '0.875rem',
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '4px',
                fontSize: isMobile ? '0.875rem' : '1rem',
                padding: isMobile ? '8px 12px' : '10px 16px',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: `linear-gradient(to right, ${colorPalette.primary.dark}, ${colorPalette.primary.main})`,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
              },
            },
          },
        },
      }),
    [isMobile, isTablet]
  );

  return theme as Theme;
};

export default useAppTheme;
