/**
 * Authentication Service
 * 
 * This is a template for integrating authentication with the login page.
 * Add this to src/services/authService.ts when ready to implement backend integration.
 */

import { apiClient } from './apiClient';
import { storageService } from '../utils/common';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}

interface RefreshTokenResponse {
  token: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Login user with email and password
   * @param request - Login credentials
   * @returns Promise with auth response
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/login',
        request
      );

      // Handle axios response (AxiosResponse<T> has data property)
      const authResponse = (response as any).data || response;

      if (authResponse.success && authResponse.token) {
        // Store token and user info
        storageService.set(this.TOKEN_KEY, authResponse.token);
        if (authResponse.user) {
          storageService.set(this.USER_KEY, authResponse.user);
        }
      }

      return authResponse;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Logout user and clear stored credentials
   */
  logout(): void {
    storageService.remove(this.TOKEN_KEY);
    storageService.remove(this.USER_KEY);
    storageService.remove(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored authentication token
   * @returns Token string or null
   */
  getToken(): string | null {
    return storageService.get<string>(this.TOKEN_KEY);
  }

  /**
   * Get stored user information
   * @returns User object or null
   */
  getUser(): any {
    return storageService.get<any>(this.USER_KEY);
  }

  /**
   * Check if user is authenticated
   * @returns True if token exists
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Refresh authentication token
   * @returns Promise with new token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        '/api/auth/refresh'
      );

      // Handle axios response
      const refreshResponse = (response as any).data || response;

      if (refreshResponse.token) {
        storageService.set(this.TOKEN_KEY, refreshResponse.token);
        return refreshResponse.token;
      }

      return null;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  /**
   * Request password reset
   * @param email - User email
   * @returns Promise with response
   */
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/forgot-password',
        { email }
      );
      return (response as any).data || response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Request failed. Please try again.',
      };
    }
  }

  /**
   * Reset password with token
   * @param token - Reset token from email
   * @param newPassword - New password
   * @returns Promise with response
   */
  async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/api/auth/reset-password',
        { token, newPassword }
      );
      return (response as any).data || response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Password reset failed. Please try again.',
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

/**
 * INTEGRATION INSTRUCTIONS:
 * 
 * 1. Create this file at: src/services/authService.ts
 * 
 * 2. Update LoginPage.tsx handleSubmit:
 *    const response = await authService.login({ email, password });
 *    if (response.success) {
 *      navigate('/dashboard');
 *    } else {
 *      setErrors({ email: response.error });
 *    }
 * 
 * 3. Add to data service for logout:
 *    export const logout = (): void => {
 *      authService.logout();
 *      // redirect to login
 *    }
 * 
 * 4. Create protected route wrapper:
 *    interface ProtectedRouteProps {
 *      element: React.ReactElement;
 *    }
 *    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
 *      return authService.isAuthenticated() ? element : <Navigate to="/login" />;
 *    };
 * 
 * 5. Use in App.tsx:
 *    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
 * 
 * 6. Backend API endpoints required:
 *    - POST /api/auth/login - Returns { success, token, user }
 *    - POST /api/auth/refresh - Returns { token }
 *    - POST /api/auth/logout - Optional, server-side cleanup
 *    - POST /api/auth/forgot-password - Request password reset
 *    - POST /api/auth/reset-password - Complete password reset
 * 
 * 7. Token format: JWT recommended
 *    Header: { Authorization: "Bearer <token>" }
 * 
 * 8. Add to apiClient.ts request interceptor:
 *    if (authService.isAuthenticated()) {
 *      config.headers.Authorization = `Bearer ${authService.getToken()}`;
 *    }
 * 
 * 9. Add to apiClient.ts response interceptor for 401 handling:
 *    if (error.response?.status === 401) {
 *      const newToken = await authService.refreshToken();
 *      if (newToken) {
 *        // Retry original request
 *      } else {
 *        // Redirect to login
 *      }
 *    }
 */
