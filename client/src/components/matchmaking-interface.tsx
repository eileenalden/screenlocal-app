import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ResourceCard from "./resource-card";
import { Grid3X3, Layers3 } from "lucide-react";

export default function MatchmakingInterface() {
  const [filters, setFilters] = useState({
    projectType: "",
    budgetMin: "",
    budgetMax: "",
    startDate: "",
    endDate: "",
    locationTypes: [] as string[]
  });

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/resources", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.budgetMin) params.append("minPrice", filters.budgetMin);
      if (filters.budgetMax) params.append("maxPrice", filters.budgetMax);
      
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  const updateFilters = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show only first 4 resources for the home page preview
  const displayResources = resources.slice(0, 4);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Smart Matching for Your Project
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Swipe through curated matches or browse by category. Our AI learns your preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Filter Your Search</h3>
              
              <div className="space-y-4">
                {/* Project Type */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Project Type</Label>
                  <Select value={filters.projectType} onValueChange={(value) => updateFilters("projectType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
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

                {/* Budget Range */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Budget Range</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin}
                      onChange={(e) => updateFilters("budgetMin", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax}
                      onChange={(e) => updateFilters("budgetMax", e.target.value)}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Shoot Dates</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => updateFilters("startDate", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => updateFilters("endDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Location Types */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Location Type</Label>
                  <div className="space-y-2 mt-2">
                    {["Indoor", "Outdoor", "Studio"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={type}
                          checked={filters.locationTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFilters("locationTypes", [...filters.locationTypes, type]);
                            } else {
                              updateFilters("locationTypes", filters.locationTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm text-gray-600">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Right: Match Results */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-gray-900">Your Matches</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Layers3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading matches...</div>
              </div>
            ) : displayResources.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No matches found</div>
                <Button variant="outline">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    viewMode="grid"
                    showMatchButton={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
