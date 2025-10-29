import React from "react";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { MedicationsProvider } from "./contexts/MedicationsContext";
import { VitalSignsProvider } from "./contexts/VitalSignsContext";
import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import "./App.css";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MedicationsProvider>
        <VitalSignsProvider>
          <AppContent />
        </VitalSignsProvider>
      </MedicationsProvider>
    </AuthProvider>
  );
}

export default App;
