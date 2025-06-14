import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import CategoryCards from "@/components/category-cards";
import ProductionTools from "@/components/production-tools";
import PermitSection from "@/components/permit-section";
import SuccessStories from "@/components/success-stories";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      {/* Quick Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">{stats?.locations || 0}+</div>
              <div className="text-gray-600 font-medium">Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">{stats?.crew || 0}+</div>
              <div className="text-gray-600 font-medium">Crew Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">{stats?.cast || 0}+</div>
              <div className="text-gray-600 font-medium">Cast Profiles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">{stats?.services || 0}+</div>
              <div className="text-gray-600 font-medium">Services</div>
            </div>
          </div>
        </div>
      </section>

      <CategoryCards />
      <PermitSection />
      <ProductionTools />
      <SuccessStories />
      <Footer />
    </div>
  );
}
