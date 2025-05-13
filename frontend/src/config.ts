// API Configuration
export const API_URL = 'http://localhost:5001/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  PROFILE: `${API_URL}/auth/me`,
};

// Analysis endpoints
export const ANALYSIS_ENDPOINTS = {
  DETECT: `${API_URL}/detect`,             // Public endpoint
  USER_DETECT: `${API_URL}/user/detect`,   // Authenticated endpoint
  USER_ANALYSES: `${API_URL}/user/analyses`,
  USER_STATISTICS: `${API_URL}/user/statistics`,
};

// Disease information endpoints
export const DISEASE_ENDPOINTS = {
  LIST: `${API_URL}/diseases`,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'plantg_auth_token',
  USER: 'plantg_user',
};

// Default authentication state
export const DEFAULT_AUTH_STATE = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: true,
};

// Default analysis state
export const DEFAULT_ANALYSIS_STATE = {
  analyses: [],
  loading: false,
  error: null,
}; 