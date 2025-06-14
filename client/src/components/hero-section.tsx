import { Button } from "@/components/ui/button";
import heroImage from "@assets/iStock-1606622096_1749920695443.jpg";

export default function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Hero Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-45" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-8 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)' }}>
            Your Oakland/East Bay<br />
            Film Production Matchmaker
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)' }}>
            Connect with local crew, cast, locations, and services. From concept to screen, we've got your production covered.
          </p>
          
          {/* CTA Button */}
          <div className="text-center mb-6">
            <Button 
              size="lg"
              className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 text-lg md:text-xl font-semibold rounded-md shadow-lg transition-colors"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started
            </Button>
          </div>
          
          {/* Login Link */}
          <div className="text-center">
            <p className="text-white/90" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)' }}>
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
    </section>
  );
}
