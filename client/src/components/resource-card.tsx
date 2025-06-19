import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, Heart, Info, User, Play, Camera, MessageSquare } from "lucide-react";
import MessagingDialog from "@/components/messaging-dialog";
import type { Resource } from "@shared/schema";

interface ResourceCardProps {
  resource: Resource;
  viewMode?: "grid" | "list";
  showMatchButton?: boolean;
  onToggleFavorite?: (resourceId: number) => void;
  isFavorite?: boolean;
}

export default function ResourceCard({ resource, viewMode = "grid", showMatchButton = false, onToggleFavorite, isFavorite = false }: ResourceCardProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "crew": return User;
      case "cast": return Play;
      case "service": return Camera;
      default: return Info;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "text-green-600" : "text-gray-400";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Available" : "Unavailable";
  };

  const ResourceIcon = getResourceIcon(resource.type);
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
  const imageUrl = resource.images && resource.images.length > 0 ? resource.images[0] : defaultImage;

  if (viewMode === "list") {
    return (
      <Card className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div 
              className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span className="text-sm font-medium">{resource.rating || "0.0"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{resource.type}</Badge>
                  {resource.category && <Badge variant="outline">{resource.category}</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-semibold">
                    ${resource.pricePerDay || "0"}/{resource.priceType || "day"}
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(resource.isActive || false)}`}>
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    {getStatusText(resource.isActive || false)}
                  </span>
                  <MessagingDialog resource={resource} senderId={1} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div 
        className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-lg text-gray-900 truncate">{resource.title}</h4>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 mr-1 fill-current" />
            <span className="text-sm font-medium">{resource.rating || "0.0"}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {resource.type === 'permit' ? (
              <>
                <span className="text-orange-500 font-semibold">
                  {resource.amenities?.find(a => a.startsWith('cost:'))?.replace('cost:', '') || 
                   (resource.pricePerDay > 0 ? `$${resource.pricePerDay} ${resource.priceType}` : 'Varies')}
                </span>
                <span className="text-sm text-gray-600 mt-1">
                  {resource.amenities?.find(a => a.startsWith('processing_time:'))?.replace('processing_time:', '') || 'Processing time varies'}
                </span>
              </>
            ) : (
              <span className="text-orange-500 font-semibold">
                ${resource.pricePerDay || "0"}/{resource.priceType || "day"}
              </span>
            )}
            {resource.category && (
              <Badge variant="outline" className="mt-1 w-fit">
                {resource.category}
              </Badge>
            )}
          </div>
          <span className={`text-sm font-medium ${getStatusColor(resource.isActive || false)}`}>
            <CheckCircle className="h-4 w-4 inline mr-1" />
            {resource.type === 'permit' ? 
              (resource.amenities?.find(a => a.startsWith('status:'))?.replace('status:', '') || getStatusText(resource.isActive || false)) :
              getStatusText(resource.isActive || false)
            }
          </span>
        </div>
        
        <div className="flex gap-2">
          {resource.type === 'permit' ? (
            <Button 
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium"
              disabled={!resource.isActive}
            >
              {resource.amenities?.find(a => a.startsWith('button:'))?.replace('button:', '') || 'Apply Now'}
            </Button>
          ) : showMatchButton ? (
            <Button className="flex-1 bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium">
              <Heart className="h-3 w-3 mr-1" />
              Match
            </Button>
          ) : (
            <Button className="flex-1 bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium">
              View Details
            </Button>
          )}
          {resource.type !== 'permit' && <MessagingDialog resource={resource} senderId={1} />}
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3"
            onClick={() => onToggleFavorite?.(resource.id)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
