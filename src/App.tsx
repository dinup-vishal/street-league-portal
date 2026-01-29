import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppTheme } from './theme/appTheme';
import Layout from './components/Layout';
import { Home, Dashboard, Settings, About } from './pages';
import LoginPage from './pages/Login/LoginPage';
import SchedulerPage from './pages/ProfileHome/SchedulerPage';
import LeadershipPage from './pages/ProfileHome/LeadershipPage';
import { AuthProvider } from './features/auth';
import { AppShell as ArchitectPortal } from './features/architect';

const LayoutWithOutlet = () => (
  <Layout title="Street League Portal">
    <Outlet />
  </Layout>
);

function App() {
  const theme = useAppTheme();

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Auth Routes - Only login-legacy */}
            <Route path="/login-legacy" element={<LoginPage />} />
            
            {/* Architect Portal */}
            <Route 
              path="/architect" 
              element={
                <div style={{ height: '100vh' }}>
                  <ArchitectPortal />
                </div>
              } 
            />

            {/* Profile Home Pages */}
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />

            {/* Existing Routes */}
            <Route element={<LayoutWithOutlet />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Route>
            
            {/* Redirect to login-legacy */}
            <Route path="*" element={<Navigate to="/login-legacy" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
