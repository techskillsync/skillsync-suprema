import React from "react";
import { useNavigate } from "react-router-dom";

const AuthenticatedWelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to SkillSync!</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Onboarding Slideshow</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              console.log("Navigating to Home page");
              navigate("/home");
            }}
          >
            Skip
          </button>
        </div>
        <div className="flex flex-col items-center">
          <img src="/path/to/slide1.png" alt="Slide 1" className="mb-4" />
          <h3 className="text-lg font-bold mb-2">Slide 1</h3>
          <p className="text-gray-600 mb-4">Dummy text for slide 1.</p>
        </div>
        <div className="flex flex-col items-center">
          <img src="/path/to/slide2.png" alt="Slide 2" className="mb-4" />
          <h3 className="text-lg font-bold mb-2">Slide 2</h3>
          <p className="text-gray-600 mb-4">Dummy text for slide 2.</p>
        </div>
        <div className="flex flex-col items-center">
          <img src="/path/to/slide3.png" alt="Slide 3" className="mb-4" />
          <h3 className="text-lg font-bold mb-2">Slide 3</h3>
          <p className="text-gray-600 mb-4">Dummy text for slide 3.</p>
        </div>
        <div className="flex items-center justify-between mt-8">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedWelcomePage;
