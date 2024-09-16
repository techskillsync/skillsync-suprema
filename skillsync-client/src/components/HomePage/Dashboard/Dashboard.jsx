import React ,{useState, useEffect} from "react";
import SummarySection from "./SummarySection";
import PreferencesSection from "./PreferencesSection";
import SpotLightJobsSection from "./SpotlightJobsSection";
import ChartsSection from "./ChartsSection";
import { IoChatbox, IoHelp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Tutorial from "./Tutorial";
import {LayoutDashboard} from "lucide-react"

const Dashboard = ({ profileInfo, setSelectedJob }) => {
  const navigate = useNavigate();
  const [runTutorial, setRunTutorial] = useState(false); 


  return (
    <main className="bg-allotrix-setup font-allotrix-font min-h-[100vh] md:h-[100%] w-full text-[white] overflow-y-scroll">
      {runTutorial && <Tutorial/> }
      <section className="pt-10 pb-8 w-full md:h-full md:px-8 px-3 flex flex-col gap-2">
        <div className="p-2 mb-4 flex justify-between">
          <h1 className="text-white text-left text-2xl font-medium">
            Welcome, {profileInfo?.name}
          </h1>
          <div className="absolute flex gap-4 top-4 right-8">

          <button onClick={() => window.open("https://chromewebstore.google.com/detail/skillsync/lboeblhlbmaefeiehpifgiceemiledcg")}  
          className=" text-white rounded-lg py-2 px-3 flex items-center gap-2 bg-gradient-to-r from-[#36B7FE] to-[#03BD6C]">
              {" "}
              <LayoutDashboard /> Get the extension
            </button>
            
            <button onClick={() => setRunTutorial(!runTutorial)}  className="bg-[#1e1e1e] text-white rounded-lg py-2 px-3 flex items-center gap-2">
              {" "}
              <IoHelp /> Tutorial
            </button>
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
