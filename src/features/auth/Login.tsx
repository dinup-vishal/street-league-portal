/**
 * Login Component
 * Credential entry and authentication
 */

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Street League Portal</h1>
          <p className={styles.subtitle}>Programme Architect</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@streetleague.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.credentialsInfo}>
          <p className={styles.infoTitle}>Demo Credentials</p>
          <div className={styles.credentialList}>
            <div className={styles.credential}>
              <span className={styles.credType}>Admin:</span>
              <code className={styles.credCode}>admin@streetleague.com / admin123</code>
            </div>
            <div className={styles.credential}>
              <span className={styles.credType}>Coordinator:</span>
              <code className={styles.credCode}>coordinator@streetleague.com / coord123</code>
            </div>
            <div className={styles.credential}>
              <span className={styles.credType}>Staff:</span>
              <code className={styles.credCode}>staff@streetleague.com / staff123</code>
            </div>
            <div className={styles.credential}>
              <span className={styles.credType}>Program Manager:</span>
              <code className={styles.credCode}>manager@streetleague.com / manager123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
