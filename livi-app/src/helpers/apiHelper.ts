// API Helper for making requests to backend Express server
import { useState, useCallback } from 'react';

// Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: unknown[];
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  includeAuth?: boolean;
}

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api';
console.log('Using API Base URL:', API_BASE_URL);

// Helper function to get auth token (modify based on your auth setup)
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// Helper function to get common headers
const getHeaders = (customHeaders?: Record<string, string>, includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = includeAuth ? getAuthToken() : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

type ErrorPayload = {
  message?: string;
  errors?: unknown[];
};

const isErrorPayload = (value: unknown): value is ErrorPayload =>
  typeof value === 'object' && value !== null;

const getErrorMessage = (value: unknown, fallback: string): string => {
  if (isErrorPayload(value) && typeof value.message === 'string') {
    return value.message;
  }
  return fallback;
};

// Main API request function
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers: customHeaders = {},
    body,
    timeout = 10000,
    retries = 0,
    includeAuth = true,
  } = options;

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  console.log(`API Request: ${method} ${url}`);
  const headers = getHeaders(customHeaders, includeAuth);

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Important for cookies/sessions
  };

  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let attempts = 0;

  while (attempts <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let data: unknown;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw {
          message: getErrorMessage(data, `HTTP error! status: ${response.status}`),
          status: response.status,
          errors: isErrorPayload(data) ? data.errors : undefined,
        } as ApiError;
      }

      return {
        data,
        message: data.message,
        status: response.status,
        success: response.status >= 200 && response.status < 300,
      };

    } catch (error: unknown) {
      attempts++;

      if (attempts > retries) {
        const errorName = isRecord(error) && typeof (error as { name?: unknown }).name === 'string'
          ? (error as { name: string }).name
          : undefined;
        if (errorName === 'AbortError') {
          throw {
            message: 'Request timeout',
            status: 408,
          } as ApiError;
        }

        const fallbackMessage = 'Network error';
        const message = getErrorMessage(error, fallbackMessage);
        const status = isErrorPayload(error) && typeof (error as { status?: number }).status === 'number'
          ? (error as { status: number }).status
          : 0;
        const errors = isErrorPayload(error) ? error.errors : undefined;
        throw {
          message,
          status,
          errors,
        } as ApiError;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw {
    message: 'Max retries exceeded',
    status: 0,
  } as ApiError;
};

// Convenience methods
export const api = {
  get: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// File upload helper
export const uploadFile = async <T = unknown>(
  endpoint: string,
  file: File,
  additionalData: Record<string, string | Blob> = {},
  options?: Omit<RequestOptions, 'method' | 'body' | 'headers'>
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const headers: HeadersInit = {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
    signal: AbortSignal.timeout(options?.timeout || 30000),
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    throw {
      message: getErrorMessage(data, `Upload failed with status: ${response.status}`),
      status: response.status,
      errors: isErrorPayload(data) ? data.errors : undefined,
    } as ApiError;
  }

  return {
    data,
    message: data.message,
    status: response.status,
    success: true,
  };
};

// React hook for API calls with state management
export const useApi = <T = unknown>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = useCallback(async (
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<T>(endpoint, options);
      setData(response.data);
      setLoading(false);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      setLoading(false);
      throw apiError;
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    call,
    loading,
    error,
    data,
    reset,
  };
};

// Utility function to handle API errors
export const handleApiError = (error: ApiError, customHandler?: (error: ApiError) => void) => {
  if (customHandler) {
    customHandler(error);
    return;
  }

  // Default error handling
  console.error('API Error:', error);

  switch (error.status) {
    case 401:
      // Unauthorized - redirect to login
      window.location.href = '/login';
      break;
    case 403:
      // Forbidden
      alert('You do not have permission to perform this action.');
      break;
    case 404:
      // Not found
      alert('The requested resource was not found.');
      break;
    case 500:
      // Server error
      alert('A server error occurred. Please try again later.');
      break;
    default:
      alert(error.message || 'An unexpected error occurred.');
  }
};

// Debug helper (remove in production)
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL);
}