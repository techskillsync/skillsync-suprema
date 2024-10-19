import React from "react";

const LoadingCard = () => {
  return (
    <div className="loading-card w-11/12 sm:w-80 h-auto flex flex-col justify-start items-center text-center p-6 bg-gray-200 rounded-lg shadow-lg">
      {/* job title */}
      <div className="shine w-2/3 h-6 rounded-md mb-4 bg-gray-300 overflow-hidden relative">
        <div className="glow"></div>
      </div>

      {/*  for company and logo */}
      <div className="flex justify-between items-center w-full mb-4">
        <div className="shine w-1/3 h-6 rounded-md bg-gray-300 overflow-hidden relative">
          <div className="glow"></div>
        </div>
        <div className="shine w-16 h-16 rounded-full bg-gray-300 overflow-hidden relative">
          <div className="glow"></div>
        </div>
      </div>

      {/*  for location */}
      <div className="shine w-1/2 h-4 rounded-md mb-4 bg-gray-300 overflow-hidden relative">
        <div className="glow"></div>
      </div>

      {/*  for rank, salary, and due date */}
      <div className="flex flex-col space-y-2 w-full">
        <div className="shine w-full h-4 rounded-md bg-gray-300 overflow-hidden relative">
          <div className="glow"></div>
        </div>
        <div className="shine w-full h-4 rounded-md bg-gray-300 overflow-hidden relative">
          <div className="glow"></div>
        </div>
        <div className="shine w-full h-4 rounded-md bg-gray-300 overflow-hidden relative">
          <div className="glow"></div>
        </div>
      </div>

      {/* shine effect cus its not detecting index.css */}
      <style jsx>{`
        .shine {
          position: relative;
          background-color: #e0e0e0;
        }

        .glow {
          position: absolute;
          top: 0;
          left: -100%;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          animation: shineAnimation 1.5s infinite;
        }

        @keyframes shineAnimation {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingCard;