
import React from "react";
import HealthMetricCard, { HealthMetricProps } from "./HealthMetricCard";

interface MetricsGridProps {
  metrics: HealthMetricProps[];
  category?: string;
}

const MetricsGrid = ({ metrics, category }: MetricsGridProps) => {
  // If a category is specified, filter metrics to show only the most relevant ones
  let displayMetrics = metrics;
  
  if (category) {
    const priorityMetrics: Record<string, string[]> = {
      // Heart health related metrics
      heart: ["Total Cholesterol", "LDL Cholesterol", "HDL Cholesterol", "Triglycerides", "Blood Pressure"],
      // Diabetes related metrics
      diabetes: ["Blood Glucose", "HbA1c", "Insulin", "C-Peptide"],
      // Kidney related metrics
      kidney: ["Creatinine", "BUN", "eGFR", "Blood Pressure"],
      // Thyroid related metrics
      thyroid: ["TSH", "T4", "T3", "Thyroid Antibodies"]
    };
    
    // Get the priority metrics for this category
    const categoryPriorities = priorityMetrics[category] || [];
    
    if (categoryPriorities.length > 0) {
      // First include all the priority metrics that exist in our dataset
      const prioritized = metrics.filter(metric => 
        categoryPriorities.some(priority => metric.name.includes(priority))
      );
      
      // Then add any other metrics
      const others = metrics.filter(metric => 
        !categoryPriorities.some(priority => metric.name.includes(priority))
      );
      
      // Show prioritized metrics first, then others
      displayMetrics = [...prioritized, ...others];
    }
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displayMetrics.map((metric, index) => (
        <HealthMetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricsGrid;
