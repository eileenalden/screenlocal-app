/*
 * © Eileen Alden, 2025
 * All rights reserved.
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useSearch } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ResourceCard from "@/components/resource-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Heart, MessageSquare, Loader2, ChevronLeft, ChevronRight, X, RefreshCw, BookOpen, MapPin, Settings, ExternalLink, FileSpreadsheet, Percent, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MessagingDialog from "@/components/messaging-dialog";
import ProductionTools from "@/components/production-tools";
import type { Resource } from "@shared/schema";

// Location radius configuration for each resource type
const LOCATION_SETTINGS = {
  locations: { defaultRadius: 10, options: [5, 10, 15, 20, 30] },
  crew: { defaultRadius: 30, options: [10, 20, 30, 50] },
  cast: { defaultRadius: 30, options: [10, 20, 30, 50] },
  services: { defaultRadius: 20, options: [10, 15, 20, 30] },
  permits: { defaultRadius: 50, options: [20, 30, 50, 100] },
  budget: { defaultRadius: 100, options: [50, 100, 200, 500] }
};

// East Bay cities for distance reference
const REFERENCE_CITIES = [
  { id: "oakland", name: "Oakland", coordinates: { lat: 37.8044, lng: -122.2711 } },
  { id: "berkeley", name: "Berkeley", coordinates: { lat: 37.8715, lng: -122.2730 } },
  { id: "richmond", name: "Richmond", coordinates: { lat: 37.9358, lng: -122.3477 } },
  { id: "fremont", name: "Fremont", coordinates: { lat: 37.5485, lng: -121.9886 } },
  { id: "hayward", name: "Hayward", coordinates: { lat: 37.6688, lng: -122.0808 } },
  { id: "san_leandro", name: "San Leandro", coordinates: { lat: 37.7249, lng: -122.1561 } }
];

// Browse filtering options for each resource type
const BROWSE_FILTERS = {
  locations: {
    name: "Location Type",
    options: [
      "Interior - House",
      "Exterior - House", 
      "Interior - Apartment",
      "Exterior - Apartment",
      "Interior - Business",
      "Exterior - Business"
    ]
  },
  crew: {
    name: "Department",
    multiSelect: true,
    categories: {
      department: {
        name: "Department",
        options: [
          "Production",
          "Camera", 
          "Grip & Electric",
          "Art",
          "Wardrobe",
          "Hair & Makeup",
          "Sound",
          "Post-Production"
        ]
      },
      unionStatus: {
        name: "Union Status",
        options: [
          "Any",
          "Union",
          "Non-Union"
        ]
      }
    }
  },
  cast: {
    name: "Demographics",
    multiSelect: true,
    categories: {
      gender: {
        name: "Gender",
        options: [
          "Any",
          "Male", 
          "Female", 
          "Non-binary"
        ]
      },
      ethnicity: {
        name: "Ethnicity",
        options: [
          "Any",
          "Black / African American / African (and/or Caribbean descent)",
          "Latine / Latinx / Hispanic (when pan-ethnic identification is needed)",
          "Indigenous / Native American / First Nations / Alaska Native",
          "East Asian (e.g., Chinese, Japanese, Korean)",
          "Southeast Asian (e.g., Vietnamese, Filipino, Thai, Indonesian)",
          "South Asian (e.g., Indian, Pakistani, Bangladeshi, Nepali)",
          "Middle Eastern / North African (MENA)",
          "Pacific Islander (e.g., Native Hawaiian, Samoan, Tongan, Fijian)",
          "White / Caucasian",
          "Multiracial / Mixed-race"
        ]
      },
      age: {
        name: "Age Range",
        options: [
          "Any",
          "0-9 (Children)",
          "10-19 (Teens)", 
          "20-29 (Twenties)",
          "30-39 (Thirties)",
          "40-49 (Forties)",
          "50-59 (Fifties)",
          "60-69 (Sixties)",
          "70-79 (Seventies)",
          "80+ (Seniors)"
        ]
      },
      unionStatus: {
        name: "Union Status",
        options: [
          "Any",
          "Union",
          "Non-Union"
        ]
      }
    }
  },
  services: {
    name: "Service Type",
    options: [
      "Pre-production",
      "Equipment Rental",
      "Craft Services", 
      "Post-production"
    ]
  },
  permits: {
    name: "Permit Type",
    options: [
      "Location Permits",
      "Special Event Permits",
      "Insurance & Liability",
      "Legal Documentation"
    ]
  },
  budget: {
    name: "Budget Tool",
    options: [
      "Tax Rebates",
      "Budgeting Software",
      "Cost Estimation",
      "Financial Planning"
    ]
  }
};

// East Bay Cities Tax Rebate Data
const EAST_BAY_CITIES = [
  {
    id: "oakland",
    name: "Oakland",
    rebatePercent: "15%",
    description: "City of Oakland offers a 15% local rebate program supporting film production with reduced permit fees and tax incentives.",
    qualifications: [
      "Production budget minimum of $50,000",
      "At least 50% of filming days within Oakland city limits",
      "Hire minimum 25% local Oakland residents",
      "Complete application 30 days prior to filming"
    ],
    applicationSteps: [
      "Submit preliminary application with project details",
      "Provide detailed budget breakdown",
      "Submit local hiring plan",
      "Receive approval and certificate",
      "Complete production and submit final documentation"
    ],
    contactInfo: "Oakland Film Commission: film@oaklandca.gov | (510) 238-2263"
  },
  {
    id: "berkeley",
    name: "Berkeley",
    rebatePercent: "10%",
    description: "Berkeley Film Incentive Program provides tax credits for productions filming primarily within city boundaries.",
    qualifications: [
      "Minimum 60% of production days in Berkeley",
      "Local crew hiring requirement of 30%",
      "Environmental sustainability plan required",
      "Application deadline 45 days before principal photography"
    ],
    applicationSteps: [
      "Initial consultation with Berkeley Film Office",
      "Submit comprehensive application",
      "Environmental impact assessment",
      "Final approval and agreement signing",
      "Post-production compliance verification"
    ],
    contactInfo: "Berkeley Film Office: filmoffice@cityofberkeley.info | (510) 981-7530"
  },
  {
    id: "richmond",
    name: "Richmond",
    rebatePercent: "12%",
    description: "Richmond Production Incentive offers competitive rebates for film and television projects utilizing local resources.",
    qualifications: [
      "Production value minimum $75,000",
      "40% local hiring requirement",
      "Use Richmond-based vendors when possible",
      "Submit application 21 days prior to filming"
    ],
    applicationSteps: [
      "Pre-application meeting with economic development",
      "Complete formal application with supporting documents",
      "Review by Richmond Film Committee",
      "Approval and incentive agreement execution",
      "Production monitoring and final rebate processing"
    ],
    contactInfo: "Richmond Economic Development: economicdev@ci.richmond.ca.us | (510) 307-8140"
  }
];

// California State Tax Credit Information
const CALIFORNIA_TAX_CREDIT = {
  name: "California Film & TV Tax Credit Program",
  rebatePercent: "20-25%",
  description: "State tax incentive program offering up to 25% tax credits for qualified film and television productions shot in California.",
  qualifications: [
    "Principal photography must occur in California",
    "Minimum qualified expenditure thresholds",
    "Jobs ratio requirements for cast and crew",
    "Application through California Film Commission lottery system"
  ],
  applicationSteps: [
    "Register for California Film Commission portal",
    "Submit application during designated lottery periods",
    "Provide detailed production information and budget",
    "Await lottery results and allocation notification",
    "Execute tax credit agreement and comply with reporting requirements"
  ],
  contactInfo: "California Film Commission: info@film.ca.gov | (323) 860-2960",
  website: "https://film.ca.gov/tax-credit/"
};

function BudgetSection() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showCaliforniaInfo, setShowCaliforniaInfo] = useState(false);

  const selectedCityData = EAST_BAY_CITIES.find(city => city.id === selectedCity);

  const budgetingTools = [
    {
      name: "Saturation.io",
      description: "Modern cloud-based budgeting and scheduling platform",
      logo: "🎬",
      popular: true
    },
    {
      name: "Movie Magic Budgeting",
      description: "Industry-standard budgeting software by Entertainment Partners",
      logo: "✨",
      popular: true
    },
    {
      name: "Showbiz Budgeting",
      description: "Professional film and TV budgeting solution",
      logo: "🎭",
      popular: false
    },
    {
      name: "Hot Budget",
      description: "Streamlined budgeting for independent productions",
      logo: "🔥",
      popular: false
    }
  ];

  const handleExportToTool = (toolName: string) => {
    console.log(`Exporting selected resources to ${toolName}`);
  };

  return (
    <div className="space-y-8">
      {/* East Bay Cities Tax Rebates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-6 w-6 text-orange-500 mr-3" />
            East Bay City Tax Rebates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Your City</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an East Bay city..." />
              </SelectTrigger>
              <SelectContent>
                {EAST_BAY_CITIES.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name} ({city.rebatePercent} rebate)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCityData && (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{selectedCityData.name} - {selectedCityData.rebatePercent} Tax Rebate</h3>
                <p className="text-gray-700">{selectedCityData.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Qualification Requirements</h4>
                <ul className="space-y-2">
                  {selectedCityData.qualifications.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Application Process</h4>
                <ol className="space-y-2">
                  {selectedCityData.applicationSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-gray-700">{selectedCityData.contactInfo}</p>
                  </div>
                  {selectedCityData.id === "oakland" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Online
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* California State Tax Credit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Percent className="h-6 w-6 text-orange-500 mr-3" />
              California State Tax Credit
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCaliforniaInfo(!showCaliforniaInfo)}
            >
              {showCaliforniaInfo ? "Hide Details" : "Show Details"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">{CALIFORNIA_TAX_CREDIT.name}</h3>
            <p className="text-gray-700 mb-2">{CALIFORNIA_TAX_CREDIT.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-700">Tax Credit: {CALIFORNIA_TAX_CREDIT.rebatePercent}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(CALIFORNIA_TAX_CREDIT.website, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Apply Online
              </Button>
            </div>
          </div>

          {showCaliforniaInfo && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Qualification Requirements</h4>
                <ul className="space-y-2">
                  {CALIFORNIA_TAX_CREDIT.qualifications.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3">Application Process</h4>
                <ol className="space-y-2">
                  {CALIFORNIA_TAX_CREDIT.applicationSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Contact Information</h4>
                <p className="text-gray-700">{CALIFORNIA_TAX_CREDIT.contactInfo}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SSO Budgeting Software Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="h-6 w-6 text-orange-500 mr-3" />
            Export to Budgeting Software
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Send your selected resources directly to industry-standard budgeting platforms for detailed cost analysis and scheduling.
          </p>

          <div className="space-y-4">
            {budgetingTools.map((tool, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{tool.logo}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        {tool.name}
                        {tool.popular && (
                          <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">Popular</span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportToTool(tool.name)}
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> SSO integration will automatically transfer your selected locations, crew, cast, and services with pricing information to your chosen budgeting platform.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const categoryConfig = {
  locations: {
    title: "Locations",
    description: "Find the perfect filming locations",
    subcategories: ["studio", "outdoor", "house", "warehouse", "office", "restaurant"],
    placeholder: "Describe the location you need: 'Victorian house with period details' or 'Industrial warehouse with high ceilings'..."
  },
  crew: {
    title: "Crew",
    description: "Connect with professional film crew",
    subcategories: ["director", "cinematographer", "sound", "lighting", "camera-operator", "producer"],
    placeholder: "Describe your crew needs: 'Experienced DP for indie feature' or 'Sound engineer for documentary'..."
  },
  cast: {
    title: "Cast", 
    description: "Discover talented actors and performers",
    subcategories: ["actor", "voice-talent", "extras", "dancers", "musicians", "child-actor"],
    placeholder: "Describe your casting needs: 'Male actor 30-40 for lead role' or 'Child actors for commercial'..."
  },
  services: {
    title: "Services",
    description: "Professional film production services",
    subcategories: ["pre-production", "equipment-rental", "craft-services", "post-production"],
    placeholder: "Describe what services you need: 'Catering for 50 person crew' or 'Camera equipment rental'..."
  },
  permits: {
    title: "Permits",
    description: "Film permits and location approvals",
    subcategories: ["filming", "street-closure", "drone", "special-events", "public-property", "commercial"],
    placeholder: "Describe your permit needs: 'Street filming permit for downtown scene' or 'Drone permit for aerial shots'..."
  },
  budget: {
    title: "Budget",
    description: "Tax incentives, rebates, and budgeting tools",
    subcategories: ["tax-rebate", "budgeting-software", "cost-estimation", "financial-planning"],
    placeholder: "Describe your budget needs: 'California film incentive application' or 'Export to Movie Magic Budgeting'..."
  }
};

export default function ResourceCategory() {
  const [match, params] = useRoute("/:category");
  const category = params?.category as keyof typeof categoryConfig;
  const config = categoryConfig[category];
  
  const [description, setDescription] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [aiResults, setAiResults] = useState<Resource[]>([]);
  const [mode, setMode] = useState<"browse" | "search" | "favorites">("browse");
  const [locationRadius, setLocationRadius] = useState<number>(
    LOCATION_SETTINGS[category]?.defaultRadius || 20
  );
  const [referenceCity, setReferenceCity] = useState<string>("oakland");
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [skippedResources, setSkippedResources] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Browse filtering state
  const [browseFilters, setBrowseFilters] = useState<{
    selectedSubcategory?: string;
    castGender?: string[];
    castEthnicity?: string[];
    castAge?: string[];
    castUnionStatus?: string[];
    crewDepartment?: string[];
    crewUnionStatus?: string[];
  }>({});
  const [showBrowseFilters, setShowBrowseFilters] = useState(false);
  
  const { toast } = useToast();
  const search = useSearch();

  // Load favorites and skipped resources from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem(`favorites_${category}`);
    const savedSkipped = localStorage.getItem(`skipped_${category}`);
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedSkipped) {
      setSkippedResources(JSON.parse(savedSkipped));
    }
  }, [category]);

  // Save favorites to localStorage and notify other components
  useEffect(() => {
    localStorage.setItem(`favorites_${category}`, JSON.stringify(favorites));
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('favoritesChanged'));
  }, [favorites, category]);

  // Save skipped resources to localStorage
  useEffect(() => {
    localStorage.setItem(`skipped_${category}`, JSON.stringify(skippedResources));
  }, [skippedResources, category]);

  // Handle URL query parameter for AI search from home page
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const queryParam = urlParams.get('query');
    if (queryParam) {
      setDescription(queryParam);
      setMode("search");
      setTimeout(() => {
        aiSearchMutation.mutate({
          type: category,
          query: queryParam
        });
      }, 100);
    }
  }, [search, category]);

  const { data: allResources = [], isLoading } = useQuery({
    queryKey: ['/api/resources', category],
    queryFn: async () => {
      const response = await fetch(`/api/resources?type=${category}`);
      return response.json();
    }
  });

  const aiSearchMutation = useMutation({
    mutationFn: async ({ type, subtype, query }: { type: string; subtype?: string; query: string }) => {
      const response = await apiRequest('POST', '/api/ai/search', { 
        resourceType: type, 
        serviceSubtype: subtype, 
        description: query 
      });
      return await response.json();
    },
    onSuccess: (results: Resource[]) => {
      setAiResults(results);
      setCurrentIndex(0);
      toast({
        title: "Search completed",
        description: `Found ${results.length} matching resources`,
      });
    },
    onError: () => {
      toast({
        title: "Search failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  });

  const handleSearch = () => {
    if (!description.trim()) {
      toast({
        title: "Missing description",
        description: "Please describe what you're looking for",
        variant: "destructive",
      });
      return;
    }
    setMode("search");
    aiSearchMutation.mutate({
      type: category,
      subtype: subcategory,
      query: description
    });
  };

  const handleBrowse = () => {
    // Show filters dialog instead of immediately browsing
    setShowBrowseFilters(true);
  };

  const applyBrowseFilters = () => {
    // Check if required filters are selected
    const filterConfig = BROWSE_FILTERS[category];
    if (!filterConfig) return;

    if (category === 'cast') {
      // For cast, require at least one selection from each category
      if (!browseFilters.castGender?.length || !browseFilters.castEthnicity?.length || !browseFilters.castAge?.length || !browseFilters.castUnionStatus?.length) {
        toast({
          title: "Missing filters",
          description: "Please select at least one option for gender, ethnicity, age range, and union status",
          variant: "destructive",
        });
        return;
      }
    } else if (category === 'crew') {
      // For crew, require at least one selection from each category
      if (!browseFilters.crewDepartment?.length || !browseFilters.crewUnionStatus?.length) {
        toast({
          title: "Missing filters",
          description: "Please select at least one option for department and union status",
          variant: "destructive",
        });
        return;
      }
    } else {
      // For other categories, require subcategory selection
      if (!browseFilters.selectedSubcategory) {
        toast({
          title: "Missing filter",
          description: `Please select a ${filterConfig.name.toLowerCase()}`,
          variant: "destructive",
        });
        return;
      }
    }

    setMode("browse");
    setAiResults([]);
    setDescription("");
    setSubcategory("");
    setCurrentIndex(0);
    setShowFavorites(false);
    setShowBrowseFilters(false);
  };

  const handleFavorites = () => {
    setMode("favorites");
    setShowFavorites(true);
    setCurrentIndex(0);
  };

  const resetSearch = () => {
    setSkippedResources([]);
    setCurrentIndex(0);
    toast({
      title: "Search reset",
      description: "You can now review all resources again",
    });
  };

  const toggleFavorite = (resourceId: number) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const swipeLeft = () => {
    const resources = getDisplayResources();
    const currentResource = resources[currentIndex];
    
    // Mark current resource as skipped
    if (currentResource && !skippedResources.includes(currentResource.id)) {
      setSkippedResources(prev => [...prev, currentResource.id]);
    }
    
    if (currentIndex < resources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const swipeRight = () => {
    const resources = getDisplayResources();
    const currentResource = resources[currentIndex];
    if (currentResource) {
      toggleFavorite(currentResource.id);
      swipeLeft(); // Move to next after favoriting
    }
  };

  const getDisplayResources = (): Resource[] => {
    if (mode === "favorites") {
      return allResources.filter((resource: Resource) => favorites.includes(resource.id));
    }
    if (mode === "search") {
      return aiResults;
    }
    // In browse mode, filter out skipped resources unless we've seen all
    const availableResources = allResources.filter((resource: Resource) => !skippedResources.includes(resource.id));
    return availableResources.length > 0 ? availableResources : allResources;
  };

  const displayResources: Resource[] = getDisplayResources();
  const currentResource = displayResources[currentIndex];

  if (!config) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {config.description}
          </p>
          
          {/* Mode Toggle and Location Settings - Hidden for Budget */}
          {category !== "budget" && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
              <div className="flex gap-4">
                <Button
                  variant={mode === "browse" ? "default" : "outline"}
                  onClick={handleBrowse}
                >
                  Browse
                </Button>
                <Button
                  variant={mode === "search" ? "default" : "outline"}
                  onClick={() => setMode("search")}
                >
                  AI Search
                </Button>
                <Button
                  variant={mode === "favorites" ? "default" : "outline"}
                  onClick={handleFavorites}
                  className="relative"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Favorites
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              {/* Location Settings */}
              <Dialog open={showLocationSettings} onOpenChange={setShowLocationSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {locationRadius}mi from {REFERENCE_CITIES.find(c => c.id === referenceCity)?.name}
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Location Settings</DialogTitle>
                  <p className="text-sm text-gray-600">
                    Set search radius for {config.title.toLowerCase()} from your chosen East Bay city
                  </p>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reference City</label>
                    <Select value={referenceCity} onValueChange={setReferenceCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REFERENCE_CITIES.map(city => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search Radius</label>
                    <Select 
                      value={locationRadius.toString()} 
                      onValueChange={(value) => setLocationRadius(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_SETTINGS[category]?.options.map(radius => (
                          <SelectItem key={radius} value={radius.toString()}>
                            {radius} miles from {REFERENCE_CITIES.find(c => c.id === referenceCity)?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-gray-500">
                    Distance measured from city center. Different resource types have different default ranges based on typical travel willingness.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          )}

          {/* Reset Button */}
          {category !== "budget" && mode === "browse" && skippedResources.length > 0 && (
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSearch}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset & Review All Again
              </Button>
            </div>
          )}
        </div>

        {/* Budget Category - Special Content */}
        {category === "budget" && <BudgetSection />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Panel */}
          {category !== "budget" && mode === "search" && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    AI Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category === 'services' && (
                    <div>
                      <label className="text-sm font-medium">Service Type</label>
                      <Select value={subcategory} onValueChange={setSubcategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {config.subcategories.map(sub => (
                            <SelectItem key={sub} value={sub}>
                              {sub.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder={config.placeholder}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleSearch} 
                    className="w-full"
                    disabled={aiSearchMutation.isPending || !description.trim()}
                  >
                    {aiSearchMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search with AI
                      </>
                    )}
                  </Button>

                  {aiResults.length > 0 && (
                    <div className="pt-4 border-t">
                      <Badge variant="secondary" className="mb-2">
                        {aiResults.length} results found
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBrowse}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={mode === "search" ? "lg:col-span-3" : "lg:col-span-4"}>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : displayResources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {mode === "search" ? "No results found for your search" : 
                   mode === "favorites" ? "No favorites saved yet" : 
                   `No ${category} available`}
                </p>
                {mode === "favorites" && (
                  <Button 
                    variant="outline" 
                    onClick={handleBrowse}
                    className="mt-4"
                  >
                    Start browsing to add favorites
                  </Button>
                )}
              </div>
            ) : category === "budget" ? (
              /* Budget Tab - Special Layout */
              <BudgetSection />
            ) : (
              <div className="space-y-6">
                {/* Swipe Interface */}
                <div className="relative max-w-2xl mx-auto">
                  <Card className="overflow-hidden">
                    {currentResource && (
                      <div className="relative">
                        <ResourceCard 
                          resource={currentResource} 
                          viewMode="grid"
                          showMatchButton={false}
                        />
                        
                        {/* Swipe Controls */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={swipeLeft}
                            className="bg-white/90 hover:bg-white"
                          >
                            <X className="h-6 w-6" />
                          </Button>
                          <Button
                            size="lg"
                            onClick={swipeRight}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Heart className="h-6 w-6 fill-current" />
                          </Button>
                        </div>

                        {/* Navigation */}
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentIndex(Math.min(displayResources.length - 1, currentIndex + 1))}
                            disabled={currentIndex === displayResources.length - 1}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </div>

                        {/* Progress */}
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary">
                            {currentIndex + 1} / {displayResources.length}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Favorites Mode - Contact Options */}
                {mode === "favorites" && currentResource && (
                  <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Your Favorites - Contact Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <MessagingDialog resource={currentResource} senderId={1} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Browse Filters Dialog */}
      <Dialog open={showBrowseFilters} onOpenChange={setShowBrowseFilters}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Browse Filters</DialogTitle>
            <p className="text-sm text-gray-600">
              Select filters to browse {config.title.toLowerCase()}
            </p>
          </DialogHeader>
          <div className="space-y-4">
            {BROWSE_FILTERS[category] && (
              <>
                {category === 'cast' ? (
                  /* Special multi-select interface for cast demographics */
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Gender</label>
                      <div className="space-y-2">
                        {BROWSE_FILTERS[category].categories.gender.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={browseFilters.castGender?.includes(option) || false}
                              onChange={(e) => {
                                const current = browseFilters.castGender || [];
                                if (e.target.checked) {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castGender: [...current, option]
                                  });
                                } else {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castGender: current.filter(g => g !== option)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ethnicity</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {BROWSE_FILTERS[category].categories.ethnicity.options.map((option) => (
                          <label key={option} className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              checked={browseFilters.castEthnicity?.includes(option) || false}
                              onChange={(e) => {
                                const current = browseFilters.castEthnicity || [];
                                if (e.target.checked) {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castEthnicity: [...current, option]
                                  });
                                } else {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castEthnicity: current.filter(e => e !== option)
                                  });
                                }
                              }}
                              className="rounded border-gray-300 mt-0.5"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Age Range</label>
                      <div className="space-y-2">
                        {BROWSE_FILTERS[category].categories.age.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={browseFilters.castAge?.includes(option) || false}
                              onChange={(e) => {
                                const current = browseFilters.castAge || [];
                                if (e.target.checked) {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castAge: [...current, option]
                                  });
                                } else {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castAge: current.filter(a => a !== option)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Union Status</label>
                      <div className="space-y-2">
                        {BROWSE_FILTERS[category].categories.unionStatus.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={browseFilters.castUnionStatus?.includes(option) || false}
                              onChange={(e) => {
                                const current = browseFilters.castUnionStatus || [];
                                if (e.target.checked) {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castUnionStatus: [...current, option]
                                  });
                                } else {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    castUnionStatus: current.filter(u => u !== option)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : category === 'crew' ? (
                  /* Special multi-select interface for crew department and union status */
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Department</label>
                      <div className="space-y-2">
                        {BROWSE_FILTERS[category].categories.department.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={browseFilters.crewDepartment?.includes(option) || false}
                              onChange={(e) => {
                                const current = browseFilters.crewDepartment || [];
                                if (e.target.checked) {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    crewDepartment: [...current, option]
                                  });
                                } else {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    crewDepartment: current.filter(d => d !== option)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Union Status</label>
                      <div className="space-y-2">
                        {BROWSE_FILTERS[category].categories.unionStatus.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={browseFilters.crewUnionStatus?.includes(option) || false}
                              onChange={(e) => {
                                const current = browseFilters.crewUnionStatus || [];
                                if (e.target.checked) {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    crewUnionStatus: [...current, option]
                                  });
                                } else {
                                  setBrowseFilters({
                                    ...browseFilters,
                                    crewUnionStatus: current.filter(u => u !== option)
                                  });
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard dropdown for other categories */
                  <div>
                    <label className="text-sm font-medium mb-2 block">{BROWSE_FILTERS[category].name}</label>
                    <Select 
                      value={browseFilters.selectedSubcategory || ""} 
                      onValueChange={(value) => setBrowseFilters({
                        ...browseFilters,
                        selectedSubcategory: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${BROWSE_FILTERS[category].name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {BROWSE_FILTERS[category].options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowBrowseFilters(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={applyBrowseFilters}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}