import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  Medication,
  MedicationsContextType,
  MedicationsProviderProps,
} from "../types/medication";
import { storageUtils } from "../utils/storage";
import { useAuthContext } from "./AuthContext";

const MedicationsContext = createContext<MedicationsContextType | undefined>(
  undefined
);

export const MedicationsProvider: React.FC<MedicationsProviderProps> = ({
  children,
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuthContext();

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

  const value = {
    medications,
    addMedication,
    removeMedication,
  };

  return (
    <MedicationsContext.Provider value={value}>
      {children}
    </MedicationsContext.Provider>
  );
};

export const useMedicationsContext = (): MedicationsContextType => {
  const context = useContext(MedicationsContext);
  if (context === undefined) {
    throw new Error(
      "useMedicationsContext must be used within a MedicationsProvider"
    );
  }
  return context;
};
