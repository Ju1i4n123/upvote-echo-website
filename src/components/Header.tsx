
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-gray-900">📧 Postfully</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`transition-colors ${
                location.pathname === "/" 
                  ? "text-gray-900 font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Reddit Post Template
            </Link>
            <Link 
              to="/fake-text-generator" 
              className={`transition-colors ${
                location.pathname === "/fake-text-generator" 
                  ? "text-gray-900 font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Fake Text Generator
            </Link>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              All Tools
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
