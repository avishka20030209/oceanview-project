export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
}

// Store user in localStorage
export const login = (user: AuthUser, redirectUrl?: string) => {
  localStorage.setItem('ocean_user', JSON.stringify(user));
  if (redirectUrl) localStorage.setItem('ocean_redirect', redirectUrl);
};

// Clear user from storage
export const logout = () => {
  localStorage.removeItem('ocean_user');
  localStorage.removeItem('ocean_redirect');
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem('ocean_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Check authentication
export const isAuthenticated = (): boolean => !!localStorage.getItem('ocean_user');

// Redirect helpers
export const getRedirectUrl = (): string | null => localStorage.getItem('ocean_redirect');
export const clearRedirectUrl = () => localStorage.removeItem('ocean_redirect');

// ------------------------
// API wrapper
// ------------------------
export const postUser = async (
  action: string,
  body: Record<string, string>
): Promise<any> => {
  const formData = new URLSearchParams(body);
  formData.append('action', action);

  const res = await fetch('/oceanview-backend/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
    credentials: 'include', // include session cookie
  });
  return res.json();
};

// Validate session
export const validateSession = async (): Promise<AuthUser | null> => {
  try {
    const res = await fetch('/oceanview-backend/user?action=session', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.status === 'success') {
      const user: AuthUser = {
        id: data.userId,
        name: data.fullName,
        email: data.email,
        role: data.role,
      };
      login(user);
      return user;
    } else {
      logout();
      return null;
    }
  } catch {
    logout();
    return null;
  }
};
