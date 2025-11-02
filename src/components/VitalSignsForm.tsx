import React, { useState } from "react";
import { useVitalSignsContext } from "../contexts/VitalSignsContext";
import type { FormErrors } from "../types/common";

const VitalSignsForm: React.FC = () => {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const { addVitalSigns } = useVitalSignsContext();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Validate systolic blood pressure
    const systolicNum = parseInt(systolic);
    if (!systolic.trim() || isNaN(systolicNum)) {
      newErrors.systolic = "Systolic blood pressure must be a valid number";
    } else if (systolicNum < 70 || systolicNum > 250) {
      newErrors.systolic =
        "Systolic blood pressure should be between 70-250 mmHg";
    }

    // Validate diastolic blood pressure
    const diastolicNum = parseInt(diastolic);
    if (!diastolic.trim() || isNaN(diastolicNum)) {
      newErrors.diastolic = "Diastolic blood pressure must be a valid number";
    } else if (diastolicNum < 40 || diastolicNum > 150) {
      newErrors.diastolic =
        "Diastolic blood pressure should be between 40-150 mmHg";
    }

    // Validate heart rate
    const heartRateNum = parseInt(heartRate);
    if (!heartRate.trim() || isNaN(heartRateNum)) {
      newErrors.heartRate = "Heart rate must be a valid number";
    } else if (heartRateNum < 30 || heartRateNum > 220) {
      newErrors.heartRate = "Heart rate should be between 30-220 BPM";
    }

    // Validate weight
    const weightNum = parseFloat(weight);
    if (!weight.trim() || isNaN(weightNum)) {
      newErrors.weight = "Weight must be a valid number";
    } else if (weightNum < 50 || weightNum > 1000) {
      newErrors.weight = "Weight should be between 50-1000 lbs";
    }

    // Check if systolic is higher than diastolic
    if (
      !newErrors.systolic &&
      !newErrors.diastolic &&
      systolicNum <= diastolicNum
    ) {
      newErrors.systolic =
        "Systolic pressure should be higher than diastolic pressure";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    addVitalSigns({
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      heartRate: parseInt(heartRate),
      weight: parseFloat(weight),
    });

    // Reset form
    setSystolic("");
    setDiastolic("");
    setHeartRate("");
    setWeight("");
    setErrors({});
  };

  return (
    <div className="vital-signs-form">
      <h2>Log Vital Signs</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="systolic">Systolic BP (mmHg):</label>
            <input
              type="number"
              id="systolic"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="e.g., 120"
              min="70"
              max="250"
              className={errors.systolic ? "error" : ""}
            />
            {errors.systolic && (
              <span className="error-text">{errors.systolic}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="diastolic">Diastolic BP (mmHg):</label>
            <input
              type="number"
              id="diastolic"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="e.g., 80"
              min="40"
              max="150"
              className={errors.diastolic ? "error" : ""}
            />
            {errors.diastolic && (
              <span className="error-text">{errors.diastolic}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="heart-rate">Heart Rate (BPM):</label>
            <input
              type="number"
              id="heart-rate"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="e.g., 65"
              min="30"
              max="220"
              className={errors.heartRate ? "error" : ""}
            />
            {errors.heartRate && (
              <span className="error-text">{errors.heartRate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (lbs):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 150"
              min="50"
              max="1000"
              step="0.1"
              className={errors.weight ? "error" : ""}
            />
            {errors.weight && (
              <span className="error-text">{errors.weight}</span>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Log Vital Signs
        </button>
      </form>
    </div>
  );
};

export default VitalSignsForm;
