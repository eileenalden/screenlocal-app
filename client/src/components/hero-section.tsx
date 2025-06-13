import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { Wand2, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const oaklandImages = [
  {
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Oakland Downtown & Lake Merritt"
  },
  {
    url: "https://images.unsplash.com/photo-1563299796-17596ed6b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Oakland City Architecture"
  },
  {
    url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Bay Area Urban Landscape"
  },
  {
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Oakland Industrial District"
  }
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % oaklandImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % oaklandImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + oaklandImages.length) % oaklandImages.length);
  };

  const aiMatchMutation = useMutation({
    mutationFn: async (query: string) => {
      return apiRequest("POST", "/api/ai-match", {
        projectDescription: query,
        projectType: "feature",
        budget: 50000
      });
    },
    onSuccess: (data) => {
      // Handle AI match results - could navigate to results page
      console.log("AI matches:", data);
    },
  });

  const handleAISearch = () => {
    if (searchQuery.trim()) {
      aiMatchMutation.mutate(searchQuery);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-orange-500/80 to-amber-500/90"></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        {/* Oakland Themed Geometric Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-lg rotate-45 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Oakland<br />
            <span className="text-white drop-shadow-lg">Film Production</span><br />
            Matchmaker
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-3xl mx-auto font-medium">
            Connect with locations, crew, cast, and services in Oakland. From concept to screen, we've got your production covered.
          </p>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Textarea
                  placeholder="Describe your project: 'Looking for a Victorian house in Oakland for a period drama, need 3-day shoot with vintage props...'"
                  className="w-full p-4 border border-gray-300 rounded-xl resize-none text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleAISearch}
                  disabled={aiMatchMutation.isPending}
                  className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors font-semibold h-auto"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {aiMatchMutation.isPending ? "Matching..." : "AI Match"}
                </Button>
                <div className="text-center">
                  <span className="text-gray-500 text-sm">or</span>
                </div>
                <Link href="/browse">
                  <Button
                    variant="outline"
                    className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-colors font-semibold h-auto w-full"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
