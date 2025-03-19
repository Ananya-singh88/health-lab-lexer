
import React, { useState } from "react";
import { Heart, ShoppingCart, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileModal from "@/components/ProfileModal";

const Header = () => {
  const location = useLocation();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
      <div className="container mx-auto py-4">
        {/* Top Header with Logo and Search */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Link to="/" className="flex items-end">
              <span className="text-xl font-bold text-primary tracking-tight">HealthLab</span>
              <div className="bg-primary text-white px-1 rounded text-sm font-bold">24/7</div>
            </Link>
            <div className="text-sm text-muted-foreground ml-4 hidden md:block">
              Collect sample from
              <Button variant="outline" size="sm" className="ml-2">
                Select Address <span className="ml-1">▼</span>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 px-6 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Search for lab tests" className="pl-8 pr-4 py-2 w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setProfileModalOpen(true)}
            >
              <span>Login</span>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Bottom Header with Navigation */}
        <nav className="flex items-center gap-8 pt-1 overflow-x-auto pb-2">
          <Link to="/" className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors">
            Buy Medicines
          </Link>
          <Link to="/" className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors">
            Find Doctors
          </Link>
          <Link 
            to="/" 
            className={`whitespace-nowrap text-sm font-medium transition-colors border-b-2 border-primary text-primary pb-1`}
          >
            Lab Tests
          </Link>
          <Link to="/" className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors">
            Circle Membership
          </Link>
          <Link to="/dashboard" className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors">
            Health Records
          </Link>
          <Link to="/" className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors">
            Diabetes Reversal
          </Link>
          <Link to="/" className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors flex items-center">
            Buy Insurance
            <span className="ml-1 text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">New</span>
          </Link>
        </nav>
      </div>
      
      <ProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
    </header>
  );
};

export default Header;
