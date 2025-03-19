
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface BellCurveProps {
  title: string;
  data: {
    x: number;
    y: number;
  }[];
  userValue: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
}

const BellCurveChart = ({ 
  title, 
  data, 
  userValue, 
  unit, 
  referenceMin, 
  referenceMax 
}: BellCurveProps) => {
  // Find the maximum y value for scaling
  const maxY = Math.max(...data.map(point => point.y));
  
  // Generate user marker data point (vertical line at user value)
  const userMarker = data.map(point => ({
    ...point,
    userMarker: point.x === userValue ? point.y : 0
  }));

  // Calculate the position of the user value within the reference range
  const position = () => {
    if (userValue < referenceMin) return "below";
    if (userValue > referenceMax) return "above";
    return "normal";
  };

  const statusColor = () => {
    switch (position()) {
      case "below": return "text-amber-500";
      case "above": return "text-red-500";
      default: return "text-green-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <span className={`text-sm font-normal ${statusColor()}`}>
            Your value: {userValue} {unit} 
            ({position() === "normal" ? "Normal Range" : position() === "below" ? "Below Normal" : "Above Normal"})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userMarker} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="x" 
                domain={[data[0].x, data[data.length - 1].x]}
                type="number"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis hide domain={[0, maxY * 1.1]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === "y" ? "" : value, 
                  name === "y" ? `Value: ${value} ${unit}` : name
                ]}
                labelFormatter={(label) => `${label} ${unit}`}
              />
              
              {/* Bell curve area */}
              <Area 
                type="monotone" 
                dataKey="y" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
              
              {/* Vertical line for user value */}
              <Line
                type="monotone"
                dataKey="userMarker"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
              />
              
              {/* Reference range markers */}
              <Area
                type="monotone"
                dataKey={() => 0}
                stroke="transparent"
                fill="hsl(var(--success) / 0.2)"
                activeDot={false}
                baseValue={0}
                legendType="none"
                strokeWidth={0}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Reference range indicator */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Min: {referenceMin} {unit}</span>
            <span className="text-center">Normal Range</span>
            <span>Max: {referenceMax} {unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BellCurveChart;
