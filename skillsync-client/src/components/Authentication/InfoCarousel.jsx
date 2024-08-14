import React, { useState } from "react";
import HandShakeImage from '../../assets/Handshake.svg';
import DashboardImage from '../../assets/Dashboard.svg';
import OpportunitiesImage from '../../assets/Opportunities.svg';

const InfoCarousel = () => {
  const carouselitems = [
    {
      title: "Welcome to SkillSync",
      description:
        "SkillSync is a platform that connects job seekers with employers. We help you find the right job for you.",
      image: HandShakeImage,
    },
    {
      title: "Find the right job for you",
      description:
        "SkillSync helps you find the right job for you. We have a wide range of jobs available for you to apply to.",
      image: OpportunitiesImage,
    },
    {
      title: "Connect with employers",
      description:
        "SkillSync allows you to connect with employers and apply for jobs. We help you find the right job for you.",
      image: DashboardImage,
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (index) => {
    setCurrentPage(index);
  };

return (
    <div className="hidden md:flex flex-col p-12 h-full bg-black">
        <div className="h-full p-0.5 bg-gradient-to-r  from-[#03BD6C] to-[#36B7FE]  rounded-md">
            <div className="bg-black h-full p-5 text-white rounded overflow-x-hidden">
                <div
                    id="carousel"
                    className="carousel h-[90%] transition-all duration-300 flex"
                    style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                    {carouselitems.map((item, index) => (
                        <div
                            key={index}
                            className={`carousel-item flex flex-col items-center w-full p-5 ${
                                index === currentPage ? "active" : ""
                            }`}
                            style={{ flex: "0 0 100%" }}
                        >
                            <img className="mx-auto max-h-[70%]" src={item.image} alt={item.title} />
                            <h1 className="mt-3 text-4xl text-center font-bold">{item.title}</h1>
                            <p className="mt-3 text-center text-lg">{item.description}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full page-dots flex justify-center">
                    {carouselitems.map((_, index) => (
                        <div
                            key={index}
                            className={`dot cursor-pointer p-2 m-2 rounded-full transition-all duration-300 ${
                                index === currentPage ? "bg-green-500" : "bg-white"
                            }`}
                            onClick={() => handlePageChange(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
};

export default InfoCarousel;
