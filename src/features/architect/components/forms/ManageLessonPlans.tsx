/**
 * ManageLessonPlans.tsx
 * Lesson Plan management interface
 * Create, view, and delete lesson plans
 */

import React, { useState, useEffect } from 'react';
import styles from './ManageLessonPlans.module.css';

import type { Lesson } from '../../types/lesson';
import {
  MOCK_PRODUCTS,
  saveLessons,
  loadLessons,
} from '../../data/lessonMock';

export const ManageLessonPlans: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    productId: '',
    duration: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load lessons on mount
  useEffect(() => {
    const loadedLessons = loadLessons();
    setLessons(loadedLessons);
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a Lesson Title');
      return;
    }

    if (!formData.code.trim()) {
      setErrorMessage('Please enter a Lesson Code');
      return;
    }

    if (!formData.productId) {
      setErrorMessage('Please select a Product');
      return;
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setErrorMessage('Please enter a valid Duration (in minutes)');
      return;
    }

    // Create new lesson
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: formData.title.trim(),
      code: formData.code.trim(),
      productId: formData.productId,
      duration: parseInt(formData.duration),
      createdAt: new Date().toISOString(),
    };

    // Add to lessons in memory
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    
    // Save only user-created lessons (filter to exclude mock lessons)
    const userCreatedLessons = updatedLessons.filter((l) => l.id.startsWith('lesson-'));
    saveLessons(userCreatedLessons);

    // Reset form
    setFormData({
      title: '',
      code: '',
      productId: '',
      duration: '',
    });

    setSuccessMessage(`Lesson "${newLesson.title}" created successfully`);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      code: '',
      productId: '',
      duration: '',
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDeleteLesson = (lessonId: string) => {
    const lessonToDelete = lessons.find((l) => l.id === lessonId);
    const updatedLessons = lessons.filter((l) => l.id !== lessonId);
    
    // Only save user-created lessons (those starting with 'lesson-' created from Date.now())
    const userCreatedLessons = updatedLessons.filter((l) => l.id.startsWith('lesson-'));
    saveLessons(userCreatedLessons);
    
    setLessons(updatedLessons);
    setSuccessMessage(`Lesson "${lessonToDelete?.title}" deleted successfully`);
  };

  const getProductName = (productId: string) => {
    return MOCK_PRODUCTS.find((p) => p.id === productId)?.name || 'Unknown';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Lesson Plans</h2>
      <p className={styles.subtitle}>Create and manage lesson plans for your products</p>

      {/* Messages */}
      {successMessage && (
        <div className={styles.messageSuccess} role="alert">
          ✓ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className={styles.messageError} role="alert">
          ✗ {errorMessage}
        </div>
      )}

      {/* Form Section */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Create New Lesson</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Lesson Title */}
            <div className={styles.fieldGroup}>
              <label htmlFor="title" className={styles.label}>
                Lesson Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., CV Writing & Personal Branding"
                className={styles.input}
              />
            </div>

            {/* Lesson Code */}
            <div className={styles.fieldGroup}>
              <label htmlFor="code" className={styles.label}>
                Lesson Code <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., L001"
                className={styles.input}
              />
            </div>

            {/* Product */}
            <div className={styles.fieldGroup}>
              <label htmlFor="productId" className={styles.label}>
                Product <span className={styles.required}>*</span>
              </label>
              <select
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">-- Select a Product --</option>
                {MOCK_PRODUCTS.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className={styles.fieldGroup}>
              <label htmlFor="duration" className={styles.label}>
                Duration (minutes) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 120"
                className={styles.input}
                min="1"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.buttonPrimary}>
              Create Lesson
            </button>
            <button type="button" onClick={handleReset} className={styles.buttonSecondary}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Lessons Grid */}
      <div className={styles.gridSection}>
        <h3 className={styles.sectionTitle}>
          Lessons ({lessons.length})
        </h3>

        {lessons.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>📝</p>
            <p className={styles.emptyText}>No lessons created yet. Create your first lesson above.</p>
          </div>
        ) : (
          <div className={styles.gridWrapper}>
            <div className={styles.grid}>
              {/* Grid Header */}
              <div className={styles.gridHeader}>
                <div className={styles.gridCell}>Lesson ID</div>
                <div className={styles.gridCell}>Title</div>
                <div className={styles.gridCell}>Code</div>
                <div className={styles.gridCell}>Product</div>
                <div className={styles.gridCell}>Duration</div>
                <div className={styles.gridCell}>Created</div>
                <div className={styles.gridCell}>Action</div>
              </div>

              {/* Grid Rows */}
              {lessons.map((lesson) => {
                const isMockLesson = !lesson.id.startsWith('lesson-');
                return (
                  <div key={lesson.id} className={styles.gridRow}>
                    <div className={styles.gridCell}>
                      <span className={styles.lessonId}>{lesson.id}</span>
                      {isMockLesson && <span className={styles.mockBadge}>Mock</span>}
                    </div>
                    <div className={styles.gridCell}>
                      <span className={styles.cellContent}>{lesson.title}</span>
                    </div>
                    <div className={styles.gridCell}>
                      <span className={styles.cellContent}>{lesson.code}</span>
                    </div>
                    <div className={styles.gridCell}>
                      <span className={styles.productBadge}>{getProductName(lesson.productId)}</span>
                    </div>
                    <div className={styles.gridCell}>
                      <span className={styles.cellContent}>{lesson.duration} min</span>
                    </div>
                    <div className={styles.gridCell}>
                      <span className={styles.dateText}>
                        {new Date(lesson.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.gridCell}>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className={styles.deleteButton}
                        disabled={isMockLesson}
                        title={isMockLesson ? 'Cannot delete mock lessons' : 'Delete this lesson'}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
