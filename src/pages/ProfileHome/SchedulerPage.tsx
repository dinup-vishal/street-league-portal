import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, mockLogout } from '../../services/mockAuthService';
import styles from './ProfileHome.module.css';

const SchedulerPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    mockLogout();
    navigate('/login');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentCard}>
        <h1 className={styles.greeting}>Welcome, {user?.username}!</h1>
        <p className={styles.profileLabel}>Profile: Scheduler</p>
        
        <div className={styles.infoSection}>
          <p className={styles.description}>
            You are logged in with the Scheduler profile.
          </p>
        </div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SchedulerPage;
