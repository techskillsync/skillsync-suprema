import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSwipeable } from "react-swipeable";
import "../../styles/slide_display.css";
// import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";

const SlideDisplay = ({ sections, actions }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((prev) => prev + 1),
    onSwipedRight: () => setCurrentSlide((prev) => prev - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const isBigScreen = useMediaQuery({ minDeviceWidth: 768 });

  return (
    <>
      <div
        id="container-slide-display"
        className="md:mx-auto mx-8 max-w-screen md:max-w-[90%] dark:bg-[#131325] my-5 bg-gray-200 rounded-3xl "
      >
        <div className="flex justify-center md:justify-start px-5 pt-5 md:px-20 md:pt-10 my-1">
          {sections.map((section, index) => (
            <>
              <button
                key={index}
                className={`${
                  currentSlide === index
                    ? "text-gray-800 dark:text-white"
                    : "text-gray-500"
                } hidden md:block bg-transparent border-none hover:bg-blue-100 text-xl px-3 py-2 rounded-full font-medium transition-all duration-300`}
                onClick={() => handleSlideChange(index)}
              >
                {section.slide_heading || index + 1}
              </button>
              <button
                key={100+index}
                className={`md:hidden transition-all duration-300 h-1 w-1 rounded-full mx-1 ${
                  index === currentSlide ? "bg-regal-blue" : "bg-gray-300"
                }`}
                onClick={() => handleSlideChange(index)}
              />
            </>
          ))}
        </div>
        <div className="slider overflow-x-hidden">
          <div
            {...handlers}
            className={`slides flex ${isBigScreen ? "" : "!w-screen"}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sections.map((section, index) => (
              <div
                className={`slide flex-none ${
                  isBigScreen ? "w-full" : "w-screen"
                }`}
                key={200+index}
              >
                <div className="p-3">
                  <div className="w-full p-4 flex flex-col md:flex-row md:flex-row-reverse md:items-center slide">
                    <div className="md:w-1/2">
                      <img
                        src={section.image}
                        alt={section.heading}
                        className="rounded-lg mb-4 max-h-[200px] md:max-h-[400px] mx-auto"
                      />
                    </div>
                    <div className="md:w-1/2 md:px-12">
                      <h2 className="text-4xl text-left text-white font-[500] mb-2">
                        {section.heading}
                      </h2>
                      <p className="dark:text-gray-200 mt-7 text-left text-lg text-gray-600">
                        {section.text}
                      </p>{" "}
                      <div className="mt-6 flex justify-between items-start flex-col md:space-x-0 space-x-2 space-y-2">
                        {section.children}
                      </div>
                      {/* {actions[index] && (
                        <SignatureButtonPlain
                          className="my-4 text-lg"
                          text={actions[index].text}
                          onClick={actions[index].action}
                        />
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideDisplay;