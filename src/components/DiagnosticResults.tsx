
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, AlertTriangle, Info, DollarSign, Wrench, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

export interface Diagnosis {
  issue: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleCauses: string[];
  recommendedFixes: {
    action: string;
    difficulty: 'DIY' | 'Mechanic' | 'Specialist';
    estimatedCost: string;
  }[];
  additionalNotes?: string;
}

interface DiagnosticResultsProps {
  diagnoses: Diagnosis[];
  carInfo: {
    make: string;
    model: string;
    year: string;
  };
}

export function DiagnosticResults({ diagnoses, carInfo }: DiagnosticResultsProps) {
  if (!diagnoses.length) return null;

  const getSeverityColor = (severity: Diagnosis['severity']) => {
    switch(severity) {
      case 'low': return 'bg-repair-severity-low';
      case 'medium': return 'bg-repair-severity-medium';
      case 'high': return 'bg-repair-severity-high';
      case 'critical': return 'bg-repair-severity-critical';
      default: return 'bg-repair-severity-medium';
    }
  };

  const getSeverityLabel = (severity: Diagnosis['severity']) => {
    switch(severity) {
      case 'low': return 'Minor Issue';
      case 'medium': return 'Moderate Issue';
      case 'high': return 'Serious Problem';
      case 'critical': return 'Critical - Urgent Attention';
      default: return 'Unspecified Severity';
    }
  };

  const getSeverityPercentage = (severity: Diagnosis['severity']) => {
    switch(severity) {
      case 'low': return 25;
      case 'medium': return 50;
      case 'high': return 75;
      case 'critical': return 100;
      default: return 50;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'DIY': return 'bg-green-100 text-green-800 border-green-200';
      case 'Mechanic': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Specialist': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg border-repair-blue-light/20">
      <CardHeader className="bg-gradient-to-r from-repair-blue to-repair-blue-dark text-white">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-6 w-6" />
          <CardTitle className="text-2xl">Diagnostic Results</CardTitle>
        </div>
        <CardDescription className="text-white/90">
          AI analysis for {carInfo.year} {carInfo.make} {carInfo.model}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        {diagnoses.map((diagnosis, index) => (
          <div key={index} className="space-y-4">
            {index > 0 && <Separator className="my-6" />}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge 
                  className={`${getSeverityColor(diagnosis.severity)} text-white px-3 py-1`}
                >
                  {getSeverityLabel(diagnosis.severity)}
                </Badge>
                <h3 className="text-xl font-semibold mt-2">{diagnosis.issue}</h3>
              </div>
              
              <div className="w-full md:w-48">
                <div className="flex justify-between text-xs mb-1">
                  <span>Severity</span>
                  <span>{diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}</span>
                </div>
                <Progress 
                  value={getSeverityPercentage(diagnosis.severity)} 
                  className={`h-2 ${getSeverityColor(diagnosis.severity)}`} 
                />
              </div>
            </div>
            
            <p className="text-muted-foreground">{diagnosis.description}</p>

            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-repair-orange" />
                <h4 className="font-medium">Possible Causes</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {diagnosis.possibleCauses.map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>

            <Accordion type="single" collapsible className="border rounded-md">
              <AccordionItem value="fixes">
                <AccordionTrigger className="px-4 hover:bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-repair-blue" />
                    <span>Recommended Fixes</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  {diagnosis.recommendedFixes.map((fix, idx) => (
                    <div key={idx} className="py-3 border-b last:border-0">
                      <div className="flex items-start gap-2 mb-2">
                        <ArrowRight className="h-4 w-4 mt-1 text-repair-blue" />
                        <span className="font-medium">{fix.action}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`${getDifficultyColor(fix.difficulty)} font-normal`}
                        >
                          <Wrench className="h-3.5 w-3.5 mr-1" />
                          {fix.difficulty}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className="bg-blue-50 text-repair-blue border-blue-200 font-normal"
                        >
                          <DollarSign className="h-3.5 w-3.5 mr-1" />
                          {fix.estimatedCost}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {diagnosis.additionalNotes && (
              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-md border border-blue-100">
                <Info className="h-5 w-5 mt-0.5 text-repair-blue" />
                <div>
                  <h4 className="font-medium text-repair-blue mb-1">Additional Information</h4>
                  <p className="text-sm">{diagnosis.additionalNotes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
