
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface HealthSummaryProps {
  patientName?: string;
  date?: string;
  summaryText: string;
  overallHealth: "healthy" | "monitor" | "attention" | "good" | "needs attention";
}

const HealthSummary = ({
  patientName,
  date,
  summaryText,
  overallHealth,
}: HealthSummaryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "good":
        return "text-health-normal";
      case "monitor":
        return "text-health-warning";
      case "attention":
      case "needs attention":
        return "text-health-alert";
      default:
        return "text-health-normal";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "healthy":
      case "good":
        return "Overall Healthy";
      case "monitor":
        return "Monitor Condition";
      case "attention":
      case "needs attention":
        return "Attention Required";
      default:
        return "Overall Healthy";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Health Summary</CardTitle>
            {(patientName || date) && (
              <CardDescription>
                {patientName && patientName} {date && `• ${date}`}
              </CardDescription>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            overallHealth === "healthy" || overallHealth === "good" ? "bg-health-normal/10 text-health-normal" :
            overallHealth === "monitor" ? "bg-health-warning/10 text-health-warning" :
            "bg-health-alert/10 text-health-alert"
          }`}>
            {getStatusText(overallHealth)}
          </div>
          
          <p className="text-muted-foreground">{summaryText}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary;
