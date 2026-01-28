/**
 * Settings Page
 */

import React from 'react';
import { Box, Typography, Card, CardContent, FormControlLabel, Switch, Divider } from '@mui/material';
import { appConfig } from '../config/appConfig';
import { apiConfig } from '../config/apiConfig';

const Settings: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your application settings.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* API Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              API Configuration
            </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Mode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {apiConfig.useMockData ? '📋 Mock Data (Development)' : '🔗 Real API (Production)'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Base URL
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    backgroundColor: 'action.hover',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {apiConfig.baseUrl}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Request Timeout
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {apiConfig.timeout / 1000}s
                </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Application Settings
            </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {appConfig.app.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  v{appConfig.app.version}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appConfig.app.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked disabled />}
                  label="Enable Offline Mode"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked disabled />}
                  label="Enable Push Notifications"
                />
              </Box>

            <Box>
              <FormControlLabel
                control={<Switch defaultChecked disabled />}
                label="Enable Analytics"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Environment Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                backgroundColor: 'action.hover',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                overflow: 'auto',
              }}
            >
              <div>VITE_USE_MOCK_DATA={apiConfig.useMockData ? 'true' : 'false'}</div>
              <div>VITE_API_BASE_URL={import.meta.env.VITE_API_BASE_URL}</div>
              <div>VITE_AZURE_API_URL={import.meta.env.VITE_AZURE_API_URL}</div>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings;
