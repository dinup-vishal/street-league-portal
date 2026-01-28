/**
 * Home Page
 */

import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Welcome to Street League Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Manage your street league effectively with our modern web and mobile application.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              📊 Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              View real-time statistics and analytics about your league.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              ⚙️ Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure your application settings and preferences.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/settings')}
            >
              Go to Settings
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              ℹ️ About
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Learn more about the application and its features.
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ backgroundColor: 'info.lighter' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, color: 'info.main' }}>
            💡 Tip
          </Typography>
          <Typography variant="body2">
            This application supports both mock data (for development) and real API calls (for production).
            Change the environment variable <code>VITE_USE_MOCK_DATA</code> to switch between them.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
