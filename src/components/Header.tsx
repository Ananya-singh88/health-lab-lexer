
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ProfileModal } from "./ProfileModal";

const Header = () => {
  const navigate = useNavigate();
  
  const handleReportsClick = () => {
    navigate("/dashboard");
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">HealthLab</span>
          <span className="text-xl font-semibold">Insights</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleReportsClick}>
            Reports
          </Button>
          <ProfileModal />
        </div>
      </div>
    </header>
  );
};

export default Header;
