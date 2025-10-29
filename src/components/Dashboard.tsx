import React, { useState } from 'react';
import MedicationForm from './MedicationForm';
import MedicationList from './MedicationList';
import VitalSignsForm from './VitalSignsForm';
import VitalSignsLog from './VitalSignsLog';

type TabType = 'medications' | 'vitals';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('medications');

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          Medications
        </button>
        <button
          className={`nav-button ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          Vital Signs
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'medications' && (
          <div className="medications-section">
            <MedicationForm />
            <MedicationList />
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="vitals-section">
            <VitalSignsForm />
            <VitalSignsLog />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
