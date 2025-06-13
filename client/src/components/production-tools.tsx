import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar, Percent, Download, CalendarPlus } from "lucide-react";

export default function ProductionTools() {
  const [selectedMonth, setSelectedMonth] = useState("March 2024");

  const costBreakdown = [
    { item: "Location (3 days)", cost: 1200 },
    { item: "Crew (5 members × 3 days)", cost: 4500 },
    { item: "Cast (3 actors × 3 days)", cost: 2250 },
    { item: "Equipment Rental", cost: 1800 },
    { item: "Permits & Insurance", cost: 600 }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0);

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
            Estimate costs, check availability, and manage permits all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cost Estimator */}
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-6 w-6 text-orange-500 mr-3" />
                Cost Estimator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {costBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">{item.item}</span>
                    <span className="font-semibold text-gray-900">${item.cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Estimated Cost</span>
                  <span className="font-bold text-2xl text-orange-500">${totalCost.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">3-day shoot, 8 total resources</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  <Percent className="h-4 w-4 mr-2" />
                  Tax Rebates
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
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
