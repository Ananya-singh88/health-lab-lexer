
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
      referenceRange: "70-100 mg/dL",
      description: "Fasting blood glucose levels indicate how effectively your body regulates sugar"
    },
    {
      name: "Total Cholesterol",
      value: Math.floor(150 + Math.random() * 100),
      unit: "mg/dL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 30) - 15,
      referenceRange: "125-200 mg/dL",
      description: "Total cholesterol measures all cholesterol in your blood, including HDL and LDL"
    },
    {
      name: "Blood Pressure",
      value: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(70 + Math.random() * 20)}`,
      unit: "mmHg",
      status: Math.random() > 0.6 ? "normal" : "attention",
      change: Math.floor(Math.random() * 10) - 5,
      referenceRange: "120/80 mmHg",
      description: "Blood pressure is the force of blood pushing against artery walls"
    },
    {
      name: "Hemoglobin",
      value: (12 + Math.random() * 4).toFixed(1),
      unit: "g/dL",
      status: Math.random() > 0.8 ? "normal" : "caution",
      change: (Math.random() * 2 - 1).toFixed(1),
      referenceRange: "13.5-17.5 g/dL (men), 12.0-15.5 g/dL (women)",
      description: "Hemoglobin is a protein in red blood cells that carries oxygen"
    },
    {
      name: "Vitamin D",
      value: Math.floor(20 + Math.random() * 40),
      unit: "ng/mL",
      status: Math.random() > 0.6 ? "normal" : "caution",
      change: Math.floor(Math.random() * 10) - 5,
      referenceRange: "20-50 ng/mL",
      description: "Vitamin D is essential for calcium absorption and bone health"
    },
    {
      name: "Vitamin B12",
      value: Math.floor(200 + Math.random() * 600),
      unit: "pg/mL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 100) - 50,
      referenceRange: "200-900 pg/mL",
      description: "Vitamin B12 is important for nerve function and red blood cell formation"
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
      referenceRange: "4.0-5.6%",
      description: "HbA1c measures average blood glucose levels over the past 2-3 months"
    });
    baseMetrics.push({
      name: "Insulin",
      value: Math.floor(5 + Math.random() * 20),
      unit: "μIU/mL",
      status: Math.random() > 0.6 ? "normal" : "caution",
      change: Math.floor(Math.random() * 5) - 2,
      referenceRange: "5-25 μIU/mL",
      description: "Insulin is a hormone that regulates blood glucose levels"
    });
  }
  
  if (fileNameLower.includes("lipid") || fileNameLower.includes("cholesterol")) {
    baseMetrics.push({
      name: "LDL Cholesterol",
      value: Math.floor(70 + Math.random() * 80),
      unit: "mg/dL",
      status: Math.random() > 0.6 ? "normal" : "caution",
      change: Math.floor(Math.random() * 15) - 7,
      referenceRange: "<100 mg/dL",
      description: "LDL (bad) cholesterol can build up in your arteries"
    });
    baseMetrics.push({
      name: "HDL Cholesterol",
      value: Math.floor(35 + Math.random() * 30),
      unit: "mg/dL",
      status: Math.random() > 0.7 ? "normal" : "attention",
      change: Math.floor(Math.random() * 8) - 4,
      referenceRange: ">40 mg/dL (men), >50 mg/dL (women)",
      description: "HDL (good) cholesterol helps remove LDL cholesterol from your arteries"
    });
    baseMetrics.push({
      name: "Triglycerides",
      value: Math.floor(50 + Math.random() * 100),
      unit: "mg/dL",
      status: Math.random() > 0.6 ? "normal" : "caution",
      change: Math.floor(Math.random() * 20) - 10,
      referenceRange: "<150 mg/dL",
      description: "Triglycerides are a type of fat in the blood"
    });
  }
  
  if (fileNameLower.includes("thyroid")) {
    baseMetrics.push({
      name: "TSH",
      value: (0.5 + Math.random() * 4).toFixed(2),
      unit: "mIU/L",
      status: Math.random() > 0.6 ? "normal" : "attention",
      change: (Math.random() * 1 - 0.5).toFixed(2),
      referenceRange: "0.4-4.0 mIU/L",
      description: "TSH (Thyroid Stimulating Hormone) regulates thyroid hormone production"
    });
    baseMetrics.push({
      name: "T4",
      value: (5 + Math.random() * 7).toFixed(1),
      unit: "μg/dL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: (Math.random() * 2 - 1).toFixed(1),
      referenceRange: "5.0-12.0 μg/dL",
      description: "T4 (Thyroxine) is the main thyroid hormone in the blood"
    });
    baseMetrics.push({
      name: "T3",
      value: (80 + Math.random() * 100).toFixed(0),
      unit: "ng/dL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 30) - 15,
      referenceRange: "80-180 ng/dL",
      description: "T3 (Triiodothyronine) is an active thyroid hormone"
    });
  }

  if (fileNameLower.includes("liver") || fileNameLower.includes("hepatic")) {
    baseMetrics.push({
      name: "ALT",
      value: Math.floor(10 + Math.random() * 40),
      unit: "U/L",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 10) - 5,
      referenceRange: "7-56 U/L",
      description: "ALT (Alanine Transaminase) is an enzyme primarily found in the liver"
    });
    baseMetrics.push({
      name: "AST",
      value: Math.floor(10 + Math.random() * 30),
      unit: "U/L",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 8) - 4,
      referenceRange: "10-40 U/L",
      description: "AST (Aspartate Transaminase) is an enzyme found in the liver and other tissues"
    });
    baseMetrics.push({
      name: "Albumin",
      value: (3.5 + Math.random() * 1.5).toFixed(1),
      unit: "g/dL",
      status: Math.random() > 0.8 ? "normal" : "caution",
      change: (Math.random() * 0.6 - 0.3).toFixed(1),
      referenceRange: "3.5-5.0 g/dL",
      description: "Albumin is a protein made by the liver"
    });
  }

  if (fileNameLower.includes("kidney") || fileNameLower.includes("renal")) {
    baseMetrics.push({
      name: "Creatinine",
      value: (0.6 + Math.random() * 0.8).toFixed(2),
      unit: "mg/dL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: (Math.random() * 0.4 - 0.2).toFixed(2),
      referenceRange: "0.6-1.2 mg/dL (men), 0.5-1.1 mg/dL (women)",
      description: "Creatinine is a waste product filtered by the kidneys"
    });
    baseMetrics.push({
      name: "BUN",
      value: Math.floor(7 + Math.random() * 13),
      unit: "mg/dL",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 6) - 3,
      referenceRange: "7-20 mg/dL",
      description: "BUN (Blood Urea Nitrogen) is a waste product filtered by the kidneys"
    });
    baseMetrics.push({
      name: "eGFR",
      value: Math.floor(60 + Math.random() * 60),
      unit: "mL/min/1.73m²",
      status: Math.random() > 0.7 ? "normal" : "caution",
      change: Math.floor(Math.random() * 10) - 5,
      referenceRange: ">60 mL/min/1.73m²",
      description: "eGFR estimates how well your kidneys filter blood"
    });
  }
  
  // Dietary recommendations based on metrics
  const dietaryRecommendations = {
    highCholesterol: [
      "Limit saturated and trans fats found in red meat and full-fat dairy",
      "Increase soluble fiber from oats, beans, and fruits",
      "Add fatty fish like salmon to your diet twice weekly",
      "Include plant sterols found in nuts, seeds, and vegetable oils"
    ],
    highGlucose: [
      "Limit refined carbohydrates and added sugars",
      "Choose whole grains over processed grains",
      "Add cinnamon to your diet, which may help lower blood sugar",
      "Include lean proteins with each meal to stabilize blood sugar"
    ],
    vitaminD: [
      "Include fatty fish, egg yolks, and mushrooms in your diet",
      "Consider fortified foods like milk, orange juice, and cereals",
      "Spend 15-30 minutes in the sun a few times per week",
      "Include vitamin D-rich dairy alternatives like fortified plant milks"
    ],
    highBloodPressure: [
      "Follow the DASH diet (rich in fruits, vegetables, and low-fat dairy)",
      "Limit sodium intake to less than 2,300mg daily",
      "Include potassium-rich foods like bananas, potatoes, and avocados",
      "Consider including beet juice, which may help lower blood pressure"
    ],
    anemia: [
      "Include iron-rich foods like lean red meat, beans, and spinach",
      "Pair iron-rich foods with vitamin C to enhance absorption",
      "Include vitamin B12 sources like meat, eggs, and dairy",
      "Consider adding folate-rich foods like leafy greens and legumes"
    ]
  };

  // Select relevant dietary recommendations based on metrics
  let selectedDietaryRecommendations = [];
  
  // Check for abnormal values and add relevant dietary recommendations
  const cholesterolMetric = baseMetrics.find(m => m.name === "Total Cholesterol");
  if (cholesterolMetric && cholesterolMetric.status !== "normal") {
    selectedDietaryRecommendations = [...selectedDietaryRecommendations, ...dietaryRecommendations.highCholesterol];
  }
  
  const glucoseMetric = baseMetrics.find(m => m.name === "Blood Glucose");
  if (glucoseMetric && glucoseMetric.status !== "normal") {
    selectedDietaryRecommendations = [...selectedDietaryRecommendations, ...dietaryRecommendations.highGlucose];
  }
  
  const vitaminDMetric = baseMetrics.find(m => m.name === "Vitamin D");
  if (vitaminDMetric && vitaminDMetric.status !== "normal") {
    selectedDietaryRecommendations = [...selectedDietaryRecommendations, ...dietaryRecommendations.vitaminD];
  }
  
  const bpMetric = baseMetrics.find(m => m.name === "Blood Pressure");
  if (bpMetric && bpMetric.status !== "normal") {
    selectedDietaryRecommendations = [...selectedDietaryRecommendations, ...dietaryRecommendations.highBloodPressure];
  }
  
  const hemoglobinMetric = baseMetrics.find(m => m.name === "Hemoglobin");
  if (hemoglobinMetric && hemoglobinMetric.status !== "normal") {
    selectedDietaryRecommendations = [...selectedDietaryRecommendations, ...dietaryRecommendations.anemia];
  }
  
  // If no specific conditions were detected, add some general recommendations
  if (selectedDietaryRecommendations.length === 0) {
    selectedDietaryRecommendations = [
      "Maintain a balanced diet with plenty of fruits and vegetables",
      "Limit processed foods and added sugars",
      "Stay hydrated by drinking 8-10 glasses of water daily",
      "Include a variety of protein sources in your diet"
    ];
  }
  
  // Remove duplicates and limit to 6 recommendations
  selectedDietaryRecommendations = [...new Set(selectedDietaryRecommendations)].slice(0, 6);
  
  // Randomized general recommendations
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
  
  if (fileContent.type.includes('pdf')) {
    recommendations.push("Your PDF results show important health indicators - discuss specific findings with your doctor");
  } else if (fileContent.type.includes('document') || fileContent.type.includes('doc')) {
    recommendations.push("Your lab document contains detailed health parameters - schedule a review with your healthcare provider");
  } else if (fileContent.type.includes('image')) {
    recommendations.push("For more accurate analysis, consider providing digital copies of your lab reports");
  }
  
  // Count abnormal metrics
  const abnormalMetricsCount = baseMetrics.filter(m => m.status !== "normal").length;
  
  // Determine overall health status based on abnormal metrics
  let overallHealth = "good";
  if (abnormalMetricsCount > baseMetrics.length / 2) {
    overallHealth = "needs attention";
  } else if (abnormalMetricsCount > 0) {
    overallHealth = "monitor";
  }
  
  // Generate a summary based on metrics
  const summaryText = `Based on your ${fileContent.type} report "${fileContent.name}", your overall health appears to be ${overallHealth}. ${abnormalMetricsCount} out of ${baseMetrics.length} metrics require attention. ${
    abnormalMetricsCount > 0 
      ? `Key areas of concern include ${baseMetrics
          .filter(m => m.status !== "normal")
          .slice(0, 3)
          .map(m => m.name)
          .join(", ")}.` 
      : "All your metrics are within normal ranges."
  }`;
  
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
    dietaryPlan: {
      title: "Personalized Dietary Recommendations",
      recommendations: selectedDietaryRecommendations
    },
    rawData: fileContent
  };
};
