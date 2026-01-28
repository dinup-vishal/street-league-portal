import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, mockLogout } from '../../services/mockAuthService';
import { fetchActiveCohorts, formatDate } from '../../services/cohortService';
import type { Cohort } from '../../types/cohort';
import SchedulerModal from '../../features/scheduler/components/SchedulerModal';
import styles from './SchedulerHome.module.css';

const SchedulerPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);

  useEffect(() => {
    const loadCohorts = async () => {
      try {
        setLoading(true);
        const response = await fetchActiveCohorts();
        if (response.success && response.data) {
          setCohorts(response.data);
          setError(null);
        } else {
          setError(response.error || 'Failed to load cohorts');
        }
      } catch (err) {
        setError('An error occurred while loading cohorts');
      } finally {
        setLoading(false);
      }
    };

    loadCohorts();
  }, []);

  const handleLogout = () => {
    mockLogout();
    navigate('/login');
  };

  const handleSchedule = (cohort: Cohort) => {
    setSelectedCohort(cohort);
  };

  const closeModal = () => {
    setSelectedCohort(null);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.greeting}>Welcome, {user?.username}!</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.contentArea}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Active Cohorts</h2>
          <p className={styles.sectionSubtitle}>
            {cohorts.length} active cohort{cohorts.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading cohorts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && cohorts.length > 0 && (
          <div className={styles.gridContainer}>
            <table className={styles.cohortTable}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.th}>Cohort Code</th>
                  <th className={styles.th}>Academy ID</th>
                  <th className={styles.th}>Day of Week</th>
                  <th className={styles.th}>Session Time</th>
                  <th className={styles.th}>Created Date</th>
                  <th className={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort) => (
                  <tr key={cohort.cohortId} className={styles.tableRow}>
                    <td className={styles.td}>
                      <span className={styles.cohortCode}>{cohort.cohortCode}</span>
                    </td>
                    <td className={styles.td}>{cohort.academyId}</td>
                    <td className={styles.td}>{cohort.dayOfWeek}</td>
                    <td className={styles.td}>{cohort.sessionTime}</td>
                    <td className={styles.td}>{formatDate(cohort.createdAt)}</td>
                    <td className={styles.td}>
                      <button
                        className={styles.scheduleButton}
                        onClick={() => handleSchedule(cohort)}
                        title={`Schedule for ${cohort.cohortCode}`}
                      >
                        Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cohorts.length === 0 && (
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>No active cohorts available</p>
          </div>
        )}
      </div>

      {/* Scheduler Modal */}
      {selectedCohort && <SchedulerModal cohort={selectedCohort} onClose={closeModal} />}
    </div>
  );
};

export default SchedulerPage;
