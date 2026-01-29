/**
 * Home.tsx
 * Home screen for authenticated users
 * Displays user info and navigation options
 */

import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateToArchitect = () => {
    navigate('/architect');
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>Street League Portal</h1>
            <p className={styles.subtitle}>Welcome to the Programme Management System</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.userCard}>
          <div className={styles.userHeader}>
            <div className={styles.avatar}>{user?.name.charAt(0).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{user?.name}</h2>
              <p className={styles.userEmail}>{user?.email}</p>
              <p className={styles.userRole}>
                Role: <span className={styles.roleTag}>{user?.role.replace('_', ' ')}</span>
              </p>
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Modules</h2>

          <div className={styles.moduleGrid}>
            {/* Architect Portal Card */}
            {['admin', 'program_manager'].includes(user?.role || '') && (
              <div className={styles.moduleCard}>
                <div className={styles.moduleIcon}>📋</div>
                <h3 className={styles.moduleName}>Architect Portal</h3>
                <p className={styles.moduleDescription}>
                  Configure programme structure, phases, and steps
                </p>
                <button
                  onClick={handleNavigateToArchitect}
                  className={styles.moduleButton}
                >
                  Open →
                </button>
              </div>
            )}

            {/* Scheduler Card */}
            <div className={styles.moduleCard}>
              <div className={styles.moduleIcon}>📅</div>
              <h3 className={styles.moduleName}>Scheduler</h3>
              <p className={styles.moduleDescription}>
                Manage staff schedules and workshop assignments
              </p>
              <button className={styles.moduleButton} disabled>
                Coming Soon
              </button>
            </div>

            {/* Reports Card */}
            <div className={styles.moduleCard}>
              <div className={styles.moduleIcon}>📊</div>
              <h3 className={styles.moduleName}>Reports</h3>
              <p className={styles.moduleDescription}>
                View analytics and performance metrics
              </p>
              <button className={styles.moduleButton} disabled>
                Coming Soon
              </button>
            </div>

            {/* Settings Card */}
            <div className={styles.moduleCard}>
              <div className={styles.moduleIcon}>⚙️</div>
              <h3 className={styles.moduleName}>Settings</h3>
              <p className={styles.moduleDescription}>
                Manage system configuration and user preferences
              </p>
              <button className={styles.moduleButton} disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </section>

        {user?.role === 'program_manager' && (
          <section className={styles.section}>
            <div className={styles.infoBox}>
              <div className={styles.infoIcon}>ℹ️</div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Programme Manager Features</h3>
                <p className={styles.infoText}>
                  As a Programme Manager, you have full access to the Architect Portal to
                  design and configure your programme structure. Use the portal to define
                  phases, steps, and organize your curriculum.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
