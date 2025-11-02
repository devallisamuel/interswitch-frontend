import { useState, useEffect, useCallback } from "react";
import type { Medication } from "../types/medication";
import { storageUtils } from "../utils/storage";
import { useAuthContext } from "../contexts/AuthContext";

export const useMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuthContext();

  // Load medications when user changes
  useEffect(() => {
    if (user) {
      const userMedications = storageUtils.getMedications(user.username);
      setMedications(userMedications);
      setIsInitialized(true);
    } else {
      setMedications([]);
      setIsInitialized(false);
    }
  }, [user]);

  // Save medications to localStorage whenever medications change
  useEffect(() => {
    if (user && isInitialized) {
      storageUtils.saveMedications(user.username, medications);
    }
  }, [user, medications, isInitialized]);

  const addMedication = useCallback((medication: Omit<Medication, "id">) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
    };
    setMedications((prev) => [...prev, newMedication]);
  }, []);

  const removeMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  }, []);

  return {
    medications,
    addMedication,
    removeMedication,
  };
};
