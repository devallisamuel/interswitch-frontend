import React from "react";
import { useMedicationsContext } from "../contexts/MedicationsContext";

const MedicationList: React.FC = () => {
  const { medications, removeMedication } = useMedicationsContext();

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      removeMedication(id);
    }
  };

  if (medications.length === 0) {
    return (
      <div className="medication-list">
        <h2>Your Medications</h2>
        <p className="empty-state">
          No medications added yet. Use the form above to add your first
          medication.
        </p>
      </div>
    );
  }

  return (
    <div className="medication-list">
      <h2>Your Medications ({medications.length})</h2>
      <div className="medications-grid">
        {medications.map((medication) => (
          <div key={medication.id} className="medication-card">
            <div className="medication-info">
              <h3 className="medication-name">{medication.name}</h3>
              <p className="medication-dosage">
                <strong>Dosage:</strong> {medication.dosage}
              </p>
              <p className="medication-frequency">
                <strong>Frequency:</strong> {medication.frequency}
              </p>
            </div>
            <button
              className="remove-button"
              onClick={() => handleRemove(medication.id, medication.name)}
              aria-label={`Remove ${medication.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationList;
