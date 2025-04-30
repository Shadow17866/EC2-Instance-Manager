import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#232F3E] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-semibold hover:opacity-90 transition-opacity"
        >
          <Cloud className="h-6 w-6" />
          <span>EC2 Manager</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link 
                to="/" 
                className="hover:text-blue-300 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/deploy" 
                className="hover:text-blue-300 transition-colors"
              >
                Deploy
              </Link>
            </li>
            <li>
              <Link 
                to="/terminate" 
                className="hover:text-blue-300 transition-colors"
              >
                Terminate
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;