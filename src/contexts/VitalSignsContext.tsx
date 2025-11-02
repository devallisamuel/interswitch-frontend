import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  VitalSigns,
  VitalSignsContextType,
  VitalSignsProviderProps,
} from "../types/vitalSigns";
import { storageUtils } from "../utils/storage";
import { useAuthContext } from "./AuthContext";

const VitalSignsContext = createContext<VitalSignsContextType | undefined>(
  undefined
);

export const VitalSignsProvider: React.FC<VitalSignsProviderProps> = ({
  children,
}) => {
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuthContext();

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
      setVitalSigns((prev) => [newVitals, ...prev]);
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
