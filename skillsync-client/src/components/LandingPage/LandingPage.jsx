import React, { useEffect, useState } from "react";
import { USERS, CLIENTS, serviceDetails } from "./Constants.js";
import GradientTab from "./GradientTab.jsx";
import StickyScroll from "./StickyScroll";
import TestimonialCard from "./TestimonialCard";
import Navbar from "./Navbar.jsx";
import MobileNavbar from "./MobileNavbar.jsx";
import Footer from "./Footer.jsx";
import "./LandingPage.css";
import CreatableSelect from "react-select/creatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { UserCheck, FileText, Smile } from 'lucide-react'; 

import { FaArrowRightArrowLeft, FaChrome } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { countries, states, cities } from "../../constants/location_list.js";
import StickyScrollTut from "./StickyScrollTut.jsx";
import BentoComponent from "./BentoComponent.jsx";

const Home = () => {
  const [openNav, setOpenNav] = useState(false);
  const IMGS = ["./v1.gif", "./v2.gif", "./v3.gif"];

  const [expandedTab, setExpandedTab] = useState(1);
  const [currIMG, setCurrIMG] = useState(IMGS[0]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedLocation(null);
  };

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedLocation(null);
  };

  const handleTabClick = (number) => {
    setExpandedTab(expandedTab === number ? 1 : number);
    setCurrIMG(expandedTab === number ? IMGS[0] : IMGS[number - 1]);
  };

  const groupUsers = (users) => {
    const groupedUsers = [];
    for (let i = 0; i < users.length; i += 2) {
      groupedUsers.push(users.slice(i, i + 2));
    }
    return groupedUsers;
  };

  const items = [
    {
      icon: <UserCheck size={40} className="text-teal-400" />, // Icon for "Just start with registration"
      title: 'Just start with registration',
    },
    {
      icon: <FileText size={40} className="text-teal-400" />, // Icon for "Build your resume"
      title: 'Use SkillSync’s tools to build your resume',
    },
    {
      icon: <Smile size={40} className="text-teal-400" />, // Icon for "sit back and relax"
      title: 'Finally, sit back and relax',
    },
  ];
  return (
    <main className="relative text-[white] flex flex-col items-center justify-center">
      <Navbar openNav={openNav} setOpenNav={setOpenNav} />
      <MobileNavbar openNav={openNav} setOpenNav={setOpenNav} />
      {/*section 1 */}
      <section
        id="home"
        className="text-[#fff] min-h-[80vh] h-full pt-16  px-4  flex flex-col md:flex-row items-center justify-center gap-y-5  rounded-xl"
      >
        <aside className="flex flex-col w-full md:w-full justify-start items-center   h-full">
          <h1 className="text-4xl md:text-6xl text-center font-bold text-white leading-tight">
            Super power <br />
            your job search with <br />
            <span className=" w-full bg-gradient-to-r from-[#36B7FE] via-[#03BD6C] inline-block text-transparent bg-clip-text ">
              Co-pilot
            </span>
          </h1>
          <h5 className="mt-5 text-center md:text-lg pr-4 ">
            Stop missing opportunities. AI job search extension <br /> allows
            you to apply for jobs in 30 seconds.
          </h5>
          <button
            onClick={() => {
              window.open(
                "https://chromewebstore.google.com/detail/skillsync/lboeblhlbmaefeiehpifgiceemiledcg"
              );
            }}
            className="bg-[#36B7FE] flex gap-2 items-center justify-center py-2 px-4 rounded-md mt-5 md:mt-10"
          >
            <FaChrome />
            Add to Chrome
          </button>
        </aside>
      </section>
      {/*section 2 */}
      <section
        id="secretariat"
        className="w-full items-center flex flex-col justify-start  bg-black py-10 mb-64"
      >
        <StickyScroll OBJECT={serviceDetails} />
      </section>

      {/*section 4 */}
      <section className="flex flex-col items-center justify-center bg-black text-white py-16">
      {/* Title */}
      <h2 className="text-4xl font-bold mb-4 text-center">Job search meets Simplicity</h2>
      <p className="text-lg text-center mb-10 max-w-2xl">
        Quickly fill out the registration details and verify your personal documents. That's it. No BS.
      </p>

      {/* Icon and Description Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-16 w-full max-w-5xl">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              {item.icon} 
            </div>
            <p className="text-lg font-semibold">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
      {/* Section 3*/}
      <section
        id="how-it-works"
        className="w-full items-center flex flex-col justify-start bg-black py-10 mb-64"
      >
        <StickyScrollTut />
      </section>


      {/* Section 5*/}
      <section
        id="features"
        className="w-full items-center flex flex-col justify-start bg-black py-10 mb-20"
      >
        <BentoComponent />
      </section>
      <section className="flex flex-col w-10/12 rounded-full items-center justify-center py-10 mb-20  text-white bg-[#112133] ">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Transform Your Job Search <br /> with SkillSync
        </h1>
        <p className="text-center text-lg mb-6 max-w-lg">
          Low success rates? You aren’t the problem. The job platforms you use
          are. SkillSync is here to change the game.
        </p>
        <button className="bg-gradient-to-r from-blue-400 to-green-500 text-white py-2 px-6 rounded-full">
          Sign Up
        </button>
      </section>
      {/* Waitlist Section */}
      <section className="flex flex-col w-full items-center justify-center py-20 bg-gradient-to-r from-blue-400 to-green-500 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Find Right For Your Business
        </h2>
        <p className="text-center max-w-xl mb-6">
          Join our waitlist to connect with the perfect candidates for your
          business. Be among the first to access our innovative platform!
        </p>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="py-2 px-4 rounded-l-full text-black"
          />
          <button className="bg-black text-white py-2 px-6 rounded-r-full">
            Join the Waitlist
          </button>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </main>
  );
};

export default Home;
