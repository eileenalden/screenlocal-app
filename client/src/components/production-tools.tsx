import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileSpreadsheet } from "lucide-react";

export default function ProductionTools() {

  const budgetingTools = [
    {
      name: "Saturation.io",
      description: "Modern cloud-based budgeting and scheduling platform",
      logo: "🎬",
      popular: true
    },
    {
      name: "Movie Magic Budgeting",
      description: "Industry-standard budgeting software by Entertainment Partners",
      logo: "✨",
      popular: true
    },
    {
      name: "Showbiz Budgeting",
      description: "Professional film and TV budgeting solution",
      logo: "🎭",
      popular: false
    },
    {
      name: "Hot Budget",
      description: "Streamlined budgeting for independent productions",
      logo: "🔥",
      popular: false
    }
  ];

  const handleExportToTool = (toolName: string) => {
    // This would integrate with SSO and export selected resources
    console.log(`Exporting selected resources to ${toolName}`);
    // Implementation would pass favorites/selected resources to the budgeting tool
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Production Planning Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Export your selected resources to professional budgeting software for detailed cost analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Budgeting Software Integration */}
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="h-6 w-6 text-orange-500 mr-3" />
                Export to Budgeting Software
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Send your selected resources directly to industry-standard budgeting platforms for detailed cost analysis and scheduling.
              </p>

              <div className="space-y-4">
                {budgetingTools.map((tool, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{tool.logo}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            {tool.name}
                            {tool.popular && (
                              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">Popular</span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExportToTool(tool.name)}
                        className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> SSO integration will automatically transfer your selected locations, crew, cast, and services with pricing information to your chosen budgeting platform.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
