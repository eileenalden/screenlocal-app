import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const filmingImages = [
  {
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Urban Downtown & Waterfront"
  },
  {
    url: "https://images.unsplash.com/photo-1563299796-17596ed6b77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Modern City Architecture"
  },
  {
    url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Bay Area Landscape"
  },
  {
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380",
    caption: "Industrial Film District"
  }
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % filmingImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filmingImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filmingImages.length) % filmingImages.length);
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
            Your Oakland/East Bay<br />
            <span className="text-white drop-shadow-lg">Film Production</span><br />
            Matchmaker
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-3xl mx-auto font-medium">
            Connect with locations, crew, cast, services, permits, and tax rebates. From concept to screen, we've got your production covered.
          </p>
          
          {/* CTA Buttons */}
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg font-semibold mb-4"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started
            </Button>
            
            <div className="text-center">
              <p className="text-white/90">
                Already have an account?{" "}
                <a 
                  href="/api/login" 
                  className="text-white underline hover:no-underline font-medium"
                >
                  Log in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
