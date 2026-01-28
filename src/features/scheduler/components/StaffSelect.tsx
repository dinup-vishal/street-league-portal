/**
 * StaffSelect Component
 * Accessible multi-select for assigning staff to a programme
 */

import React, { useState, useRef, useEffect } from 'react';
import type { Staff, StaffRole } from '../types';
import { getAvailabilityStatus } from '../mock/mockStaff';
import styles from './StaffSelect.module.css';

interface StaffSelectProps {
  staff: Staff[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

const ROLES: StaffRole[] = ['Coach', 'Facilitator', 'Coordinator'];

export const StaffSelect: React.FC<StaffSelectProps> = ({ staff, selected, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Set<StaffRole>>(new Set(ROLES));
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter staff by search term and selected roles
  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoles.has(s.role);
    return matchesSearch && matchesRole;
  });

  // Handle checkbox toggle
  const handleToggle = (staffId: string) => {
    const newSelected = selected.includes(staffId)
      ? selected.filter((id) => id !== staffId)
      : [...selected, staffId];
    onChange(newSelected);
  };

  // Handle role filter toggle
  const handleRoleToggle = (role: StaffRole) => {
    const newRoles = new Set(selectedRoles);
    if (newRoles.has(role)) {
      newRoles.delete(role);
    } else {
      newRoles.add(role);
    }
    setSelectedRoles(newRoles);
    setFocusedIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredStaff.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredStaff.length) % filteredStaff.length);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && filteredStaff[focusedIndex]) {
        handleToggle(filteredStaff[focusedIndex].id);
      }
    }
  };

  // Auto-focus keyboard navigation
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      const item = items[focusedIndex] as HTMLElement;
      item?.focus();
    }
  }, [focusedIndex]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // Modal stays open for staff selection
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <label htmlFor="staff-search" className={styles.label}>
        Assign Staff to Programme <span className={styles.required}>*</span>
      </label>

      {/* Search Input */}
      <input
        id="staff-search"
        type="text"
        placeholder="Search staff by name or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
        aria-label="Search staff by name or role"
        aria-describedby="staff-help"
      />

      {/* Role Filters */}
      <div className={styles.roleFilters}>
        <div className={styles.roleLabel}>Filter by role:</div>
        <div className={styles.roleCheckboxes}>
          {ROLES.map((role) => (
            <label key={role} className={styles.roleCheckbox}>
              <input
                type="checkbox"
                checked={selectedRoles.has(role)}
                onChange={() => handleRoleToggle(role)}
                aria-label={`Filter by ${role}`}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Staff List */}
      <div className={styles.listWrapper}>
        <ul
          ref={listRef}
          className={styles.staffList}
          role="listbox"
          aria-label="Staff list"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {filteredStaff.length > 0 ? (
            filteredStaff.map((s, index) => {
              const isChecked = selected.includes(s.id);
              const availability = getAvailabilityStatus(s, 'Monday'); // Example day for status
              return (
                <li
                  key={s.id}
                  className={`${styles.staffItem} ${isChecked ? styles.selected : ''} ${
                    index === focusedIndex ? styles.focused : ''
                  }`}
                  role="option"
                  aria-selected={isChecked}
                >
                  <label className={styles.itemLabel}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggle(s.id)}
                      className={styles.itemCheckbox}
                      aria-label={`Select ${s.name}, ${s.role}, availability ${availability}`}
                    />
                    <span className={styles.itemName}>{s.name}</span>
                    <span className={styles.itemRole}>{s.role}</span>
                    <span className={`${styles.itemAvail} ${styles[`avail-${availability}`]}`}>
                      {availability}
                    </span>
                  </label>
                </li>
              );
            })
          ) : (
            <li className={styles.emptyMessage} role="option" aria-label="No staff found">
              No staff found matching your search.
            </li>
          )}
        </ul>
      </div>

      <div id="staff-help" className={styles.helperText}>
        Select at least one staff member. Green = Available full week; Yellow = Limited hours; Red = Potential
        conflicts.
      </div>

      {/* Selected Count */}
      {selected.length > 0 && (
        <div className={styles.selectedCount} aria-live="polite">
          {selected.length} staff member{selected.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};
