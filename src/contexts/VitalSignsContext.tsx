import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { VitalSigns } from "../types";
import { storageUtils } from "../utils/storage";
import { useAuthContext } from "./AuthContext";

interface VitalSignsContextType {
  vitalSigns: VitalSigns[];
  addVitalSigns: (vitals: Omit<VitalSigns, "id" | "timestamp">) => void;
}

const VitalSignsContext = createContext<VitalSignsContextType | undefined>(
  undefined
);

interface VitalSignsProviderProps {
  children: ReactNode;
}

export const VitalSignsProvider: React.FC<VitalSignsProviderProps> = ({
  children,
}) => {
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
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      setVitalSigns((prev) => [newVitals, ...prev]); // Add to beginning for reverse chronological order
    },
    []
  );

  const value = {
    vitalSigns,
    addVitalSigns,
  };

  return (
    <VitalSignsContext.Provider value={value}>
      {children}
    </VitalSignsContext.Provider>
  );
};

export const useVitalSignsContext = (): VitalSignsContextType => {
  const context = useContext(VitalSignsContext);
  if (context === undefined) {
    throw new Error(
      "useVitalSignsContext must be used within a VitalSignsProvider"
    );
  }
  return context;
};
