import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, MapPin, Clock, DollarSign } from "lucide-react";

// Sample resource data with placeholder images
const sampleResources = [
  {
    id: 1,
    type: "location",
    title: "Historic Oakland Theater",
    description: "Beautiful 1920s theater perfect for period pieces",
    price: "$500/day",
    location: "Downtown Oakland",
    category: "Interior - Theater",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 2,
    type: "crew",
    title: "Sarah Chen - Cinematographer",
    description: "Award-winning DP with 10+ years experience",
    price: "$800/day",
    location: "Oakland, CA",
    category: "Camera Department",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 3,
    type: "cast",
    title: "Marcus Johnson - Lead Actor",
    description: "Versatile actor with theater and film background",
    price: "$400/day",
    location: "Berkeley, CA",
    category: "Male, 30-39, African American",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 4,
    type: "service",
    title: "Bay Area Equipment Rental",
    description: "Full-service camera and lighting equipment",
    price: "$200/day",
    location: "Emeryville, CA",
    category: "Equipment Rental",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 5,
    type: "location",
    title: "Industrial Warehouse Space",
    description: "Large open space with natural lighting",
    price: "$300/day",
    location: "West Oakland",
    category: "Interior - Warehouse",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    available: true
  },
  {
    id: 6,
    type: "crew",
    title: "Elena Rodriguez - Sound Engineer",
    description: "Professional audio recording and mixing",
    price: "$600/day",
    location: "San Francisco, CA",
    category: "Sound Department",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    available: true
  }
];

const typeColors = {
  location: "bg-blue-100 text-blue-800",
  crew: "bg-green-100 text-green-800",
  cast: "bg-purple-100 text-purple-800",
  service: "bg-orange-100 text-orange-800"
};

export default function ResourceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1200) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => 
        prev >= sampleResources.length - visibleCards ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [visibleCards]);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev >= sampleResources.length - visibleCards ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev <= 0 ? sampleResources.length - visibleCards : prev - 1
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Amazing Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our curated collection of locations, crew, cast, and services. 
            Each resource is carefully verified and ready for your next production.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-8">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                width: `${(sampleResources.length / visibleCards) * 100}%`
              }}
            >
              {sampleResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="flex-shrink-0"
                  style={{ width: `${100 / sampleResources.length}%` }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img
                        src={resource.image}
                        alt={resource.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={typeColors[resource.type as keyof typeof typeColors]}>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-white/90 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {resource.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {resource.category}
                        </div>
                        <div className="flex items-center text-sm font-semibold text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {resource.price}
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        size="sm"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Provider
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: sampleResources.length - visibleCards + 1 }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline">
            Explore All Resources
          </Button>
        </div>
      </div>
    </section>
  );
}