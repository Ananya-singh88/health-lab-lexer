
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportData } from "@/services/reportService";

interface PreviousReportsListProps {
  reports: ReportData[];
  onViewReport: (reportId: string) => void;
}

const PreviousReportsList = ({ reports, onViewReport }: PreviousReportsListProps) => {
  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Previous Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No previous reports found.</p>
            <p className="text-sm">Upload a lab report to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Previous Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {report.fileName.length > 20 
                    ? `${report.fileName.substring(0, 20)}...` 
                    : report.fileName}
                </TableCell>
                <TableCell>
                  {new Date(report.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{report.fileType}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewReport(report.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PreviousReportsList;
