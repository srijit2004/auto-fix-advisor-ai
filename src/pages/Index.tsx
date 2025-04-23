
import React, { useState } from "react";
import { CarSymptomForm, SymptomData } from "@/components/CarSymptomForm";
import { DiagnosticResults, Diagnosis } from "@/components/DiagnosticResults";
import { analyzeCar } from "@/services/diagnosticService";
import { CarFront, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [carInfo, setCarInfo] = useState<{ make: string; model: string; year: string }>({
    make: "",
    model: "",
    year: "",
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSymptomSubmit = async (symptomData: SymptomData) => {
    setIsAnalyzing(true);
    setHasSubmitted(true);
    setCarInfo({
      make: symptomData.carMake,
      model: symptomData.carModel,
      year: symptomData.carYear,
    });
    
    try {
      const result = await analyzeCar(symptomData);
      setDiagnoses(result.diagnoses);
    } catch (error) {
      console.error("Error analyzing car symptoms:", error);
    } finally {
      setIsAnalyzing(false);
    }
    
    // Scroll to results after a short delay to ensure they're rendered
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const resetDiagnosis = () => {
    setDiagnoses([]);
    setHasSubmitted(false);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-repair-blue text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CarFront className="h-8 w-8" />
            <h1 className="text-3xl font-bold text-center">AI Auto Repair Advisor</h1>
          </div>
          <p className="text-center text-blue-100 max-w-2xl mx-auto">
            Quickly diagnose car issues with our AI-powered tool. Describe your car's symptoms and get repair recommendations.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* How it works section */}
          {!hasSubmitted && (
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-repair-gray-dark">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-repair-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <span className="text-repair-blue font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-1">Describe Symptoms</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your car's details and describe the symptoms you're experiencing
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="bg-repair-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <span className="text-repair-blue font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-1">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI system analyzes the symptoms to identify potential issues
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="bg-repair-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <span className="text-repair-blue font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-1">Get Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Review diagnosis, recommended fixes, and estimated costs
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Symptom Form */}
          {(!hasSubmitted || isAnalyzing) && (
            <div className="w-full mb-8">
              <CarSymptomForm onSubmit={handleSymptomSubmit} isAnalyzing={isAnalyzing} />
            </div>
          )}

          {/* Results Section */}
          {hasSubmitted && !isAnalyzing && diagnoses.length > 0 && (
            <div id="results" className="w-full space-y-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ArrowRight className="h-5 w-5 text-repair-blue" />
                <h2 className="text-2xl font-semibold text-center">Diagnostic Results</h2>
              </div>
              
              <DiagnosticResults diagnoses={diagnoses} carInfo={carInfo} />
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={resetDiagnosis}
                  className="px-4 py-2 text-repair-blue hover:text-repair-blue-dark border border-repair-blue hover:border-repair-blue-dark rounded-md transition-colors"
                >
                  Start New Diagnosis
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-8 text-center">
                <h3 className="text-lg font-medium text-repair-blue mb-2">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  This AI diagnostic tool provides general guidance based on symptoms described. 
                  It is not a substitute for professional diagnosis by a qualified mechanic. 
                  Always consult with a professional for serious vehicle issues.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-repair-gray-dark text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <Separator className="mb-6 bg-white/10" />
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CarFront className="h-5 w-5" />
              <span className="font-medium">AI Auto Repair Advisor</span>
            </div>
            <div className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} AI Auto Repair Advisor. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
