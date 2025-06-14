/*
 * © Eileen Alden, 2025
 * All rights reserved.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ResourceCard from "@/components/resource-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List, Heart, MessageSquare, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MessagingDialog from "@/components/messaging-dialog";
import type { Resource } from "@shared/schema";

export default function Browse() {
  const [resourceType, setResourceType] = useState<string>("");
  const [serviceSubtype, setServiceSubtype] = useState<string>("");
  const [description, setDescription] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [aiResults, setAiResults] = useState<Resource[]>([]);
  const { toast } = useToast();

  const { data: allResources = [], isLoading } = useQuery({
    queryKey: ['/api/resources'],
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
    if (!resourceType || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a resource type and provide a description",
        variant: "destructive",
      });
      return;
    }

    aiSearchMutation.mutate({
      type: resourceType,
      subtype: resourceType === 'services' ? serviceSubtype : undefined,
      query: description
    });
  };

  const toggleFavorite = (resourceId: number) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const displayResources: Resource[] = aiResults.length > 0 ? aiResults : (allResources || []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* AI Search Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  AI Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="resource-type">Resource Type</Label>
                  <Select value={resourceType} onValueChange={setResourceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="crew">Crew</SelectItem>
                      <SelectItem value="cast">Cast</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {resourceType === 'services' && (
                  <div>
                    <Label htmlFor="service-subtype">Service Category</Label>
                    <Select value={serviceSubtype} onValueChange={setServiceSubtype}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-production">Pre-production</SelectItem>
                        <SelectItem value="equipment-rental">Equipment Rental</SelectItem>
                        <SelectItem value="craft-services">Craft Services</SelectItem>
                        <SelectItem value="post-production">Post-production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need using natural language..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={handleSearch} 
                  className="w-full"
                  disabled={aiSearchMutation.isPending || !resourceType || !description.trim()}
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

                {favorites.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium">Favorites ({favorites.length})</Label>
                    <div className="mt-2 space-y-2">
                      {favorites.map(id => {
                        const resource = displayResources.find((r: Resource) => r.id === id);
                        return resource ? (
                          <div key={id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm truncate">{resource.title}</span>
                            <MessagingDialog resource={resource} senderId={1} />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {aiResults.length > 0 ? 'Search Results' : 'All Resources'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isLoading ? 'Loading...' : `${displayResources.length} resources found`}
                </p>
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

            {aiResults.length > 0 && (
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  AI Search Results for "{resourceType}"
                  {serviceSubtype && ` - ${serviceSubtype}`}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAiResults([]);
                    setDescription("");
                    setResourceType("");
                    setServiceSubtype("");
                  }}
                >
                  Clear search
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {displayResources.map((resource: Resource) => (
                  <div key={resource.id} className="relative">
                    <ResourceCard 
                      resource={resource} 
                      viewMode={viewMode}
                      showMatchButton={false}
                    />
                    <Button
                      size="sm"
                      variant={favorites.includes(resource.id) ? "default" : "outline"}
                      className="absolute top-2 right-2"
                      onClick={() => toggleFavorite(resource.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${favorites.includes(resource.id) ? 'fill-current' : ''}`}
                      />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}