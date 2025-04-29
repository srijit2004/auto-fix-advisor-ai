import type { Diagnosis } from "@/components/DiagnosticResults";
import type { SymptomData } from "@/components/CarSymptomForm";
import { enrichDiagnostics } from "./apiClient";

// Mock database of potential car issues and their diagnoses
export const carIssuesDatabase = {
  engine: {
    "won't start": [
      {
        issue: "Dead Battery",
        description: "Your battery may not have enough charge to start the car.",
        severity: "medium",
        possibleCauses: [
          "Battery is old and needs replacement",
          "Alternator is not charging the battery properly",
          "Battery terminals are corroded or loose",
          "Electrical system is draining the battery when car is off"
        ],
        recommendedFixes: [
          {
            action: "Test the battery voltage with a multimeter",
            difficulty: "DIY",
            estimatedCost: "$0 (if you have a multimeter)"
          },
          {
            action: "Clean battery terminals and connections",
            difficulty: "DIY",
            estimatedCost: "$5-$10"
          },
          {
            action: "Replace battery if it's old or failing tests",
            difficulty: "DIY",
            estimatedCost: "$100-$300"
          }
        ],
        additionalNotes: "If your car makes a clicking sound when trying to start, this is often a sign of a dead battery."
      },
      {
        issue: "Starter Motor Failure",
        description: "The starter motor may be faulty or have a poor connection.",
        severity: "high",
        possibleCauses: [
          "Worn out starter motor",
          "Loose or corroded connections to the starter",
          "Faulty starter relay or solenoid",
          "Issues with the ignition switch"
        ],
        recommendedFixes: [
          {
            action: "Test starter motor and connections",
            difficulty: "Mechanic",
            estimatedCost: "$50-$100 for diagnosis"
          },
          {
            action: "Replace starter motor",
            difficulty: "Mechanic",
            estimatedCost: "$250-$650 including labor"
          }
        ]
      }
    ],
    "stalling": [
      {
        issue: "Fuel Delivery Problems",
        description: "Your engine may not be receiving adequate fuel, causing it to stall.",
        severity: "high",
        possibleCauses: [
          "Clogged fuel filter",
          "Failing fuel pump",
          "Dirty fuel injectors",
          "Fuel pressure regulator issues"
        ],
        recommendedFixes: [
          {
            action: "Replace fuel filter",
            difficulty: "DIY",
            estimatedCost: "$15-$60 for parts"
          },
          {
            action: "Clean fuel injectors",
            difficulty: "DIY",
            estimatedCost: "$10-$20 for cleaning kit"
          },
          {
            action: "Replace fuel pump",
            difficulty: "Mechanic",
            estimatedCost: "$300-$1000 depending on vehicle"
          }
        ],
        additionalNotes: "If your car stalls particularly when it's warm or under load, fuel delivery issues are more likely."
      },
      {
        issue: "Faulty Mass Airflow Sensor",
        description: "The sensor that measures air entering your engine may be malfunctioning.",
        severity: "medium",
        possibleCauses: [
          "Dirty or contaminated sensor",
          "Electrical issues with the sensor",
          "Air leaks in the intake system"
        ],
        recommendedFixes: [
          {
            action: "Clean the mass airflow sensor",
            difficulty: "DIY",
            estimatedCost: "$5-$15 for cleaner"
          },
          {
            action: "Replace the sensor if cleaning doesn't work",
            difficulty: "DIY",
            estimatedCost: "$80-$380 for parts"
          }
        ]
      }
    ],
    "check engine light": [
      {
        issue: "Multiple Potential Issues",
        description: "The check engine light can indicate numerous problems. A diagnostic scan is required.",
        severity: "medium",
        possibleCauses: [
          "Oxygen sensor failure",
          "Loose gas cap",
          "Catalytic converter issues",
          "Spark plug or ignition problems",
          "Many other possible causes"
        ],
        recommendedFixes: [
          {
            action: "Get diagnostic code scan",
            difficulty: "DIY",
            estimatedCost: "Free at many auto parts stores or $50-$100 at repair shops"
          },
          {
            action: "Check and tighten gas cap",
            difficulty: "DIY",
            estimatedCost: "Free"
          },
          {
            action: "Address specific issue based on diagnostic codes",
            difficulty: "Varies",
            estimatedCost: "Varies from $20 to $2000+ depending on issue"
          }
        ],
        additionalNotes: "A flashing check engine light indicates a serious problem that could damage your catalytic converter. Reduce speed and load immediately and get the car checked."
      }
    ],
    "knocking": [
      {
        issue: "Engine Knock or Detonation",
        description: "Pre-ignition or improper combustion causing knocking sounds.",
        severity: "high",
        possibleCauses: [
          "Using fuel with too low octane rating",
          "Carbon deposits in cylinders",
          "Failed knock sensor",
          "Advanced ignition timing",
          "Engine overheating"
        ],
        recommendedFixes: [
          {
            action: "Try higher octane fuel",
            difficulty: "DIY",
            estimatedCost: "Extra $0.20-$0.40 per gallon"
          },
          {
            action: "Use fuel system cleaner",
            difficulty: "DIY",
            estimatedCost: "$10-$20"
          },
          {
            action: "Full diagnosis and potential engine work",
            difficulty: "Specialist",
            estimatedCost: "$100-$1000+"
          }
        ],
        additionalNotes: "Continued engine knocking can lead to serious engine damage. If changing to higher octane fuel doesn't help, seek professional help quickly."
      }
    ]
  },
  brakes: {
    "grinding": [
      {
        issue: "Worn Brake Pads",
        description: "Your brake pads have worn down completely and metal is grinding against metal.",
        severity: "critical",
        possibleCauses: [
          "Brake pads worn beyond their service limit",
          "Metal backing of pads contacting the rotors"
        ],
        recommendedFixes: [
          {
            action: "Replace brake pads immediately",
            difficulty: "Mechanic",
            estimatedCost: "$150-$300 per axle"
          },
          {
            action: "Replace or resurface brake rotors",
            difficulty: "Mechanic",
            estimatedCost: "$200-$500 additional if rotors are damaged"
          }
        ],
        additionalNotes: "This is a critical safety issue that needs immediate attention. Continuing to drive can cause brake failure."
      }
    ],
    "squeaking": [
      {
        issue: "Worn Brake Pad Indicators",
        description: "Many brake pads have built-in wear indicators that squeal when pads are getting thin.",
        severity: "medium",
        possibleCauses: [
          "Brake pads wearing thin",
          "Buildup of brake dust between pad and rotor",
          "Glazed brake pads from heat"
        ],
        recommendedFixes: [
          {
            action: "Inspect brake pad thickness",
            difficulty: "DIY",
            estimatedCost: "Free"
          },
          {
            action: "Replace brake pads if necessary",
            difficulty: "Mechanic",
            estimatedCost: "$150-$300 per axle"
          }
        ]
      }
    ],
    "soft pedal": [
      {
        issue: "Air in Brake Lines",
        description: "Air bubbles in the hydraulic brake lines causing a soft, spongy brake pedal.",
        severity: "high",
        possibleCauses: [
          "Recent brake service that introduced air",
          "Leak in brake lines or components",
          "Master cylinder issues"
        ],
        recommendedFixes: [
          {
            action: "Bleed the brake system",
            difficulty: "Mechanic",
            estimatedCost: "$80-$200"
          },
          {
            action: "Check for and repair any leaks",
            difficulty: "Mechanic",
            estimatedCost: "Varies by location and severity of leak"
          }
        ],
        additionalNotes: "Soft brakes can significantly increase stopping distance. This should be addressed urgently for safety."
      }
    ]
  },
  transmission: {
    "slipping": [
      {
        issue: "Transmission Fluid Issues",
        description: "Low or degraded transmission fluid causing gear slippage.",
        severity: "high",
        possibleCauses: [
          "Low transmission fluid level",
          "Dirty or burned transmission fluid",
          "Transmission fluid leaks",
          "Internal transmission wear"
        ],
        recommendedFixes: [
          {
            action: "Check transmission fluid level and condition",
            difficulty: "DIY",
            estimatedCost: "Free"
          },
          {
            action: "Add transmission fluid if low",
            difficulty: "DIY",
            estimatedCost: "$20-$30"
          },
          {
            action: "Change transmission fluid and filter",
            difficulty: "Mechanic",
            estimatedCost: "$150-$400"
          },
          {
            action: "Transmission rebuild or replacement if internal damage",
            difficulty: "Specialist",
            estimatedCost: "$1500-$4000+"
          }
        ],
        additionalNotes: "Prompt attention to transmission slipping can prevent more costly repairs later."
      }
    ],
    "hard shifting": [
      {
        issue: "Transmission Control Issues",
        description: "Problems with shift control mechanisms causing hard or delayed shifts.",
        severity: "medium",
        possibleCauses: [
          "Low or dirty transmission fluid",
          "Faulty shift solenoids",
          "Transmission control module issues",
          "Internal mechanical problems"
        ],
        recommendedFixes: [
          {
            action: "Check/replace transmission fluid",
            difficulty: "DIY/Mechanic",
            estimatedCost: "$150-$400 for fluid service"
          },
          {
            action: "Diagnose and replace faulty solenoids",
            difficulty: "Mechanic",
            estimatedCost: "$300-$850"
          },
          {
            action: "Transmission control module reprogramming",
            difficulty: "Specialist",
            estimatedCost: "$150-$300"
          }
        ]
      }
    ]
  },
  electrical: {
    "battery drain": [
      {
        issue: "Parasitic Electrical Drain",
        description: "Something is drawing power from your battery when the car is off.",
        severity: "medium",
        possibleCauses: [
          "Component not shutting off properly (light, computer, etc.)",
          "Short circuit in electrical system",
          "Faulty alternator diode",
          "Aftermarket accessories improperly installed"
        ],
        recommendedFixes: [
          {
            action: "Parasitic draw test",
            difficulty: "Mechanic",
            estimatedCost: "$80-$200 for diagnosis"
          },
          {
            action: "Repair specific electrical issue",
            difficulty: "Mechanic",
            estimatedCost: "Varies based on cause, typically $150-$500"
          }
        ],
        additionalNotes: "Until fixed, you might need to disconnect the battery when parking for extended periods."
      }
    ],
    "dim lights": [
      {
        issue: "Charging System Problems",
        description: "The alternator may not be charging properly or there are connection issues.",
        severity: "medium",
        possibleCauses: [
          "Failing alternator",
          "Loose or corroded battery connections",
          "Worn drive belt",
          "Bad voltage regulator"
        ],
        recommendedFixes: [
          {
            action: "Test alternator output",
            difficulty: "DIY/Mechanic",
            estimatedCost: "$0-$100"
          },
          {
            action: "Clean and tighten battery connections",
            difficulty: "DIY",
            estimatedCost: "$0-$10"
          },
          {
            action: "Replace alternator if failing",
            difficulty: "Mechanic",
            estimatedCost: "$350-$850"
          }
        ]
      }
    ]
  },
  cooling: {
    "overheating": [
      {
        issue: "Cooling System Failure",
        description: "The engine cooling system is not functioning correctly, causing overheating.",
        severity: "critical",
        possibleCauses: [
          "Low coolant level or leak",
          "Faulty radiator cap",
          "Failed thermostat",
          "Water pump failure",
          "Clogged radiator"
        ],
        recommendedFixes: [
          {
            action: "Check coolant level and for leaks",
            difficulty: "DIY",
            estimatedCost: "$0-$20"
          },
          {
            action: "Replace thermostat",
            difficulty: "DIY/Mechanic",
            estimatedCost: "$20-$150"
          },
          {
            action: "Replace water pump",
            difficulty: "Mechanic",
            estimatedCost: "$300-$750"
          },
          {
            action: "Radiator replacement or service",
            difficulty: "Mechanic",
            estimatedCost: "$400-$1000"
          }
        ],
        additionalNotes: "Stop driving immediately if your engine is overheating to prevent serious engine damage. Wait for the engine to cool before opening the hood."
      }
    ],
    "white smoke": [
      {
        issue: "Coolant Leak Into Combustion Chamber",
        description: "Coolant is leaking into the cylinders and being burned, producing white smoke.",
        severity: "critical",
        possibleCauses: [
          "Blown head gasket",
          "Cracked cylinder head",
          "Cracked engine block"
        ],
        recommendedFixes: [
          {
            action: "Cooling system pressure test",
            difficulty: "Mechanic",
            estimatedCost: "$100-$200"
          },
          {
            action: "Replace head gasket",
            difficulty: "Specialist",
            estimatedCost: "$1000-$2000"
          },
          {
            action: "Replace cylinder head if cracked",
            difficulty: "Specialist",
            estimatedCost: "$1500-$3000+"
          },
          {
            action: "Engine replacement if block is cracked",
            difficulty: "Specialist",
            estimatedCost: "$3000-$7000+"
          }
        ],
        additionalNotes: "White exhaust smoke that smells sweet (like coolant) is a serious issue requiring immediate attention."
      }
    ]
  },
  suspension: {
    "bouncing": [
      {
        issue: "Worn Shock Absorbers",
        description: "The shock absorbers are worn and not properly dampening motion.",
        severity: "medium",
        possibleCauses: [
          "Worn out shock absorbers or struts",
          "Damaged springs",
          "Worn bushings in suspension components"
        ],
        recommendedFixes: [
          {
            action: "Test shock absorbers with bounce test",
            difficulty: "DIY",
            estimatedCost: "Free"
          },
          {
            action: "Replace shock absorbers/struts",
            difficulty: "Mechanic",
            estimatedCost: "$200-$1500 depending on vehicle and if all four are replaced"
          }
        ],
        additionalNotes: "Worn shock absorbers can increase stopping distance and reduce handling ability, affecting safety."
      }
    ],
    "pulling": [
      {
        issue: "Alignment Issues",
        description: "The wheels are not properly aligned, causing the vehicle to pull to one side.",
        severity: "medium",
        possibleCauses: [
          "Wheels out of alignment",
          "Uneven tire pressure or wear",
          "Brake caliper sticking on one side",
          "Damaged suspension components"
        ],
        recommendedFixes: [
          {
            action: "Check and adjust tire pressure",
            difficulty: "DIY",
            estimatedCost: "Free"
          },
          {
            action: "Get wheel alignment",
            difficulty: "Mechanic",
            estimatedCost: "$80-$200"
          },
          {
            action: "Inspect and repair suspension components if damaged",
            difficulty: "Mechanic",
            estimatedCost: "Varies based on components $200-$1000+"
          }
        ]
      }
    ]
  },
  exhaust: {
    "loud": [
      {
        issue: "Exhaust Leak or Damage",
        description: "There is a hole, crack, or disconnection in the exhaust system.",
        severity: "medium",
        possibleCauses: [
          "Rust or physical damage to exhaust pipes",
          "Failed gasket between exhaust components",
          "Cracked exhaust manifold",
          "Damaged muffler"
        ],
        recommendedFixes: [
          {
            action: "Inspect entire exhaust system",
            difficulty: "Mechanic",
            estimatedCost: "$50-$100"
          },
          {
            action: "Repair or replace damaged sections",
            difficulty: "Mechanic",
            estimatedCost: "$150-$800 depending on component"
          }
        ],
        additionalNotes: "Exhaust leaks can allow dangerous carbon monoxide into the cabin under certain conditions."
      }
    ],
    "black smoke": [
      {
        issue: "Rich Fuel Mixture",
        description: "The engine is running with too much fuel relative to air.",
        severity: "high",
        possibleCauses: [
          "Faulty fuel injectors",
          "Bad oxygen sensor",
          "Clogged air filter",
          "Failed engine sensor (MAF, MAP)",
          "Fuel pressure regulator issues"
        ],
        recommendedFixes: [
          {
            action: "Replace air filter",
            difficulty: "DIY",
            estimatedCost: "$15-$50"
          },
          {
            action: "Diagnostic scan to check sensors",
            difficulty: "Mechanic",
            estimatedCost: "$50-$150"
          },
          {
            action: "Clean or replace fuel injectors",
            difficulty: "Mechanic",
            estimatedCost: "$150-$700"
          }
        ]
      }
    ]
  },
  fuel: {
    "poor economy": [
      {
        issue: "Fuel Economy Reduction",
        description: "The vehicle is using more fuel than normal for the same driving conditions.",
        severity: "low",
        possibleCauses: [
          "Clogged air filter",
          "Under-inflated tires",
          "Faulty oxygen sensor",
          "Dirty fuel injectors",
          "Dragging brakes",
          "Incorrect engine timing"
        ],
        recommendedFixes: [
          {
            action: "Check and replace air filter",
            difficulty: "DIY",
            estimatedCost: "$15-$50"
          },
          {
            action: "Inflate tires to proper pressure",
            difficulty: "DIY",
            estimatedCost: "Free or $1-$2 at air pump"
          },
          {
            action: "Diagnostic test for oxygen sensors and engine sensors",
            difficulty: "Mechanic",
            estimatedCost: "$100-$200"
          },
          {
            action: "Clean fuel system and injectors",
            difficulty: "DIY/Mechanic",
            estimatedCost: "$20 for DIY additive or $100-$200 professional service"
          }
        ]
      }
    ],
    "smell": [
      {
        issue: "Fuel Leak",
        description: "Fuel is leaking somewhere in the system.",
        severity: "critical",
        possibleCauses: [
          "Damaged fuel line",
          "Faulty fuel injector seal",
          "Fuel tank leak",
          "Loose fuel cap"
        ],
        recommendedFixes: [
          {
            action: "Check and tighten fuel cap",
            difficulty: "DIY",
            estimatedCost: "Free"
          },
          {
            action: "Professional inspection of fuel system",
            difficulty: "Mechanic",
            estimatedCost: "$100-$200"
          },
          {
            action: "Repair specific fuel leak",
            difficulty: "Mechanic",
            estimatedCost: "$200-$1000+ depending on location"
          }
        ],
        additionalNotes: "Fuel leaks are a serious fire hazard. If you smell fuel strongly, have the vehicle towed rather than driving it."
      }
    ]
  },
  other: {
    "vibration": [
      {
        issue: "Wheel Balancing or Tire Issues",
        description: "Unbalanced wheels, damaged tires, or worn suspension causing vibrations.",
        severity: "medium",
        possibleCauses: [
          "Unbalanced wheels",
          "Damaged or worn tires",
          "Bent wheel rim",
          "Worn suspension components",
          "Brake rotor issues"
        ],
        recommendedFixes: [
          {
            action: "Balance wheels",
            difficulty: "Mechanic",
            estimatedCost: "$40-$150"
          },
          {
            action: "Inspect and replace damaged tires",
            difficulty: "Mechanic",
            estimatedCost: "$100-$200 per tire"
          },
          {
            action: "Wheel alignment",
            difficulty: "Mechanic",
            estimatedCost: "$80-$200"
          }
        ]
      }
    ],
    "rattling": [
      {
        issue: "Loose Component",
        description: "Something has come loose and is rattling under certain conditions.",
        severity: "low",
        possibleCauses: [
          "Loose heat shield",
          "Damaged exhaust hangers",
          "Foreign object caught in undercarriage",
          "Loose interior trim or components"
        ],
        recommendedFixes: [
          {
            action: "Visual inspection to locate rattle",
            difficulty: "DIY/Mechanic",
            estimatedCost: "$0-$100"
          },
          {
            action: "Secure or replace loose components",
            difficulty: "DIY/Mechanic",
            estimatedCost: "Varies by component $0-$300"
          }
        ]
      }
    ]
  }
};

