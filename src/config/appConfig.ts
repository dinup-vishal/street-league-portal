/**
 * Application Configuration
 * Central configuration for app settings
 */

export const appConfig = {
  app: {
    name: 'Street League Portal',
    version: '1.0.0',
    description: 'Street League Management Portal',
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  ui: {
    mobileBreakpoint: 600,
    tabletBreakpoint: 960,
    desktopBreakpoint: 1280,
  },
  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableAnalytics: true,
  },
};

export default appConfig;
