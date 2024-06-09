import React from "react";

const Hero = () => {
  const byLine =
    "Stay ahead of the curve with advanced analytics, job trends, and goal-setting tools";
  const byLineChars = byLine.split("");
  return (
    <div className="pt-36 p-8 text-center text-white">
      <div className="text-3xl font-bold">
        <h1>Today Is The Day</h1>
        <h1>
          To{" "}
          <span className="text-blue-500">Land Your</span>{" "}
          <span className="text-green-400">Dream Job</span>
        </h1>
      </div>
      <div className="mt-5 mx-12 p-8 w-auto bg-gradient-to-b from-[#164e8e] to-black/5">
        <h4 className="md:max-w-[70%] mx-auto px-12 flex justify-between text-sm font-thin">
          {byLineChars.map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </h4>
        <div className="text-2xl mt-3 mx-auto font-bold bg-white p-8 rounded md:max-w-[70%]"></div>
      </div>
      <div className="flex flex-row md:space-x-4 tracking-widest text-white justify-center">
        <button className="bg-blue-500 hover:bg-blue-700 py-2 px-8 rounded-lg transition-bg duration-300">SEARCH JOB</button>
        <h3 className="py-2">OR</h3>
        <button className="bg-green-400 hover:bg-green-600 py-2 px-8 rounded-lg transition-bg duration-300">EXPLORE</button>
      </div>
    </div>
  );
};

export default Hero;
