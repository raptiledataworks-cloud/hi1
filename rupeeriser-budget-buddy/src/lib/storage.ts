const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function setStoredTokens(
  accessToken: string,
  refreshToken: string
): void {
  // In production, use HTTPOnly cookies instead of localStorage
  // For now, using localStorage with the understanding that this is a limitation

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getStoredTokens(): {
  access_token: string | null;
  refresh_token: string | null;
} {
  return {
    access_token: localStorage.getItem(ACCESS_TOKEN_KEY),
    refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function clearStoredTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasStoredTokens(): boolean {
  const { access_token, refresh_token } = getStoredTokens();

  return !!access_token && !!refresh_token;
}
