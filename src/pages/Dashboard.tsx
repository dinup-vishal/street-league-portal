/**
 * Dashboard Page
 * Example page showing how to use the data hooks
 */

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useData } from '../hooks';
import { Loading, Error } from '../components';

const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useData('examples');

  if (loading) return <Loading message="Loading dashboard data..." />;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your league data.
        </Typography>
      </Box>

      {error && <Error error={error} onRetry={refetch} />}

      {data && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {data.map((item: any) => (
            <Card
              key={item.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                },
              }}
            >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        backgroundColor:
                          item.status === 'active'
                            ? 'success.light'
                            : item.status === 'pending'
                            ? 'warning.light'
                            : 'error.light',
                        color:
                          item.status === 'active'
                            ? 'success.dark'
                            : item.status === 'pending'
                            ? 'warning.dark'
                            : 'error.dark',
                        fontWeight: 600,
                      }}
                    >
                      {item.status.toUpperCase()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      )}

      {data && data.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No data available. Start by creating a new item.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;
