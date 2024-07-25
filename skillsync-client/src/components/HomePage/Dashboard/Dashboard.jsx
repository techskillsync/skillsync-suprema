import React from "react";
import SummarySection from "./SummarySection";
import PreferencesSection from "./PreferencesSection";
import SpotLightJobsSection from "./SpotlightJobsSection";
import ChartsSection from "./ChartsSection";

const Dashboard = ({ profileInfo }) => {
  return (
    <div className="w-full min-h-screen bg-black p-8">
      <div className="p-2 mb-3">
        <h1 className="text-white text-left text-2xl font-medium">
          Welcome, {profileInfo?.name}
        </h1>
      </div>
      <div className="flex flex-row !w-auto">
        <div className="flex flex-col w-2/3">
          <SummarySection />
          <PreferencesSection />
        </div>
        <div className="flex flex-col w-1/3 px-3">
          <ChartsSection />
        </div>
      </div>
      <SpotLightJobsSection />
    </div>
  );
};

export default Dashboard;
