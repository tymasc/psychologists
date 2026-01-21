import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header/Header.tsx";
import Home from "../pages/Home/HomePage.tsx";
import Psychologists from "../pages/Psychologists/PsychologistsPage.tsx";
import Favorites from "../pages/Favorite/FavoritePage.tsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    document.body.className = "";

    if (location.pathname === "/") {
      document.body.classList.add("home-bg");
    }

    if (location.pathname === "/psychologists") {
      document.body.classList.add("psychologists-bg");
    }
  }, [location.pathname]);
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/psychologists" element={<Psychologists />} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
