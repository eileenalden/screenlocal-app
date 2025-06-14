import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { MapPin, Users, Theater, Cog, FileText, Percent, Wand2, Grid3X3, Lock, Eye } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const categories = [
  {
    id: "location",
    title: "Locations",
    description: "Studios, warehouses, homes, and iconic spots",
    icon: MapPin,
    count: "250+ available",
    price: "From $200/day",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/locations"
  },
  {
    id: "crew",
    title: "Crew",
    description: "Directors, DPs, sound engineers, and technical specialists",
    icon: Users,
    count: "150+ professionals",
    price: "From $300/day",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/crew"
  },
  {
    id: "cast",
    title: "Cast",
    description: "Actors, extras, and specialty performers",
    icon: Theater,
    count: "300+ profiles",
    price: "From $150/day",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/cast"
  },
  {
    id: "service",
    title: "Services",
    description: "Equipment rental, post-production, and craft services",
    icon: Cog,
    count: "75+ services",
    price: "Custom pricing",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/services"
  },
  {
    id: "permit",
    title: "Permits",
    description: "Filming permits, location clearances, and legal documentation",
    icon: FileText,
    count: "All agencies",
    price: "From $100",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/permits"
  },
  {
    id: "budget",
    title: "Budget",
    description: "Tax incentives, rebate programs, and budgeting software",
    icon: Percent,
    count: "Multiple tools",
    price: "Save up to 30%",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/budget"
  }
];

// Mock preview results for unauthenticated users
const PREVIEW_RESULTS = [
  {
    id: 1,
    name: "Victorian House with Period Details",
    type: "location",
    price: "$400/day",
    location: "Oakland Hills",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 2,
    name: "Industrial Warehouse Space",
    type: "location", 
    price: "$600/day",
    location: "West Oakland",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 3,
    name: "Retro Diner Interior",
    type: "location",
    price: "$350/day", 
    location: "Downtown Oakland",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&h=300"
  },
  {
    id: 4,
    name: "Classic American Diner",
    type: "location",
    price: "$425/day",
    location: "Berkeley",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&h=300"
  }
];

export default function CategoryCards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewSummary, setPreviewSummary] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const previewSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      // Simulate AI analysis for preview
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        summary: `I found several locations perfect for filming retro diner scenes in the Oakland area. These venues offer authentic vintage atmospheres with period-appropriate fixtures and décor.`,
        matchCount: 4,
        results: PREVIEW_RESULTS
      };
    },
    onSuccess: (data) => {
      setPreviewSummary(data.summary);
      setMatchCount(data.matchCount);
      setShowPreview(true);
    },
    onError: () => {
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });

  const handleAISearch = () => {
    if (searchQuery.trim()) {
      previewSearchMutation.mutate(searchQuery);
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Your Oakland Production
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our curated collection of locations, talent, and services specifically for Oakland filmmakers
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto mb-8"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <CarouselItem key={category.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link href={category.href}>
                    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group h-full">
                      <div 
                        className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Icon className="h-5 w-5 text-orange-500 mr-3" />
                          <h3 className="font-semibold text-lg text-gray-900">{category.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{category.count}</span>
                          <span className="text-orange-500 font-semibold text-sm">{category.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Integrated AI Search Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              Can't find what you need browsing? Let AI help you find the perfect match from these categories
            </p>
          </div>
          
          <Card className="bg-white rounded-2xl shadow-lg border-2 border-orange-100">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Textarea
                    placeholder="Try: 'Where can I film a retro diner scene in Oakland?' or 'Need a Victorian house for period drama...'"
                    className="w-full p-4 border border-gray-300 rounded-xl resize-none text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={handleAISearch}
                    disabled={previewSearchMutation.isPending}
                    className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors font-semibold h-auto disabled:opacity-70"
                  >
                    {previewSearchMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Try AI Search
                      </>
                    )}
                  </Button>
                  <div className="text-center">
                    <span className="text-gray-500 text-sm">or</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/api/login'}
                    className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-colors font-semibold h-auto"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Sign Up to Browse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Preview Results */}
          {showPreview && (
            <div className="mt-8 max-w-4xl mx-auto">
              <Card className="bg-white rounded-2xl shadow-xl border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Eye className="h-5 w-5 text-orange-500 mr-2" />
                      <h3 className="font-semibold text-lg text-gray-900">AI Search Preview</h3>
                    </div>
                    <p className="text-gray-700 mb-4">{previewSummary}</p>
                    <p className="text-orange-600 font-medium">
                      I found {matchCount} locations that match your search
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {PREVIEW_RESULTS.map((result) => (
                      <div key={result.id} className="relative">
                        <Card className="overflow-hidden bg-gray-100">
                          <div className="relative">
                            <div 
                              className="h-40 bg-cover bg-center filter blur-sm"
                              style={{ backgroundImage: `url(${result.image})` }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <Lock className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="filter blur-sm">
                              <h4 className="font-semibold text-gray-900 mb-1">{result.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{result.location}</p>
                              <p className="text-orange-600 font-medium">{result.price}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center bg-orange-50 rounded-xl p-6">
                    <Lock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Sign up to view full matches and contact info</h4>
                    <p className="text-gray-600 mb-4">Get complete details, pricing, availability, and direct contact with providers</p>
                    <Button 
                      onClick={() => window.location.href = '/api/login'}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                    >
                      Sign Up Now - It's Free
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
