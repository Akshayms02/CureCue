import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <header className="bg-lavender-200 text-black shadow-lg rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold text-black">
              Logo
            </a>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="/" className="hover:text-lavender-800">
              Home
            </a>
            <a href="/about" className="hover:text-lavender-800">
              About
            </a>
            <a href="/services" className="hover:text-lavender-800">
              Services
            </a>
            <a href="/contact" className="hover:text-lavender-800">
              Contact
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={toggleNav} className="focus:outline-none text-lavender-600">
              {navOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {navOpen && (
        <div className="md:hidden bg-lavender-200 rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-lavender-600 hover:bg-lavender-300">
              Home
            </a>
            <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-lavender-600 hover:bg-lavender-300">
              About
            </a>
            <a href="/services" className="block px-3 py-2 rounded-md text-base font-medium text-lavender-600 hover:bg-lavender-300">
              Services
            </a>
            <a href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-lavender-600 hover:bg-lavender-300">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
