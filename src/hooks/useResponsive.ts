/**
 * Responsive Layout Hook
 */

import { useMediaQuery, useTheme } from '@mui/material';

export interface DeviceSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const useResponsive = (): DeviceSize => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  let screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  if (isMobile) {
    screenSize = 'xs';
  } else if (isTablet) {
    screenSize = 'sm';
  } else {
    screenSize = 'md';
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
  };
};

export default useResponsive;
