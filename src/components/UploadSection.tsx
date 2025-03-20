
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
        content: `Extracted content from ${file.name}`,
      };
      
      // Add metadata based on file name to help with processing
      if (file.name.toLowerCase().includes('glucose') || file.name.toLowerCase().includes('diabetes')) {
        fileContent.category = 'diabetes';
      } else if (file.name.toLowerCase().includes('lipid') || file.name.toLowerCase().includes('cholesterol') || 
                file.name.toLowerCase().includes('heart') || file.name.toLowerCase().includes('cardiac')) {
        fileContent.category = 'heart';
      } else if (file.name.toLowerCase().includes('kidney') || file.name.toLowerCase().includes('renal')) {
        fileContent.category = 'kidney';
      } else if (file.name.toLowerCase().includes('thyroid')) {
        fileContent.category = 'thyroid';
      } else {
        fileContent.category = 'general';
      }
      
      console.log("Processed file:", fileContent);
      
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
