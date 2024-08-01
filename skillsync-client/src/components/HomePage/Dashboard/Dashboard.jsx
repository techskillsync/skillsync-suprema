import React from "react";
import SummarySection from "./SummarySection";
import PreferencesSection from "./PreferencesSection";
import SpotLightJobsSection from "./SpotlightJobsSection";
import ChartsSection from "./ChartsSection";

const Dashboard = ({ profileInfo, setSelectedJob }) => {
  return (
    <main className="bg-allotrix-setup font-allotrix-font min-h-[100vh] md:h-[100%] w-full text-[white] overflow-y-scroll">
      <section className="pt-20 pb-8 w-full md:h-full md:px-8 px-3 flex flex-col gap-2">
      <div className="p-2 mb-3">
        <h1 className="text-white text-left text-2xl font-medium">
          Welcome, {profileInfo?.name}
        </h1>
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between w-full">
          <SummarySection />
        </div>
        <div className="flex items-center min-h-[100px]">
        <PreferencesSection />

          <ChartsSection />
        </div>
      </div>
      <SpotLightJobsSection setSelectedJob={setSelectedJob} />
    </section>
    </main>
  );
};

export default Dashboard;
