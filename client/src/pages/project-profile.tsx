import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Camera, Users, MapPin, Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProjectProfile() {
  const { toast } = useToast();
  
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    type: "",
    genre: "",
    budget: "",
    location: "Oakland, CA",
    requirements: {
      locations: [],
      crew: [],
      cast: [],
      services: []
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      toast({
        title: "Project Created",
        description: "Your project profile has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      ...projectData,
      filmmakerId: 1, // Placeholder - would come from auth
      budget: projectData.budget ? parseFloat(projectData.budget) : null,
    });
  };

  const updateProjectData = (field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Project Profile</h1>
          <p className="text-gray-600">
            Tell us about your project to get matched with the perfect Oakland resources
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 text-orange-500 mr-2" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter your project title"
                    value={projectData.title}
                    onChange={(e) => updateProjectData("title", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Project Type *</Label>
                  <Select value={projectData.type} onValueChange={(value) => updateProjectData("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature Film</SelectItem>
                      <SelectItem value="short">Short Film</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="music_video">Music Video</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    placeholder="Drama, Comedy, Action, etc."
                    value={projectData.genre}
                    onChange={(e) => updateProjectData("genre", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Total budget"
                    value={projectData.budget}
                    onChange={(e) => updateProjectData("budget", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, vision, and what makes it unique..."
                  rows={4}
                  value={projectData.description}
                  onChange={(e) => updateProjectData("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                Location Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Primary Location</Label>
                  <Input
                    id="location"
                    value={projectData.location}
                    onChange={(e) => updateProjectData("location", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Location Types Needed</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {["Studio", "House", "Warehouse", "Outdoor", "Office", "Restaurant", "Street", "Other"].map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crew Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 text-orange-500 mr-2" />
                Crew & Cast Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Crew Positions</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {["Director of Photography", "Sound Engineer", "Gaffer", "Script Supervisor", "Editor", "Producer"].map((position) => (
                      <Button
                        key={position}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {position}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Cast Requirements</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {["Lead Actor (Male)", "Lead Actor (Female)", "Supporting Cast", "Extras", "Voice Actor", "Child Actor"].map((role) => (
                      <Button
                        key={role}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                Production Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Preferred Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Preferred End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button 
              type="submit" 
              disabled={createProjectMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project & Find Matches"}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
