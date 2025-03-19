
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import HealthSummary from "@/components/HealthSummary";
import MetricsGrid from "@/components/MetricsGrid";
import RecommendationCard from "@/components/RecommendationCard";
import TrendChart from "@/components/TrendChart";
import DietaryPlanner from "@/components/DietaryPlanner";
import HealthCalendar from "@/components/HealthCalendar";
import HealthChecks from "@/components/HealthChecks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { analyzeReport, saveReport } from "@/services/reportService";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");

  const handleUpload = (file: File, fileContent: any) => {
    // In a real application, this would process the file and extract lab report data
    setFileName(file.name);
    setFileType(file.type || "unknown");
    
    toast({
      title: "Lab report uploaded successfully",
      description: "AI is analyzing your health metrics...",
    });

    // Simulate processing delay
    setTimeout(() => {
      // Analyze the report based on file content
      const results = analyzeReport(fileContent);
      setAnalysisResults(results);
      
      // Create a report object and save it
      const reportId = uuidv4();
      const reportData = {
        id: reportId,
        fileName: file.name,
        fileType: file.type || "unknown",
        uploadDate: new Date().toISOString(),
        metrics: results.metrics,
        summary: results.summary,
        recommendations: results.recommendations,
        dietaryPlan: results.dietaryPlan,
        rawData: fileContent
      };
      
      // Save to localStorage
      saveReport(reportData);
      
      toast({
        title: "Analysis complete",
        description: "Your health insights are ready to view",
      });
    }, 2000);
  };

  const handleDownload = () => {
    if (!analysisResults) return;
    
    // Create a downloadable report
    const reportData = {
      fileName,
      fileType,
      dateGenerated: new Date().toISOString(),
      results: analysisResults
    };
    
    const jsonData = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report downloaded",
      description: "Health report has been saved to your device",
    });
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container py-6">
          <HealthChecks />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <UploadSection onUpload={handleUpload} />
            </div>
            
            {analysisResults && (
              <div className="md:col-span-2">
                <HealthSummary 
                  summaryText={analysisResults.summary.text} 
                  overallHealth={analysisResults.summary.overallHealth} 
                />
              </div>
            )}
          </div>

          {analysisResults && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Health Metrics</h2>
                <div className="flex gap-3">
                  <Button onClick={handleViewDashboard} variant="outline">
                    View All Reports
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" /> Download Report
                  </Button>
                </div>
              </div>

              <div className="mb-8">
                <MetricsGrid metrics={analysisResults.metrics} />
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
                        data={[
                          { date: '2023-01-01', value: 110 },
                          { date: '2023-03-15', value: 95 },
                          { date: '2023-06-30', value: 105 },
                          { date: new Date().toISOString().split('T')[0], 
                            value: analysisResults.metrics.find((m: any) => m.name === "Blood Glucose")?.value || 100 }
                        ]}
                        unit="mg/dL"
                        dataKey="value"
                      />
                    </TabsContent>
                    <TabsContent value="lipids">
                      <TrendChart 
                        title="Total Cholesterol" 
                        data={[
                          { date: '2023-01-01', value: 160 },
                          { date: '2023-03-15', value: 180 },
                          { date: '2023-06-30', value: 150 },
                          { date: new Date().toISOString().split('T')[0], 
                            value: analysisResults.metrics.find((m: any) => m.name === "Total Cholesterol")?.value || 140 }
                        ]}
                        unit="mg/dL"
                        dataKey="value"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="md:col-span-1">
                  <RecommendationCard {...analysisResults.recommendations} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DietaryPlanner metrics={analysisResults.metrics} />
                <HealthCalendar />
              </div>
            </>
          )}

          {!analysisResults && (
            <div className="text-center p-12 bg-muted/30 rounded-lg mt-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to HealthLab Insights</h2>
              <p className="text-muted-foreground mb-4">
                Upload your lab report to get AI-powered health insights and recommendations
              </p>
            </div>
          )}
        </div>
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
