
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import HealthSummary from "@/components/HealthSummary";
import MetricsGrid from "@/components/MetricsGrid";
import RecommendationCard from "@/components/RecommendationCard";
import TrendChart from "@/components/TrendChart";
import BellCurveChart from "@/components/BellCurveChart";
import DietaryPlanner from "@/components/DietaryPlanner";
import HealthCalendar from "@/components/HealthCalendar";
import HealthChecks from "@/components/HealthChecks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { analyzeReport, saveReport, generateHumanReadableReport } from "@/services/reportService";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("glucose");

  // Parse URL parameters to check if a category was selected
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    
    if (category) {
      // Simulate a report upload for the selected category
      simulateCategoryReport(category);
    }
  }, [location.search]);

  const simulateCategoryReport = (category: string) => {
    const sampleFile = new File(["sample content"], `${category}-report.pdf`, { type: "application/pdf" });
    
    toast({
      title: `${category} report requested`,
      description: "Simulating report analysis...",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      handleUpload(sampleFile, {
        type: 'pdf',
        name: `${category}-report.pdf`,
        size: 1024,
        lastModified: new Date().toISOString(),
        content: `Sample content for ${category} report`,
      });
    }, 1000);
  };

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
      id: uuidv4(),
      fileName,
      fileType,
      uploadDate: new Date().toISOString(),
      metrics: analysisResults.metrics,
      summary: analysisResults.summary,
      recommendations: analysisResults.recommendations,
      dietaryPlan: analysisResults.dietaryPlan
    };
    
    // Generate human-readable content
    const humanReadableReport = generateHumanReadableReport(reportData);
    
    // Create a text blob for downloading
    const blob = new Blob([humanReadableReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${fileName.split('.')[0]}.txt`;
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

  // Generate blood glucose bell curve data
  const glucoseBellCurveData = generateBellCurveData(100, 15, 
    analysisResults?.metrics.find((m: any) => m.name === "Blood Glucose")?.value || 95);
    
  // Generate cholesterol bell curve data
  const cholesterolBellCurveData = generateBellCurveData(180, 30, 
    analysisResults?.metrics.find((m: any) => m.name === "Total Cholesterol")?.value || 190);
    
  // Generate blood pressure bell curve data  
  const bpBellCurveData = generateBellCurveData(120, 10, 
    analysisResults?.metrics.find((m: any) => m.name === "Blood Pressure (Systolic)")?.value || 125);
    
  // Generate thyroid bell curve data
  const thyroidBellCurveData = generateBellCurveData(1.5, 0.5, 
    analysisResults?.metrics.find((m: any) => m.name === "TSH")?.value || 1.8);

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
                  <Tabs defaultValue="glucose" value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="mb-2">
                      <TabsTrigger value="glucose">Glucose</TabsTrigger>
                      <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
                      <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
                      <TabsTrigger value="thyroid">Thyroid</TabsTrigger>
                    </TabsList>
                    <TabsContent value="glucose">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TrendChart 
                          title="Blood Glucose (Fasting) Trend" 
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
                        <BellCurveChart
                          title="Blood Glucose Distribution"
                          data={glucoseBellCurveData}
                          userValue={analysisResults.metrics.find((m: any) => m.name === "Blood Glucose")?.value || 95}
                          unit="mg/dL"
                          referenceMin={70}
                          referenceMax={99}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="cholesterol">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TrendChart 
                          title="Total Cholesterol Trend" 
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
                        <BellCurveChart
                          title="Cholesterol Distribution"
                          data={cholesterolBellCurveData}
                          userValue={analysisResults.metrics.find((m: any) => m.name === "Total Cholesterol")?.value || 190}
                          unit="mg/dL"
                          referenceMin={150}
                          referenceMax={200}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="bp">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TrendChart 
                          title="Blood Pressure Trend" 
                          data={[
                            { date: '2023-01-01', value: 128 },
                            { date: '2023-03-15', value: 120 },
                            { date: '2023-06-30', value: 124 },
                            { date: new Date().toISOString().split('T')[0], 
                              value: analysisResults.metrics.find((m: any) => m.name === "Blood Pressure (Systolic)")?.value || 125 }
                          ]}
                          unit="mmHg"
                          dataKey="value"
                        />
                        <BellCurveChart
                          title="Blood Pressure Distribution"
                          data={bpBellCurveData}
                          userValue={analysisResults.metrics.find((m: any) => m.name === "Blood Pressure (Systolic)")?.value || 125}
                          unit="mmHg"
                          referenceMin={90}
                          referenceMax={120}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="thyroid">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TrendChart 
                          title="Thyroid (TSH) Trend" 
                          data={[
                            { date: '2023-01-01', value: 1.2 },
                            { date: '2023-03-15', value: 1.5 },
                            { date: '2023-06-30', value: 1.7 },
                            { date: new Date().toISOString().split('T')[0], 
                              value: analysisResults.metrics.find((m: any) => m.name === "TSH")?.value || 1.8 }
                          ]}
                          unit="mIU/L"
                          dataKey="value"
                        />
                        <BellCurveChart
                          title="Thyroid Function Distribution"
                          data={thyroidBellCurveData}
                          userValue={analysisResults.metrics.find((m: any) => m.name === "TSH")?.value || 1.8}
                          unit="mIU/L"
                          referenceMin={0.4}
                          referenceMax={4.0}
                        />
                      </div>
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
