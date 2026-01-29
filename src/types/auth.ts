/**
 * Authentication Types
 */

export type UserProfile = 'Scheduler' | 'Leadership' | 'Architect';

export interface User {
  id: string;
  username: string;
  profile: UserProfile;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
