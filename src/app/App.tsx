import React from "react";
import { BrowserRouter as Router } from "react-router";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AuthProvider } from "@/features/auth";
import { AppRouter } from "./router";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRouter />
      </Router>
    </AuthProvider>
  );
};

export default App;
