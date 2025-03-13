
import React from "react";
import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary animate-pulse-glow" />
          <h1 className="text-xl font-bold tracking-tight">HealthLab Insights</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Reports</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Profile</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Help</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
