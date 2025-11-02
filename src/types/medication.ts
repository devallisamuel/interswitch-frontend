export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface MedicationsContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  removeMedication: (id: string) => void;
}

export interface MedicationsProviderProps {
  children: React.ReactNode;
}
