import React from "react";
import { Link } from "react-router-dom";
import { Film, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Company: [
      { name: "About Us", to: "/about" },
      { name: "Careers", to: "/careers" },
      { name: "Press", to: "/press" },
      { name: "Terms of Service", to: "/terms" },
    ],
    Support: [
      { name: "Help Center", to: "/help" },
      { name: "Contact Us", to: "/contact" },
      { name: "FAQ", to: "/faq" },
      { name: "Site Map", to: "/sitemap" },
    ],
    Browse: [
      { name: "Popular", to: "/movies/popular" },
      { name: "Now Playing", to: "/movies/now-playing" },
      { name: "Upcoming", to: "/movies/upcoming" },
      { name: "Top Rated", to: "/movies/top-rated" },
    ],
  };

  return (
    <footer className="bg-gray-900 border-t border-indigo-900 shadow-inner mt-12 pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700/50">
          {/* Column 1: Logo and Mission */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-yellow-400 p-2 rounded-lg shadow-md">
                <Film className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">AuroraCine</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your premium destination for the latest cinematic experiences,
              booked with ease.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-yellow-400/50 inline-block">
              Company
            </h4>
            <ul className="space-y-2">
              {links.Company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-yellow-400 transition text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Browse Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-yellow-400/50 inline-block">
              Browse
            </h4>
            <ul className="space-y-2">
              {links.Browse.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-yellow-400 transition text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-yellow-400/50 inline-block">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 text-indigo-400 flex-shrink-0" />
                <span>123 Movie St, Cinema City, CA 90210</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 text-indigo-400 flex-shrink-0" />
                <a
                  href="mailto:support@auroracine.com"
                  className="hover:text-yellow-400"
                >
                  support@auroracine.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 text-indigo-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>

            {/* Social Icons (Placeholder) */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-17 14 2.1 1.5 5 2.1 8-.4C5.8 19.3 2.7 20 2 20c2.2-2.3 3.6-5.4 3.6-9.1C3 9.4 3.7 7 4.9 5.8c3 3.7 6.4 5.2 10.3 3.8C16.5 8 18 5.7 18.7 4" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.5" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 text-center text-sm text-gray-500">
          &copy; {currentYear} AuroraCine. All rights reserved. Powered by TMDB.
        </div>
      </div>
    </footer>
  );
}
