import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#232F3E] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} EC2 Manager. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="text-sm hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="text-sm hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="text-sm hover:text-blue-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;