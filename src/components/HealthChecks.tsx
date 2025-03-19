
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, Activity, Lungs, Thermometer, User, Droplet, 
  Baby, ThermometerSnowflake, Pill 
} from "lucide-react";

type HealthCheckCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

const categories: HealthCheckCategory[] = [
  {
    id: "full-body",
    name: "Full Body Checkup",
    icon: <User className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "diabetes",
    name: "Diabetes",
    icon: <ThermometerSnowflake className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "womens-health",
    name: "Women's Health",
    icon: <Baby className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "thyroid",
    name: "Thyroid",
    icon: <Pill className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "vitamin",
    name: "Vitamin",
    icon: <Pill className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "blood-studies",
    name: "Blood Studies",
    icon: <Droplet className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "heart",
    name: "Heart",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "kidney",
    name: "Kidney",
    icon: <Activity className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "liver",
    name: "Liver",
    icon: <Lungs className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "hairfall",
    name: "Hairfall",
    icon: <User className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "fever",
    name: "Fever",
    icon: <Thermometer className="h-6 w-6" />,
    color: "bg-orange-100"
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen",
    icon: <User className="h-6 w-6" />,
    color: "bg-orange-100"
  }
];

const HealthChecks = () => {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Doctor Created Health Checks (29)</h2>
        <a href="#" className="text-primary text-sm">View All</a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center">
              <div className={`relative mb-2 rounded-full p-4 ${category.color}`}>
                {category.icon}
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-0.5 text-xs">+</div>
              </div>
              <span className="text-sm text-center">{category.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HealthChecks;
