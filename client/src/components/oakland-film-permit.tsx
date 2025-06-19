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
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName">Production Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                placeholder="Your production company"
              />
            </div>
            
            <div>
              <Label htmlFor="companyAddress">Address *</Label>
              <Input
                id="companyAddress"
                value={formData.companyAddress}
                onChange={(e) => updateFormData('companyAddress', e.target.value)}
                placeholder="Street address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyCity">City *</Label>
                <Input
                  id="companyCity"
                  value={formData.companyCity}
                  onChange={(e) => updateFormData('companyCity', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="companyState">State *</Label>
                <Select value={formData.companyState} onValueChange={(value) => updateFormData('companyState', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyCountry">Country *</Label>
                <Input
                  id="companyCountry"
                  value={formData.companyCountry}
                  onChange={(e) => updateFormData('companyCountry', e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div>
                <Label htmlFor="companyZip">Zip Code *</Label>
                <Input
                  id="companyZip"
                  value={formData.companyZip}
                  onChange={(e) => updateFormData('companyZip', e.target.value)}
                  placeholder="Zip code"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyPhone">Company Phone *</Label>
                <Input
                  id="companyPhone"
                  value={formData.companyPhone}
                  onChange={(e) => handlePhoneChange('companyPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                  maxLength={14}
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => updateFormData('companyEmail', e.target.value)}
                  placeholder="company@example.com"
                />
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Filming Locations</Label>
              <Button
                type="button"
                onClick={addFilmingLocation}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Location
              </Button>
            </div>
            
            {formData.filmingLocations.map((location, index) => (
              <Card key={location.id} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Location {index + 1}</h4>
                  {formData.filmingLocations.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeFilmingLocation(location.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4">
                  <div>
                    <Label>Location/Address *</Label>
                    <Input
                      value={location.address}
                      onChange={(e) => updateFilmingLocation(location.id, 'address', e.target.value)}
                      placeholder="Full address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Type *</Label>
                      <Select 
                        value={location.type} 
                        onValueChange={(value) => updateFilmingLocation(location.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interior">Interior</SelectItem>
                          <SelectItem value="exterior">Exterior</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={location.date}
                        onChange={(e) => updateFilmingLocation(location.id, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={location.startTime}
                        onChange={(e) => updateFilmingLocation(location.id, 'startTime', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={location.endTime}
                        onChange={(e) => updateFilmingLocation(location.id, 'endTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Special Conditions</Label>
                      <Input
                        value={location.specialConditions}
                        onChange={(e) => updateFilmingLocation(location.id, 'specialConditions', e.target.value)}
                        placeholder="Any special requirements"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Location Contact Name</Label>
                      <Input
                        value={location.contactName}
                        onChange={(e) => updateFilmingLocation(location.id, 'contactName', e.target.value)}
                        placeholder="Contact person"
                      />
                    </div>
                    <div>
                      <Label>Location Contact Phone</Label>
                      <Input
                        value={location.contactPhone}
                        onChange={(e) => updateFilmingLocation(location.id, 'contactPhone', formatPhoneNumber(e.target.value))}
                        placeholder="(555) 123-4567"
                        maxLength={14}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numCastExtras">Number of Cast and Extras *</Label>
                <Input
                  id="numCastExtras"
                  type="number"
                  min="0"
                  value={formData.numCastExtras}
                  onChange={(e) => updateFormData('numCastExtras', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="numCrew">Number of Crew *</Label>
                <Input
                  id="numCrew"
                  type="number"
                  min="0"
                  value={formData.numCrew}
                  onChange={(e) => updateFormData('numCrew', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="starring">Starring</Label>
              <Input
                id="starring"
                value={formData.starring}
                onChange={(e) => updateFormData('starring', e.target.value)}
                placeholder="Main cast members"
              />
            </div>
            
            <div>
              <Label htmlFor="synopsis">Synopsis *</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => updateFormData('synopsis', e.target.value)}
                placeholder="Brief description of your project"
                rows={4}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Police Services needed?</Label>
                <RadioGroup
                  value={formData.needsPoliceServices}
                  onValueChange={(value) => updateFormData('needsPoliceServices', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="police-yes" />
                    <Label htmlFor="police-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="police-no" />
                    <Label htmlFor="police-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-base font-medium">Traffic Control needed?</Label>
                <RadioGroup
                  value={formData.needsTrafficControl}
                  onValueChange={(value) => updateFormData('needsTrafficControl', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="traffic-yes" />
                    <Label htmlFor="traffic-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="traffic-no" />
                    <Label htmlFor="traffic-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-base font-medium">Reserved Parking needed?</Label>
                <RadioGroup
                  value={formData.needsReservedParking}
                  onValueChange={(value) => updateFormData('needsReservedParking', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="parking-yes" />
                    <Label htmlFor="parking-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="parking-no" />
                    <Label htmlFor="parking-no">No</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-600 mt-1">Note: Parking diagram may be required</p>
              </div>
              
              <div>
                <Label className="text-base font-medium">Drone Use?</Label>
                <RadioGroup
                  value={formData.needsDroneUse}
                  onValueChange={(value) => updateFormData('needsDroneUse', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="drone-yes" />
                    <Label htmlFor="drone-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="drone-no" />
                    <Label htmlFor="drone-no">No</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-600 mt-1">Note: Reviewed case-by-case. Required for drone filming on, from, within, and over City property</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialEffects">Special Effects or Stunts</Label>
              <Textarea
                id="specialEffects"
                value={formData.specialEffects}
                onChange={(e) => updateFormData('specialEffects', e.target.value)}
                placeholder="Describe any special effects, stunts, or hazardous activities"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Additional Information about your project</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                placeholder="Any other relevant information"
                rows={3}
              />
            </div>
          </div>
        );
        
      case 7:
        const cost = calculateCost();
        return (
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <Card className="bg-blue-50 border-blue-200">
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
                <div className="flex justify-between">
                  <span>Technology Surcharge (12.5%):</span>
                  <span className="font-medium">${cost.surcharge.toFixed(2)}</span>
                </div>
                <hr className="border-blue-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Permit Cost:</span>
                  <span className="text-orange-600">${cost.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Fee Reference Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fee Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Feature: $245/day</div>
                  <div>TV/Commercial: $306/day</div>
                  <div>Industrial/Web: $245/day</div>
                  <div>Music Video: $122/day</div>
                  <div>Short Film: $61/day</div>
                  <div>Still Photo: $92/day</div>
                  <div>Student/PSA: FREE</div>
                  <div className="text-gray-600">+ 12.5% tech fee</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Insurance Status */}
            <div>
              <Label className="text-base font-medium">Insurance Status *</Label>
              <RadioGroup
                value={formData.insuranceStatus}
                onValueChange={(value) => updateFormData('insuranceStatus', value)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="included" id="insurance-included" />
                  <Label htmlFor="insurance-included">Proof of Insurance included</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-ready" id="insurance-not-ready" />
                  <Label htmlFor="insurance-not-ready">Insurance documents not yet ready</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="on-file" id="insurance-on-file" />
                  <Label htmlFor="insurance-on-file">Have insurance on file with Oakland Film Office</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="need-help" id="insurance-need-help" />
                  <Label htmlFor="insurance-need-help">Don't understand insurance requirements</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreesToTerms}
                onCheckedChange={(checked) => updateFormData('agreesToTerms', !!checked)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to abide by Oakland Film Office Terms & Conditions *
              </Label>
            </div>
          </div>
        );
        
        default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-4">Step Complete</h3>
            <p className="text-gray-600">This step has been completed.</p>
          </div>
        );
    }
  };

  const progressPercentage = currentStep === 1 && !formData.projectTitle ? 0 : (currentStep / TOTAL_STEPS) * 100;
  const cost = calculateCost();

  const handleSubmit = () => {
    const applicationNumber = `OFP-${Date.now().toString().slice(-6)}`;
    toast({
      title: "Application Submitted Successfully",
      description: `Your Oakland Film Permit application #${applicationNumber} has been submitted. You will receive a confirmation email shortly.`,
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