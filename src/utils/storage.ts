import type { Medication, VitalSigns } from "../types";

const MEDICATIONS_KEY_PREFIX = "health-tracker-medications-";
const VITALS_KEY_PREFIX = "health-tracker-vitals-";

export const storageUtils = {
  // Medication storage
  getMedications: (username: string): Medication[] => {
    try {
      const key = `${MEDICATIONS_KEY_PREFIX}${username}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading medications:", error);
      return [];
    }
  },

  saveMedications: (username: string, medications: Medication[]): void => {
    try {
      const key = `${MEDICATIONS_KEY_PREFIX}${username}`;
      localStorage.setItem(key, JSON.stringify(medications));
    } catch (error) {
      console.error("Error saving medications:", error);
    }
  },

  // Vital signs storage
  getVitalSigns: (username: string): VitalSigns[] => {
    try {
      const key = `${VITALS_KEY_PREFIX}${username}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading vital signs:", error);
      return [];
    }
  },

  saveVitalSigns: (username: string, vitals: VitalSigns[]): void => {
    try {
      const key = `${VITALS_KEY_PREFIX}${username}`;
      localStorage.setItem(key, JSON.stringify(vitals));
    } catch (error) {
      console.error("Error saving vital signs:", error);
    }
  },

  // Utility to clear all user data
  clearUserData: (username: string): void => {
    try {
      localStorage.removeItem(`${MEDICATIONS_KEY_PREFIX}${username}`);
      localStorage.removeItem(`${VITALS_KEY_PREFIX}${username}`);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  },
};
