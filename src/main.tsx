import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserCartProvider } from "./context/UserCartContext";

function RootWrapper() {
  const { loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando sesión...
      </div>
    );

  return (
    <UserCartProvider>
      <App />
    </UserCartProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RootWrapper />
    </AuthProvider>
  </React.StrictMode>
);
