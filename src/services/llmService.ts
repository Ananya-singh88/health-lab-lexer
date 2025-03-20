
import { toast } from "@/hooks/use-toast";

const API_KEY = "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";

export interface LLMResponse {
  content: string;
  status: "success" | "error";
  error?: string;
}

/**
 * Analyzes health data using the Anthropic API
 * @param healthData Raw health data or query to be processed
 * @returns Processed health insights
 */
export const analyzeLLMData = async (healthData: any): Promise<LLMResponse> => {
  try {
    console.log("Analyzing data with LLM:", healthData);
    
    // Call the actual API for real data processing
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Analyze this health report data and provide medically accurate insights:
              ${JSON.stringify(healthData)}
              
              Return only a JSON object with the following structure:
              {
                "insights": [string array of key health insights],
                "metrics": [array of metric objects with name, value, unit, status],
                "recommendations": [string array of personalized recommendations],
                "trends": {
                  "description": string describing the overall trend,
                  "concerns": [array of potential health concerns]
                }
              }
              
              Make sure all metric objects have the required fields: name, value, unit, status.
              For any metrics missing from the input data, mark them as "N/A" rather than inventing values.
              Status should be one of: "normal", "caution", "attention".
              Ensure all values are medically accurate and conservative - do not exaggerate risks.
              Include all metrics from the input data without modifying their values.
              `
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("LLM API Error:", errorData);
      
      // Fall back to the synchronous version for now
      console.log("Falling back to simulated data");
      return analyzeFallbackData(healthData);
    }

    const data = await response.json();
    console.log("LLM API Response:", data);
    
    // Extract the content text from the message
    const content = data.content?.[0]?.text || "{}";
    
    // Parse the JSON from the text to validate it
    try {
      const parsedContent = JSON.parse(content);
      return {
        content,
        status: "success"
      };
    } catch (parseError) {
      console.error("LLM Response parsing error:", parseError);
      return analyzeFallbackData(healthData);
    }
  } catch (error) {
    console.error("LLM Service Error:", error);
    toast({
      title: "Analysis Error",
      description: "Failed to analyze the health data. Using fallback data.",
      variant: "destructive"
    });
    
    // In case of any error, fall back to simulated data
    return analyzeFallbackData(healthData);
  }
};

// Fallback function to generate simulated data when API fails
const analyzeFallbackData = (healthData: any): LLMResponse => {
  console.log("Using fallback data generator with:", healthData);
  
  // Preserve the original values from input if they exist
  const inputMetrics = healthData.baseMetrics || [];
  
  // Create a response that preserves the original metric values
  return {
    content: JSON.stringify({
      insights: [
        "This is simulated fallback data as the API request failed",
        "The values shown are from your original input data",
        "Please try again later for AI-powered analysis"
      ],
      metrics: inputMetrics.map((metric: any) => ({
        name: metric.name,
        value: metric.value,
        unit: metric.unit || "",
        status: metric.status || "normal"
      })),
      recommendations: [
        "Please consult with your healthcare provider for accurate recommendations",
        "Consider retrying the analysis later when the service is available",
        "Ensure your lab report data is complete for better analysis"
      ],
      trends: {
        description: "Unable to analyze trends at this time.",
        concerns: []
      }
    }),
    status: "success"
  };
};

// Synchronous version for immediate use
export const analyzeLLMDataSync = (healthData: any): LLMResponse => {
  console.log("Using synchronous LLM analysis with:", healthData);
  
  // Extract the original metrics if available
  const inputMetrics = healthData.baseMetrics || [];
  
  // Build response using only the data provided
  return {
    content: JSON.stringify({
      insights: [
        "Your health metrics analysis is based on the provided data",
        "All values shown reflect exactly what was in your report",
        "For more detailed analysis, please upload a complete report"
      ],
      metrics: inputMetrics.map((metric: any) => ({
        name: metric.name,
        value: metric.value,
        unit: metric.unit || "",
        status: metric.status || "normal"
      })),
      recommendations: [
        "Maintain consistent monitoring of your health metrics",
        "Share your complete lab results with your healthcare provider",
        "Consider regular comprehensive health checkups"
      ],
      trends: {
        description: "Analysis based on your current report data only.",
        concerns: []
      }
    }),
    status: "success"
  };
};
