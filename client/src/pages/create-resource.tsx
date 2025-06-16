import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Upload, MapPin, Users, Theater, Cog } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ResourceFormData {
  type: string;
  title: string;
  description: string;
  pricePerDay: number;
  location: string;
  images: string[];
  // Location specific
  propertyType?: string;
  spaceType?: string;
  interiorExterior?: string;
  linkedLocationId?: number;
  // Talent specific  
  gender?: string;
  ethnicity?: string[];
  ageRange?: string;
  unionStatus?: string;
  // Crew specific
  department?: string[];
  experience?: string;
  // Service specific
  category?: string;
  equipment?: string[];
}

const STEPS = {
  location: [
    { id: 1, title: "Basic Info", description: "Name and description" },
    { id: 2, title: "Property Details", description: "Type and features" },
    { id: 3, title: "Photos", description: "Add images" },
    { id: 4, title: "Pricing", description: "Set your rates" },
    { id: 5, title: "Review", description: "Final review" }
  ],
  talent: [
    { id: 1, title: "Basic Info", description: "Name and bio" },
    { id: 2, title: "Demographics", description: "Age, gender, ethnicity" },
    { id: 3, title: "Photos", description: "Headshots and portfolio" },
    { id: 4, title: "Rates", description: "Set your day rates" },
    { id: 5, title: "Review", description: "Final review" }
  ],
  crew: [
    { id: 1, title: "Basic Info", description: "Name and bio" },
    { id: 2, title: "Expertise", description: "Department and skills" },
    { id: 3, title: "Portfolio", description: "Work samples" },
    { id: 4, title: "Rates", description: "Set your day rates" },
    { id: 5, title: "Review", description: "Final review" }
  ],
  service: [
    { id: 1, title: "Basic Info", description: "Service name and description" },
    { id: 2, title: "Category", description: "Type of service" },
    { id: 3, title: "Gallery", description: "Service images" },
    { id: 4, title: "Pricing", description: "Set your rates" },
    { id: 5, title: "Review", description: "Final review" }
  ]
};

export default function CreateResource() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const resourceType = params.type as string;
  const currentStep = parseInt(params.step as string) || 1;
  const steps = STEPS[resourceType as keyof typeof STEPS] || STEPS.location;
  
  const [formData, setFormData] = useState<ResourceFormData>({
    type: resourceType,
    title: "",
    description: "",
    pricePerDay: 0,
    location: "",
    images: [],
  });

  const createResourceMutation = useMutation({
    mutationFn: async (data: ResourceFormData) => {
      return await apiRequest("/api/resources", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your resource has been created successfully.",
      });
      setLocation("/my-resources");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create resource. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateFormData = (updates: Partial<ResourceFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setLocation(`/create-resource/${resourceType}/step-${currentStep + 1}`);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setLocation(`/create-resource/${resourceType}/step-${currentStep - 1}`);
    } else {
      setLocation("/my-resources");
    }
  };

  const handleSubmit = () => {
    if (currentStep === steps.length) {
      createResourceMutation.mutate(formData);
    } else {
      nextStep();
    }
  };

  const getIcon = (type: string) => {
    const icons = {
      location: MapPin,
      talent: Theater,
      crew: Users,
      service: Cog
    };
    return icons[type as keyof typeof icons] || MapPin;
  };

  const Icon = getIcon(resourceType);
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Listing
          </h1>
          <p className="text-gray-600">Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            {steps.map((step) => (
              <span 
                key={step.id}
                className={step.id <= currentStep ? "text-orange-500 font-medium" : ""}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="title">
                    {resourceType === 'location' ? 'Location Name' : 
                     resourceType === 'talent' ? 'Stage Name / Real Name' :
                     resourceType === 'crew' ? 'Professional Name' : 'Service Name'}
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder={
                      resourceType === 'location' ? 'e.g., Victorian House in Oakland Hills' :
                      resourceType === 'talent' ? 'e.g., Sarah Johnson' :
                      resourceType === 'crew' ? 'e.g., Mike Chen, DP' : 
                      'e.g., Professional Video Editing'
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">
                    {resourceType === 'talent' || resourceType === 'crew' ? 'Bio' : 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder={
                      resourceType === 'location' ? 'Describe your location, its features, and what makes it special...' :
                      resourceType === 'talent' ? 'Tell us about your acting experience, training, and specialties...' :
                      resourceType === 'crew' ? 'Describe your experience, notable projects, and technical skills...' :
                      'Describe your service, what you offer, and your expertise...'
                    }
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                    placeholder="Oakland, CA"
                  />
                </div>
              </>
            )}

            {/* Step 2: Type-specific details */}
            {currentStep === 2 && resourceType === 'location' && (
              <>
                <div>
                  <Label>Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => updateFormData({ propertyType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="outdoor">Outdoor Space</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Interior or Exterior</Label>
                  <Select value={formData.interiorExterior} onValueChange={(value) => updateFormData({ interiorExterior: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select space type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior Only</SelectItem>
                      <SelectItem value="exterior">Exterior Only</SelectItem>
                      <SelectItem value="both">Both Interior & Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 2 && resourceType === 'talent' && (
              <>
                <div>
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Age Range</Label>
                  <Select value={formData.ageRange} onValueChange={(value) => updateFormData({ ageRange: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-9">0-9 (Children)</SelectItem>
                      <SelectItem value="10-19">10-19 (Teens)</SelectItem>
                      <SelectItem value="20-29">20-29 (Young Adults)</SelectItem>
                      <SelectItem value="30-39">30-39 (Adults)</SelectItem>
                      <SelectItem value="40-49">40-49 (Middle Age)</SelectItem>
                      <SelectItem value="50-59">50-59 (Mature)</SelectItem>
                      <SelectItem value="60-69">60-69 (Seniors)</SelectItem>
                      <SelectItem value="70+">70+ (Elderly)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Union Status</Label>
                  <Select value={formData.unionStatus} onValueChange={(value) => updateFormData({ unionStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select union status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sag-aftra">SAG-AFTRA</SelectItem>
                      <SelectItem value="non-union">Non-Union</SelectItem>
                      <SelectItem value="financial-core">Financial Core</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <div>
                <Label htmlFor="price">Day Rate ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => updateFormData({ pricePerDay: parseInt(e.target.value) || 0 })}
                  placeholder="Enter your day rate"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This is what you'll charge per day. You can always adjust this later.
                </p>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Review Your Listing</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium">Title:</span> {formData.title}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {formData.description}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {formData.location}
                  </div>
                  <div>
                    <span className="font-medium">Day Rate:</span> ${formData.pricePerDay}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Once you create this listing, it will be reviewed and published within 24 hours.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createResourceMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {createResourceMutation.isPending ? (
              "Creating..."
            ) : currentStep === steps.length ? (
              "Create Listing"
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}