/**
 * LessonPlansForm.tsx
 * Lesson Plans form for Architect Portal
 * Allows mapping lessons to cohorts through product and academy selection
 * Uses unified lessons from both mock data and user-created lessons
 */

import React, { useState, useEffect } from 'react';
import styles from './LessonPlansForm.module.css';

import type {
  LessonCohortMapping,
  LessonPlansFormState,
} from '../../types/lessonPlans';
import {
  MOCK_PRODUCTS,
  MOCK_ACADEMIES,
  MOCK_COHORTS,
  MOCK_LESSONS,
  getAcademiesByProduct,
  saveLessonPlansMappings,
  loadLessonPlansMappings,
  getMappingsByProductAndAcademy,
} from '../../data/lessonPlansMock';
import { loadLessons, getLessonsByProductAndAcademy } from '../../data/lessonMock';

export const LessonPlansForm: React.FC = () => {
  const [formState, setFormState] = useState<LessonPlansFormState>({
    selectedLessons: [],
    mappings: [],
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load mappings and user lessons on mount
  useEffect(() => {
    const loadedMappings = loadLessonPlansMappings();
    loadLessons(); // Load lessons to ensure they're available for filtering
    
    setFormState((prev) => ({
      ...prev,
      mappings: loadedMappings,
    }));
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

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setFormState((prev) => ({
      ...prev,
      selectedProduct: productId,
      selectedAcademy: undefined,
      selectedLessons: [],
    }));
  };

  const handleAcademyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const academyId = e.target.value;
    setFormState((prev) => ({
      ...prev,
      selectedAcademy: academyId,
      selectedLessons: [],
    }));
  };

  const handleLessonToggle = (lessonId: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedLessons: prev.selectedLessons.includes(lessonId)
        ? prev.selectedLessons.filter((id) => id !== lessonId)
        : [...prev.selectedLessons, lessonId],
    }));
  };

  const handleCohortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      selectedCohort: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!formState.selectedProduct) {
      setErrorMessage('Please select a Product');
      return;
    }

    if (!formState.selectedAcademy) {
      setErrorMessage('Please select an Academy');
      return;
    }

    if (formState.selectedLessons.length === 0) {
      setErrorMessage('Please select at least one Lesson');
      return;
    }

    if (!formState.selectedCohort) {
      setErrorMessage('Please select a Cohort');
      return;
    }

    // Create new mapping
    const newMapping: LessonCohortMapping = {
      id: `mapping-${Date.now()}`,
      lessonIds: formState.selectedLessons,
      cohortId: formState.selectedCohort,
      productId: formState.selectedProduct,
      academyId: formState.selectedAcademy,
      createdAt: new Date().toISOString(),
      mappedLessonCount: formState.selectedLessons.length,
    };

    // Save to state and localStorage
    const updatedMappings = [...formState.mappings, newMapping];
    setFormState((prev) => ({
      ...prev,
      mappings: updatedMappings,
      selectedProduct: undefined,
      selectedAcademy: undefined,
      selectedLessons: [],
      selectedCohort: undefined,
    }));

    saveLessonPlansMappings(updatedMappings);
    setSuccessMessage(
      `Successfully mapped ${formState.selectedLessons.length} lesson(s) to cohort`
    );
  };

  const handleReset = () => {
    setFormState((prev) => ({
      ...prev,
      selectedProduct: undefined,
      selectedAcademy: undefined,
      selectedLessons: [],
      selectedCohort: undefined,
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDeleteMapping = (mappingId: string) => {
    const updatedMappings = formState.mappings.filter((m) => m.id !== mappingId);
    setFormState((prev) => ({
      ...prev,
      mappings: updatedMappings,
    }));
    saveLessonPlansMappings(updatedMappings);
  };

  // Get filtered data
  const academiesForProduct =
    formState.selectedProduct &&
    getAcademiesByProduct(formState.selectedProduct);

  const lessonsForSelection =
    formState.selectedProduct &&
    formState.selectedAcademy &&
    getLessonsByProductAndAcademy(formState.selectedProduct, formState.selectedAcademy);

  const currentMappings =
    formState.selectedProduct &&
    formState.selectedAcademy &&
    getMappingsByProductAndAcademy(
      formState.selectedProduct,
      formState.selectedAcademy,
      formState.mappings
    );

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Lesson Plans Mapping</h2>
      <p className={styles.formSubtitle}>Map lessons to cohorts for programme delivery</p>

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

      <div className={styles.formContent}>
        {/* Section 1: Product & Academy Selection */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legendTitle}>Step 1: Select Product & Academy</legend>

          <div className={styles.fieldGroup}>
            <label htmlFor="product-select" className={styles.fieldLabel}>
              Product <span className={styles.required}>*</span>
            </label>
            <select
              id="product-select"
              value={formState.selectedProduct || ''}
              onChange={handleProductChange}
              className={styles.select}
            >
              <option value="">-- Select a Product --</option>
              {MOCK_PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {formState.selectedProduct && (
              <p className={styles.fieldHelper}>
                {MOCK_PRODUCTS.find((p) => p.id === formState.selectedProduct)?.description}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="academy-select" className={styles.fieldLabel}>
              Academy <span className={styles.required}>*</span>
            </label>
            <select
              id="academy-select"
              value={formState.selectedAcademy || ''}
              onChange={handleAcademyChange}
              className={styles.select}
              disabled={!formState.selectedProduct}
            >
              <option value="">-- Select an Academy --</option>
              {academiesForProduct &&
                academiesForProduct.map((academy) => (
                  <option key={academy.id} value={academy.id}>
                    {academy.name}
                  </option>
                ))}
            </select>
            {formState.selectedAcademy && (
              <p className={styles.fieldHelper}>
                {MOCK_ACADEMIES.find((a) => a.id === formState.selectedAcademy)?.description}
              </p>
            )}
          </div>
        </fieldset>

        {/* Section 2: Lesson Selection */}
        {formState.selectedProduct && formState.selectedAcademy && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legendTitle}>
              Step 2: Select Lessons ({formState.selectedLessons.length} selected)
            </legend>

            {lessonsForSelection && lessonsForSelection.length > 0 ? (
              <div className={styles.lessonGrid}>
                {lessonsForSelection.map((lesson) => (
                  <label
                    key={lesson.id}
                    className={styles.lessonCheckboxLabel}
                  >
                    <input
                      type="checkbox"
                      checked={formState.selectedLessons.includes(lesson.id)}
                      onChange={() => handleLessonToggle(lesson.id)}
                      className={styles.lessonCheckbox}
                    />
                    <span className={styles.lessonContent}>
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      {lesson.description && (
                        <span className={styles.lessonDescription}>{lesson.description}</span>
                      )}
                      {lesson.duration && (
                        <span className={styles.lessonDuration}>{lesson.duration} mins</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No lessons available for this selection</p>
            )}
          </fieldset>
        )}

        {/* Section 3: Cohort Selection */}
        {formState.selectedLessons.length > 0 && (
          <fieldset className={styles.fieldset}>
            <legend className={styles.legendTitle}>Step 3: Select Cohort</legend>

            <div className={styles.fieldGroup}>
              <label htmlFor="cohort-select" className={styles.fieldLabel}>
                Cohort <span className={styles.required}>*</span>
              </label>
              <select
                id="cohort-select"
                value={formState.selectedCohort || ''}
                onChange={handleCohortChange}
                className={styles.select}
              >
                <option value="">-- Select a Cohort --</option>
                {MOCK_COHORTS.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                    {cohort.startDate && ` (${new Date(cohort.startDate).toLocaleDateString()})`}
                  </option>
                ))}
              </select>
              {formState.selectedCohort && (
                <p className={styles.fieldHelper}>
                  {MOCK_COHORTS.find((c) => c.id === formState.selectedCohort)?.capacity &&
                    `Capacity: ${
                      MOCK_COHORTS.find((c) => c.id === formState.selectedCohort)?.capacity
                    } participants`}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {/* Action Buttons */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Actions</span>
          <div className={styles.actionButtonGroup}>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={
                !formState.selectedProduct ||
                !formState.selectedAcademy ||
                formState.selectedLessons.length === 0 ||
                !formState.selectedCohort
              }
            >
              Save Mapping
            </button>
            <button
              type="reset"
              className={styles.buttonSecondary}
              onClick={handleReset}
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      {/* Display Current Mappings */}
      {currentMappings && currentMappings.length > 0 && (
        <div className={styles.mappingsSection}>
          <h3 className={styles.mappingsTitle}>
            Current Mappings for {formState.selectedProduct}
          </h3>
          <div className={styles.mappingsList}>
            {currentMappings.map((mapping) => {
              const cohort = MOCK_COHORTS.find((c) => c.id === mapping.cohortId);
              const academy = MOCK_ACADEMIES.find((a) => a.id === mapping.academyId);
              const lessons = MOCK_LESSONS.filter((l) => mapping.lessonIds.includes(l.id));

              return (
                <div key={mapping.id} className={styles.mappingCard}>
                  <div className={styles.mappingHeader}>
                    <div>
                      <h4 className={styles.mappingCohort}>{cohort?.name}</h4>
                      <p className={styles.mappingAcademy}>{academy?.name}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDeleteMapping(mapping.id)}
                      title="Delete this mapping"
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.mappingContent}>
                    <p className={styles.lessonCount}>
                      {mapping.mappedLessonCount} lesson{mapping.mappedLessonCount !== 1 ? 's' : ''} mapped
                    </p>
                    <div className={styles.lessonsList}>
                      {lessons.map((lesson) => (
                        <span key={lesson.id} className={styles.lessonTag}>
                          {lesson.title}
                        </span>
                      ))}
                    </div>
                    <p className={styles.mappingDate}>
                      Mapped: {new Date(mapping.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
};
