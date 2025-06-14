import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Your Next Production?
        </h2>
        <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
          Join filmmakers across Oakland who are already using FilmMatcher to build their teams and find resources
        </p>
        
        <Button 
          size="lg"
          className="bg-white text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg font-semibold mb-4"
          onClick={() => window.location.href = '/api/login'}
        >
          Get Started
        </Button>
        
        <div className="text-center">
          <p className="text-orange-100">
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