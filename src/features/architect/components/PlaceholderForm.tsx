/**
 * PlaceholderForm.tsx
 * Generic placeholder form surface for wireframe demonstration
 * Shows a structured layout with labelled blocks for future fields
 */

import React from 'react';
import styles from './PlaceholderForm.module.css';

interface PlaceholderFormProps {
  title: string;
}

export const PlaceholderForm: React.FC<PlaceholderFormProps> = ({ title }) => {
  return (
    <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
      <h2 className={styles.formTitle}>{title}</h2>
      <p className={styles.formSubtitle}>Form placeholder</p>

      <div className={styles.formContent}>
        {/* Field group 1 */}
        <div className={styles.fieldGroup}>
          <label htmlFor="field-1" className={styles.fieldLabel}>
            Field Group A
          </label>
          <div id="field-1" className={styles.fieldPlaceholder} tabIndex={0} role="region">
            [Input field or selection area]
          </div>
        </div>

        {/* Field group 2 */}
        <div className={styles.fieldGroup}>
          <label htmlFor="field-2" className={styles.fieldLabel}>
            Field Group B
          </label>
          <div id="field-2" className={styles.fieldPlaceholder} tabIndex={0} role="region">
            [Input field or selection area]
          </div>
        </div>

        {/* Field group 3 */}
        <div className={styles.fieldGroup}>
          <label htmlFor="field-3" className={styles.fieldLabel}>
            Field Group C
          </label>
          <div id="field-3" className={styles.fieldPlaceholder} tabIndex={0} role="region">
            [Input field or selection area]
          </div>
        </div>

        {/* Actions */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Actions</span>
          <div className={styles.actionButtonGroup}>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled
            >
              Save (disabled for wireframe)
            </button>
            <button
              type="reset"
              className={styles.buttonSecondary}
              disabled
            >
              Cancel (disabled for wireframe)
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
