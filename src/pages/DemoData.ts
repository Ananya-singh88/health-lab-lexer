
// Demo data for the health metrics dashboard
import { HealthMetricProps } from "@/components/HealthMetricCard";

export const demoHealthMetrics: HealthMetricProps[] = [
  {
    name: "Hemoglobin",
    value: 13.5,
    unit: "g/dL",
    status: "normal",
    referenceRange: "13.5-17.5",
    trend: "stable",
    description: "Hemoglobin is a protein in your red blood cells that carries oxygen to your body's organs and tissues."
  },
  {
    name: "White Blood Cells",
    value: 10.8,
    unit: "k/μL",
    status: "warning",
    referenceRange: "4.5-11.0",
    trend: "up",
    description: "White blood cells help your body fight infections. Elevated levels may indicate an infection or inflammation."
  },
  {
    name: "Cholesterol (Total)",
    value: 240,
    unit: "mg/dL",
    status: "alert",
    referenceRange: "125-200",
    trend: "up",
    description: "Total cholesterol is a measure of all cholesterol in your blood. High levels increase risk of heart disease."
  },
  {
    name: "HDL Cholesterol",
    value: 65,
    unit: "mg/dL",
    status: "normal",
    referenceRange: ">40",
    trend: "stable",
    description: "HDL (High-Density Lipoprotein) is 'good' cholesterol that helps remove other forms of cholesterol from the bloodstream."
  },
  {
    name: "LDL Cholesterol",
    value: 145,
    unit: "mg/dL",
    status: "warning",
    referenceRange: "<100",
    trend: "up",
    description: "LDL (Low-Density Lipoprotein) is 'bad' cholesterol that can build up in your arteries."
  },
  {
    name: "Glucose (Fasting)",
    value: 115,
    unit: "mg/dL",
    status: "warning",
    referenceRange: "70-99",
    trend: "up",
    description: "Blood glucose measures the amount of sugar in your blood. Elevated levels could indicate prediabetes."
  },
  {
    name: "Thyroid (TSH)",
    value: 2.5,
    unit: "mIU/L",
    status: "normal",
    referenceRange: "0.4-4.0",
    trend: "stable",
    description: "TSH (Thyroid Stimulating Hormone) regulates the production of hormones by the thyroid gland."
  },
  {
    name: "Vitamin D",
    value: 29,
    unit: "ng/mL",
    status: "warning",
    referenceRange: "30-100",
    trend: "down",
    description: "Vitamin D is essential for strong bones and immune function. Levels below 30 ng/mL are considered insufficient."
  },
];

export const demoHealthSummary = {
  patientName: "John Smith",
  date: "October 21, 2023",
  summaryText: "Your lab results indicate generally good health with a few areas to monitor. Your cholesterol is elevated and should be addressed with lifestyle changes. Your vitamin D levels are slightly low, which is common but should be improved. Your glucose levels suggest prediabetes, which warrants lifestyle modifications.",
  overallStatus: "monitor" as "healthy" | "monitor" | "attention",
};

export const demoRecommendations = {
  title: "AI-Generated Recommendations",
  recommendations: [
    "Consider dietary changes to lower cholesterol: reduce saturated fats and increase fiber intake through fruits, vegetables, and whole grains.",
    "Start a moderate exercise routine of at least 150 minutes per week to help lower LDL cholesterol and glucose levels.",
    "Supplement with Vitamin D3 (1000-2000 IU daily) after consulting with your healthcare provider.",
    "Monitor blood glucose levels and consider reducing refined carbohydrate intake to prevent progression to type 2 diabetes.",
    "Schedule a follow-up lab test in 3 months to track improvements in cholesterol and glucose values."
  ]
};

export const demoGlucoseTrend = [
  { date: "Jan", value: 89, referenceMin: 70, referenceMax: 99 },
  { date: "Mar", value: 92, referenceMin: 70, referenceMax: 99 },
  { date: "May", value: 98, referenceMin: 70, referenceMax: 99 },
  { date: "Jul", value: 105, referenceMin: 70, referenceMax: 99 },
  { date: "Sep", value: 110, referenceMin: 70, referenceMax: 99 },
  { date: "Oct", value: 115, referenceMin: 70, referenceMax: 99 },
];

export const demoLipidsTrend = [
  { date: "2022 Q1", value: 210, referenceMin: 125, referenceMax: 200 },
  { date: "2022 Q2", value: 215, referenceMin: 125, referenceMax: 200 },
  { date: "2022 Q3", value: 225, referenceMin: 125, referenceMax: 200 },
  { date: "2022 Q4", value: 230, referenceMin: 125, referenceMax: 200 },
  { date: "2023 Q1", value: 235, referenceMin: 125, referenceMax: 200 },
  { date: "2023 Q2", value: 240, referenceMin: 125, referenceMax: 200 },
];
