/**
 * CreateWorkshopModal.tsx
 * Modal for creating custom workshops by selecting lessons
 */

import React, { useState } from 'react';
import styles from './CreateWorkshopModal.module.css';
import { loadLessons } from '../../architect/data/lessonMock';

interface CreateWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lessonId: string, lessonName: string, workshopName: string) => void;
  week: number;
  day: string;
}

export const CreateWorkshopModal: React.FC<CreateWorkshopModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  week,
  day,
}) => {
  const [selectedLesson, setSelectedLesson] = useState('');
  const [workshopName, setWorkshopName] = useState('');
  const [error, setError] = useState('');

  const lessons = loadLessons();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedLesson) {
      setError('Please select a lesson');
      return;
    }

    if (!workshopName.trim()) {
      setError('Please enter a workshop name');
      return;
    }

    const lesson = lessons.find((l) => l.id === selectedLesson);
    if (!lesson) {
      setError('Selected lesson not found');
      return;
    }

    onSubmit(selectedLesson, lesson.title, workshopName.trim());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} role="presentation" />

      {/* Modal */}
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.modalContent}>
          <header className={styles.modalHeader}>
            <h2 id="modal-title" className={styles.modalTitle}>
              Create Workshop
            </h2>
            <p className={styles.modalSubtitle}>
              Week {week}, {day}
            </p>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
              title="Close"
            >
              ✕
            </button>
          </header>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage} role="alert">
                ✗ {error}
              </div>
            )}

            {/* Lesson Selection */}
            <div className={styles.formGroup}>
              <label htmlFor="lesson-select" className={styles.label}>
                Select Lesson <span className={styles.required}>*</span>
              </label>
              <select
                id="lesson-select"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className={styles.select}
              >
                <option value="">-- Choose a lesson --</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title} ({lesson.code})
                  </option>
                ))}
              </select>
              {selectedLesson && (
                <p className={styles.helper}>
                  {lessons.find((l) => l.id === selectedLesson)?.description || 'No description'}
                </p>
              )}
            </div>

            {/* Workshop Name */}
            <div className={styles.formGroup}>
              <label htmlFor="workshop-name" className={styles.label}>
                Workshop Name <span className={styles.required}>*</span>
              </label>
              <input
                id="workshop-name"
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                placeholder="e.g., CV Writing Session"
                className={styles.input}
              />
              <p className={styles.helper}>
                Give this workshop a unique name (can be different from lesson title)
              </p>
            </div>

            {/* Actions */}
            <div className={styles.formActions}>
              <button type="submit" className={styles.buttonPrimary}>
                Create Workshop
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles.buttonSecondary}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
