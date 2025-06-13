import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ResourceCard from "@/components/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Grid, List } from "lucide-react";
import type { Resource } from "@shared/schema";

export default function Browse() {
  const params = useParams();
  const categoryFromUrl = params?.category;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(categoryFromUrl || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/resources", selectedType, selectedCategory, location, minPrice, maxPrice],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedType && selectedType !== "all") params.append("type", selectedType);
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  const filteredResources = resources.filter((resource: Resource) => 
    !searchQuery || 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Browse {selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Resources"}
          </h1>
          <p className="text-gray-600">
            Discover the perfect resources for your Oakland film production
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Resource Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="location">Locations</SelectItem>
                    <SelectItem value="crew">Crew</SelectItem>
                    <SelectItem value="cast">Cast</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="craft-service">Craft Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              {selectedType && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {selectedType === "location" && (
                        <>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                        </>
                      )}
                      {selectedType === "crew" && (
                        <>
                          <SelectItem value="director">Director</SelectItem>
                          <SelectItem value="dp">Director of Photography</SelectItem>
                          <SelectItem value="sound">Sound Engineer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="gaffer">Gaffer</SelectItem>
                          <SelectItem value="script-supervisor">Script Supervisor</SelectItem>
                          <SelectItem value="producer">Producer</SelectItem>
                        </>
                      )}
                      {selectedType === "cast" && (
                        <>
                          <SelectItem value="lead-male">Lead Actor (Male)</SelectItem>
                          <SelectItem value="lead-female">Lead Actor (Female)</SelectItem>
                          <SelectItem value="supporting">Supporting Cast</SelectItem>
                          <SelectItem value="extra">Extra</SelectItem>
                          <SelectItem value="voice">Voice Actor</SelectItem>
                          <SelectItem value="child">Child Actor</SelectItem>
                        </>
                      )}
                      {selectedType === "service" && (
                        <>
                          <SelectItem value="equipment">Equipment Rental</SelectItem>
                          <SelectItem value="post">Post-Production</SelectItem>
                          <SelectItem value="transport">Transportation</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </>
                      )}
                      {selectedType === "craft-service" && (
                        <>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="coffee">Coffee Service</SelectItem>
                          <SelectItem value="meals">Full Meals</SelectItem>
                          <SelectItem value="snacks">Snacks & Beverages</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Input
                  placeholder="Oakland area..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("");
                  setSelectedCategory("");
                  setMinPrice("");
                  setMaxPrice("");
                  setLocation("");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                {filteredResources.length} results found
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading resources...</div>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No resources found matching your criteria</div>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("");
                    setSelectedCategory("");
                    setMinPrice("");
                    setMaxPrice("");
                    setLocation("");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredResources.map((resource: Resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
