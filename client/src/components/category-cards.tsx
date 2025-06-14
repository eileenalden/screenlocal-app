import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin, Users, Theater, Cog, FileText, Percent } from "lucide-react";
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
    id: "tax-rebate",
    title: "Tax Rebates",
    description: "State and local film tax incentives and rebate programs",
    icon: Percent,
    count: "Multiple programs",
    price: "Up to 30% back",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/tax-rebates"
  }
];

export default function CategoryCards() {
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
          className="w-full max-w-6xl mx-auto"
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
      </div>
    </section>
  );
}
