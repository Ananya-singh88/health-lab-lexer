
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

const UploadSection = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const [dragging, setDragging] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
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
      setFileName(file.name);
      onUpload(file);
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
          Upload your lab report PDF or image to get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
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
              Supports PDF, JPG, PNG formats
            </p>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-4">
          <Button 
            onClick={triggerFileInput} 
            className="w-full"
          >
            Select File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
