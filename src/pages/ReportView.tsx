
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReportById } from "@/services/reportService";
import Header from "@/components/Header";
import HealthSummary from "@/components/HealthSummary";
import MetricsGrid from "@/components/MetricsGrid";
import RecommendationCard from "@/components/RecommendationCard";
import TrendChart from "@/components/TrendChart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportData } from "@/services/reportService";
import DietaryPlanner from "@/components/DietaryPlanner";
import HealthCalendar from "@/components/HealthCalendar";

const ReportView = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const reportData = getReportById(id);
      if (reportData) {
        setReport(reportData);
      }
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDownload = () => {
    if (!report) return;
    
    // Create a downloadable report in JSON format
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${report.fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading report...</div>;
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-6">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <Card className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
            <p className="text-muted-foreground">The report you're looking for doesn't exist or has been deleted.</p>
          </Card>
        </main>
      </div>
    );
  }

  // Create sample trend data for this report
  const trendData = [
    { date: '2023-01-01', value: 160 },
    { date: '2023-03-15', value: 180 },
    { date: '2023-06-30', value: 150 },
    { date: report.uploadDate, value: report.metrics.find(m => m.name === "Total Cholesterol")?.value || 140 }
  ];

  const glucoseTrendData = [
    { date: '2023-01-01', value: 110 },
    { date: '2023-03-15', value: 95 },
    { date: '2023-06-30', value: 105 },
    { date: report.uploadDate, value: report.metrics.find(m => m.name === "Blood Glucose")?.value || 100 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Download Report
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{report.fileName}</h1>
          <p className="text-muted-foreground">
            Uploaded on {new Date(report.uploadDate).toLocaleDateString()} • {report.fileType} file
          </p>
        </div>
        
        <div className="mb-8">
          <HealthSummary 
            summaryText={report.summary.text} 
            overallHealth={report.summary.overallHealth} 
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Health Metrics</h2>
          <MetricsGrid metrics={report.metrics} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="cholesterol">
              <TabsList className="mb-2">
                <TabsTrigger value="cholesterol">Cholesterol Trend</TabsTrigger>
                <TabsTrigger value="glucose">Glucose Trend</TabsTrigger>
              </TabsList>
              <TabsContent value="cholesterol">
                <TrendChart 
                  title="Total Cholesterol" 
                  data={trendData}
                  unit="mg/dL"
                  dataKey="value"
                />
              </TabsContent>
              <TabsContent value="glucose">
                <TrendChart 
                  title="Blood Glucose (Fasting)" 
                  data={glucoseTrendData}
                  unit="mg/dL"
                  dataKey="value"
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:col-span-1">
            <RecommendationCard {...report.recommendations} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DietaryPlanner metrics={report.metrics} />
          <HealthCalendar />
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

export default ReportView;
