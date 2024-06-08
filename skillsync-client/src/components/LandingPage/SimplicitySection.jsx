import React from "react";
import SmallCard from "./Card";

const SimplicitySection = () => {
  const instructions = [
    {
      heading: "Just Start With Registration",
      description: "Quickly fill out the registration details and verify your personal documents. That’s it. No bullshit",
    },
    {
      heading: "Use SkillSync. to build your resume",
      description: "Upload your resume to get started",
    },
    {
      heading: "Finally, sit back and relax",
      description: "Get matched to jobs based on your resume",
    },
  ];
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
          {instructions.map((instruction, index) => (
            <SmallCard
              key={index}
              index={index}
              heading={instruction.heading}
              text={instruction.description}
            />
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
