
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Heart, Activity, Snowflake, Pill, Search 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type HealthCheckCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

const categories: HealthCheckCategory[] = [
  {
    id: "diabetes",
    name: "Diabetes",
    icon: <Snowflake className="h-6 w-6" />,
    color: "bg-blue-100"
  },
  {
    id: "heart",
    name: "Heart",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-red-100"
  },
  {
    id: "kidney",
    name: "Kidney",
    icon: <Activity className="h-6 w-6" />,
    color: "bg-purple-100"
  },
  {
    id: "thyroid",
    name: "Thyroid",
    icon: <Pill className="h-6 w-6" />,
    color: "bg-green-100"
  }
];

const HealthChecks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categoryId: string) => {
    // Simulate uploading a report for this category
    navigate(`/?category=${categoryId}`);
  };

  return (
    <div className="py-6">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Doctor Created Health Checks</h2>
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search health checks..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <Card 
            key={category.id} 
            className="border rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCategoryClick(category.id)}
          >
            <CardContent className="p-6 flex items-center gap-3 justify-center">
              <div className={`p-2 rounded-full ${category.color}`}>
                {category.icon}
              </div>
              <span className="text-lg font-medium">{category.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealthChecks;
