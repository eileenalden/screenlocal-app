import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, Upload } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      number: "1",
      title: "Browse Resources",
      description: "Explore locations, crew, cast, and services by category or use AI-powered search to find exactly what you need"
    },
    {
      icon: Heart,
      number: "2", 
      title: "Save Favorites",
      description: "Add resources to your favorites and organize your production needs. Build your perfect team and resource list."
    },
    {
      icon: Upload,
      number: "3",
      title: "Connect & Budget",
      description: "Message providers directly to negotiate details and book resources. Upload to your favorite production budget software."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From discovery to production, we streamline your entire workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">{step.number}</span>
                    </div>
                    <Icon className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}