/**
 * Mock Login Service
 * Provides mock authentication with user profiles
 */

import type { User, UserProfile } from '../types/auth';

// Mock user database with username-to-profile mapping
const MOCK_USERS: Record<string, { username: string; password: string; profile: UserProfile }> = {
  'scheduler_user': {
    username: 'scheduler_user',
    password: 'password1',
    profile: 'Scheduler',
  },
  'leadership_user': {
    username: 'leadership_user',
    password: 'password1',
    profile: 'Leadership',
  },
  'demo': {
    username: 'demo',
    password: 'demo',
    profile: 'Scheduler',
  },
};

const STORAGE_KEY = 'auth_user';

/**
 * Mock login - validates username/password and returns user with profile
 */
export const mockLogin = async (username: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = MOCK_USERS[username.toLowerCase()];

  if (!user || user.password !== password) {
    return null; // Invalid credentials
  }

  const authUser: User = {
    id: username.toLowerCase(),
    username: user.username,
    profile: user.profile,
  };

  // Store user in localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

  return authUser;
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading stored user:', error);
    return null;
  }
};

/**
 * Mock logout - clears stored user
 */
export const mockLogout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getStoredUser() !== null;
};

/**
 * Get the route based on user profile
 */
export const getProfileRoute = (profile: UserProfile): string => {
  switch (profile) {
    case 'Scheduler':
      return '/scheduler';
    case 'Leadership':
      return '/leadership';
    default:
      return '/';
  }
};


/**
 * Mock credentials for testing
 * scheduler_user / password1 (Scheduler profile)
 * leadership_user / password1 (Leadership profile)
 * demo / demo (Scheduler profile)
 */
