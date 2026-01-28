import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppTheme } from './theme/appTheme';
import Layout from './components/Layout';
import { Home, Dashboard, Settings, About } from './pages';
import LoginPage from './pages/Login/LoginPage';
import SchedulerPage from './pages/ProfileHome/SchedulerPage';
import LeadershipPage from './pages/ProfileHome/LeadershipPage';

const LayoutWithOutlet = () => (
  <Layout title="Street League Portal">
    <Outlet />
  </Layout>
);

function App() {
  const theme = useAppTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route element={<LayoutWithOutlet />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
