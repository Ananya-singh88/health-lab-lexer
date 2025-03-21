
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, LineChart, BarChart, Brain, Calendar } from "lucide-react";
import HealthSummary from "@/components/HealthSummary";
import MetricsGrid from "@/components/MetricsGrid";
import TrendChart from "@/components/TrendChart";
import BellCurveChart from "@/components/BellCurveChart";
import RecommendationCard from "@/components/RecommendationCard";
import DietaryPlanner from "@/components/DietaryPlanner";
import HealthCalendar from "@/components/HealthCalendar";

// Helper function to get category-specific metrics
const getCategoryMetrics = (category: string) => {
  // Base metrics that are always present
  const baseMetrics = [
    {
      name: "Blood Glucose",
      value: 98,
      unit: "mg/dL",
      status: "normal",
      referenceRange: "70-100 mg/dL",
      description: "Fasting blood glucose levels"
    },
    {
      name: "Total Cholesterol",
      value: 175,
      unit: "mg/dL",
      status: "normal",
      referenceRange: "125-200 mg/dL",
      description: "Total cholesterol in blood"
    },
    {
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "normal",
      referenceRange: "120/80 mmHg",
      description: "Blood pressure reading"
    }
  ];

  // Category-specific metrics
  switch(category) {
    case "diabetes":
      return [
        ...baseMetrics,
        {
          name: "HbA1c",
          value: 5.4,
          unit: "%",
          status: "normal",
          referenceRange: "4.0-5.6%",
          description: "Average blood glucose levels over past 2-3 months"
        },
        {
          name: "Insulin",
          value: 12,
          unit: "μIU/mL",
          status: "normal",
          referenceRange: "5-25 μIU/mL",
          description: "Hormone that regulates blood glucose"
        },
        {
          name: "C-Peptide",
          value: 1.8,
          unit: "ng/mL",
          status: "normal",
          referenceRange: "0.8-3.9 ng/mL",
          description: "Indicator of insulin production"
        }
      ];
    
    case "heart":
      return [
        ...baseMetrics,
        {
          name: "LDL Cholesterol",
          value: 90,
          unit: "mg/dL",
          status: "normal",
          referenceRange: "<100 mg/dL",
          description: "Low-density lipoprotein cholesterol"
        },
        {
          name: "HDL Cholesterol",
          value: 55,
          unit: "mg/dL",
          status: "normal",
          referenceRange: ">40 mg/dL (men), >50 mg/dL (women)",
          description: "High-density lipoprotein cholesterol"
        },
        {
          name: "Triglycerides",
          value: 120,
          unit: "mg/dL",
          status: "normal",
          referenceRange: "<150 mg/dL",
          description: "Type of fat in the blood"
        }
      ];
      
    case "kidney":
      return [
        ...baseMetrics,
        {
          name: "Creatinine",
          value: 0.9,
          unit: "mg/dL",
          status: "normal",
          referenceRange: "0.6-1.2 mg/dL (men), 0.5-1.1 mg/dL (women)",
          description: "Waste product filtered by kidneys"
        },
        {
          name: "BUN",
          value: 15,
          unit: "mg/dL",
          status: "normal",
          referenceRange: "7-20 mg/dL",
          description: "Blood Urea Nitrogen"
        },
        {
          name: "eGFR",
          value: 95,
          unit: "mL/min/1.73m²",
          status: "normal",
          referenceRange: ">60 mL/min/1.73m²",
          description: "Estimated Glomerular Filtration Rate"
        }
      ];
      
    case "thyroid":
      return [
        ...baseMetrics,
        {
          name: "TSH",
          value: 2.5,
          unit: "mIU/L",
          status: "normal",
          referenceRange: "0.4-4.0 mIU/L",
          description: "Thyroid Stimulating Hormone"
        },
        {
          name: "T4",
          value: 8.5,
          unit: "μg/dL",
          status: "normal",
          referenceRange: "5.0-12.0 μg/dL",
          description: "Thyroxine"
        },
        {
          name: "T3",
          value: 120,
          unit: "ng/dL",
          status: "normal",
          referenceRange: "80-180 ng/dL",
          description: "Triiodothyronine"
        }
      ];
      
    default:
      return baseMetrics;
  }
};