interface DiagnosticResponse {
  diagnoses: Diagnosis[];
}

// Function to analyze symptoms and provide diagnoses
export async function analyzeCar(symptomData: SymptomData): Promise<DiagnosticResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      // Simulate processing time with a delay
      setTimeout(async () => {
        const diagnoses: Diagnosis[] = [];
        
        // Mock AI diagnostic algorithm
        const description = symptomData.description.toLowerCase();
        const category = symptomData.symptomCategory;
        
        // Check for common symptoms in the description
        const keywordChecks = {
          "engine": {
            "won't start": ["won't start", "won't turn over", "doesn't start", "no start", "not starting"],
            "stalling": ["stalling", "stalls", "dies", "cuts out"],
            "check engine light": ["check engine", "engine light", "warning light"],
            "knocking": ["knocking", "knock", "tapping", "clicking"]
          },
          "brakes": {
            "grinding": ["grinding", "grind", "metal on metal"],
            "squeaking": ["squeak", "squeal", "high pitched"],
            "soft pedal": ["soft pedal", "spongy", "goes to floor"]
          },
          "transmission": {
            "slipping": ["slipping", "slips", "revs without accelerating"],
            "hard shifting": ["hard shift", "difficult to shift", "clunk", "jerks when shifting"]
          },
          "electrical": {
            "battery drain": ["battery dead", "drains battery", "won't hold charge"],
            "dim lights": ["dim lights", "flickering", "headlights dim"]
          },
          "cooling": {
            "overheating": ["overheat", "overheating", "temperature high", "running hot"],
            "white smoke": ["white smoke", "steam", "sweet smell"]
          },
          "suspension": {
            "bouncing": ["bouncing", "bouncy", "continues to bounce"],
            "pulling": ["pulls", "pulling", "drifts", "veers"]
          },
          "exhaust": {
            "loud": ["loud exhaust", "muffler noise", "rumbling"],
            "black smoke": ["black smoke", "dark smoke"]
          },
          "fuel": {
            "poor economy": ["bad gas mileage", "poor mpg", "using more gas"],
            "smell": ["fuel smell", "gas smell", "gasoline odor"]
          },
          "other": {
            "vibration": ["vibration", "shaking", "shimmy"],
            "rattling": ["rattle", "rattling", "loose"]
          }
        };
        
        // Function to check if description contains any of the keywords
        const containsKeyword = (keywords: string[]): boolean => {
          return keywords.some(keyword => description.includes(keyword));
        };
        
        // Check for matches in the selected category first
        if (keywordChecks[category as keyof typeof keywordChecks]) {
          const categoryChecks = keywordChecks[category as keyof typeof keywordChecks];
          
          for (const [issueType, keywords] of Object.entries(categoryChecks)) {
            if (containsKeyword(keywords)) {
              // @ts-ignore - We know this structure exists
              const possibleIssues = carIssuesDatabase[category][issueType] || [];
              diagnoses.push(...possibleIssues);
            }
          }
        }
        
        // If we didn't find any specific matches, check other categories too
        if (diagnoses.length === 0) {
          for (const [checkCategory, categoryChecks] of Object.entries(keywordChecks)) {
            // Skip the already checked selected category
            if (checkCategory === category) continue;
            
            for (const [issueType, keywords] of Object.entries(categoryChecks)) {
              if (containsKeyword(keywords)) {
                // @ts-ignore - We know this structure exists
                const possibleIssues = carIssuesDatabase[checkCategory][issueType] || [];
                diagnoses.push(...possibleIssues);
              }
            }
          }
        }
        
        // If still no diagnoses, provide a generic response
        if (diagnoses.length === 0) {
          diagnoses.push({
            issue: "Unidentified Issue",
            description: "Based on the symptoms described, we couldn't identify a specific issue. More information or a hands-on inspection may be needed.",
            severity: "medium",
            possibleCauses: [
              "Insufficient symptom information",
              "Combination of multiple minor issues",
              "Uncommon or complex problem"
            ],
            recommendedFixes: [
              {
                action: "Visit a professional mechanic for diagnostic",
                difficulty: "Mechanic",
                estimatedCost: "$80-$150 for diagnostic"
              },
              {
                action: "Provide more detailed symptom information",
                difficulty: "DIY",
                estimatedCost: "Free"
              }
            ]
          } as Diagnosis);
        }
        
        // Enhance our diagnoses with real API data if the car details are provided
        if (symptomData.carMake && symptomData.carModel && symptomData.carYear) {
          try {
            const enrichedDiagnoses = await enrichDiagnostics(symptomData, diagnoses);
            resolve({ diagnoses: enrichedDiagnoses });
          } catch (error) {
            console.error("API enrichment failed:", error);
            // Still return our local diagnoses if API fails
            resolve({ diagnoses });
          }
        } else {
          // No car details provided, just return our local diagnoses
          resolve({ diagnoses });
        }
      }, 1500); // 1.5 second delay to simulate processing
    } catch (error) {
      console.error("Error in analyzeCar:", error);
      reject(error);
    }
  });
}
