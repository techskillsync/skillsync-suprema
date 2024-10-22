import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = ({ openNav, setOpenNav }) => {
  const scrollToSection = (section) => {
    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpenNav(false);
    } else {
      window.location.href = "/";
      //   document.addEventListener("DOMContentLoaded",()=>{
      //     const newElement = document.getElementById(section);
      //     if (newElement) {
      //         newElement.scrollIntoView({ behavior: "smooth" });
      //         setOpenNav(false);
      //     }
      // });
    }
  };
  return (
    <nav
      className={`sticky top-0  items-center justify-between border rounded-full w-11/12 py-3 px-10 mt-10 bg-black z-50  hidden md:flex`}
    >
      <div className="md:hidden">
        <button
          className="text-4xl text-[white] absolute top-6 right-4"
          onClick={() => setOpenNav(!openNav)}
        >
          <IoCloseSharp />
        </button>
      </div>
      <div className="w-[150px] mr-[162px]  ">
        <Link to={"/"} onClick={() => setOpenNav(!openNav)}>
          <img
            src="/LogoDark.png"
            alt="Skillsync"
            className="max-h-full max-w-full"
          />
        </Link>
      </div>
      <ul className="flex cursor-pointer flex-col items-center gap-4 px-6 py-4 rounded-xl md:flex-row md:gap-10 md:py-3 md:px-8 md:h-[55px]">
        <li
          onClick={() => scrollToSection("home")}
          className="hover:pb-2 transition-all duration-300 ease-out hover:text--std "
        >
          Home
        </li>
        <li
          onClick={() => scrollToSection("how-it-works")}
          className="hover:pb-2 transition-all duration-300 ease-out hover:text--std "
        >
          How it works
        </li>
        <li
          onClick={() => scrollToSection("features")}
          className="hover:pb-2 transition-all duration-300 ease-out hover:text--std "
        >
          Features
        </li>
      </ul>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Link to="/login" onClick={() => setOpenNav(!openNav)}>
          <div className=" font-light py-2 px-8 rounded-lg  text-[white] transition-all duration-300 ease-out border-[#36B7FE]">
            Log In
          </div>
        </Link>
        <Link to="/signup" onClick={() => setOpenNav(!openNav)}>
          <div className=" font-light py-2 px-8 rounded-full  text-[white] transition-all duration-300 ease-out bg-gradient-to-r from-[#36B7FE] to-[#03BD6C]">
            Sign Up
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
