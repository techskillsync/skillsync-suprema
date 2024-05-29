import React from "react";

const Hero = () => {
  const byLine =
    "Stay ahead of the curve with advanced analytics, job trends, and goal-setting tools";
  const byLineChars = byLine.split("");
  return (
    <div className="pt-36 p-8 text-center text-white text-6xl font-bold">
      <h1>Today Is The Day</h1>
      <h1>To Land Your Dream Job</h1>
      <div className="mt-5 mx-12 p-8 w-auto bg-gradient-to-b from-[#164e8e] to-black/5">
        <h4 className="md:max-w-[70%] mx-auto px-12 flex justify-between text-sm font-thin">
          {byLineChars.map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h4>
        <div className="text-2xl mt-3 mx-auto font-bold bg-white p-8 rounded md:max-w-[70%]"></div>
      </div>
    </div>
  );
};

export default Hero;
