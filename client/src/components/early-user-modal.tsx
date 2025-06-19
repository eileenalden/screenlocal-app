import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Film, MapPin, Lightbulb, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EarlyUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  email: string;
  userType: string;
  challenge: string;
  wantedFeatures: string[];
  name: string;
  company: string;
}

const USER_TYPES = [
  "Filmmaker/Producer",
  "Location Owner",
  "Crew Member",
  "Service Provider",
  "Student/Film School",
  "Other"
];

const FEATURE_OPTIONS = [
  "Better Location Finding",
  "Easier Permitting",
  "Crew Networking", 
  "Equipment Rental",
  "Budget Planning",
  "Other"
];

export default function EarlyUserModal({ isOpen, onClose }: EarlyUserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    userType: "",
    challenge: "",
    wantedFeatures: [],
    name: "",
    company: ""
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  if (!isOpen) return null;

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = formData.wantedFeatures;
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    updateFormData('wantedFeatures', newFeatures);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.userType) {
      newErrors.userType = "Please select your role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Store data in localStorage
    const earlyUser = {
      id: Date.now(),
      email: formData.email,
      userType: formData.userType,
      challenge: formData.challenge,
      wantedFeatures: formData.wantedFeatures,
      name: formData.name,
      company: formData.company,
      submittedAt: new Date().toISOString()
    };

    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('earlyUsers') || '[]');
    existingUsers.push(earlyUser);
    localStorage.setItem('earlyUsers', JSON.stringify(existingUsers));

    toast({
      title: "Thanks for joining!",
      description: "We'll be in touch soon with updates on ScreenLocal's development.",
    });

    // Reset form and close modal
    setFormData({
      email: "",
      userType: "",
      challenge: "",
      wantedFeatures: [],
      name: "",
      company: ""
    });
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-orange-600">
              Help Us Build the Future of Film Production!
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600">
            ScreenLocal is in demo stage. Whether you're a filmmaker, location owner, crew member, or service provider - we want to build exactly what you need.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="your@email.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* User Type */}
            <div>
              <Label htmlFor="userType">I am a: *</Label>
              <Select value={formData.userType} onValueChange={(value) => updateFormData('userType', value)}>
                <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {USER_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType}</p>}
            </div>

            {/* Challenge */}
            <div>
              <Label htmlFor="challenge">What's your biggest challenge in film production?</Label>
              <Textarea
                id="challenge"
                value={formData.challenge}
                onChange={(e) => updateFormData('challenge', e.target.value)}
                placeholder="Finding locations, getting permits, hiring crew, managing budgets..."
                rows={3}
              />
            </div>

            {/* Wanted Features */}
            <div>
              <Label className="text-base font-medium">What feature would you want to see first?</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {FEATURE_OPTIONS.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.wantedFeatures.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Project (optional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  placeholder="Your company or project"
                />
              </div>
            </div>

            {/* Incentives */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Film className="h-4 w-4 text-orange-600" />
                    <span>Be first to access new features</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span>List your locations/services for free during beta</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 text-orange-600" />
                    <span>Help shape the product with your feedback</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Rocket className="h-4 w-4 text-orange-600" />
                    <span>Get exclusive launch benefits</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
              size="lg"
            >
              Join Our Launch Community
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}