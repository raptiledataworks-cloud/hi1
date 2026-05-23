// Auth Types
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_name: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  created_at?: string;
  updated_at?: string;
}

// Transaction Types
export interface Transaction {
  _id: string;
  user_id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  type: 'income' | 'expense';
  account: string;
  created_at?: string;
}

export interface CreateTransactionRequest {
  amount: number;
  category: string;
  note: string;
  date: string;
  type: 'income' | 'expense';
  account: string;
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message: string;
    details?: any[];
  };
  meta?: {
    pagination?: {
      page: number;
      per_page: number;
      total: number;
      has_more: boolean;
    };
  };
}
