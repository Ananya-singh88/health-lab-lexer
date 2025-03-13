
import React from "react";
import HealthMetricCard, { HealthMetricProps } from "./HealthMetricCard";

interface MetricsGridProps {
  metrics: HealthMetricProps[];
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <HealthMetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MetricsGrid;
