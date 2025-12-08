import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {currentYear} Gestion Notes Universitaires. Tous droits réservés.
          </div>
          
          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Développé avec</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>par votre équipe</span>
          </div>
          
          {/* Links */}
          <div className="flex gap-6 text-sm">

            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              À propos
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Support
            </a>

            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Contact
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
