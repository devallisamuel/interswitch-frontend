import React from "react";
import { useVitalSignsContext } from "../contexts/VitalSignsContext";

const VitalSignsLog: React.FC = () => {
  const { vitalSigns } = useVitalSignsContext();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80)
      return { category: "Normal", className: "bp-normal" };
    if (systolic < 130 && diastolic < 80)
      return { category: "Elevated", className: "bp-elevated" };
    if (
      (systolic >= 130 && systolic < 140) ||
      (diastolic >= 80 && diastolic < 90)
    ) {
      return { category: "Stage 1 High", className: "bp-stage1" };
    }
    if (systolic >= 140 || diastolic >= 90)
      return { category: "Stage 2 High", className: "bp-stage2" };
    return { category: "Unknown", className: "bp-unknown" };
  };

  if (vitalSigns.length === 0) {
    return (
      <div className="vital-signs-log">
        <h2>Vital Signs History</h2>
        <p className="empty-state">
          No vital signs logged yet. Use the form above to log your first entry.
        </p>
      </div>
    );
  }

  return (
    <div className="vital-signs-log">
      <h2>Vital Signs History ({vitalSigns.length} entries)</h2>
      <div className="vitals-list">
        {vitalSigns.map((vitals) => {
          const bpInfo = getBPCategory(vitals.systolic, vitals.diastolic);
          return (
            <div key={vitals.id} className="vitals-card">
              <div className="vitals-header">
                <span className="vitals-date">
                  {formatDate(vitals.timestamp)}
                </span>
              </div>
              <div className="vitals-content">
                <div className="vitals-row">
                  <div className="vital-item">
                    <span className="vital-label">Blood Pressure:</span>
                    <span className="vital-value">
                      {vitals.systolic}/{vitals.diastolic} mmHg
                    </span>
                    <span className={`bp-category ${bpInfo.className}`}>
                      ({bpInfo.category})
                    </span>
                  </div>
                </div>
                <div className="vitals-row">
                  <div className="vital-item">
                    <span className="vital-label">Heart Rate:</span>
                    <span className="vital-value">{vitals.heartRate} BPM</span>
                  </div>
                  <div className="vital-item">
                    <span className="vital-label">Weight:</span>
                    <span className="vital-value">{vitals.weight} lbs</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VitalSignsLog;
