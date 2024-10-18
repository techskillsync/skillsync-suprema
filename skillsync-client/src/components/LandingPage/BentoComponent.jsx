import React from "react";

function BentoComponent() {


  const blockInfo = [
    {
      title: "A better way to nail your first impressions",
      description:
        "Generate tailor made resumés and cover letters for each position with the power of AI.",
      image: "/Block1.gif",
    },
    {
        title: "Get ahead of the curve",
        description:
          "Take advantage of comparative analytics to know your likelihood of landing an interview.",
        image:"/Block5.gif",
      },
    {
        title: "Stay in the loop",
        description:
          "Stay updated on your job-finding journey and plan applications accordingly.",
        image: "/Block3.gif",
      },
      
    {
        title: "Navigate the application process with ease",
        description:
          "SkillSync will display only the information that you need to ace your job-finding journey.",
        image: "/Block6.gif",
      },
     
    {
        title: "Find the right opportunities",
        description:
          "Find the best possible job opportunities personalized to your skills, interests, and goals.",
        image:"/Block4.gif",
      },
   
   
    {
        title: "Unlocking hiring insights",
        description:
          "Streamline your recruitment process with instant access to key details and contact information.",
        image: "/Block2.gif",
      },
   
   
   
  ];

  return (
    <>
  <h1 className="mb-12 font-bold text-center">
    A 21st Century Platform <br />
    For 21st Century Seekers
  </h1>
  
  <div className="flex justify-center w-full">
    {/* Two Columns */}
    <div className="flex w-10/12 gap-6">
      {/* Left Column: Even Index Blocks */}
      <div className="flex flex-col gap-6 w-1/2">
        {blockInfo
          .filter((_, index) => index % 2 === 0)
          .map((block, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-6 bg-[#171717] rounded-lg shadow-lg w-full border-gray-300"
            >
              {/* Text Content */}
              <div className="text-white mb-5 flex flex-col items-start justify-start">
                <span className="text-sm font-bold mb-2 text-[#36B7FE]">
                  {block.title}
                </span>
                <h3 className="text-xl font-bold mb-2">{block.title}</h3>
                <p className="text-sm">{block.description}</p>
              </div>

              {/* Image */}
              <img
                src={block.image}
                alt={block.title}
                className="w-full h-auto object-contain rounded-lg mb-6"
              />
            </div>
          ))}
      </div>

      {/* Right Column: Odd Index Blocks */}
      <div className="flex flex-col gap-6 w-1/2">
        {blockInfo
          .filter((_, index) => index % 2 !== 0)
          .map((block, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-6 bg-[#171717] rounded-lg shadow-lg w-full border-gray-300"
            >
              {/* Text Content */}
              <div className="text-white mb-5 flex flex-col items-start justify-start">
                <span className="text-sm font-bold mb-2 text-[#03BD6C]">
                  {block.title}
                </span>
                <h3 className="text-xl font-bold mb-2">{block.title}</h3>
                <p className="text-sm">{block.description}</p>
              </div>

              {/* Image */}
              <img
                src={block.image}
                alt={block.title}
                className="w-full h-auto object-cover rounded-lg mb-6"
              />
            </div>
          ))}
      </div>
    </div>
  </div>
</>

  );
}

export default BentoComponent;
