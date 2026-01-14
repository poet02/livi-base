import { api, handleApiError, ApiError } from '../helpers/apiHelper';

export interface User {
  id: number;
  mobile: string;
  name?: string;
  surname?: string;
  [key: string]: any;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

/**
 * Auth Service - Centralized authentication service
 * Designed to be swappable with Auth0 later
 */
class AuthService {
  /**
   * Request OTP for a mobile number
   */
  async requestOTP(mobile: string): Promise<void> {
    try {
      const response = await api.post('/v1/auth/request-otp', { mobile });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to request OTP');
      }
    } catch (error: any) {
      const apiError = error as ApiError;
      handleApiError(apiError);
      throw error;
    }
  }

  /**
   * Verify OTP and login
   * Returns token and user data
   */
  async verifyOTP(mobile: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await api.post<{
        access_token: string;
        user: User;
        data: User;
      }>('/v1/auth/verify-otp', { mobile, otp });

      if (!response.success || !response.data.access_token) {
        throw new Error(response.message || 'Failed to verify OTP');
      }

      const token = response.data.access_token;
      const user = response.data.user || response.data.data;

      // Store token and user data
      this.setToken(token);
      if (user) {
        this.setUser(user);
      }

      return {
        token,
        user: user || { id: 0, mobile },
      };
    } catch (error: any) {
      const apiError = error as ApiError;
      handleApiError(apiError);
      throw error;
    }
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set user data
   */
  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication token and user data
   */
  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearToken();
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing or custom instances
export default AuthService;

