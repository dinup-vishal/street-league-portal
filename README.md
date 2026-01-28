# Street League Portal

A modern, responsive React application for managing street leagues with support for both mobile and desktop platforms. Built with Material-UI, TypeScript, and Vite for optimal performance.

##  Features

-  **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
-  **Mock Data Support** - Develop with mock data, deploy with real API
-  **Environment-Based Switching** - Easy configuration change from file-based to API calls
-  **Material-UI Components** - Beautiful, accessible UI components
-  **TypeScript** - Full type safety and better developer experience
-  **Azure Ready** - Pre-configured for Azure Static Web Apps and Function Apps
-  **Fast Development** - Vite with Hot Module Replacement (HMR)
-  **API Client** - Axios with interceptors for request/response handling
-  **Routing** - React Router for client-side navigation
-  **Custom Hooks** - Reusable data fetching and responsive design hooks

##  Prerequisites

- Node.js 18+
- npm or yarn
- Git

##  Installation & Setup

### 1. Clone the repository (if applicable)
\\\ash
git clone <your-repo-url>
cd Street-League-Portal
\\\

### 2. Install dependencies
\\\ash
npm install
\\\

### 3. Configure environment variables

Create a \.env.local\ file for development:
\\\env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AZURE_API_URL=https://your-azure-function-url.azurewebsites.net/api
\\\

### 4. Start development server
\\\ash
npm run dev
\\\

The application will open at \http://localhost:5173/\

##  Project Structure

\\\
src/
 components/        # Reusable React components (Layout, Navigation, etc.)
 pages/            # Page components for different routes
 services/         # API client and data services
 hooks/            # Custom React hooks for data fetching
 config/           # Configuration files
 types/            # TypeScript type definitions
 data/             # Mock data for development
 theme/            # Material-UI theme configuration
 utils/            # Utility functions
 constants/        # Application constants
 context/          # React context providers
 App.tsx           # Main App component
 main.tsx          # Application entry point
 index.css         # Global styles
\\\

##  Quick Start Guide

### Running the Application

**Development:**
\\\ash
npm run dev
\\\

**Production Build:**
\\\ash
npm run build
\\\

**Preview Production Build:**
\\\ash
npm run preview
\\\

**Linting:**
\\\ash
npm run lint
\\\

##  API Configuration

The application supports two modes:

### Development Mode (Mock Data)
\\\env
VITE_USE_MOCK_DATA=true
\\\
- Uses mock data from \src/data/mockData.ts\
- No backend API required
- Perfect for UI development

### Production Mode (Real API)
\\\env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-azure-api-url
\\\
- Calls real API endpoints
- Update the Azure API URL
- Connect to your backend

##  Responsive Design

The app automatically adapts to different screen sizes:
- **Mobile** (< 600px): Full-width layout with hamburger menu
- **Tablet** (600px - 960px): Optimized touch experience
- **Desktop** ( 960px): Full navigation sidebar

Use the \useResponsive\ hook to make responsive components:
\\\	ypescript
import { useResponsive } from './hooks';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
};
\\\

##  Styling with Material-UI

The application uses Material-UI with a custom theme. All components are pre-configured with responsive design.

Example:
\\\	ypescript
import { Box, Card, CardContent, Button } from '@mui/material';

const MyComponent = () => (
  <Card>
    <CardContent>
      <Button variant="contained">Click me</Button>
    </CardContent>
  </Card>
);
\\\

##  API Integration

### Using Data Hooks

\\\	ypescript
import { useData } from './hooks';
import { Loading, Error } from './components';

const MyPage = () => {
  const { data, loading, error, refetch } = useData('endpoint-name');
  
  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={refetch} />;
  
  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
\\\

### Using Data Service Directly

\\\	ypescript
import dataService from './services/dataService';

// Fetch data
const items = await dataService.fetchData('endpoint');

// Create item
const newItem = await dataService.createItem('endpoint', data);

// Update item
const updated = await dataService.updateItem('endpoint', id, data);

// Delete item
await dataService.deleteItem('endpoint', id);
\\\

##  Deployment to Azure

### Prerequisites
- Azure subscription
- Azure Static Web Apps resource
- Azure Function App for backend (optional)

### Quick Deploy Steps

1. **Build the application:**
   \\\ash
   npm run build
   \\\

2. **Connect to Azure Static Web Apps:**
   - Link your GitHub repository to Azure
   - Configure build settings (Vite preset)
   - Set output location to \dist/\

3. **Set Environment Variables:**
   - Add \VITE_USE_MOCK_DATA=false\ in Azure portal
   - Add \VITE_AZURE_API_URL\ with your API endpoint

4. **Deploy:**
   - Push to main branch
   - GitHub Actions automatically deploys to Azure

See \DEPLOYMENT_GUIDE.md\ for detailed Azure setup instructions.

##  Documentation

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Comprehensive development guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Azure deployment instructions

##  Creating New Features

### Add a New Page

1. Create component in \src/pages/NewPage.tsx\
2. Add route in \src/App.tsx\
3. Add navigation item in \src/components/Navigation.tsx\

### Add New API Endpoint

1. Define types in \src/types/index.ts\
2. Add mock data in \src/data/mockData.ts\
3. Use in components with \useData\ hook

### Add Custom Hook

1. Create hook in \src/hooks/useMyHook.ts\
2. Export from \src/hooks/index.ts\
3. Use in your components

##  Testing

To add testing, install and configure:
\\\ash
npm install -D vitest @testing-library/react @testing-library/jest-dom
\\\

##  Available Scripts

| Script | Description |
|--------|-------------|
| \
pm run dev\ | Start development server |
| \
pm run build\ | Build for production |
| \
pm run preview\ | Preview production build |
| \
pm run lint\ | Run ESLint |

##  Security

- API calls use HTTPS in production
- Request interceptors handle authentication tokens
- CORS configured for Azure deployment
- Environment variables protect sensitive data

##  Performance

- Code splitting with React Router
- Lazy loading support
- Image optimization
- CSS/JS minification
- Tree shaking for unused code

##  Support & Troubleshooting

### Port Already in Use
If port 5173 is already in use:
\\\ash
npm run dev -- --port 3000
\\\

### Build Fails
1. Clear node_modules: \m -rf node_modules && npm install\
2. Check Node version: \
ode --version\ (should be 18+)
3. Check for syntax errors: \
pm run lint\

### API Connection Issues
1. Verify API URL in environment variables
2. Check API is running and accessible
3. Review browser console for CORS errors
4. Ensure authentication tokens are valid

##  Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

##  License

MIT License - feel free to use this project as a template

##  Next Steps

1. Customize the theme in \src/theme/appTheme.ts\
2. Add your data models in \src/types/index.ts\
3. Create mock data in \src/data/mockData.ts\
4. Build your feature pages
5. Connect to your Azure backend
6. Deploy to production

---

**Happy coding! **
