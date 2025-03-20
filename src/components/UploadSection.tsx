
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadSection = ({ onUpload }: { onUpload: (file: File, fileContent: any) => void }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    setProcessing(true);
    try {
      // Get actual file content when possible
      let fileContent: any = {
        type: file.type || determineFileType(file.name),
        name: file.name,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString(),
      };
      
      // For PDF files, we would need a PDF parser library in a real app
      // For this demo, let's extract categories and key metrics from filename
      console.log("Processed file:", fileContent);
      
      // Extract potential metrics from filename
      const fileNameLower = file.name.toLowerCase();
      
      // Add metadata based on file name to help with processing
      fileContent.metrics = [];
      
      // Detect specific values in filename (simulated extraction)
      // In a real app, this would come from actual file parsing
      if (fileNameLower.includes('glucose')) {
        fileContent.metrics.push({
          name: 'Blood Glucose',
          value: getNumberFromString(fileNameLower, 'glucose', 98),
          unit: 'mg/dL'
        });
      }
      
      if (fileNameLower.includes('cholesterol')) {
        fileContent.metrics.push({
          name: 'Total Cholesterol',
          value: getNumberFromString(fileNameLower, 'cholesterol', 175),
          unit: 'mg/dL'
        });
      }
      
      if (fileNameLower.includes('pressure') || fileNameLower.includes('bp')) {
        fileContent.metrics.push({
          name: 'Blood Pressure (Systolic)',
          value: getNumberFromString(fileNameLower, 'bp', 120),
          unit: 'mmHg'
        });
      }
      
      if (fileNameLower.includes('tsh') || fileNameLower.includes('thyroid')) {
        fileContent.metrics.push({
          name: 'TSH',
          value: getNumberFromString(fileNameLower, 'tsh', 2.5),
          unit: 'mIU/L'
        });
      }
      
      // Determine primary category
      if (fileNameLower.includes('glucose') || fileNameLower.includes('diabetes')) {
        fileContent.category = 'diabetes';
      } else if (fileNameLower.includes('lipid') || fileNameLower.includes('cholesterol') || 
                fileNameLower.includes('heart') || fileNameLower.includes('cardiac')) {
        fileContent.category = 'heart';
      } else if (fileNameLower.includes('kidney') || fileNameLower.includes('renal')) {
        fileContent.category = 'kidney';
      } else if (fileNameLower.includes('thyroid')) {
        fileContent.category = 'thyroid';
      } else {
        fileContent.category = 'general';
      }
      
      // Add raw text content (simulated)
      fileContent.content = `Extracted content from ${file.name}`;
      
      setFileName(file.name);
      onUpload(file, fileContent);
      
      toast({
        title: `${file.name} uploaded successfully`,
        description: "Analyzing your health data...",
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "Please try again with a different file",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Helper function to extract numbers from filename (simulated file content parsing)
  const getNumberFromString = (str: string, keyword: string, defaultValue: number): number => {
    // This is a very simplified simulation of extracting values from file content
    // In a real app, this would use actual parsed values from the file
    try {
      // Simple approach: look for patterns like "glucose-98" or "glucose_98" or "glucose 98"
      const regex = new RegExp(`${keyword}[\\s_-]*(\\d+(?:\\.\\d+)?)`, 'i');
      const match = str.match(regex);
      
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
      
      // Add some variation to the default values to simulate different reports
      return defaultValue + (Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 10));
    } catch (e) {
      return defaultValue;
    }
  };

  // Helper function to determine file type from extension
  const determineFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return "unknown";
    
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'doc': case 'docx': return 'application/msword';
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      default: return "unknown";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Upload Lab Report</CardTitle>
        <CardDescription>
          Upload your lab report PDF, document, or image to get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          } ${processing ? "opacity-50 pointer-events-none" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium">
              {fileName ? (
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {fileName}
                </span>
              ) : (
                "Drag & drop or click to upload"
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOC, DOCX, JPG, PNG formats
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-4">
          <Button 
            onClick={triggerFileInput} 
            className="w-full"
            disabled={processing}
          >
            {processing ? "Processing..." : "Select File"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
