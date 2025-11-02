import { useState, useEffect, useCallback } from "react";
import type { VitalSigns } from "../types/vitalSigns";
import { storageUtils } from "../utils/storage";
import { useAuthContext } from "../contexts/AuthContext";

export const useVitalSigns = () => {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuthContext();

  // Load vital signs when user changes
  useEffect(() => {
    if (user) {
      const userVitals = storageUtils.getVitalSigns(user.username);
      setVitalSigns(userVitals);
      setIsInitialized(true);
    } else {
      setVitalSigns([]);
      setIsInitialized(false);
    }
  }, [user]);

  // Save vital signs to localStorage whenever they change
  useEffect(() => {
    if (user && isInitialized) {
      storageUtils.saveVitalSigns(user.username, vitalSigns);
    }
  }, [user, vitalSigns, isInitialized]);

  const addVitalSigns = useCallback(
    (vitals: Omit<VitalSigns, "id" | "timestamp">) => {
      const newVitals: VitalSigns = {
        ...vitals,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString(),
      };
      setVitalSigns((prev) => [newVitals, ...prev]); // Add to beginning for reverse chronological order
    },
    []
  );

  return {
    vitalSigns,
    addVitalSigns,
  };
};
