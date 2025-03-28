
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PreviousReportsList from "@/components/PreviousReportsList";
import { getReports, getReportById, deleteReport } from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadReports = () => {
    // Load reports from local storage
    const loadedReports = getReports();
    setReports(loadedReports);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleViewReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handleNewReport = () => {
    navigate('/');
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport(reportId);
    loadReports(); // Refresh the list
    toast({
      title: "Report deleted",
      description: "The report has been successfully deleted.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Health Reports</h1>
          <Button onClick={handleNewReport}>
            <PlusCircle className="h-4 w-4 mr-2" /> New Report
          </Button>
        </div>

        <PreviousReportsList 
          reports={reports} 
          onViewReport={handleViewReport}
          onDeleteReport={handleDeleteReport}
        />
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          HealthLab Insights — AI-powered health metrics analyzer
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
