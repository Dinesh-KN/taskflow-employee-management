import axios from 'axios';

import { API_ENDPOINTS } from '@/api/api-endpoints';
import { normalizeApiError } from '@/utils/error.utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SESSION_HINT_KEY = 'taskflow.has-session';

let accessToken = null;
let refreshTokenPromise = null;
let unauthorizedHandler = null;

const getLocalStorage = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const hasAccessToken = () => {
  return Boolean(accessToken);
};

export const markSessionActive = () => {
  try {
    getLocalStorage()?.setItem(SESSION_HINT_KEY, 'true');
  } catch {
    // Authentication must continue when storage is unavailable.
  }
};

export const clearSessionHint = () => {
  try {
    getLocalStorage()?.removeItem(SESSION_HINT_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
};

export const hasSessionHint = () => {
  try {
    return getLocalStorage()?.getItem(SESSION_HINT_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Allows the Axios layer to notify Redux that the browser
 * session is no longer valid without importing the store here.
 */
export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
};

const invalidateSession = () => {
  clearAccessToken();
  clearSessionHint();
  unauthorizedHandler?.();
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

const requestHadAuthentication = (config) => {
  const authorizationHeader =
    config?.headers?.Authorization ||
    config?.headers?.authorization ||
    config?.headers?.get?.('Authorization');

  return Boolean(accessToken || authorizationHeader);
};

const shouldRefreshAccessToken = (error) => {
  const originalRequest = error.config;

  return (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry &&
    !isRefreshBlockedEndpoint(originalRequest.url) &&
    requestHadAuthentication(originalRequest)
  );
};

const refreshAccessToken = async () => {
  const response = await publicApi.post(API_ENDPOINTS.AUTH.REFRESH);
  const newAccessToken = response.data?.data?.accessToken;

  if (!newAccessToken) {
    throw new Error('Refresh response did not include an access token');
  }

  setAccessToken(newAccessToken);
  markSessionActive();

  return newAccessToken;
};

const getRefreshTokenPromise = () => {
  /*
   * Concurrent failed requests share one refresh request.
   */
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshAccessToken().finally(() => {
      refreshTokenPromise = null;
    });
  }

  return refreshTokenPromise;
};

export const restoreAccessToken = async () => {
  try {
    return await getRefreshTokenPromise();
  } catch (error) {
    clearAccessToken();
    clearSessionHint();

    throw normalizeApiError(error);
  }
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
    const originalRequest = error.config;

    /*
     * A retried request still returned 401. The refreshed
     * session is invalid, so clear authentication completely.
     */
    if (error.response?.status === 401 && originalRequest?._retry) {
      invalidateSession();

      return Promise.reject(normalizeApiError(error));
    }

    if (!shouldRefreshAccessToken(error)) {
      return Promise.reject(normalizeApiError(error));
    }

    try {
      originalRequest._retry = true;

      const newAccessToken = await getRefreshTokenPromise();

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      invalidateSession();

      return Promise.reject(normalizeApiError(refreshError));
    }
  },
);

export default api;
