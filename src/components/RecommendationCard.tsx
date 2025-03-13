
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationProps {
  title: string;
  recommendations: string[];
}

const RecommendationCard = ({ title, recommendations }: RecommendationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
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
