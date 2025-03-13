
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Salad, Leaf, Apple } from "lucide-react";
import { HealthMetricProps } from "./HealthMetricCard";

interface DietaryPlannerProps {
  metrics: HealthMetricProps[];
}

const DietaryPlanner = ({ metrics }: DietaryPlannerProps) => {
  // Generate dietary recommendations based on metrics
  const dietaryRecommendations = [
    {
      category: "Proteins",
      items: [
        "Lean meats (chicken, turkey)",
        "Fish (especially fatty fish like salmon)",
        "Eggs",
        "Legumes (beans, lentils)"
      ],
      icon: <Salad className="h-5 w-5 text-green-500" />
    },
    {
      category: "Fruits & Vegetables",
      items: [
        "Leafy greens (spinach, kale)",
        "Berries (blueberries, strawberries)",
        "Citrus fruits (oranges, lemons)",
        "Cruciferous vegetables (broccoli, cauliflower)"
      ],
      icon: <Apple className="h-5 w-5 text-red-500" />
    },
    {
      category: "Grains & Fiber",
      items: [
        "Whole grains (brown rice, quinoa)",
        "Oats",
        "Chia seeds and flaxseeds",
        "Nuts and seeds"
      ],
      icon: <Leaf className="h-5 w-5 text-amber-500" />
    }
  ];

  // Analyze metrics for special dietary needs
  const hasHighCholesterol = metrics.some(m => 
    (m.name === "Total Cholesterol" || m.name === "LDL Cholesterol") && 
    m.status !== "normal"
  );
  
  const hasHighGlucose = metrics.some(m => 
    (m.name === "Blood Glucose" || m.name === "HbA1c") && 
    m.status !== "normal"
  );
  
  const hasLowVitamins = metrics.some(m => 
    (m.name === "Vitamin D" || m.name === "Vitamin B12") && 
    m.status !== "normal"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personalized Dietary Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dietaryRecommendations.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-2">
                {category.icon}
                <h3 className="font-medium">{category.category}</h3>
              </div>
              <ul className="space-y-1 pl-7">
                {category.items.map((item, i) => (
                  <li key={i} className="text-sm list-disc">{item}</li>
                ))}
              </ul>
            </div>
          ))}
          
          {(hasHighCholesterol || hasHighGlucose || hasLowVitamins) && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Special Recommendations</h3>
              <ul className="space-y-1 pl-7">
                {hasHighCholesterol && (
                  <li className="text-sm list-disc">
                    Limit saturated and trans fats, increase soluble fiber and omega-3s
                  </li>
                )}
                {hasHighGlucose && (
                  <li className="text-sm list-disc">
                    Limit refined carbs and added sugars, choose low glycemic index foods
                  </li>
                )}
                {hasLowVitamins && (
                  <li className="text-sm list-disc">
                    Include vitamin-rich foods and consider appropriate supplements
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DietaryPlanner;
