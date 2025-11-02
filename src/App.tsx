import { AuthProvider } from "./contexts/AuthContext";
import { MedicationsProvider } from "./contexts/MedicationsContext";
import { VitalSignsProvider } from "./contexts/VitalSignsContext";
import AppContent from "./components/AppContent";
import "./App.css";

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
