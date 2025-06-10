import { Routes, Route, Link } from "react-router-dom";
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import Resources from "@/pages/Resources";
import Notice from "@/pages/Notice";
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (_value: boolean) => {},
  logout: () => {},
});

/**
 * The main application component that sets up authentication context and routing.
 *
 * @component
 * @returns {JSX.Element} The root component of the class website.
 *
 * @remarks
 * - Provides `AuthContext` to child components, including authentication state and logout functionality.
 * - Uses React Router for navigation between pages: Home, Gallery, Resources, and Notice.
 * - Displays a navigation bar with links to each page.
 *
 * @context
 * - `isAuthenticated`: Indicates if the user is authenticated.
 * - `setIsAuthenticated`: Function to update authentication state.
 * - `logout`: Function to log out the user.
 */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      <nav className="bg-[#06AED5] text-white p-4 shadow-md">
        <div className="container mx-auto flex space-x-6">
          <Link to="/" className="hover:underline">首页</Link>
          <Link to="/gallery" className="hover:underline">相册</Link>
          <Link to="/resources" className="hover:underline">资料中心</Link>
          <Link to="/notice" className="hover:underline">公告栏</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/notice" element={<Notice />} />
      </Routes>
    </AuthContext.Provider>
  );
}
