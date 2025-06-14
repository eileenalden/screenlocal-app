import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, CalendarPlus, FileSpreadsheet } from "lucide-react";

export default function ProductionTools() {
  const [selectedMonth, setSelectedMonth] = useState("March 2024");

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

  const calendarDays = [
    { day: "5", status: "available" },
    { day: "6", status: "available" },
    { day: "7", status: "available" },
    { day: "12", status: "booked" },
    { day: "13", status: "booked" },
    { day: "14", status: "booked" },
    { day: "18", status: "limited" },
    { day: "19", status: "limited" },
    { day: "20", status: "limited" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700";
      case "booked": return "bg-red-100 text-red-700";
      case "limited": return "bg-yellow-100 text-yellow-700";
      default: return "";
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Production Planning Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Export your selected resources to professional budgeting software and check availability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Availability Calendar */}
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-orange-500 mr-3" />
                  Availability Calendar
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Button variant="ghost" size="sm">‹</Button>
                  <span className="font-medium text-gray-900 px-2">{selectedMonth}</span>
                  <Button variant="ghost" size="sm">›</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days - simplified layout */}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 4; // Start from day 1 on a Wednesday
                  if (dayNum < 1 || dayNum > 31) {
                    return <div key={i} className="text-center text-sm text-gray-400 py-2"></div>;
                  }
                  
                  const dayData = calendarDays.find(d => d.day === dayNum.toString());
                  const statusClass = dayData ? getStatusColor(dayData.status) : "";
                  
                  return (
                    <div 
                      key={i} 
                      className={`text-center text-sm py-2 rounded cursor-pointer hover:bg-gray-100 ${statusClass}`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 rounded mr-2"></div>
                  <span className="text-gray-600">Limited</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
                  <span className="text-gray-600">Booked</span>
                </div>
              </div>

              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Schedule Shoot
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
