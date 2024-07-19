import React from "react";
import SummarySection from "./SummarySection";
import PreferencesSection from "./PreferencesSection";
   

const Dashboard = ({profileInfo}) => {
  

  return (
    <div className="w-full h-full bg-black p-5">
      <div className="p-2 mb-3">
        <h1 className="text-white text-left text-2xl font-medium">Welcome, {profileInfo?.name}</h1>
      </div>
      <SummarySection />
      <div className="flex flex-row !w-auto">
        <div className="flex w-3/4">
          <PreferencesSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
