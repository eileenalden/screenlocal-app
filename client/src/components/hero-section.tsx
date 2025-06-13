import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { Wand2, Grid3X3 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

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
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Oakland<br />
            <span className="text-orange-500">Film Production</span><br />
            Matchmaker
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
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
