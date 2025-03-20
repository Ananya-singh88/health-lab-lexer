
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import TrendChart from "@/components/TrendChart";
import BellCurveChart from "@/components/BellCurveChart";
import RecommendationCard from "@/components/RecommendationCard";
import DietaryPlanner from "@/components/DietaryPlanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

// Type for category details
interface CategoryInfo {
  title: string;
  description: string;
  primaryMetrics: string[];
  secondaryMetrics: string[];
  recommendations: string[];
}

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Define category specific information
  const categoryInfo: Record<string, CategoryInfo> = {
    diabetes: {
      title: "Diabetes Management",
      description: "Track and manage your blood glucose levels and related metrics.",
      primaryMetrics: ["Blood Glucose", "HbA1c", "Insulin"],
      secondaryMetrics: ["Weight", "Blood Pressure"],
      recommendations: [
        "Monitor blood glucose levels regularly",
        "Maintain a consistent carbohydrate intake at meals",
        "Exercise regularly to improve insulin sensitivity",
        "Stay hydrated throughout the day",
        "Get regular eye and foot exams"
      ]
    },
    heart: {
      title: "Heart Health",
      description: "Monitor your cardiovascular health metrics and risk factors.",
      primaryMetrics: ["Blood Pressure", "Total Cholesterol", "LDL Cholesterol", "HDL Cholesterol"],
      secondaryMetrics: ["Triglycerides", "Heart Rate"],
      recommendations: [
        "Maintain a heart-healthy diet low in saturated fats",
        "Exercise for at least 150 minutes per week",
        "Manage stress through meditation or relaxation techniques",
        "Limit sodium intake to less than 2,300 mg per day",
        "If you smoke, consider a smoking cessation program"
      ]
    },
    kidney: {
      title: "Kidney Health",
      description: "Track your kidney function and related health metrics.",
      primaryMetrics: ["Creatinine", "BUN", "eGFR"],
      secondaryMetrics: ["Blood Pressure", "Protein in Urine"],
      recommendations: [
        "Stay well-hydrated by drinking 8-10 glasses of water daily",
        "Limit dietary sodium to reduce blood pressure",
        "Monitor and control blood sugar levels",
        "Avoid taking excessive NSAIDs (like ibuprofen)",
        "Get regular kidney function tests if at risk"
      ]
    },
    thyroid: {
      title: "Thyroid Function",
      description: "Monitor your thyroid health and hormone levels.",
      primaryMetrics: ["TSH", "T4", "T3"],
      secondaryMetrics: ["Thyroid Antibodies", "Iodine Levels"],
      recommendations: [
        "Take thyroid medication on an empty stomach if prescribed",
        "Wait at least 1 hour before eating after taking medication",
        "Get adequate dietary iodine through seafood or iodized salt",
        "Have thyroid levels checked annually or as advised",
        "Monitor for symptoms of hypo/hyperthyroidism"
      ]
    }
  };

  // Create sample trend data
  const generateTrendData = (metric: string, isIncreasing: boolean = false) => {
    const today = new Date();
    const data = [];
    
    let baseValue = 0;
    let refMin = 0;
    let refMax = 0;
    
    // Set different baseline values and reference ranges based on metric
    switch (metric) {
      case "Blood Glucose":
        baseValue = 95;
        refMin = 70;
        refMax = 100;
        break;
      case "HbA1c":
        baseValue = 5.7;
        refMin = 4.0;
        refMax = 5.6;
        break;
      case "Blood Pressure Systolic":
        baseValue = 120;
        refMin = 90;
        refMax = 120;
        break;
      case "Total Cholesterol":
        baseValue = 180;
        refMin = 125;
        refMax = 200;
        break;
      case "LDL Cholesterol":
        baseValue = 100;
        refMin = 0;
        refMax = 100;
        break;
      case "HDL Cholesterol":
        baseValue = 45;
        refMin = 40;
        refMax = 60;
        break;
      case "Creatinine":
        baseValue = 0.9;
        refMin = 0.6;
        refMax = 1.2;
        break;
      case "TSH":
        baseValue = 2.0;
        refMin = 0.4;
        refMax = 4.0;
        break;
      default:
        baseValue = 100;
        refMin = 80;
        refMax = 120;
    }
    
    // Generate data points for the last 6 months
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      
      // Random fluctuation, with overall trend up or down
      const fluctuation = Math.random() * 0.2 - 0.1;
      const trendAdjustment = isIncreasing ? i * 0.05 : -i * 0.05;
      
      const value = baseValue * (1 + fluctuation + trendAdjustment);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Number(value.toFixed(2)),
        referenceMin: refMin,
        referenceMax: refMax
      });
    }
    
    return data;
  };

  // Generate bell curve data
  const generateBellCurveData = (mean: number, stdDev: number) => {
    const data = [];
    for (let i = mean - 3 * stdDev; i <= mean + 3 * stdDev; i += stdDev / 5) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                Math.exp(-0.5 * Math.pow((i - mean) / stdDev, 2));
      data.push({ x: i, y: y });
    }
    return data;
  };

  // Get the current category info or default to a generic one
  const currentCategory = categoryInfo[categoryId || ""] || {
    title: "Health Category",
    description: "Track and manage your health metrics.",
    primaryMetrics: ["Health Metric 1", "Health Metric 2"],
    secondaryMetrics: ["Secondary Metric"],
    recommendations: ["Consult with your healthcare provider"]
  };

  // Sample metrics for the dietary planner
  const sampleMetrics = currentCategory.primaryMetrics.map(metric => ({
    name: metric,
    value: Math.random() > 0.5 ? 'normal' : 'caution',
    status: Math.random() > 0.5 ? 'normal' : 'caution'
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container py-6 flex-1">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Health Checks
          </Link>
          <h1 className="text-3xl font-bold">{currentCategory.title}</h1>
          <p className="text-muted-foreground mt-2">{currentCategory.description}</p>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {currentCategory.primaryMetrics.map((metric, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{metric}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setActiveTab("trends")}
                        >
                          View Trend
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <RecommendationCard 
                title="Personalized Recommendations" 
                recommendations={currentCategory.recommendations} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {currentCategory.primaryMetrics.map((metric, index) => (
                <TrendChart 
                  key={index}
                  title={`${metric} Trend`}
                  data={generateTrendData(metric, index % 2 === 0)}
                  unit={metric.includes("HbA1c") ? "%" : metric.includes("Cholesterol") ? "mg/dL" : "units"}
                  dataKey="value"
                  showReferenceBounds={true}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {currentCategory.primaryMetrics.slice(0, 2).map((metric, index) => {
                // Different settings based on the metric
                let mean = 0;
                let stdDev = 0;
                let userValue = 0;
                let unit = "";
                let refMin = 0;
                let refMax = 0;
                
                switch (metric) {
                  case "Blood Glucose":
                    mean = 85;
                    stdDev = 15;
                    userValue = 95;
                    unit = "mg/dL";
                    refMin = 70;
                    refMax = 100;
                    break;
                  case "HbA1c":
                    mean = 5.4;
                    stdDev = 0.8;
                    userValue = 5.7;
                    unit = "%";
                    refMin = 4.0;
                    refMax = 5.6;
                    break;
                  case "Blood Pressure":
                    mean = 120;
                    stdDev = 15;
                    userValue = 128;
                    unit = "mmHg";
                    refMin = 90;
                    refMax = 120;
                    break;
                  case "Total Cholesterol":
                    mean = 180;
                    stdDev = 30;
                    userValue = 195;
                    unit = "mg/dL";
                    refMin = 125;
                    refMax = 200;
                    break;
                  case "LDL Cholesterol":
                    mean = 90;
                    stdDev = 20;
                    userValue = 105;
                    unit = "mg/dL";
                    refMin = 0;
                    refMax = 100;
                    break;
                  case "HDL Cholesterol":
                    mean = 50;
                    stdDev = 10;
                    userValue = 45;
                    unit = "mg/dL";
                    refMin = 40;
                    refMax = 60;
                    break;
                  case "Creatinine":
                    mean = 0.9;
                    stdDev = 0.2;
                    userValue = 1.0;
                    unit = "mg/dL";
                    refMin = 0.6;
                    refMax = 1.2;
                    break;
                  case "BUN":
                    mean = 15;
                    stdDev = 4;
                    userValue = 17;
                    unit = "mg/dL";
                    refMin = 7;
                    refMax = 20;
                    break;
                  case "TSH":
                    mean = 2.0;
                    stdDev = 1.0;
                    userValue = 2.5;
                    unit = "mIU/L";
                    refMin = 0.4;
                    refMax = 4.0;
                    break;
                  case "T4":
                    mean = 8.0;
                    stdDev = 2.0;
                    userValue = 7.5;
                    unit = "μg/dL";
                    refMin = 5.0;
                    refMax = 12.0;
                    break;
                  default:
                    mean = 100;
                    stdDev = 15;
                    userValue = 110;
                    unit = "units";
                    refMin = 80;
                    refMax = 120;
                }
                
                return (
                  <BellCurveChart
                    key={index}
                    title={`${metric} Distribution`}
                    data={generateBellCurveData(mean, stdDev)}
                    userValue={userValue}
                    unit={unit}
                    referenceMin={refMin}
                    referenceMax={refMax}
                  />
                );
              })}
              
              <Card>
                <CardHeader>
                  <CardTitle>Health Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Based on your {categoryId} metrics, here are some key insights:
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Your values show {Math.random() > 0.5 ? "improvement" : "stabilization"} over the last 3 months</li>
                    <li>Your metrics are {Math.random() > 0.7 ? "within" : "near"} the healthy reference ranges</li>
                    <li>Continue with your current management plan and regular monitoring</li>
                    <li>Consider discussing these trends with your healthcare provider at your next visit</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="plan" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DietaryPlanner metrics={sampleMetrics} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Activity Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Weekly Goals</h3>
                      <ul className="space-y-1 pl-7">
                        <li className="text-sm list-disc">150 minutes of moderate aerobic activity</li>
                        <li className="text-sm list-disc">2-3 strength training sessions</li>
                        <li className="text-sm list-disc">Daily stretching for flexibility</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Recommended Activities</h3>
                      <ul className="space-y-1 pl-7">
                        {categoryId === "diabetes" && (
                          <>
                            <li className="text-sm list-disc">Walking after meals to help manage blood sugar</li>
                            <li className="text-sm list-disc">Swimming for low-impact cardiovascular exercise</li>
                          </>
                        )}
                        {categoryId === "heart" && (
                          <>
                            <li className="text-sm list-disc">Aerobic exercises like brisk walking, cycling, or swimming</li>
                            <li className="text-sm list-disc">Interval training to improve heart health</li>
                          </>
                        )}
                        {categoryId === "kidney" && (
                          <>
                            <li className="text-sm list-disc">Light to moderate activities like walking or cycling</li>
                            <li className="text-sm list-disc">Gentle yoga to improve circulation</li>
                          </>
                        )}
                        {categoryId === "thyroid" && (
                          <>
                            <li className="text-sm list-disc">Low-impact exercises that won't stress your body</li>
                            <li className="text-sm list-disc">Yoga and tai chi for balance and stress reduction</li>
                          </>
                        )}
                        <li className="text-sm list-disc">Regular stretching to maintain flexibility</li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Monitoring Advice</h3>
                      <p className="text-sm">
                        Track your vital signs before and after exercise. Stop if you experience 
                        unusual symptoms and consult your healthcare provider.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryDetail;
