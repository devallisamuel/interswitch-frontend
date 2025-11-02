export interface VitalSigns {
  id: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  weight: number;
  timestamp: string;
}

export interface VitalSignsContextType {
  vitalSigns: VitalSigns[];
  addVitalSigns: (vitals: Omit<VitalSigns, "id" | "timestamp">) => void;
}

export interface VitalSignsProviderProps {
  children: React.ReactNode;
}
