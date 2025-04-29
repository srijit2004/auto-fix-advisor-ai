
// API client for making requests to the car diagnostic service
// Using NHTSA Vehicle API as an example public API

import type { SymptomData } from "@/components/CarSymptomForm";
import type { Diagnosis } from "@/components/DiagnosticResults";
import { carIssuesDatabase } from "./diagnosticService";

// Base URL for the NHTSA API
const API_BASE_URL = "https://api.nhtsa.gov/recalls/recallsByVehicle";

interface ApiResponse {
  results?: any[];
  count?: number;
  message?: string;
}

// Function to fetch real vehicle recall data from NHTSA
export async function fetchVehicleData(make: string, model: string, year: string): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    throw error;
  }
}

// Function to combine API data with our expert system
export async function enrichDiagnostics(
  symptomData: SymptomData, 
  localDiagnoses: Diagnosis[]
): Promise<Diagnosis[]> {
  try {
    // Fetch real recall data for this vehicle
    const apiData = await fetchVehicleData(
      symptomData.carMake, 
      symptomData.carModel, 
      symptomData.carYear
    );
    
    // If no API data returned or no recalls found, just return our local diagnoses
    if (!apiData.results || apiData.results.length === 0) {
      return localDiagnoses;
    }
    
    // Process up to 3 relevant recalls
    const relevantRecalls = apiData.results
      .slice(0, 3)
      .filter(recall => recall.component && recall.summary);
    
    // If no relevant recalls, return local diagnoses
    if (relevantRecalls.length === 0) {
      return localDiagnoses;
    }
    
    // Create recall-based diagnoses
    const recallDiagnoses: Diagnosis[] = relevantRecalls.map(recall => ({
      issue: `Recall: ${recall.component}`,
      description: recall.summary || "Official recall for this vehicle component",
      severity: "high",
      possibleCauses: [
        "Manufacturing defect",
        "Design flaw",
        "Safety concern identified by manufacturer",
        recall.consequence || "Potential safety hazard"
      ],
      recommendedFixes: [
        {
          action: "Contact your dealership about recall #" + recall.campaignNumber,
          difficulty: "Mechanic",
          estimatedCost: "Usually covered by manufacturer"
        }
      ],
      additionalNotes: "This is an official recall notice from the vehicle manufacturer. Contact your authorized dealer as soon as possible."
    }));
    
    // Combine recall diagnoses with our local diagnoses
    return [...recallDiagnoses, ...localDiagnoses];
  } catch (error) {
    console.error("Error enriching diagnostics with API data:", error);
    // If API fails, still return our local diagnoses
    return localDiagnoses;
  }
}