// Helper function to get category-specific recommendations
const getCategoryRecommendations = (category: string) => {
  const baseRecommendations = [
    "Maintain a balanced diet rich in vegetables and fruits",
    "Engage in moderate exercise for at least 150 minutes weekly",
    "Ensure adequate hydration by drinking 8-10 glasses of water daily"
  ];
  
  switch(category) {
    case "diabetes":
      return {
        title: "Diabetes Management Recommendations",
        recommendations: [
          ...baseRecommendations,
          "Monitor your blood glucose levels regularly",
          "Limit intake of refined carbohydrates and added sugars",
          "Consider adding cinnamon to your diet"
        ]
      };
    
    case "heart":
      return {
        title: "Heart Health Recommendations",
        recommendations: [
          ...baseRecommendations,
          "Limit saturated and trans fats in your diet",
          "Consider omega-3 fatty acids from fish or supplements",
          "Practice stress reduction techniques like meditation"
        ]
      };
      
    case "kidney":
      return {
        title: "Kidney Health Recommendations",
        recommendations: [
          ...baseRecommendations,
          "Monitor your sodium intake",
          "Maintain healthy blood pressure levels",
          "Avoid excessive protein consumption"
        ]
      };
      
    case "thyroid":
      return {
        title: "Thyroid Health Recommendations",
        recommendations: [
          ...baseRecommendations,
          "Ensure adequate iodine in your diet",
          "Consider selenium-rich foods like Brazil nuts",
          "Manage stress to support thyroid function"
        ]
      };
      
    default:
      return {
        title: "General Health Recommendations",
        recommendations: baseRecommendations
      };
  }
};

// Helper to get category name
const getCategoryName = (category: string) => {
  switch(category) {
    case "diabetes": return "Diabetes";
    case "heart": return "Heart Health";
    case "kidney": return "Kidney Health";
    case "thyroid": return "Thyroid Health";
    default: return "Health";
  }
};

// Helper to get primary metric for the category
const getPrimaryMetric = (category: string) => {
  switch(category) {
    case "diabetes": return "Blood Glucose";
    case "heart": return "Total Cholesterol";
    case "kidney": return "Creatinine";
    case "thyroid": return "TSH";
    default: return "Blood Glucose";
  }
};

// Function to generate bell curve data - fixed to ensure it doesn't return undefined
function generateBellCurveData(mean: number, stdDev: number, userValue: number) {
  const data = [];
  const start = mean - 3 * stdDev;
  const end = mean + 3 * stdDev;
  const step = (end - start) / 30;
  
  for (let x = start; x <= end; x += step) {
    // Bell curve formula
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    data.push({
      x: Math.round(x * 100) / 100,
      y: y
    });
  }
  
  return data;
}

function getCategoryTrendValue(category: string, index: number): number {
  switch(category) {
    case "diabetes":
      const glucoseValues = [105, 98, 92, 98];
      return glucoseValues[index] || 100; // Provide default if undefined
    case "heart":
      const cholesterolValues = [190, 180, 175, 175];
      return cholesterolValues[index] || 180; // Provide default if undefined
    case "kidney":
      const creatinineValues = [1.0, 0.9, 0.95, 0.9];
      return creatinineValues[index] || 1.0; // Provide default if undefined
    case "thyroid":
      const tshValues = [2.8, 2.5, 2.6, 2.5];
      return tshValues[index] || 2.5; // Provide default if undefined
    default:
      return 100;
  }
}

function getPrimaryMetricUnit(category: string): string {
  switch(category) {
    case "diabetes": return "mg/dL";
    case "heart": return "mg/dL";
    case "kidney": return "mg/dL";
    case "thyroid": return "mIU/L";
    default: return "units";
  }
}

function getCategoryBellCurveParams(category: string): {
  mean: number;
  stdDev: number;
  userValue: number;
  referenceMin: number;
  referenceMax: number;
} {
  switch(category) {
    case "diabetes":
      return {
        mean: 100,
        stdDev: 15,
        userValue: 98,
        referenceMin: 70,
        referenceMax: 100
      };
    case "heart":
      return {
        mean: 180,
        stdDev: 30,
        userValue: 175,
        referenceMin: 125,
        referenceMax: 200
      };
    case "kidney":
      return {
        mean: 0.9,
        stdDev: 0.2,
        userValue: 0.9,
        referenceMin: 0.6,
        referenceMax: 1.2
      };
    case "thyroid":
      return {
        mean: 2.0,
        stdDev: 0.8,
        userValue: 2.5,
        referenceMin: 0.4,
        referenceMax: 4.0
      };
    default:
      return {
        mean: 100,
        stdDev: 15,
        userValue: 100,
        referenceMin: 70,
        referenceMax: 130
      };
  }
}

