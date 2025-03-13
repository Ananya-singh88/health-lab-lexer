
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
      // Different handling based on file type
      let fileContent;
      
      if (file.type === 'application/pdf') {
        // For PDFs, we'd normally use a PDF.js or similar library
        // For demo purposes, we'll simulate extraction with file metadata
        fileContent = {
          type: 'pdf',
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified).toISOString(),
          content: `Extracted content from PDF: ${file.name}`,
        };
      } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        // For Word docs, we'd normally use a document processing library
        fileContent = {
          type: 'document',
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified).toISOString(),
          content: `Extracted content from document: ${file.name}`,
        };
      } else if (file.type.includes('image')) {
        // For images, we could use OCR in a real implementation
        fileContent = {
          type: 'image',
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified).toISOString(),
          content: `Extracted content from image: ${file.name}`,
        };
      } else {
        // Fallback for other file types
        fileContent = {
          type: 'unknown',
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified).toISOString(),
          content: `Unknown file type: ${file.name}`,
        };
      }
      
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
