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
import { Search, Heart, MessageSquare, Loader2, ChevronLeft, ChevronRight, X, RefreshCw, BookOpen, MapPin, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MessagingDialog from "@/components/messaging-dialog";
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
  'tax-rebates': {
    title: "Tax Rebates",
    description: "Film tax incentives and rebates",
    subcategories: ["state", "city", "county", "federal", "production", "post-production"],
    placeholder: "Describe your tax rebate needs: 'California film incentive application' or 'Local production rebates'..."
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
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [skippedResources, setSkippedResources] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
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
    setMode("browse");
    setAiResults([]);
    setDescription("");
    setSubcategory("");
    setCurrentIndex(0);
    setShowFavorites(false);
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
          
          {/* Mode Toggle and Location Settings */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex gap-4">
              <Button
                variant={mode === "browse" ? "default" : "outline"}
                onClick={handleBrowse}
              >
                Browse All
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
                  {locationRadius} mile radius
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Location Settings</DialogTitle>
                  <p className="text-sm text-gray-600">
                    Set search radius for {config.title.toLowerCase()}
                  </p>
                </DialogHeader>
                <div className="space-y-4">
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
                            {radius} miles
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-gray-500">
                    Different resource types have different default ranges. Locations typically need closer proximity, while cast and crew can travel further.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Reset Button */}
          {mode === "browse" && skippedResources.length > 0 && (
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Panel */}
          {mode === "search" && (
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

      <Footer />
    </div>
  );
}