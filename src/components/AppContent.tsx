import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";
import Header from "./Header";
import Dashboard from "./Dashboard";

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

export default AppContent;
