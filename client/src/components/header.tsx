import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Search, Bell, Menu, X, Heart } from "lucide-react";
import ProfileDropdown from "@/components/profile-dropdown";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Calculate total favorites across all categories
  useEffect(() => {
    const categories = ['locations', 'crew', 'cast', 'services'];
    let total = 0;
    
    categories.forEach(category => {
      const saved = localStorage.getItem(`favorites_${category}`);
      if (saved) {
        total += JSON.parse(saved).length;
      }
    });
    
    setTotalFavorites(total);

    // Listen for localStorage changes to update counter
    const handleStorageChange = () => {
      let newTotal = 0;
      categories.forEach(category => {
        const saved = localStorage.getItem(`favorites_${category}`);
        if (saved) {
          newTotal += JSON.parse(saved).length;
        }
      });
      setTotalFavorites(newTotal);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when favorites change within the same tab
    window.addEventListener('favoritesChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleStorageChange);
    };
  }, []);

  const navItems = [
    { href: "/locations", label: "Locations", active: location.startsWith("/locations") },
    { href: "/crew", label: "Crew", active: location.startsWith("/crew") },
    { href: "/cast", label: "Talent", active: location.startsWith("/cast") },
    { href: "/services", label: "Services", active: location.startsWith("/services") },
    { href: "/permits", label: "Permits", active: location.startsWith("/permits") },
    { href: "/budget", label: "Budget", active: location.startsWith("/budget") },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-orange-500" />
            <span className="font-serif font-bold text-xl text-gray-900">ScreenLocal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  item.active
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Heart className="h-4 w-4" />
              {totalFavorites > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalFavorites}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            {isAuthenticated ? (
              <ProfileDropdown user={user as any} />
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    item.active
                      ? "text-orange-500"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
