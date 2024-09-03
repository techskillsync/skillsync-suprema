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
import { FaArrowRightArrowLeft, FaChrome } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { countries, states, cities } from "../../constants/location_list.js";

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

  const groupedUsers = groupUsers(USERS);

  return (
    <main className="font-mamun-font-secondary text-[white] ">
      <Navbar openNav={openNav} setOpenNav={setOpenNav} />
      <MobileNavbar openNav={openNav} setOpenNav={setOpenNav} />
      {/* <section className=" text-[#fff] md:h-[100vh] pt-32 h-full lg:mx-10 sm:mx-5 flex flex-col items-center justify-center gap-y-5 md:mt-2 rounded-xl ">
        <div className="flex flex-col gap-5 items-center px-2">
          <h2 className="  md:text-6xl text-5xl text-center px-1 font-bold text-[#fff] ">
            Today Is The Day<br></br> To{" "}
            <span className="text-[#36B7FE]">Land Your </span>
            <span className="text-[#03BD6C]"> Dream Job </span>
          </h2>
        </div>
        <div className="flex flex-col gap-5 px-4 items-center justify-center w-full bg-gradient-to-">
          <p className="lg:text-[20px] md:text-[15px] animate-fadeindown text-center">
            Stay ahead of the curve with advanced analytics, job trends, and
            goal-setting tools{" "}
          </p>
          <div className="flex md:flex-row flex-col md:gap-2 p-1 justify-center items-center text-[black] md:bg-[white] w-[80%] md:w-[65%] bg-[black] rounded-md">
            <input
              type="text"
              id="search"
              placeholder="Search job by name / type / category"
              className="p-2 rounded w-full md:w-2/3 max-w-md border-0"
            />
            <p className="md:border-l-2 text-[#1E1E1E] h-5 self-center"></p>
            <p className="md:border-l-2 text-[#1E1E1E] h-5 self-center"></p>
            <CreatableSelect
              className="p-2  w-full md:w-48 rounded border-0"
              isClearable
              options={countries.map((country) => ({
                value: country,
                label: country,
              }))}
              placeholder="Country"
              formatCreateLabel={(inputValue) => `${inputValue}`}
              value={selectedCountry}
              onChange={handleCountryChange}
              styles={selectFieldStyle}
            />
            <p className="md:border-l-2 text-[#1E1E1E] h-5 self-center"></p>
            <CreatableSelect
              className="p-2  w-full md:w-48 rounded border-0"
              isClearable
              formatCreateLabel={(inputValue) => `${inputValue}`}
              options={(states[selectedCountry?.value] || []).map((state) => ({
                value: state,
                label: state,
              }))}
              placeholder="State"
              value={selectedState}
              styles={selectFieldStyle}
              onChange={handleStateChange}
            />
            <p className="md:border-l-2 text-[#1E1E1E] h-5 self-center"></p>
            <CreatableSelect
              className="p-2   w-full md:w-48 rounded border-0"
              styles={selectFieldStyle}
              isClearable
              options={(
                cities[selectedCountry?.value]?.[selectedState?.value] || []
              ).map((city) => ({
                value: city,
                label: city,
              }))}
              placeholder="Location"
              value={selectedLocation}
              onChange={handleLocationChange}
            />
          </div>

          <div className="flex md:flex-row flex-col justify-center items-center gap-5">
            <button
              className="px-16 bg-[#03BD6C] rounded-md py-2"
              onClick={() => {
                console.log(selectedCountry);
                console.log(selectedState);
                console.log(selectedLocation);

                const searchTerms = document.getElementById("search")?.value;
                console.log(searchTerms);
                const locationSearchTerm = `${
                  selectedLocation?.value ? selectedLocation.value + ", " : ""
                }${selectedState?.value ? selectedState.value + ", " : ""}${
                  selectedCountry?.value ? selectedCountry.value : ""
                }`;
                console.log(
                  `/home/jobs?location=${locationSearchTerm.replace(
                    /,+$/,
                    ""
                  )}&keywords=${searchTerms}`
                );
                window.location.href = `/home/jobs?location=${locationSearchTerm.replace(
                  /,+$/,
                  ""
                )}&keywords=${searchTerms}`;
              }}
            >
              Search
            </button>
            <p className="hidden md:block">Or</p>
            <button
              className="px-16 bg-[#175092] rounded-md py-2"
              onClick={() => {
                // Scrolls down
                document
                  .getElementById("secretariat")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore
            </button>
          </div>
          <p className="text-[20px] mt-10 animate-fadeindown text-center md:text-left">
            Helping you get the opportunities you deserve
          </p>
        </div>
        <div className='w-full md:w-full overflow-hidden flex after:content[""] after:dark:from-brand-dark after:from-background after:bg-gradient-to-l after:right-0 after:top-0 after:bottom-0 after:w-20 after:z-10 after:absolute before:content[""] before:dark:from-brand-dark before:from-background before:bg-gradient-to-r before:left-0 before:top-0 before:bottom-0 before:w-20 before:z-10 before:absolute'>
          {[...Array(2)].map((arr, i) => (
            <div key={i} className="flex flex-nowrap animate-slide">
              {CLIENTS.map((client) => (
                <div
                  key={client.alt}
                  className="relative w-[200px] m-10 shrink-0 flex items-center"
                >
                  <img
                    src={client.logo}
                    alt={client.alt}
                    className="object-contain max-w-none w-[100px] filter grayscale"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section> */}

      {/*section 1 */}
      <section className=" text-[#fff] md:h-[100vh] pt-32 h-full lg:mx-10 sm:mx-5 flex items-center justify-center gap-y-5 md:mt-2 rounded-xl ">
      
        <aside className="flex flex-col w-7/12 justify-start items-start p-10 h-full mt-24">
          <h1 className="text-6xl font-bold text-white">Super power <br/> your job search with <br/><span className=" bg-gradient-to-r from-[#36B7FE] via-[#03BD6C] inline-block text-transparent bg-clip-text pr-20">Co-pilot</span></h1>
          <h5 className="pr-24 mt-5">Stop missing opportunities. Our AI Job Search Extension helps you find job openings in seconds.</h5>
          <button onClick = {()=>{window.open("https://chromewebstore.google.com/detail/skillsync/lboeblhlbmaefeiehpifgiceemiledcg")}}className="bg-[#36B7FE] flex gap-2 items-center justify-center min-w-max max-w-min rounded-none mt-10">
            <FaChrome/>Add to Chrome
          </button>
        </aside>
        <aside className="flex flex-col items-center justify-start w-5/12 p-10 h-full  mt-24">
        <div className="bg-white min-h-[500px] min-w-[400px] rounded-md  py-5">

        </div>
        </aside>
      
      </section>


      {/*section 2 */}

      <section className="w-full bg-[black]  md:py-10" id="expose-section">
        <h2 className="md:text-5xl text-4xl sm:text-2xl px-4 text-white text-center  font-bold py-10">
          Job search meets{" "}
          <span className="text-[white] font-bold gradient-text">
            Simplicity
          </span>
        </h2>
        <article className="flex md:flex-row flex-col-reverse items-center justify-between md:h-[70vh] w-full gap-20 md:p-20 p-7">
          <aside className="md:w-6/12 flex flex-col justify-around h-full">
            <GradientTab
              number="1"
              title="Just Start With Registration"
              description="Quickly fill out the registration details and verify your personal documents. That's it. No bullshit."
              isExpanded={expandedTab === 1}
              onClick={() => handleTabClick(1)}
            />
            <GradientTab
              number="2"
              title="Use SkillSync.’s tools to build your resume"
              description="Quickly fill out the registration details and verify your personal documents. That's it. No bullshit."
              isExpanded={expandedTab === 2}
              onClick={() => handleTabClick(2)}
            />
            <GradientTab
              number="3"
              title="Finally, sit back and relax"
              description="Quickly fill out the registration details and verify your personal documents. That's it. No bullshit."
              isExpanded={expandedTab === 3}
              onClick={() => handleTabClick(3)}
            />
          </aside>
          <div className="flex w-5/12 h-full items-center justify-center rounded-md">
            {currIMG && (
              <img
                className="max-h-full rounded-lg object-cover"
                src={currIMG}
                alt="Tab Content"
              />
            )}
          </div>
        </article>
      </section>

      <section id="secretariat" className=" w-full bg-[#0b0c10] py-10 ">
        <h2 className="flex flex-col mt-10 mb-10 gap-2 text-white font-bold text-3xl md:text-6xl text-center relative">
          <span className="z-10">A 21st Century platform</span>
          <br />
          <span className="z-10 mt-[-50px]">For 21st Century seekers</span>
          <svg
            viewBox="0 0 500 100"
            className="absolute left-1/2 z-0 transform -translate-x-1/2 md:block hidden  mt-[50px] w-[60%] md:mt-[40px]  md:w-[60%]"
          >
            <path
              d="M 50 90 Q 250 10 450 90"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="transparent"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#00ff88", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#00d4ff", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </h2>

        <div className="md:block hidden">
          <StickyScroll OBJECT={serviceDetails} />
        </div>
        <div className="md:hidden block">
          {serviceDetails.map((service, index) => (
            <div key={index} className="flex flex-col gap-8 items-center px-4">
              <img src={service.video} alt="AV" className="w-[200px]" />
              <h3 className="gradient-text font-bold text-lg self-start">
                {service.heading}
              </h3>
              <h2 className="text-2xl self-start font-bold">{service.title}</h2>
              <p className="text-[gray] text-md self-start mb-5">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-4 md:px-32 my-14 py-40 text-[black] bg-[white] flex flex-col gap-y-10 justidy-center">
        <p className="text-center text-3xl w-full px-5  md:w-[60%] self-center">
          Low success rates? You aren’t the problem. The job platforms you use
          are. SkillSync is here to change the game.{" "}
        </p>
        <a
          className="
        bg-gradient-to-r font-medium flex items-center from-[#03BD6C] to-[#36B7FE] text-white  mx-auto text-2xl rounded-xl border-none p-6 hover:scale-105 transition-all duration-300
        "
          href="/signup"
          target="_blank"
        >
          Sign Up
          <FaArrowRight className="ml-2" />
        </a>
        {/* <Carousel
          autoPlay
          infiniteLoop
          interval={3000}
          showThumbs={true}
          showStatus={false}
        >
          {groupedUsers.map((group, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 justify-center text-[black] h-auto"
            >
              {group.map((user, idx) => (
                <TestimonialCard
                  key={idx}
                  name={user.name}
                  designation={user.designation}
                  img={user.profile}
                  message={user.message}
                  borderColor={"green"}
                />
              ))}
            </div>
          ))}
        </Carousel> */}
      </section>
      <section className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 px-3 gap-5 text-[black] w-full md:w-[75%] mx-auto items-center">
        <div className="flex  flex-col md:flex-row w-full gap-3 md:gap-10 border rounded-xl  bg-[white] py-2 px-8 h-[240px] md:items-center mx-auto">
          <div className="flex flex-col md:gap-10 gap-3">
            <h3 className="font-bold lg:text-3xl md:text-4xl text-3xl">
              Find Right For your{" "}
              <span className="relative inline-block pb-1">
                Career
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-[#03BD6C] to-[#36B7FE]"></span>
              </span>{" "}
            </h3>
            <button
              className="rounded-lg bg-black font-bold text-white hover:bg-gradient-to-r from-[#03BD6C] to-[#36B7FE]  border-2 outline-none p-2 w-52"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Get Started
            </button>
          </div>
          <div className="">
            <ChatBubbleLeftRightIcon
              className="h-16 w-30 stroke-[black]"
              fontSize={25}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full md:gap-10 gap-3 border bg-[white] rounded-xl py-2 px-8 h-[240px]  md:items-center ">
          <div className="flex flex-col md:gap-10 gap-3">
            <h3 className="font-bold lg:text-3xl md:text-4xl text-3xl">
              Find Right For your{" "}
              <span className="relative inline-block pb-1">
                Business
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-[#03BD6C] to-[#36B7FE]"></span>
              </span>{" "}
            </h3>
            <button
              className="rounded-lg bg-black font-bold text-white hover:bg-gradient-to-r from-[#03BD6C] to-[#36B7FE]  border-2 outline-none p-2 w-52"
              onClick={() => {
                window.location.href = "/comingSoon";
              }}
            >
              Hire
            </button>
          </div>
          <div className="">
            <UserGroupIcon className="h-16 w-30 stroke-[black]" fontSize={25} />
          </div>
        </div>
      </section>
      {/* <section className='flex flex-col  items-center py-20 gap-10'>
        <div>
          <ul className='text-primary flex flex-row gap-16 text-xl'>
            <li className='p-5 border rounded-full border-[gray]'>
          <FaInstagram/>
            </li>
            <li className='p-5 border rounded-full border-[gray]'>
          <FaLinkedin/>
            </li>
            <li className='p-5 border rounded-full border-[gray]'>
          <FaXTwitter/>
            </li>
          </ul>
          
        </div>
        <div className='text-[black] w-1/2 '>
            <p className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus nam, iste optio tenetur illum facilis odio eum aperiam dolore ut! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa totam, quis qui a praesentium incidunt voluptate aliquid quam quibusdam quia.</p>
          </div>
      </section> */}
      <Footer />
    </main>
  );
};

const selectFieldStyle = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    color: "black",
    border: "none",
    borderRadius: "5px",
    width: "100%",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#1E1E1E" : "white",
      color: isFocused ? "white" : "black",
    };
  },
  singleValue: (styles) => ({
    ...styles,
    color: "black",
    width: "100%",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "black",
  }),
  input: (styles) => ({
    ...styles,
    color: "black",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "grey",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    width: "0px",
    backgroundColor: "transparent",
  }),
  clearIndicator: (styles) => ({
    ...styles,
    width: "0px",
    color: "black",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "white",
    color: "black",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#1E1E1E",
    color: "white",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "white",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "white",
    ":hover": {
      backgroundColor: "#1E1E1E",
      color: "white",
    },
  }),
};

export default Home;
