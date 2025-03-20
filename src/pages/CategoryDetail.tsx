import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, LineChart, PieChart, Activity, Clipboard } from "lucide-react";
import HealthMetricCard, { HealthMetricProps } from "@/components/HealthMetricCard";
import HealthSummary from "@/components/HealthSummary";
import DietaryPlanner from "@/components/DietaryPlanner";
import BellCurveChart from "@/components/BellCurveChart";

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Define category-specific information
  const getCategoryInfo = (id: string | undefined) => {
    switch (id) {
      case "diabetes":
        return {
          name: "Diabetes Health",
          description: "Track your blood glucose levels and other key diabetes indicators",
          metrics: [
            { name: "Blood Glucose", value: "95", unit: "mg/dL", status: "normal" },
            { name: "HbA1c", value: "5.4", unit: "%", status: "normal" },
            { name: "Insulin", value: "10", unit: "μIU/mL", status: "normal" }
          ] as HealthMetricProps[],
          chartData: [
            { month: "Jan", glucose: 92 },
            { month: "Feb", glucose: 97 },
            { month: "Mar", glucose: 94 },
            { month: "Apr", glucose: 95 },
            { month: "May", glucose: 90 },
            { month: "Jun", glucose: 93 }
          ],
          recommendations: [
            "Maintain a balanced diet with controlled carbohydrate intake",
            "Exercise regularly for 30 minutes at least 5 days a week",
            "Monitor your blood glucose levels regularly",
            "Stay hydrated and limit alcohol consumption"
          ],
          bellCurveData: generateBellCurveData(100, 15, 95),
          insightsList: [
            { title: "Blood Glucose Trend", content: "Your blood glucose levels have remained stable over the past 6 months, indicating good glycemic control." },
            { title: "HbA1c Status", content: "Your HbA1c level is within the normal range, suggesting good long-term glucose control." },
            { title: "Risk Assessment", content: "Your current metrics indicate a low risk for diabetes development or complications." }
          ]
        };
      case "heart":
        return {
          name: "Heart Health",
          description: "Monitor your cardiovascular health and related metrics",
          metrics: [
            { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal" },
            { name: "Total Cholesterol", value: "180", unit: "mg/dL", status: "normal" },
            { name: "LDL Cholesterol", value: "110", unit: "mg/dL", status: "caution" }
          ] as HealthMetricProps[],
          chartData: [
            { month: "Jan", systolic: 122, diastolic: 82 },
            { month: "Feb", systolic: 120, diastolic: 80 },
            { month: "Mar", systolic: 118, diastolic: 78 },
            { month: "Apr", systolic: 121, diastolic: 81 },
            { month: "May", systolic: 119, diastolic: 79 },
            { month: "Jun", systolic: 120, diastolic: 80 }
          ],
          recommendations: [
            "Follow a heart-healthy diet rich in fruits, vegetables, and lean proteins",
            "Limit sodium intake to less than 2,300mg daily",
            "Engage in regular cardiovascular exercise",
            "Manage stress through relaxation techniques"
          ],
          bellCurveData: generateBellCurveData(190, 30, 180),
          insightsList: [
            { title: "Blood Pressure Status", content: "Your blood pressure is within the normal range, indicating good cardiovascular health." },
            { title: "Cholesterol Profile", content: "Your LDL cholesterol is slightly elevated. Consider dietary adjustments to reduce it." },
            { title: "Cardiovascular Risk", content: "Your overall cardiovascular risk is low based on current metrics." }
          ]
        };
      case "kidney":
        return {
          name: "Kidney Health",
          description: "Track your kidney function and related health indicators",
          metrics: [
            { name: "Creatinine", value: "0.9", unit: "mg/dL", status: "normal" },
            { name: "BUN", value: "15", unit: "mg/dL", status: "normal" },
            { name: "eGFR", value: "95", unit: "mL/min/1.73m²", status: "normal" }
          ] as HealthMetricProps[],
          chartData: [
            { month: "Jan", creatinine: 0.85, eGFR: 98 },
            { month: "Feb", creatinine: 0.9, eGFR: 95 },
            { month: "Mar", creatinine: 0.88, eGFR: 96 },
            { month: "Apr", creatinine: 0.9, eGFR: 95 },
            { month: "May", creatinine: 0.87, eGFR: 97 },
            { month: "Jun", creatinine: 0.9, eGFR: 95 }
          ],
          recommendations: [
            "Stay well-hydrated by drinking 8-10 glasses of water daily",
            "Limit sodium and processed food intake",
            "Maintain healthy blood pressure and blood sugar levels",
            "Avoid excessive use of NSAIDs and other potentially nephrotoxic medications"
          ],
          bellCurveData: generateBellCurveData(90, 15, 95),
          insightsList: [
            { title: "Kidney Function", content: "Your kidney function tests indicate normal filtration ability." },
            { title: "Hydration Status", content: "Your metrics suggest good hydration. Continue maintaining adequate fluid intake." },
            { title: "Kidney Health Trend", content: "Your kidney function has remained stable over the past 6 months." }
          ]
        };
      case "thyroid":
        return {
          name: "Thyroid Health",
          description: "Monitor your thyroid function and hormone levels",
          metrics: [
            { name: "TSH", value: "2.5", unit: "mIU/L", status: "normal" },
            { name: "T4", value: "8.5", unit: "μg/dL", status: "normal" },
            { name: "T3", value: "120", unit: "ng/dL", status: "normal" }
          ] as HealthMetricProps[],
          chartData: [
            { month: "Jan", tsh: 2.4, t4: 8.3 },
            { month: "Feb", tsh: 2.5, t4: 8.5 },
            { month: "Mar", tsh: 2.6, t4: 8.4 },
            { month: "Apr", tsh: 2.5, t4: 8.5 },
            { month: "May", tsh: 2.3, t4: 8.6 },
            { month: "Jun", tsh: 2.5, t4: 8.5 }
          ],
          recommendations: [
            "Ensure adequate iodine intake through diet or supplements",
            "Minimize consumption of goitrogenic foods if you have thyroid issues",
            "Manage stress through relaxation techniques",
            "Get regular thyroid function tests if you have a family history of thyroid disorders"
          ],
          bellCurveData: generateBellCurveData(2.0, 1.0, 2.5),
          insightsList: [
            { title: "Thyroid Function", content: "Your thyroid function tests are within normal ranges." },
            { title: "Hormone Balance", content: "Your T3 and T4 levels indicate proper thyroid hormone production." },
            { title: "Metabolism Status", content: "Your current thyroid profile suggests normal metabolic activity." }
          ]
        };
      default:
        return {
          name: "Health Category",
          description: "Details not available",
          metrics: [
            { name: "Metric 1", value: "N/A", unit: "", status: "normal" },
            { name: "Metric 2", value: "N/A", unit: "", status: "normal" },
            { name: "Metric 3", value: "N/A", unit: "", status: "normal" }
          ] as HealthMetricProps[],
          chartData: [],
          recommendations: ["No specific recommendations available"],
          bellCurveData: null,
          insightsList: []
        };
    }
  };

  // Sample data for bell curve
  const generateBellCurveData = (mean: number, stdDev: number, userValue: number) => {
    const data = [];
    const start = mean - 3 * stdDev;
    const end = mean + 3 * stdDev;
    const step = (end - start) / 30;
    
    for (let x = start; x <= end; x += step) {
      // Bell curve formula
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      data.push({
        x: Math.round(x),
        y: y
      });
    }
    
    return data;
  };

  const categoryInfo = getCategoryInfo(categoryId);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{categoryInfo.name}</h1>
      </div>

      <p className="text-muted-foreground mb-6">{categoryInfo.description}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <HealthSummary
                summaryText={`Your ${categoryInfo.name.toLowerCase()} indicators are in good standing. Continue with your current regimen to maintain optimal health.`}
                overallHealth="good"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {categoryInfo.metrics.map((metric, index) => (
                  <HealthMetricCard
                    key={index}
                    name={metric.name}
                    value={metric.value}
                    unit={metric.unit}
                    status={metric.status as any}
                    referenceRange={metric.referenceRange}
                    description={metric.description}
                  />
                ))}
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categoryInfo.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                          <Clipboard className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  {categoryId === "diabetes" ? "Glucose Trend" : 
                   categoryId === "heart" ? "Blood Pressure Trend" :
                   categoryId === "kidney" ? "Kidney Function Trend" :
                   categoryId === "thyroid" ? "Thyroid Hormone Trend" : "Health Trend"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={categoryInfo.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      {categoryId === "diabetes" && (
                        <Area type="monotone" dataKey="glucose" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      )}
                      {categoryId === "heart" && (
                        <>
                          <Area type="monotone" dataKey="systolic" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="diastolic" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                        </>
                      )}
                      {categoryId === "kidney" && (
                        <>
                          <Area type="monotone" dataKey="creatinine" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="eGFR" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                        </>
                      )}
                      {categoryId === "thyroid" && (
                        <>
                          <Area type="monotone" dataKey="tsh" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="t4" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribution Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {categoryInfo.bellCurveData && (
                    <BellCurveChart 
                      data={categoryInfo.bellCurveData}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 gap-6">
            {categoryInfo.insightsList.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{insight.content}</p>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contextual Range</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Your results in context of typical ranges:</p>
                {categoryInfo.bellCurveData && (
                  <div className="h-80">
                    <BellCurveChart 
                      data={categoryInfo.bellCurveData}
                      showLabels={true}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Action Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                          <Clipboard className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">Schedule a follow-up in 3 months</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                          <Clipboard className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">Continue with current medication regimen</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                          <Clipboard className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">Log your symptoms and metrics weekly</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Lifestyle Adjustments</h3>
                    <ul className="space-y-2">
                      {categoryInfo.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                            <Clipboard className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DietaryPlanner metrics={categoryInfo.metrics} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryDetail;
