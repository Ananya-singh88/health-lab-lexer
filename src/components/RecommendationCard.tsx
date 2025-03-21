
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationProps {
  title: string;
  recommendations: string[];
  category?: string;
}

const RecommendationCard = ({ title, recommendations, category }: RecommendationProps) => {
  // Default recommendations
  let displayRecommendations = [...recommendations];
  
  // If category is specified, add category-specific recommendations
  if (category) {
    const categoryRecommendations: Record<string, string[]> = {
      heart: [
        "Consider heart-healthy omega-3 fatty acids from fish or supplements",
        "Limit saturated and trans fats in your diet",
        "Monitor your blood pressure regularly"
      ],
      diabetes: [
        "Monitor your blood glucose levels regularly",
        "Limit intake of refined carbohydrates and added sugars",
        "Consider adding cinnamon to your diet"
      ],
      kidney: [
        "Monitor your sodium intake",
        "Stay well-hydrated but avoid excessive fluid intake",
        "Follow a kidney-friendly diet low in phosphorus and potassium if needed"
      ],
      thyroid: [
        "Ensure adequate iodine in your diet",
        "Consider selenium-rich foods like Brazil nuts",
        "Manage stress to support thyroid function"
      ]
    };
    
    // Get the recommendations for this category
    const specificRecs = categoryRecommendations[category] || [];
    
    if (specificRecs.length > 0) {
      // Add category-specific recommendations that aren't already included
      const newRecs = specificRecs.filter(rec => 
        !displayRecommendations.some(existing => existing.includes(rec))
      );
      
      // Add the new recommendations to the display list
      displayRecommendations = [...displayRecommendations, ...newRecs];
      
      // Limit to a reasonable number (e.g., 7 max)
      if (displayRecommendations.length > 7) {
        displayRecommendations = displayRecommendations.slice(0, 7);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {displayRecommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="min-w-4 h-4 w-4 rounded-full bg-primary mt-1" />
              <p className="text-sm">{recommendation}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
