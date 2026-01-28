# Street League Portal - Developer Documentation

## Project Overview

This is a modern React application infrastructure that supports:
- Development with mock data
- Production with Azure API integration
- Responsive design for mobile, tablet, and desktop
- Material-UI for styling
- TypeScript for type safety

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navigation.tsx  # Navigation menu
│   ├── Loading.tsx     # Loading state component
│   ├── Error.tsx       # Error state component
│   └── index.ts        # Component exports
├── pages/              # Page components for routes
│   ├── Home.tsx        # Home page
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Settings.tsx    # Settings page
│   ├── About.tsx       # About page
│   └── index.ts        # Page exports
├── services/           # API and data services
│   ├── apiClient.ts    # Axios API client with interceptors
│   ├── dataService.ts  # Data service (mock/API switching)
│   └── index.ts        # Service exports
├── hooks/              # Custom React hooks
│   ├── useData.ts      # Data fetching hooks
│   ├── useResponsive.ts # Responsive design hooks
│   └── index.ts        # Hooks exports
├── config/             # Configuration files
│   ├── apiConfig.ts    # API configuration
│   ├── appConfig.ts    # App configuration
│   └── index.ts        # Config exports
├── types/              # TypeScript type definitions
│   └── index.ts        # Global types
├── data/               # Mock data
│   └── mockData.ts     # Mock data examples
├── theme/              # Material-UI theme
│   └── appTheme.ts     # Theme configuration
├── utils/              # Utility functions
├── constants/          # Application constants
├── context/            # React context providers
├── App.tsx             # Main App component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Environment Variables

Create `.env.local` for development and `.env.production` for production:

### Development (.env.local)
```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AZURE_API_URL=https://your-azure-function-url.azurewebsites.net/api
```

### Production (.env.production)
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-azure-function-url.azurewebsites.net/api
VITE_AZURE_API_URL=https://your-azure-function-url.azurewebsites.net/api
```

## Running the Application

### Development
```bash
npm run dev
```
This will start the Vite development server with hot module replacement (HMR).

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## API Integration

### Switching Between Mock Data and Real API

The application automatically switches between mock data and real API based on the `VITE_USE_MOCK_DATA` environment variable.

**For Development (Mock Data):**
- Set `VITE_USE_MOCK_DATA=true` in `.env.local`
- The application will use mock data from `src/data/mockData.ts`
- Perfect for UI/UX development without backend dependency

**For Production (Real API):**
- Set `VITE_USE_MOCK_DATA=false` in `.env.production`
- The application will call the Azure API endpoints
- Update the Azure API URL in the environment variables

### Creating a New Data Service

1. Add your data types to `src/types/index.ts`
2. Add mock data to `src/data/mockData.ts`
3. Use the `dataService` in your components:

```typescript
import { useData } from '../hooks';

const MyComponent = () => {
  const { data, loading, error, refetch } = useData('my-endpoint');
  
  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={refetch} />;
  
  return <div>{/* render data */}</div>;
};
```

## Components

### Layout Component
The main layout wrapper that includes the app bar, navigation, and content area.

```typescript
<Layout title="Page Title">
  {/* Page content goes here */}
</Layout>
```

### Navigation Component
Responsive navigation menu that automatically adjusts for mobile/desktop.

### Loading Component
Shows a loading spinner with message.

### Error Component
Shows error message with retry button.

## Responsive Design

The application uses Material-UI's `useMediaQuery` hook for responsive design. Breakpoints:
- `xs`: 0px and up (mobile)
- `sm`: 600px and up (tablet)
- `md`: 960px and up (desktop)
- `lg`: 1280px and up (large desktop)
- `xl`: 1920px and up (extra large)

Use the `useResponsive` hook to get device information:

```typescript
import { useResponsive } from '../hooks';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
};
```

## Azure Deployment

### Prerequisites
- Azure Static Web Apps resource
- Azure Function App for backend API

### Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Azure Static Web Apps:**
   - Connect your GitHub repository to Azure Static Web Apps
   - The build output in `dist/` will be automatically deployed
   - Or use Azure CLI:
   ```bash
   az staticwebapp upload-build --app-name <app-name>
   ```

3. **Configure Backend API:**
   - Update `VITE_AZURE_API_URL` in environment configuration
   - Deploy your backend API to Azure Function App

## File-Based Data Loading

The application includes a mock data system for development:

1. **Add mock data** in `src/data/mockData.ts`
2. **Configure switching** via environment variable
3. **No code changes** needed to use real API

## Creating New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Add navigation item to `src/components/Navigation.tsx`

Example:
```typescript
// src/pages/MyPage.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const MyPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h1">My Page</Typography>
    </Box>
  );
};

export default MyPage;
```

Then add to App.tsx:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Styling with Material-UI

The application uses Material-UI with a custom theme configured in `src/theme/appTheme.ts`.

Example component:
```typescript
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

const MyCard = () => (
  <Card>
    <CardContent>
      <Typography variant="h6">Title</Typography>
      <Button variant="contained">Click me</Button>
    </CardContent>
  </Card>
);
```

## Performance Optimization

- Code splitting with React Router
- Lazy loading of routes with React.lazy()
- Image optimization with Vite
- CSS minification and bundling
- Tree shaking for unused code

## Building Custom Hooks

Create reusable logic with custom hooks:

```typescript
// src/hooks/useMyHook.ts
import { useState, useCallback } from 'react';

export const useMyHook = () => {
  const [state, setState] = useState(null);
  
  const myFunction = useCallback(() => {
    // Logic here
  }, []);
  
  return { state, myFunction };
};
```

## Error Handling

The application includes built-in error handling:
- API request/response interceptors
- Error boundary components
- User-friendly error messages
- Retry functionality

## Next Steps

1. Create specific data models in `src/types/`
2. Add mock data for your use cases
3. Create page components for your features
4. Connect to your Azure backend API
5. Deploy to Azure Static Web Apps

---

For more information on technologies used:
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Azure Documentation](https://docs.microsoft.com/azure)
