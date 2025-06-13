import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin, Users, Theater, Cog } from "lucide-react";

const categories = [
  {
    id: "location",
    title: "Locations",
    description: "Studios, warehouses, homes, and iconic Oakland spots",
    icon: MapPin,
    count: "250+ available",
    price: "From $200/day",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/browse/location"
  },
  {
    id: "crew",
    title: "Crew",
    description: "Directors, DPs, sound engineers, and technical specialists",
    icon: Users,
    count: "150+ professionals",
    price: "From $300/day",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/browse/crew"
  },
  {
    id: "cast",
    title: "Cast",
    description: "Actors, extras, and specialty performers",
    icon: Theater,
    count: "300+ profiles",
    price: "From $150/day",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/browse/cast"
  },
  {
    id: "service",
    title: "Services",
    description: "Post-production, equipment rental, and specialized services",
    icon: Cog,
    count: "50+ services",
    price: "Custom pricing",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    href: "/browse/service"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={category.href}>
                <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
