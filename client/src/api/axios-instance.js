import axios from 'axios';

import { API_ENDPOINTS } from '@/api/api-endpoints';
import { normalizeApiError } from '@/utils/error.utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let accessToken = null;
let refreshTokenPromise = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const isRefreshBlockedEndpoint = (url = '') => {
  return [
    API_ENDPOINTS.AUTH.LOGIN,
    API_ENDPOINTS.AUTH.REFRESH,
    API_ENDPOINTS.AUTH.LOGOUT,
  ].some((endpoint) => url.includes(endpoint));
};

const shouldRefreshAccessToken = (error) => {
  const originalRequest = error.config;

  return (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry &&
    !isRefreshBlockedEndpoint(originalRequest.url)
  );
};

const refreshAccessToken = async () => {
  const response = await publicApi.post(API_ENDPOINTS.AUTH.REFRESH);
  const newAccessToken = response.data?.data?.accessToken;

  if (!newAccessToken) {
    throw new Error('Refresh response did not include access token');
  }

  setAccessToken(newAccessToken);

  return newAccessToken;
};

const getRefreshTokenPromise = () => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshAccessToken().finally(() => {
      refreshTokenPromise = null;
    });
  }

  return refreshTokenPromise;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  },
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (shouldRefreshAccessToken(error)) {
      const originalRequest = error.config;

      try {
        originalRequest._retry = true;

        const newAccessToken = await getRefreshTokenPromise();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        clearAccessToken();

        return Promise.reject(normalizeApiError(error));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
