import React from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "14px",
              background: "#1B1F4A",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            },
            success: {
              iconTheme: {
                primary: "#3FB8A8",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#D42A52",
                secondary: "#fff",
              },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}
