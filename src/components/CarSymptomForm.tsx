
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarFront, Wrench, Settings } from "lucide-react";

interface CarSymptomFormProps {
  onSubmit: (symptomData: SymptomData) => void;
  isAnalyzing: boolean;
}

export interface SymptomData {
  description: string;
  carMake: string;
  carModel: string;
  carYear: string;
  symptomCategory: string;
}

const CAR_MAKES = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", 
  "Hyundai", "Kia", "BMW", "Mercedes-Benz", "Audi",
  "Volkswagen", "Subaru", "Mazda", "Lexus", "Jeep",
  "Other"
];

const SYMPTOM_CATEGORIES = [
  { value: "engine", label: "Engine Problems" },
  { value: "transmission", label: "Transmission Issues" },
  { value: "brakes", label: "Braking System" },
  { value: "electrical", label: "Electrical System" },
  { value: "cooling", label: "Cooling System" },
  { value: "suspension", label: "Suspension & Steering" },
  { value: "exhaust", label: "Exhaust System" },
  { value: "fuel", label: "Fuel System" },
  { value: "other", label: "Other Issues" },
];

export function CarSymptomForm({ onSubmit, isAnalyzing }: CarSymptomFormProps) {
  const [symptomData, setSymptomData] = useState<SymptomData>({
    description: "",
    carMake: "",
    carModel: "",
    carYear: "",
    symptomCategory: "engine",
  });

  const [activeTab, setActiveTab] = useState<string>("textInput");

  const handleChange = (field: keyof SymptomData, value: string) => {
    setSymptomData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(symptomData);
  };

  const yearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push(year.toString());
    }
    return years;
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg border-repair-blue-light/20">
      <CardHeader className="bg-gradient-to-r from-repair-blue to-repair-blue-dark text-white">
        <div className="flex items-center gap-2 mb-2">
          <CarFront className="h-6 w-6" />
          <CardTitle className="text-2xl">Car Symptom Diagnostics</CardTitle>
        </div>
        <CardDescription className="text-white/90">
          Describe the symptoms your vehicle is experiencing for an AI diagnosis
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carMake">Car Make</Label>
              <Select 
                value={symptomData.carMake} 
                onValueChange={(value) => handleChange("carMake", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {CAR_MAKES.map((make) => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carModel">Model</Label>
              <input
                id="carModel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={symptomData.carModel}
                onChange={(e) => handleChange("carModel", e.target.value)}
                placeholder="e.g. Camry, Civic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carYear">Year</Label>
              <Select 
                value={symptomData.carYear} 
                onValueChange={(value) => handleChange("carYear", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions().map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptomCategory">Symptom Category</Label>
            <Select 
              value={symptomData.symptomCategory} 
              onValueChange={(value) => handleChange("symptomCategory", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYMPTOM_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Describe the Symptoms</Label>
              <span className="text-xs text-muted-foreground">
                Be as detailed as possible
              </span>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-2">
                <TabsTrigger value="textInput">
                  <span className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Text Description
                  </span>
                </TabsTrigger>
                <TabsTrigger value="commonSymptoms">
                  <span className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    Common Symptoms
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="textInput">
                <Textarea
                  id="description"
                  value={symptomData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Please describe what's happening with your car. Include any sounds, vibrations, warning lights, or other symptoms you've noticed."
                  className="h-32 resize-none"
                />
              </TabsContent>

              <TabsContent value="commonSymptoms" className="p-4 bg-muted/30 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Car won't start",
                    "Engine stalls frequently",
                    "Grinding noise when braking",
                    "Transmission slipping",
                    "Check engine light is on",
                    "Car overheating",
                    "Steering wheel vibration",
                    "Squeaking belt noise",
                    "Oil leaking"
                  ].map((symptom) => (
                    <Button 
                      key={symptom}
                      type="button"
                      variant="outline"
                      className="justify-start h-auto py-2 px-4 text-left"
                      onClick={() => {
                        handleChange("description", 
                          symptomData.description ? 
                            `${symptomData.description}\n- ${symptom}` : 
                            `- ${symptom}`
                        );
                        setActiveTab("textInput");
                      }}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end border-t p-4">
          <Button 
            type="reset" 
            variant="outline"
            onClick={() => setSymptomData({
              description: "",
              carMake: "",
              carModel: "",
              carYear: "",
              symptomCategory: "engine",
            })}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="bg-repair-blue hover:bg-repair-blue-dark"
            disabled={!symptomData.description || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Analyzing...
              </>
            ) : (
              "Diagnose Problem"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
