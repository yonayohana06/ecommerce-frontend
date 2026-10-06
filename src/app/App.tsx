import React from "react";
import { BrowserRouter as Router } from "react-router";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AppRouter } from "./router";

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppRouter />
    </Router>
  );
};

export default App;
