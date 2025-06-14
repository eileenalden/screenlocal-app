import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Wand2, Grid3X3 } from "lucide-react";

export default function AISearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleAISearch = () => {
    if (searchQuery.trim()) {
      // Navigate to locations page with search query as URL parameter
      const encodedQuery = encodeURIComponent(searchQuery);
      setLocation(`/locations?query=${encodedQuery}`);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Match
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe your project and let AI help you find the ideal resources, or browse by category
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Textarea
                placeholder="Describe your project: 'Looking for a Victorian house for a period drama, need 3-day shoot with vintage props...'"
                className="w-full p-4 border border-gray-300 rounded-xl resize-none text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleAISearch}
                className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors font-semibold h-auto"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Match
              </Button>
              <div className="text-center">
                <span className="text-gray-500 text-sm">or</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation("/locations")}
                className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl hover:bg-orange-500 hover:text-white transition-colors font-semibold h-auto"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}