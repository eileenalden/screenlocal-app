import { useState } from "react";
import { Button } from "@/components/ui/button";
import EarlyUserModal from "@/components/early-user-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, MapPin, Users, Wrench, FileText, DollarSign } from "lucide-react";

export default function Landing() {
  const [showEarlyUserModal, setShowEarlyUserModal] = useState(false);
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const categories = [
    {
      icon: MapPin,
      title: "Locations",
      description: "Find the perfect filming locations in Oakland and the East Bay"
    },
    {
      icon: Users,
      title: "Crew",
      description: "Connect with experienced local film crew members"
    },
    {
      icon: Camera,
      title: "Cast",
      description: "Discover talented actors and performers for your project"
    },
    {
      icon: Wrench,
      title: "Services",
      description: "Access equipment rental, catering, and production services"
    },
    {
      icon: FileText,
      title: "Permits",
      description: "Navigate filming permits and regulations with ease"
    },
    {
      icon: DollarSign,
      title: "Budget",
      description: "Explore tax incentives and budgeting tools"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ScreenLocal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your Oakland/East Bay Film Production Matchmaker. Connect with local resources, 
            streamline your production, and bring your vision to life.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Browse Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore locations, crew, cast, and services by category or use AI-powered search
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Save Favorites
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add resources to your favorites and organize your production needs
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Connect Directly
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Message providers directly to negotiate details and book resources
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2025 ScreenLocal. All rights reserved.</p>
        </div>
      </div>
      
      <EarlyUserModal 
        isOpen={showEarlyUserModal} 
        onClose={() => setShowEarlyUserModal(false)} 
      />
    </div>
  );
}