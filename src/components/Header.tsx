
import React from "react";
import { Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary animate-pulse-glow" />
          <Link to="/" className="text-xl font-bold tracking-tight">HealthLab Insights</Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ? "text-primary" : "hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/dashboard" ? "text-primary" : "hover:text-primary"
            }`}
          >
            Dashboard
          </Link>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">Reports</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors hidden md:block">Profile</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
