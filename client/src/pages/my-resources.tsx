import { useState } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Users, Theater, Cog, Edit, Calendar, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

const resourceTypes = [
  {
    id: "location",
    title: "Location",
    description: "Houses, businesses, outdoor spaces",
    icon: MapPin,
    color: "bg-blue-500",
  },
  {
    id: "crew",
    title: "Crew",
    description: "Directors, camera ops, sound engineers",
    icon: Users,
    color: "bg-green-500",
  },
  {
    id: "talent",
    title: "Talent", 
    description: "Actors, extras, specialty performers",
    icon: Theater,
    color: "bg-purple-500",
  },
  {
    id: "service",
    title: "Service",
    description: "Equipment rental, post-production",
    icon: Cog,
    color: "bg-orange-500",
  },
];

export default function MyResources() {
  const [, setLocation] = useLocation();
  
  const { data: myResources = [], isLoading } = useQuery({
    queryKey: ["/api/my-resources"],
    retry: false,
  });

  const handleCreateNew = (type: string) => {
    setLocation(`/create-resource/${type}/step-1`);
  };

  const handleEditResource = (resourceId: number) => {
    setLocation(`/edit-resource/${resourceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resources</h1>
          <p className="text-gray-600">Manage your listings and availability</p>
        </div>

        {/* Create New Resource Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Resource</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resourceTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCreateNew(type.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <Button size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create {type.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Existing Resources */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Resources</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myResources?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myResources.map((resource: any) => (
                <Card key={resource.id} className="overflow-hidden">
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${resource.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&h=300'})` }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <Badge variant={resource.isActive ? "default" : "secondary"}>
                        {resource.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-orange-500 font-semibold">
                        ${resource.pricePerDay || 0}/day
                      </span>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEditResource(resource.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setLocation(`/calendar/${resource.id}`)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setLocation(`/resource/${resource.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources yet</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Start by creating your first resource listing. It only takes a few minutes.
                </p>
                <Button onClick={() => handleCreateNew('location')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resource
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}