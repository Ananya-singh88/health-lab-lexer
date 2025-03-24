from fastapi import FastAPI, HTTPException, Body, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import io
import os
import tempfile
import re
from typing import Dict, Any, Optional, List
import uvicorn
import PyPDF2
from pydantic import BaseModel

app = FastAPI(title="Medical Report Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Anthropic API configuration
ANTHROPIC_API_KEY = "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"
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"

@app.get("/")
async def root():
    return {"message": "Medical Report Analysis API is running"}

@app.post("/analyze")
async def analyze_medical_report(report_data: Dict[str, Any] = Body(...)):
    """
    Analyze medical report data using Claude AI
    
    Expects a JSON object with medical report data including metrics
    Returns enhanced analysis with insights and recommendations
    """
    try:
        # Extract base metrics if available
        base_metrics = report_data.get("baseMetrics", [])
        report_type = report_data.get("reportType", "general")
        
        # Prepare the prompt for Claude
        prompt = f"""Analyze this medical report data and provide medically accurate insights:
        {json.dumps(report_data)}
        
        Return only a JSON object with the following structure:
        {{"insights": [string array of key health insights],
          "metrics": [array of metric objects with name, value, unit, status],
          "recommendations": [string array of personalized recommendations],
          "trends": {{
            "description": string describing the overall trend,
            "concerns": [array of potential health concerns]
          }}
        }}
        
        IMPORTANT MEDICAL GUIDELINES:
        1. Do NOT change any values of the metrics in the input data, only add or enhance metadata
        2. For status, use one of: "normal", "caution", "attention"
        3. Do not exaggerate risks or create false concerns
        4. Ensure all insights and recommendations are medically accurate and responsible
        5. Focus on providing actionable health insights based on the lab values
        6. Include specific reference ranges when discussing abnormal values
        7. Highlight potential correlations between different metrics
        8. Suggest follow-up tests when appropriate for concerning values
        """
        
        # Call the Anthropic API
        headers = {
            "x-api-key": ANTHROPIC_API_KEY,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        payload = {
            "model": "claude-3-haiku-20240307",  # Using the same model as in llmService.ts
            "max_tokens": 1500,
            "temperature": 0.2,  # Lower temperature for more consistent medical advice
            "messages": [{"role": "user", "content": prompt}]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(ANTHROPIC_API_URL, json=payload, headers=headers)
            
        if response.status_code != 200:
            print(f"API Error: {response.text}")
            return generate_fallback_response(report_data)
            
        # Parse the response
        response_data = response.json()
        
        # The Claude API response structure has changed, content is directly in the response
        text_content = response_data.get("content", [{}])[0].get("text", "{}")
        
        # Parse the JSON from the text
        try:
            parsed_content = json.loads(text_content)
            # Validate the parsed content and its structure
            if not isinstance(parsed_content, dict):
                raise ValueError("Response is not a valid JSON object")
                
            required_fields = ["insights", "metrics", "recommendations", "trends"]
            missing_fields = [field for field in required_fields if field not in parsed_content]
            
            if missing_fields:
                print(f"Missing required fields in response: {missing_fields}")
                return generate_fallback_response(report_data)
                
            # Return the validated content
            return {
                "content": json.dumps(parsed_content),
                "status": "success"
            }
        except json.JSONDecodeError:
            print("Failed to parse LLM response as JSON")
            return generate_fallback_response(report_data)
            
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing medical report: {str(e)}")


def generate_fallback_response(report_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a fallback response when the API call fails
    Similar to the analyzeFallbackData function in llmService.ts
    """
    # Extract base metrics if available
    input_metrics = report_data.get("baseMetrics", [])
    
    # Create a basic response
    fallback_response = {
        "insights": [
            "Your health metrics are being analyzed based on your report",
            "The values shown are from your uploaded data",
            "For more comprehensive analysis, consult with a healthcare provider"
        ],
        "metrics": [{
            "name": metric.get("name", "Unknown Metric"),
            "value": metric.get("value", ""),
            "unit": metric.get("unit", ""),
            "status": metric.get("status", "normal"),
            "description": metric.get("description", f"Information about {metric.get('name', 'this metric')}")
        } for metric in input_metrics],
        "recommendations": [
            "Continue monitoring your health metrics regularly",
            "Share your complete lab results with your healthcare provider",
            "Maintain a balanced diet and regular exercise routine"
        ],
        "trends": {
            "description": "Your health metrics are being tracked based on this report.",
            "concerns": []
        }
    }
    
    return {
        "content": json.dumps(fallback_response),
        "status": "success"
    }


@app.post("/chat")
async def chat_with_claude(prompt: str = Body(..., embed=True)):
    """
    General-purpose endpoint to chat with Claude AI
    
    Expects a text prompt
    Returns Claude's response
    """
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
    }
    
    payload = {
        "model": "claude-3-haiku-20240307",
        "max_tokens": 1024,
        "temperature": 0.7,
        "messages": [{"role": "user", "content": prompt}]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(ANTHROPIC_API_URL, json=payload, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)