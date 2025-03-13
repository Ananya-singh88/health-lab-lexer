
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import HealthSummary from "@/components/HealthSummary";
import MetricsGrid from "@/components/MetricsGrid";
import RecommendationCard from "@/components/RecommendationCard";
import TrendChart from "@/components/TrendChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  demoHealthMetrics, 
  demoHealthSummary, 
  demoRecommendations,
  demoGlucoseTrend,
  demoLipidsTrend
} from "./DemoData";

const Index = () => {
  const { toast } = useToast();
  const [hasUploadedReport, setHasUploadedReport] = useState(false);

  const handleUpload = (file: File) => {
    // In a real application, this would process the file and extract lab report data
    // For this demo, we'll just simulate that process
    console.log("Uploaded file:", file.name);
    
    toast({
      title: "Lab report uploaded successfully",
      description: "AI is analyzing your health metrics...",
    });

    // Simulate processing delay
    setTimeout(() => {
      setHasUploadedReport(true);
      
      toast({
        title: "Analysis complete",
        description: "Your health insights are ready to view",
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <UploadSection onUpload={handleUpload} />
          </div>
          
          {hasUploadedReport && (
            <div className="md:col-span-2">
              <HealthSummary {...demoHealthSummary} />
            </div>
          )}
        </div>

        {hasUploadedReport && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Health Metrics</h2>
              <MetricsGrid metrics={demoHealthMetrics} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <Tabs defaultValue="glucose">
                  <TabsList className="mb-2">
                    <TabsTrigger value="glucose">Glucose Trend</TabsTrigger>
                    <TabsTrigger value="lipids">Cholesterol Trend</TabsTrigger>
                  </TabsList>
                  <TabsContent value="glucose">
                    <TrendChart 
                      title="Blood Glucose (Fasting)" 
                      data={demoGlucoseTrend}
                      unit="mg/dL"
                      dataKey="value"
                    />
                  </TabsContent>
                  <TabsContent value="lipids">
                    <TrendChart 
                      title="Total Cholesterol" 
                      data={demoLipidsTrend}
                      unit="mg/dL"
                      dataKey="value"
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="md:col-span-1">
                <RecommendationCard {...demoRecommendations} />
              </div>
            </div>
          </>
        )}

        {!hasUploadedReport && (
          <div className="text-center p-12 bg-muted/30 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Welcome to HealthLab Insights</h2>
            <p className="text-muted-foreground mb-4">
              Upload your lab report to get AI-powered health insights and recommendations
            </p>
          </div>
        )}
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          HealthLab Insights — AI-powered health metrics analyzer
        </div>
      </footer>
    </div>
  );
};

export default Index;
