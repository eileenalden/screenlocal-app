import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FilmingLocation {
  id: string;
  address: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  specialConditions: string;
  contactName: string;
  contactPhone: string;
}

interface DateRange {
  id: string;
  startDate: string;
  endDate: string;
  label: string;
}

interface FormData {
  // Step 1: Project Basics
  projectTitle: string;
  productionType: string;
  filmingDateRanges: DateRange[];
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
  
  // Step 4: Production Company
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyCountry: string;
  companyZip: string;
  companyPhone: string;
  companyEmail: string;
  
  // Step 5: Filming Locations
  filmingLocations: FilmingLocation[];
  
  // Step 6: Project Details
  numCastExtras: number;
  numCrew: number;
  starring: string;
  synopsis: string;
  needsPoliceServices: string;
  needsTrafficControl: string;
  needsReservedParking: string;
  needsDroneUse: string;
  specialEffects: string;
  additionalInfo: string;
  
  // Step 7: Cost Summary & Submit
  insuranceStatus: string;
  agreesToTerms: boolean;
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

const PRODUCTION_RATES: Record<string, number> = {
  "Feature": 245,
  "Television": 306,
  "Commercial": 306,
  "Industrial/Web": 245,
  "Music Video": 122,
  "Still Photography": 92,
  "Short Subject": 61,
  "PSA": 0,
  "Documentary": 245,
  "Student Project": 0
};

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const TOTAL_STEPS = 7;

interface OaklandFilmPermitProps {
  onClose: () => void;
}

export default function OaklandFilmPermit({ onClose }: OaklandFilmPermitProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [formData, setFormData] = useState<FormData>({
    projectTitle: "",
    productionType: "",
    filmingDateRanges: [],
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
    productionManagerPhone: "",
    companyName: "",
    companyAddress: "",
    companyCity: "",
    companyState: "CA",
    companyCountry: "USA",
    companyZip: "",
    companyPhone: "",
    companyEmail: "",
    filmingLocations: [{
      id: "1",
      address: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      specialConditions: "",
      contactName: "",
      contactPhone: ""
    }],
    numCastExtras: 0,
    numCrew: 0,
    starring: "",
    synopsis: "",
    needsPoliceServices: "",
    needsTrafficControl: "",
    needsReservedParking: "",
    needsDroneUse: "",
    specialEffects: "",
    additionalInfo: "",
    insuranceStatus: "",
    agreesToTerms: false
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

  const calculateTotalFilmingDays = () => {
    return formData.filmingDateRanges.reduce((total, range) => {
      if (!range.startDate || !range.endDate) return total;
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
  };

  const calculateCost = () => {
    if (!formData.productionType || formData.filmingDateRanges.length === 0) {
      return { subtotal: 0, surcharge: 0, total: 0, dailyRate: 0, filmingDays: 0, dateRanges: 0 };
    }
    
    const dailyRate = PRODUCTION_RATES[formData.productionType] || 0;
    const filmingDays = calculateTotalFilmingDays();
    const dateRanges = formData.filmingDateRanges.length;
    const subtotal = dailyRate * filmingDays;
    const surcharge = dailyRate > 0 ? subtotal * 0.125 : 0;
    const total = subtotal + surcharge;
    
    return { subtotal, surcharge, total, dailyRate, filmingDays, dateRanges };
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.projectTitle && formData.productionType && formData.filmingDateRanges.length > 0 && formData.estimatedAirDate && formData.producerName && formData.directorName);
      case 2:
        return !!(formData.contactName && formData.contactTitle && formData.phoneNumber && formData.emailAddress);
      case 3:
        return !!(formData.locationManagerName && formData.locationManagerPhone);
      case 4:
        return !!(formData.companyName && formData.companyAddress && formData.companyCity && formData.companyState && formData.companyZip && formData.companyPhone && formData.companyEmail);
      case 5:
        return formData.filmingLocations.some(loc => loc.address && loc.type && loc.date);
      case 6:
        return !!(formData.numCastExtras >= 0 && formData.numCrew >= 0 && formData.synopsis);
      case 7:
        return !!(formData.insuranceStatus && formData.agreesToTerms);
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

  const addFilmingLocation = () => {
    const newLocation: FilmingLocation = {
      id: Date.now().toString(),
      address: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      specialConditions: "",
      contactName: "",
      contactPhone: ""
    };
    setFormData(prev => ({
      ...prev,
      filmingLocations: [...prev.filmingLocations, newLocation]
    }));
  };

  const removeFilmingLocation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      filmingLocations: prev.filmingLocations.filter(loc => loc.id !== id)
    }));
  };

  const updateFilmingLocation = (id: string, field: keyof FilmingLocation, value: string) => {
    setFormData(prev => ({
      ...prev,
      filmingLocations: prev.filmingLocations.map(loc =>
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (startDate === endDate) {
      return endFormatted;
    }
    
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${startFormatted}-${end.getDate()}, ${end.getFullYear()}`;
    }
    
    return `${startFormatted}-${endFormatted}`;
  };

  const addDateRange = () => {
    if (!tempStartDate || !tempEndDate) {
      toast({
        title: "Invalid dates",
        description: "Please select both start and end dates.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(tempStartDate) > new Date(tempEndDate)) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    const newRange: DateRange = {
      id: Date.now().toString(),
      startDate: tempStartDate,
      endDate: tempEndDate,
      label: formatDateRange(tempStartDate, tempEndDate)
    };

    setFormData(prev => ({
      ...prev,
      filmingDateRanges: [...prev.filmingDateRanges, newRange]
    }));

    // Clear the temporary dates but keep the picker open for easier multiple additions
    setTempStartDate("");
    setTempEndDate("");
    
    toast({
      title: "Date range added",
      description: `Added ${newRange.label} to filming schedule.`,
    });
  };

  const removeDateRange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      filmingDateRanges: prev.filmingDateRanges.filter(range => range.id !== id)
    }));
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
            
            {/* Filming Dates Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">Filming Dates *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDatePicker(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Add Filming Dates
                </Button>
              </div>
              
              {/* Selected Date Ranges */}
              {formData.filmingDateRanges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.filmingDateRanges.map((range) => (
                    <div
                      key={range.id}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{range.label}</span>
                      <button
                        type="button"
                        onClick={() => removeDateRange(range.id)}
                        className="hover:bg-blue-200 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Total Days Display */}
              {formData.filmingDateRanges.length > 0 && (
                <div className="text-sm text-gray-600 mb-4">
                  Total filming days: {calculateTotalFilmingDays()} days across {formData.filmingDateRanges.length} date range{formData.filmingDateRanges.length > 1 ? 's' : ''}
                </div>
              )}
              
              {/* Date Picker Modal */}
              {showDatePicker && (
                <Card className="border-2 border-blue-200 p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Add Filming Date Range</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowDatePicker(false);
                        setTempStartDate("");
                        setTempEndDate("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label htmlFor="tempStartDate">Start Date</Label>
                      <Input
                        id="tempStartDate"
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempEndDate">End Date</Label>
                      <Input
                        id="tempEndDate"
                        type="date"
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        min={tempStartDate}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={addDateRange}
                      className="flex-1"
                      disabled={!tempStartDate || !tempEndDate}
                    >
                      Add Date Range
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowDatePicker(false);
                        setTempStartDate("");
                        setTempEndDate("");
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </Card>
              )}
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

  const progressPercentage = currentStep === 1 && !formData.projectTitle ? 0 : (currentStep / TOTAL_STEPS) * 100;
  const cost = calculateCost();

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "Your Oakland Film Permit application has been submitted successfully. You will receive a confirmation email shortly.",
    });
    localStorage.removeItem('oakland-film-permit-draft');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="flex w-full max-w-6xl max-h-[90vh] gap-4">
        {/* Main Form */}
        <Card className="flex-1 overflow-y-auto">
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
              
              {currentStep === TOTAL_STEPS ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  Submit Application
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Auto-save indicator */}
            <p className="text-xs text-gray-500 text-center">
              Your progress is automatically saved
            </p>
          </CardContent>
        </Card>
        
        {/* Sticky Cost Summary */}
        {formData.productionType && formData.filmingDateRanges.length > 0 && (
          <Card className="w-80 h-fit sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Production Type:</span>
                <span className="font-medium">{formData.productionType}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Rate:</span>
                <span className="font-medium">${cost.dailyRate}/day</span>
              </div>
              <div className="flex justify-between">
                <span>Filming Days:</span>
                <span className="font-medium">{cost.filmingDays} days across {cost.dateRanges} range{cost.dateRanges > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${cost.subtotal}</span>
              </div>
              {cost.surcharge > 0 && (
                <div className="flex justify-between">
                  <span>Tech Surcharge (12.5%):</span>
                  <span className="font-medium">${cost.surcharge.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-orange-600">${cost.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}