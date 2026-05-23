export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    GET_ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/password',
    DELETE_ACCOUNT: '/auth/me',
  },

  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    UPDATE: (id: string) => `/transactions/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
  },

  BUDGET: {
    GET: '/budget',
    UPDATE: '/budget',
  },

  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    DELETE: (id: string) => `/accounts/${id}`,
  },

  GOALS: {
    LIST: '/goals',
    CREATE: '/goals',
    DELETE: (id: string) => `/goals/${id}`,
  },

  HABITS: {
    LIST: '/habits',
    CREATE: '/habits',
    UPDATE: (id: string) => `/habits/${id}`,
    DELETE: (id: string) => `/habits/${id}`,
  },
};
