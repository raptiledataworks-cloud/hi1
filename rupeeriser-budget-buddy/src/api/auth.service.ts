// rupeeriser-budget-buddy/src/api/auth.service.ts
import { api } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_name: string;
  expires_in: number;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PasswordChangeInput {
  current_password: string;
  new_password: string;
}

export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const authService = {
  async signup(data: SignupInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    if (response.data) {
      api.setTokens(response.data);
    }
    return response.data!;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data) {
      api.setTokens(response.data);
    }
    return response.data!;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data!;
  },

  async updateProfile(data: ProfileUpdateInput): Promise<{ success: boolean; message: string }> {
    const response = await api.put("/auth/profile", data);
    return response as any;
  },

  async changePassword(data: PasswordChangeInput): Promise<{ success: boolean; message: string }> {
    const response = await api.put("/auth/password", data);
    return response as any;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/forgot-password", { email });
    return response as any;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return response as any;
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const response = await api.delete("/auth/me");
    api.clearTokens();
    return response as any;
  },

  logout(): void {
    api.clearTokens();
    window.location.href = "/login";
  },
};

export default authService;