import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Medication } from "../types";
import { storageUtils } from "../utils/storage";
import { useAuthContext } from "./AuthContext";

interface MedicationsContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  removeMedication: (id: string) => void;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(
  undefined
);

interface MedicationsProviderProps {
  children: ReactNode;
}

export const MedicationsProvider: React.FC<MedicationsProviderProps> = ({
  children,
}) => {
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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
