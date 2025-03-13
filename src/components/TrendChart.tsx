
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface TrendData {
  date: string;
  value: number;
  referenceMin?: number;
  referenceMax?: number;
}

interface TrendChartProps {
  title: string;
  data: TrendData[];
  unit: string;
  dataKey: string;
  minDomain?: number;
  maxDomain?: number;
  showReferenceBounds?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  unit,
}: TooltipProps<ValueType, NameType> & { unit: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as TrendData;
    return (
      <div className="custom-tooltip bg-background p-2 border rounded-md shadow-md">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">
          {payload[0].value} {unit}
        </p>
        {data.referenceMin !== undefined && data.referenceMax !== undefined && (
          <p className="text-xs text-muted-foreground">
            Range: {data.referenceMin} - {data.referenceMax} {unit}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const TrendChart = ({
  title,
  data,
  unit,
  dataKey = "value",
  minDomain,
  maxDomain,
  showReferenceBounds = true,
}: TrendChartProps) => {
  // Calculate min/max for domain if not provided
  const calculatedMin = minDomain ?? Math.min(...data.map(item => item.value)) * 0.9;
  const calculatedMax = maxDomain ?? Math.max(...data.map(item => item.value)) * 1.1;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted) / 0.5)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[calculatedMin, calculatedMax]} 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              
              {showReferenceBounds && data[0]?.referenceMin !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="referenceMin" 
                  stroke="hsl(var(--muted-foreground) / 0.5)" 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              )}
              
              {showReferenceBounds && data[0]?.referenceMax !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="referenceMax" 
                  stroke="hsl(var(--muted-foreground) / 0.5)" 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="hsl(var(--primary))" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
