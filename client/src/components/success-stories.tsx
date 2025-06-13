import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

const stories = [
  {
    id: 1,
    title: "The Neighborhood",
    description: "Found the perfect Oakland locations and crew for our indie feature. The AI matching saved us weeks of searching.",
    author: "Maria Rodriguez",
    role: "Director",
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 2,
    title: "Oakland Tourism Ad",
    description: "The permit process was seamless and we saved 20% with the tax rebate calculator. Amazing platform!",
    author: "James Park",
    role: "Producer",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 3,
    title: "Music Video Series",
    description: "Connected with amazing local talent and found unique Oakland locations. Our videos went viral!",
    author: "Alex Thompson",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  }
];

export default function SuccessStories() {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how FilmMatch Oakland has helped bring projects to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="bg-gray-800 border-gray-700 rounded-2xl overflow-hidden">
              <div 
                className="h-32 bg-cover bg-center"
                style={{ backgroundImage: `url(${story.image})` }}
              />
              <CardContent className="p-6">
                <h4 className="font-semibold text-lg text-white mb-2">{story.title}</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  "{story.description}"
                </p>
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 bg-gray-600 mr-3" />
                  <div>
                    <div className="font-medium text-sm text-white">{story.author}</div>
                    <div className="text-gray-400 text-xs">{story.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
