
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ArrowUp, ArrowDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type HealthMetricStatus = "normal" | "warning" | "alert" | "attention" | "caution";

export interface HealthMetricProps {
  name: string;
  value: string | number;
  unit: string;
  status: HealthMetricStatus;
  referenceRange?: string;
  trend?: "up" | "down" | "stable";
  description?: string;
  change?: number | string;
}

const HealthMetricCard = ({
  name,
  value,
  unit,
  status,
  referenceRange,
  trend,
  description,
  change,
}: HealthMetricProps) => {
  const getStatusColor = (status: HealthMetricStatus) => {
    switch (status) {
      case "normal":
        return "text-green-500";
      case "warning":
      case "caution":
        return "text-amber-500";
      case "alert":
      case "attention":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  const getStatusIcon = (status: HealthMetricStatus) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
      case "caution":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "alert":
      case "attention":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
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

  const getStatusText = (status: HealthMetricStatus) => {
    switch (status) {
      case "normal":
        return "Normal";
      case "warning":
      case "caution":
        return "Borderline";
      case "alert":
      case "attention":
        return "Attention needed";
      default:
        return "Normal";
    }
  };

  return (
    <Card className="health-metric-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">{name}</CardTitle>
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
          {change && (
            <span className={`ml-1 flex items-center text-xs ${parseFloat(String(change)) > 0 ? 'text-red-500' : parseFloat(String(change)) < 0 ? 'text-green-500' : 'text-gray-500'}`}>
              {parseFloat(String(change)) > 0 ? '↑' : parseFloat(String(change)) < 0 ? '↓' : ''}
              {Math.abs(parseFloat(String(change)))}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            {getStatusIcon(status)}
            <span className={`text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
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
