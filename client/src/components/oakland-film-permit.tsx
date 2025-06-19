import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Step 1: Project Basics
  projectTitle: string;
  productionType: string;
  estimatedAirDate: string;
  producerName: string;
  directorName: string;
  
  // Step 2: Contact Information
  contactName: string;
  contactTitle: string;
  phoneNumber: string;
  emailAddress: string;
  
  // Step 3: Crew Information
  locationManagerName: string;
  locationManagerPhone: string;
  locationAssistantName: string;
  locationAssistantPhone: string;
  productionManagerName: string;
  productionManagerPhone: string;
}

const PRODUCTION_TYPES = [
  "Feature",
  "Commercial", 
  "Television",
  "Industrial/Web",
  "Music Video",
  "Still Photography",
  "Short Subject",
  "PSA",
  "Documentary",
  "Student Project"
];

const TOTAL_STEPS = 7;

interface OaklandFilmPermitProps {
  onClose: () => void;
}

export default function OaklandFilmPermit({ onClose }: OaklandFilmPermitProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    projectTitle: "",
    productionType: "",
    estimatedAirDate: "",
    producerName: "",
    directorName: "",
    contactName: "",
    contactTitle: "",
    phoneNumber: "",
    emailAddress: "",
    locationManagerName: "",
    locationManagerPhone: "",
    locationAssistantName: "",
    locationAssistantPhone: "",
    productionManagerName: "",
    productionManagerPhone: ""
  });
  
  const { toast } = useToast();

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('oakland-film-permit-draft', JSON.stringify(formData));
  }, [formData]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('oakland-film-permit-draft');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.projectTitle && formData.productionType && formData.estimatedAirDate && formData.producerName && formData.directorName);
      case 2:
        return !!(formData.contactName && formData.contactTitle && formData.phoneNumber && formData.emailAddress);
      case 3:
        return !!(formData.locationManagerName && formData.locationManagerPhone);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return value;
  };

  const handlePhoneChange = (field: keyof FormData, value: string) => {
    const formatted = formatPhoneNumber(value);
    updateFormData(field, formatted);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                value={formData.projectTitle}
                onChange={(e) => updateFormData('projectTitle', e.target.value)}
                placeholder="Enter your project title"
              />
            </div>
            
            <div>
              <Label>Production Type *</Label>
              <RadioGroup
                value={formData.productionType}
                onValueChange={(value) => updateFormData('productionType', value)}
                className="grid grid-cols-2 gap-2 mt-2"
              >
                {PRODUCTION_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="estimatedAirDate">Estimated Air Date/Print Date *</Label>
              <Input
                id="estimatedAirDate"
                type="date"
                value={formData.estimatedAirDate}
                onChange={(e) => updateFormData('estimatedAirDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="producerName">Producer Name *</Label>
              <Input
                id="producerName"
                value={formData.producerName}
                onChange={(e) => updateFormData('producerName', e.target.value)}
                placeholder="Enter producer name"
              />
            </div>
            
            <div>
              <Label htmlFor="directorName">Director Name *</Label>
              <Input
                id="directorName"
                value={formData.directorName}
                onChange={(e) => updateFormData('directorName', e.target.value)}
                placeholder="Enter director name"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Your Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="contactTitle">Your Title *</Label>
                <Input
                  id="contactTitle"
                  value={formData.contactTitle}
                  onChange={(e) => updateFormData('contactTitle', e.target.value)}
                  placeholder="Your job title"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handlePhoneChange('phoneNumber', e.target.value)}
                placeholder="(555) 123-4567"
                maxLength={14}
              />
            </div>
            
            <div>
              <Label htmlFor="emailAddress">Email Address *</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => updateFormData('emailAddress', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationManagerName">Location Manager Name *</Label>
                <Input
                  id="locationManagerName"
                  value={formData.locationManagerName}
                  onChange={(e) => updateFormData('locationManagerName', e.target.value)}
                  placeholder="Location manager name"
                />
              </div>
              <div>
                <Label htmlFor="locationManagerPhone">Location Manager Phone *</Label>
                <Input
                  id="locationManagerPhone"
                  value={formData.locationManagerPhone}
                  onChange={(e) => handlePhoneChange('locationManagerPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationAssistantName">Location Assistant/Scout Name</Label>
                <Input
                  id="locationAssistantName"
                  value={formData.locationAssistantName}
                  onChange={(e) => updateFormData('locationAssistantName', e.target.value)}
                  placeholder="Assistant name (optional)"
                />
              </div>
              <div>
                <Label htmlFor="locationAssistantPhone">Location Assistant Phone</Label>
                <Input
                  id="locationAssistantPhone"
                  value={formData.locationAssistantPhone}
                  onChange={(e) => handlePhoneChange('locationAssistantPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productionManagerName">Production Manager Name</Label>
                <Input
                  id="productionManagerName"
                  value={formData.productionManagerName}
                  onChange={(e) => updateFormData('productionManagerName', e.target.value)}
                  placeholder="Production manager (optional)"
                />
              </div>
              <div>
                <Label htmlFor="productionManagerPhone">Production Manager Phone</Label>
                <Input
                  id="productionManagerPhone"
                  value={formData.productionManagerPhone}
                  onChange={(e) => handlePhoneChange('productionManagerPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
            <p className="text-gray-600">Additional permit application steps will be available soon.</p>
          </div>
        );
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Oakland Film Permit Application</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {TOTAL_STEPS}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={currentStep === TOTAL_STEPS}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Auto-save indicator */}
          <p className="text-xs text-gray-500 text-center">
            Your progress is automatically saved
          </p>
        </CardContent>
      </Card>
    </div>
  );
}