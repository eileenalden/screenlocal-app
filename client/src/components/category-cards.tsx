import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useLocation } from "wouter";
import { MapPin, Users, Theater, Cog, FileText, Percent, Wand2, Grid3X3 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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

export default function CategoryCards() {
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
                    Browse All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
