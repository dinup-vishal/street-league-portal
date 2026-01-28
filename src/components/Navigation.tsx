/**
 * Navigation Component
 * Navigation menu for the application
 * Responsive for mobile and desktop
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';

interface NavigationProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { label: 'About', path: '/about', icon: InfoIcon },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Box
          sx={{
            fontSize: '0.875rem',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          Menu
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItem
              component="button"
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                backgroundColor: isActive ? 'action.selected' : 'transparent',
                borderLeft: isActive ? `4px solid` : 'none',
                borderLeftColor: isActive ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                pl: isActive ? 1 : 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Navigation;
