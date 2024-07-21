import React from "react";
import SummarySection from "./SummarySection";
import PreferencesSection from "./PreferencesSection";
import SpotLightJobsSection from "./SpotlightJobsSection";
   

const Dashboard = ({profileInfo}) => {
  

  return (
    <div className="w-full h-screen bg-black p-8">
      <div className="p-2 mb-3">
        <h1 className="text-white text-left text-2xl font-medium">Welcome, {profileInfo?.name}</h1>
      </div>
      <SummarySection />
      <div className="flex flex-row !w-auto">
        <div className="flex w-3/4">
          <PreferencesSection />
        </div>
      </div>
      {/* <SpotLightJobsSection /> */}
    </div>
  );
};

export default Dashboard;
