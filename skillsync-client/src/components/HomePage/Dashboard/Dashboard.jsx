import React from "react";
import SummarySection from "./SummarySection";
import PreferencesSection from "./PreferencesSection";
import SpotLightJobsSection from "./SpotlightJobsSection";
import ChartsSection from "./ChartsSection";
import { IoChatbox } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ profileInfo, setSelectedJob }) => {
  const navigate = useNavigate();

  return (
    <main className="bg-allotrix-setup font-allotrix-font min-h-[100vh] md:h-[100%] w-full text-[white] overflow-y-scroll">
      <section className="pt-20 pb-8 w-full md:h-full md:px-8 px-3 flex flex-col gap-2">
        <div className="p-2 mb-3">
          <h1 className="text-white text-left text-2xl font-medium">
            Welcome, {profileInfo?.name}
          </h1>
          <div className="absolute top-4 right-8">
            <button
              className="bg-[#1e1e1e] text-white rounded-lg py-2 px-3 flex items-center gap-2"
              onClick={() => {
                navigate("/home/feedback");
              }}
            >
              <IoChatbox />
              <span>Feedback</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex justify-between w-full">
            <SummarySection />
          </div>
          <div className="flex flex-col gap-4  md:flex-row md:items-center min-h-[300px]">
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
