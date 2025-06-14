import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import CategoryCards from "@/components/category-cards";
import HowItWorks from "@/components/how-it-works";
import PermitSection from "@/components/permit-section";
import SuccessStories from "@/components/success-stories";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <HowItWorks />
      <CategoryCards />
      <PermitSection />
      <SuccessStories />
      <Footer />
    </div>
  );
}
