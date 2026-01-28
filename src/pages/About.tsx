/**
 * About Page
 */

import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const About: React.FC = () => {
  const features = [
    'Material-UI for modern, responsive design',
    'Mock data support for development',
    'Seamless API switching via environment variables',
    'Azure deployment ready',
    'Mobile and browser responsive design',
    'TypeScript for type safety',
    'Component-based architecture',
    'Customizable theme',
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          About Street League Portal
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          A modern, responsive application for managing street leagues.
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            About This Application
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            This application is built with modern web technologies and best practices to provide
            a seamless experience across desktop, tablet, and mobile devices. It's designed to be
            easy to develop, test, and deploy.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Whether you're developing locally with mock data or connecting to a production Azure
            backend, this infrastructure provides the flexibility you need to build and scale your
            application efficiently.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Key Features
          </Typography>
          <List disablePadding>
            {features.map((feature, index) => (
              <ListItem key={index} disableGutters sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;
