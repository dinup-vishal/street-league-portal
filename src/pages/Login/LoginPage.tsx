import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLogin, getProfileRoute } from '../../services/mockAuthService';
import styles from './Login.module.css';

interface FormErrors {
  username?: string;
  password?: string;
  submit?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock login with username and password
      const user = await mockLogin(username, password);
      
      if (user) {
        // Get the route based on user's profile
        const route = getProfileRoute(user.profile);
        navigate(route);
      } else {
        // Invalid credentials
        setErrors({
          submit: 'Invalid username or password',
        });
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Skip to main content link */}
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className={styles.content}>
        {/* Left Column: Login Form */}
        <div className={styles.formColumn}>
          <div className={styles.card}>
            {/* Logo Row */}
            <div className={styles.logoRow}>
              <svg
                className={styles.logo}
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Street League Portal"
              >
                {/* Shield shape */}
                <path
                  d="M32 8L12 16v12c0 12 20 20 20 20s20-8 20-20V16L32 8z"
                  fill="var(--color-primary)"
                  stroke="var(--color-navy)"
                  strokeWidth="1"
                />
                {/* SL letters */}
                <text
                  x="32"
                  y="36"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="var(--font-family-base)"
                >
                  SL
                </text>
              </svg>
            </div>

            {/* Form Heading */}
            <h1 id="main" className={styles.heading}>
              Sign in
            </h1>

            {/* Error Alert (if general error) */}
            {errors.submit && (
              <div className={styles.alertError} role="alert">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username Field */}
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors({ ...errors, username: undefined });
                    }
                  }}
                  aria-describedby={errors.username ? 'username-error' : 'username-hint'}
                  aria-invalid={!!errors.username}
                  disabled={isSubmitting}
                  placeholder="Enter your username"
                />
                {errors.username ? (
                  <div id="username-error" className={styles.errorText}>
                    {errors.username}
                  </div>
                ) : (
                  <div id="username-hint" className={styles.helperText}>
                    Try: demo, scheduler_user, or leadership_user
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <div className={styles.passwordLabelRow}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>
                </div>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.input} ${styles.passwordInput} ${
                      errors.password ? styles.inputError : ''
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors({ ...errors, password: undefined });
                      }
                    }}
                    aria-describedby={errors.password ? 'password-error' : 'password-hint'}
                    aria-invalid={!!errors.password}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-pressed={showPassword}
                    aria-controls="password"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {/* Eye open icon */}
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        {/* Eye closed icon */}
                        <path d="M11.83 9L15.5 12.63C15.82 12.4 16.08 12.09 16.24 11.73C16.5 11.16 16.44 10.46 16.09 9.91C15.74 9.36 15.11 8.94 14.37 8.94C13.87 8.94 13.42 9.11 13.05 9.37M2 4.27l2.28 2.28l.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.42.41L19.73 22L21 20.73L3.27 3M12 7c2.76 0 5 2.24 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92c1.44-1.01 2.7-2.3 3.62-3.81C20.27 7.11 16 4 12 4c-1.3 0-2.55.25-3.69.7l2.07 2.07C10.74 6.91 11.35 7 12 7z" />
                      </svg>
                    )}
                    <span className={styles.passwordToggleText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  </button>
                </div>
                {errors.password ? (
                  <div id="password-error" className={styles.errorText}>
                    {errors.password}
                  </div>
                ) : (
                  <div id="password-hint" className={styles.helperText}>
                    Any password works in demo mode
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Background Panel */}
        <div className={styles.backgroundColumn}>
          <div className={styles.backgroundPanel}>
            {/* Decorative abstract shapes */}
            <svg
              className={styles.backgroundSvg}
              viewBox="0 0 400 600"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Soft blue curve */}
              <path
                d="M0,100 Q100,50 200,100 T400,100 L400,0 L0,0 Z"
                fill="var(--color-slate-100)"
                opacity="0.7"
              />
              {/* Slate accent shape */}
              <circle
                cx="350"
                cy="150"
                r="80"
                fill="var(--color-slate-200)"
                opacity="0.5"
              />
              {/* Gold accent */}
              <rect
                x="30"
                y="400"
                width="120"
                height="8"
                fill="var(--color-gold)"
                opacity="0.4"
                rx="4"
              />
              {/* Soft blue accent */}
              <ellipse
                cx="100"
                cy="500"
                rx="60"
                ry="40"
                fill="var(--color-info-light)"
                opacity="0.4"
              />
            </svg>

            {/* Optional: Tagline or message */}
            <div className={styles.backgroundContent}>
              <p className={styles.backgroundText}>
                Manage your street league with confidence
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
