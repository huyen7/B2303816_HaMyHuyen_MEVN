import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiRequest } from '@/services/api';
import type { User, LoginCredentials, RegisterData, AuthResponse, AuthTokens } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isUser = computed(() => user.value?.role === 'user');

  // Actions
  const setTokens = (tokens: AuthTokens) => {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  };

  const clearTokens = () => {
    accessToken.value = null;
    refreshToken.value = null;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const setUser = (userData: User) => {
    user.value = userData;
  };

  const clearUser = () => {
    user.value = null;
  };

  // Login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true;
    
    try {
      const response: AuthResponse = await apiRequest.post('/auth/login', credentials);
      
      setTokens(response.tokens);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      isLoading.value = false;
    }
  };

  // Register
  const register = async (userData: RegisterData): Promise<void> => {
    isLoading.value = true;
    
    try {
      const response: AuthResponse = await apiRequest.post('/auth/register', userData);
      
      setTokens(response.tokens);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      if (refreshToken.value) {
        await apiRequest.post('/auth/logout', { refreshToken: refreshToken.value });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      clearUser();
    }
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<void> => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiRequest.post('/auth/refresh', {
        refreshToken: refreshToken.value
      });
      
      setTokens(response.tokens);
    } catch (error) {
      clearTokens();
      clearUser();
      throw error;
    }
  };

  // Get current user profile
  const fetchProfile = async (): Promise<void> => {
    if (!accessToken.value) return;

    try {
      const response = await apiRequest.get('/auth/profile');
      setUser(response.user);
    } catch (error) {
      console.error('Fetch profile error:', error);
      clearTokens();
      clearUser();
    }
  };

  // Update profile
  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    try {
      const response = await apiRequest.put('/users/profile', profileData);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  // Initialize auth state
  const initializeAuth = async (): Promise<void> => {
    if (accessToken.value) {
      try {
        await fetchProfile();
      } catch (error) {
        console.error('Initialize auth error:', error);
        clearTokens();
        clearUser();
      }
    }
  };

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isUser,
    
    // Actions
    login,
    register,
    logout,
    refreshAccessToken,
    fetchProfile,
    updateProfile,
    initializeAuth,
    setTokens,
    clearTokens,
    setUser,
    clearUser
  };
});