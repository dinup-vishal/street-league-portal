/**
 * Error Component
 * Shows error message when data fetch fails
 */

import React from 'react';
import { Box, Alert, Button, Typography } from '@mui/material';
import type { ApiError } from '../types';

interface ErrorProps {
  error: ApiError | null;
  onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <Box sx={{ my: 3 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Error {error.statusCode}
        </Typography>
        <Typography variant="body2">{error.message}</Typography>
        {error.details && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {JSON.stringify(error.details)}
          </Typography>
        )}
      </Alert>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};

export default Error;
