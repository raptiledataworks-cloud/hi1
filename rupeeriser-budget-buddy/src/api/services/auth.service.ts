import client from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';

import type {
  SignupRequest,
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
  UserProfile,
} from '@/types/api';

export const authService = {
  signup: (data: SignupRequest) =>
    client.post<TokenResponse>(API_ENDPOINTS.AUTH.SIGNUP, data),

  login: (data: LoginRequest) =>
    client.post<TokenResponse>(API_ENDPOINTS.AUTH.LOGIN, data),

  refresh: (data: RefreshTokenRequest) =>
    client.post<TokenResponse>(API_ENDPOINTS.AUTH.REFRESH, data),

  getMe: () =>
    client.get<UserProfile>(API_ENDPOINTS.AUTH.GET_ME),

  updateProfile: (data: Partial<UserProfile>) =>
    client.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data),

  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) =>
    client.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),

  deleteAccount: () =>
    client.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT),
};

export default authService;
