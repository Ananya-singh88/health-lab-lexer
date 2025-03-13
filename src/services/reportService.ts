
export interface ReportData {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  metrics: any[];
  summary: any;
  recommendations: any;
  rawData?: any;
}

// Store reports in localStorage
export const saveReport = (report: ReportData): void => {
  try {
    const existingReports = getReports();
    const updatedReports = [report, ...existingReports];
    localStorage.setItem('health_reports', JSON.stringify(updatedReports));
  } catch (error) {
    console.error('Error saving report:', error);
  }
};

export const getReports = (): ReportData[] => {
  try {
    const reports = localStorage.getItem('health_reports');
    return reports ? JSON.parse(reports) : [];
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
};

export const getReportById = (id: string): ReportData | undefined => {
  try {
    const reports = getReports();
    return reports.find(report => report.id === id);
  } catch (error) {
    console.error('Error getting report by id:', error);
    return undefined;
  }
};

export const deleteReport = (id: string): void => {
  try {
    const reports = getReports();
    const updatedReports = reports.filter(report => report.id !== id);
    localStorage.setItem('health_reports', JSON.stringify(updatedReports));
  } catch (error) {
    console.error('Error deleting report:', error);
  }
};

export const analyzeReport = (fileContent: any): any => {
  // This would be where you'd process the file with AI in a real app
  // For now, we'll generate different results based on the file name and type
  
  const fileNameLower = fileContent.name.toLowerCase();
  
  // Generate different metrics based on filename to simulate real analysis
  const baseMetrics = [
    {
      name: "Blood Glucose",
      value: Math.floor(70 + Math.random() * 100),
      unit: "mg/dL",
      status: Math.random() > 0.5 ? "normal" : "attention",
      change: Math.floor(Math.random() * 20) - 10,
    },
    {
      name: "Total Cholesterol",
      value: Math.floor(150 + Math.random() * 100),
      unit: "mg/dL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 30) - 15,
    },
    {
      name: "Blood Pressure",
      value: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(70 + Math.random() * 20)}`,
      unit: "mmHg",
      status: Math.random() > 0.6 ? "normal" : "attention",
      change: Math.floor(Math.random() * 10) - 5,
    },
    {
      name: "Hemoglobin",
      value: (12 + Math.random() * 4).toFixed(1),
      unit: "g/dL",
      status: Math.random() > 0.8 ? "normal" : "caution",
      change: (Math.random() * 2 - 1).toFixed(1),
    }
  ];
  
  // Add file-specific metrics based on filename
  if (fileNameLower.includes("glucose") || fileNameLower.includes("diabetes")) {
    baseMetrics.push({
      name: "HbA1c",
      value: (4 + Math.random() * 3).toFixed(1),
      unit: "%",
      status: Math.random() > 0.5 ? "normal" : "caution",
      change: (Math.random() * 1 - 0.5).toFixed(1),
    });
  }
  
  if (fileNameLower.includes("lipid") || fileNameLower.includes("cholesterol")) {
    baseMetrics.push({
      name: "LDL Cholesterol",
      value: Math.floor(70 + Math.random() * 80),
      unit: "mg/dL",
      status: Math.random() > 0.6 ? "normal" : "caution",
      change: Math.floor(Math.random() * 15) - 7,
    });
    baseMetrics.push({
      name: "HDL Cholesterol",
      value: Math.floor(35 + Math.random() * 30),
      unit: "mg/dL",
      status: Math.random() > 0.7 ? "normal" : "attention",
      change: Math.floor(Math.random() * 8) - 4,
    });
  }
  
  if (fileNameLower.includes("thyroid")) {
    baseMetrics.push({
      name: "TSH",
      value: (0.5 + Math.random() * 4).toFixed(2),
      unit: "mIU/L",
      status: Math.random() > 0.6 ? "normal" : "attention",
      change: (Math.random() * 1 - 0.5).toFixed(2),
    });
  }
  
  // Randomized recommendations
  const recommendationSets = [
    ["Maintain a balanced diet rich in vegetables and fruits", 
     "Engage in moderate exercise for at least 150 minutes weekly", 
     "Ensure adequate hydration by drinking 8-10 glasses of water daily"],
    ["Consider reducing sodium intake to support blood pressure health", 
     "Aim for 7-8 hours of quality sleep each night", 
     "Monitor your blood glucose levels regularly"],
    ["Include omega-3 rich foods in your diet like fatty fish", 
     "Practice stress reduction techniques such as meditation", 
     "Schedule a follow-up appointment in 3-6 months"]
  ];
  
  // Select a random set and add a file-specific recommendation
  let recommendations = [...recommendationSets[Math.floor(Math.random() * recommendationSets.length)]];
  
  if (fileContent.type === 'pdf') {
    recommendations.push("Your PDF results show important health indicators - discuss specific findings with your doctor");
  } else if (fileContent.type === 'document') {
    recommendations.push("Your lab document contains detailed health parameters - schedule a review with your healthcare provider");
  } else if (fileContent.type === 'image') {
    recommendations.push("For more accurate analysis, consider providing digital copies of your lab reports");
  }
  
  // Generate a summary based on metrics
  const overallHealth = Math.random() > 0.7 ? "good" : "needs attention";
  const summaryText = `Based on your ${fileContent.type} report "${fileContent.name}", your overall health appears to be ${overallHealth}. ${baseMetrics.filter(m => m.status !== "normal").length} metrics require attention.`;
  
  return {
    metrics: baseMetrics,
    summary: {
      text: summaryText,
      overallHealth: overallHealth
    },
    recommendations: {
      title: "Personalized Health Recommendations",
      recommendations: recommendations
    },
    rawData: fileContent
  };
};