function getCategoryRiskFactor(category: string, index: number): string {
  const diabetesRisks = ["Type 2 Diabetes", "Cardiovascular Disease", "Nerve Damage"];
  const heartRisks = ["Coronary Artery Disease", "Stroke", "Hypertension"];
  const kidneyRisks = ["Chronic Kidney Disease", "Kidney Stones", "Hypertension"];
  const thyroidRisks = ["Hypothyroidism", "Hyperthyroidism", "Autoimmune Thyroiditis"];
  
  // Ensure index is valid to avoid "undefined" errors
  const safeIndex = index >= 0 && index < 3 ? index : 0;
  
  switch(category) {
    case "diabetes": return diabetesRisks[safeIndex];
    case "heart": return heartRisks[safeIndex];
    case "kidney": return kidneyRisks[safeIndex];
    case "thyroid": return thyroidRisks[safeIndex];
    default: return "Health Risk";
  }
}

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any>({
    title: "Loading...",
    recommendations: []  // Initialize with an empty array to avoid map errors
  });
  
  // Use safe categoryId, defaulting to "general" if undefined
  const safeCategoryId = categoryId || "general";
  const categoryName = getCategoryName(safeCategoryId);
  const primaryMetric = getPrimaryMetric(safeCategoryId);
  
  useEffect(() => {
    // Add debug log
    console.log("CategoryDetail mounted, categoryId:", safeCategoryId);
    
    // Load data for this category
    const categoryMetrics = getCategoryMetrics(safeCategoryId);
    setMetrics(categoryMetrics);
    
    const categoryRecommendations = getCategoryRecommendations(safeCategoryId);
    setRecommendations(categoryRecommendations);
  }, [safeCategoryId]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  // Create trend data for the primary metric - ensure it's an array with values
  const trendData = [
    { date: '2023-01-01', value: getCategoryTrendValue(safeCategoryId, 0) },
    { date: '2023-03-15', value: getCategoryTrendValue(safeCategoryId, 1) },
    { date: '2023-06-30', value: getCategoryTrendValue(safeCategoryId, 2) },
    { date: '2023-09-15', value: getCategoryTrendValue(safeCategoryId, 3) }
  ];
  
  // Generate bell curve data
  const bellCurveParams = getCategoryBellCurveParams(safeCategoryId);
  const bellCurveData = generateBellCurveData(
    bellCurveParams.mean,
    bellCurveParams.stdDev,
    bellCurveParams.userValue
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">{categoryName} Reports</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Activity className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" /> Trends
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <Brain className="h-4 w-4" /> Insights
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Plan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="mb-6">
              <HealthSummary 
                summaryText={`Your ${categoryName.toLowerCase()} metrics show overall good health. Continue with regular monitoring and following your healthcare provider's recommendations.`}
                overallHealth="good"
              />
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Health Metrics</h2>
              <MetricsGrid metrics={metrics} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TrendChart 
                  title={`${primaryMetric} Trend`}
                  data={trendData}
                  unit={getPrimaryMetricUnit(safeCategoryId)}
                  dataKey="value"
                />
              </div>
              <div className="md:col-span-1">
                {recommendations && (
                  <RecommendationCard 
                    title={recommendations.title} 
                    recommendations={recommendations.recommendations || []} 
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Trends</CardTitle>
                  <CardDescription>Your health metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendChart 
                    title={`${primaryMetric} History`}
                    data={trendData}
                    unit={getPrimaryMetricUnit(safeCategoryId)}
                    dataKey="value"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Population Distribution</CardTitle>
                  <CardDescription>How your metrics compare to the population</CardDescription>
                </CardHeader>
                <CardContent>
                  <BellCurveChart
                    title={`${primaryMetric} Distribution`}
                    data={bellCurveData}
                    userValue={bellCurveParams.userValue}
                    unit={getPrimaryMetricUnit(safeCategoryId)}
                    referenceMin={bellCurveParams.referenceMin}
                    referenceMax={bellCurveParams.referenceMax}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Correlated Metrics</CardTitle>
                <CardDescription>How different health metrics relate to each other</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Correlation data will be available when more reports are analyzed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="md:col-span-2 mb-6">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>AI-powered analysis of your health data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-500/10 p-1 mt-1">
                        <Activity className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Your {primaryMetric} levels are stable</p>
                        <p className="text-muted-foreground text-sm">Consistent readings indicate good metabolic control</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-500/10 p-1 mt-1">
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Your metrics show good {categoryName.toLowerCase()} health</p>
                        <p className="text-muted-foreground text-sm">All key indicators are within normal ranges</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-amber-500/10 p-1 mt-1">
                        <Activity className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">Regular monitoring is advised</p>
                        <p className="text-muted-foreground text-sm">Continue with scheduled check-ups to maintain health</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Potential health considerations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{getCategoryRiskFactor(safeCategoryId, 0)}</span>
                      <span className="text-green-500 font-medium">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{getCategoryRiskFactor(safeCategoryId, 1)}</span>
                      <span className="text-green-500 font-medium">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{getCategoryRiskFactor(safeCategoryId, 2)}</span>
                      <span className="text-amber-500 font-medium">Moderate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Research Insights</CardTitle>
                  <CardDescription>Latest findings related to your health</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Recent studies related to {categoryName.toLowerCase()} health indicate that lifestyle factors continue to play a significant role in long-term outcomes.
                  </p>
                  <Button variant="outline" className="w-full">View Research Citations</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="plan">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DietaryPlanner metrics={metrics} />
              <HealthCalendar />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          HealthLab Insights — AI-powered health metrics analyzer
        </div>
      </footer>
    </div>
  );
};

export default CategoryDetail;
