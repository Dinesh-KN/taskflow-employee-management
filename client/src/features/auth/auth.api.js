import api from '@/api/axios-instance';
import { API_ENDPOINTS } from '@/api/api-endpoints';

export const authApi = {
  login: (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  getCurrentUser: () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },

  logout: () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  changePassword: (payload) => {
    return api.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },

  resetPassword: ({ userId }) => {
    return api.patch(API_ENDPOINTS.AUTH.RESET_PASSWORD(userId));
  },
};
