export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface VitalSigns {
  id: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  weight: number;
  timestamp: string;
}

export interface User {
  username: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
