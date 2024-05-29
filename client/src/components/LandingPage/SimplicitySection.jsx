import React from "react";

const SimplicitySection = () => {
  return (
    <div className="py-20 md:max-w-[70%] mx-auto">
      <h1 className="text-4xl text-white font-bold text-center">
        Job search meets{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          simplicity
        </span>
      </h1>
      <div className="flex flex-row mt-16 md:space-x-24">
        <div className="flex-col w-1/2 space-y-6">
          {["A", "B", "C"].map((letter) => (
            <div className="rounded-lg bg-white p-8 min-h-[120px]">
              {letter}
            </div>
          ))}
        </div>
        <div className="flex-col w-1/2">
          <div className="rounded-lg bg-white p-8 h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SimplicitySection;
