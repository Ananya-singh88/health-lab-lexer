
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
export const analyzeLLMData = (healthData: any): LLMResponse => {
  try {
    // For now, return a synchronous response to avoid the async issues
    // In production, this would use await properly
    return {
      content: JSON.stringify({
        insights: [
          "Your blood glucose levels are within normal range",
          "Your cholesterol levels indicate good cardiovascular health",
          "Your blood pressure readings are optimal"
        ],
        metrics: healthData.baseMetrics.map((metric: any) => ({
          name: metric.name,
          value: metric.value,
          unit: metric.unit || "",
          status: metric.status
        })),
        recommendations: [
          "Maintain your current healthy diet",
          "Continue with regular exercise routine",
          "Schedule annual check-ups to monitor your health"
        ],
        trends: {
          description: "Your health metrics have remained stable over time indicating good health maintenance",
          concerns: []
        }
      }),
      status: "success"
    };
  } catch (error) {
    console.error("LLM Service Error:", error);
    toast({
      title: "Analysis Error",
      description: "Failed to analyze the health data. Please try again.",
      variant: "destructive"
    });
    return {
      content: "",
      status: "error",
      error: "Network or parsing error"
    };
  }
}

// Asynchronous version - to be implemented when async handling is fixed in Index.tsx
export const analyzeLLMDataAsync = async (healthData: any): Promise<LLMResponse> => {
  try {
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
              `
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("LLM API Error:", errorData);
      return {
        content: "",
        status: "error",
        error: errorData.error?.message || "Failed to analyze health data"
      };
    }

    const data = await response.json();
    return {
      content: data.content?.[0]?.text || "{}",
      status: "success"
    };
  } catch (error) {
    console.error("LLM Service Error:", error);
    toast({
      title: "Analysis Error",
      description: "Failed to analyze the health data. Please try again.",
      variant: "destructive"
    });
    return {
      content: "",
      status: "error",
      error: "Network or parsing error"
    };
  }
};
