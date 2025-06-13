import { Link } from "wouter";
import { Film } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "For Filmmakers",
      links: [
        { href: "/browse/location", label: "Browse Locations" },
        { href: "/browse/crew", label: "Find Crew" },
        { href: "/browse/cast", label: "Cast Your Project" },
        { href: "/browse/service", label: "Production Services" },
        { href: "/project-profile", label: "Cost Calculator" },
      ]
    },
    {
      title: "For Providers",
      links: [
        { href: "#", label: "List Your Location" },
        { href: "#", label: "Join as Crew" },
        { href: "#", label: "Actor Profiles" },
        { href: "#", label: "Offer Services" },
        { href: "#", label: "Manage Bookings" },
      ]
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Help Center" },
        { href: "#", label: "Permit Guide" },
        { href: "#", label: "Tax Incentives" },
        { href: "#", label: "Contact Us" },
        { href: "#", label: "Community" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Film className="h-8 w-8 text-orange-500" />
              <span className="font-serif font-bold text-xl">FilmMatch</span>
              <span className="text-gray-400">Oakland</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting Oakland's film community. From concept to screen, we've got your production covered.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 FilmMatch Oakland. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
