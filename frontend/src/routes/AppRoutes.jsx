/* IMPORTS OF COMPONENTS */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/general/LandingPage";

/* MAIN COMPONENT */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}