import React, { useEffect, useState } from "react";
import LogoDark from "../assets/LogoDark.png";
import LogoLight from "../assets/LogoLight.png";

const Navbar = ({ logIn, signUp }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  const links = [
    { text: "Link 1", href: "#hover-card-display" },
    { text: "Link 2", href: "#container-slide-display" },
    { text: "Link 3", href: "#container-slide-display" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasShadow(true);
      } else {
        setHasShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`bg-white dark:bg-black sticky top-0 z-20 transition-shadow ${
        hasShadow ? "shadow-lg dark:shadow-white/50 dark:shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto p-5 sm:px-6 lg:px-8">
        <div className="flex justify-between">
          <div id="nav-logo" className="flex-shrink-0">
            <span className="text-white text-lg font-semibold">
              <img
                className="hidden dark:block"
                width={150}
                src={LogoDark}
                alt="SkillSync. Logo"
              />
              <img
                className="block dark:hidden"
                width={150}
                src={LogoLight}
                alt="SkillSync. Logo"
              />
            </span>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              // className="text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r from-cyan-800 to-lime-800 hover:text-white px-3 py-2 hover:px-4 hover:py-3 rounded-md text-sm font-medium transition-all duration-300"
              className="text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r dark:from-cyan-800 from-cyan-400 dark:to-lime-800 hover:text-white rounded-md text-sm font-medium transition-all duration-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          <div
            id="nav-links"
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } md:block w-auto px-auto ml-auto py-auto my-auto flex flex-col md:flex-row justify-content-center mx-auto`}
          >
            {links.map((link) => (
              <a
                key={link.text}
                onClick={link.action}
                href={link.href}
                className="hover:cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-blue-100 px-3 py-2 rounded-full text-base font-medium transition-all duration-300"
              >
                {link.text}
              </a>
            ))}
            <div id="nav-actions-mobile" className="md:hidden">
              <a
                key="Log In"
                onClick={logIn}
                // className="text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r dark:from-cyan-800 from-cyan-400 dark:to-lime-800 to-lime-300  hover:text-white px-3 py-2 hover:px-4 hover:py-3 rounded-md text-sm font-medium transition-all duration-300"
                className="hover:cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-blue-100 px-3 py-2 rounded-full text-base font-medium transition-all duration-300"
              >
                Log In
              </a>
              <a
                key="Sign Up"
                onClick={signUp}
                // className="text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r dark:from-cyan-800 from-cyan-400 dark:to-lime-800 to-lime-300  hover:text-white px-3 py-2 hover:px-4 hover:py-3 rounded-md text-sm font-medium transition-all duration-300"
                className="hover:cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-blue-100 px-3 py-2 rounded-full text-base font-medium transition-all duration-300"
              >
                Sign Up
              </a>
            </div>
          </div>
          <div id="nav-actions" className="hidden md:block">
            <a
              key="Log In"
              onClick={logIn}
              className="hover:cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-blue-100 px-3 py-2 rounded-full text-base font-medium transition-all duration-300"
            >
              Log In
            </a>
            <a
              key="Sign Up"
              onClick={signUp}
              className="hover:cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-blue-100 px-3 py-2 rounded-full text-base font-medium transition-all duration-300"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
