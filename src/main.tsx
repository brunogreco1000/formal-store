// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; 
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { UserCartProvider } from "./context/UserCartContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <UserCartProvider>
        <App />
      </UserCartProvider>
    </AuthProvider>
  </React.StrictMode>
);
