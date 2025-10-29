import React, { useState } from "react";
import { useMedicationsContext } from "../contexts/MedicationsContext";

const MedicationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { addMedication } = useMedicationsContext();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Medication name is required";
    }

    if (!dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }

    if (!frequency.trim()) {
      newErrors.frequency = "Frequency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    addMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
    });

    // Reset form
    setName("");
    setDosage("");
    setFrequency("");
    setErrors({});
  };

  return (
    <div className="medication-form">
      <h2>Add New Medication</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="medication-name">Medication Name:</label>
          <input
            type="text"
            id="medication-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Lisinopril"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="medication-dosage">Dosage:</label>
          <input
            type="text"
            id="medication-dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g., 20mg"
            className={errors.dosage ? "error" : ""}
          />
          {errors.dosage && <span className="error-text">{errors.dosage}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="medication-frequency">Frequency:</label>
          <input
            type="text"
            id="medication-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="e.g., Once daily in the morning"
            className={errors.frequency ? "error" : ""}
          />
          {errors.frequency && (
            <span className="error-text">{errors.frequency}</span>
          )}
        </div>

        <button type="submit" className="submit-button">
          Add Medication
        </button>
      </form>
    </div>
  );
};

export default MedicationForm;
