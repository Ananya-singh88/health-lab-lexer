
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ArrowUp, ArrowDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type HealthMetricStatus = "normal" | "warning" | "alert";

export interface HealthMetricProps {
  title: string;
  value: string | number;
  unit: string;
  status: HealthMetricStatus;
  referenceRange?: string;
  trend?: "up" | "down" | "stable";
  description?: string;
}

const HealthMetricCard = ({
  title,
  value,
  unit,
  status,
  referenceRange,
  trend,
  description,
}: HealthMetricProps) => {
  const getStatusColor = (status: HealthMetricStatus) => {
    switch (status) {
      case "normal":
        return "text-health-normal";
      case "warning":
        return "text-health-warning";
      case "alert":
        return "text-health-alert";
      default:
        return "text-health-normal";
    }
  };

  const getStatusIcon = (status: HealthMetricStatus) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-health-normal" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-health-warning" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-health-alert" />;
      default:
        return <CheckCircle className="h-5 w-5 text-health-normal" />;
    }
  };

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4" />;
      case "down":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="health-metric-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">{title}</CardTitle>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
          {trend && (
            <span className="ml-1 flex items-center text-xs">
              {getTrendIcon(trend)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            {getStatusIcon(status)}
            <span className={`text-xs font-medium ${getStatusColor(status)}`}>
              {status === "normal" ? "Normal" : status === "warning" ? "Borderline" : "Attention needed"}
            </span>
          </div>
          {referenceRange && (
            <span className="text-xs text-muted-foreground">
              Range: {referenceRange}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;
