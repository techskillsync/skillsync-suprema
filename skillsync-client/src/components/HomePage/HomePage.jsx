import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MenuBar, menuItems } from "./MenuBar";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import JobDetailsSlide from "../Feed/JobDetailsSlide";
import { redirectUser } from "../../utilities/redirect_user";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [profileInfo, setProfileInfo] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [popupBackground, setPopupBackground] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isPanelSlidingOut, setIsPanelSlidingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedJob && selectedPage !== "Jobs") {
      setIsPanelVisible(true);
      setIsPanelSlidingOut(false);
    } else if (isPanelVisible) {
      setIsPanelSlidingOut(true);
      setTimeout(() => {
        setIsPanelVisible(false);
      }, 300); // Match this duration with your slide-out animation duration
    }
  }, [selectedJob, selectedPage]);

  useEffect(() => {
    redirectUser("/landingPage", false);
  }, []);

  useEffect(() => {
    if (selectedJob && selectedPage !== "Jobs") {
      setPopupBackground(true);
    }
  }, [selectedJob]);

  useEffect(() => {
    async function fetchProfileInfo() {
      setProfileInfo(await GetProfileInfo("name, school"));
    }

    fetchProfileInfo();
  }, []);

  const handleMenuItemClick = (page) => {
    navigate(`/home/${page.toLowerCase().replace(" ", "")}`);
  };

  return (
    <div className="h-full w-full flex-1">
      <div className="fixed left-0 top-0 h-screen">
        <MenuBar
          selectedPage={selectedPage}
          handleMenuItemClick={handleMenuItemClick}
          profileInfo={profileInfo}
          setSidebarExpanded={setSidebarExpanded}
        />
      </div>
      <div className={`flex-1 transition-all duration-300 ease-in-out `}>
        {popupBackground && (
          <div
            className={`fixed top-0 left-0 w-screen h-screen bg-black z-[98] transition-opacity duration-300 ${
              popupBackground ? "opacity-70" : "opacity-0"
            }`}
            onClick={() => {
              setPopupBackground(false);
              setSelectedJob(null);
            }}
          ></div>
        )}
        {isPanelVisible && (
          <div
            className={`fixed right-0 top-0 h-screen w-[33.33%] overflow-y-scroll bg-[#1e1e1e] z-[99] shadow-lg ${
              isPanelSlidingOut ? "slide-out" : "slide-in"
            }`}
          >
            <JobDetailsSlide jobDescription={selectedJob} />
          </div>
        )}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out  `}
          style={
            sidebarExpanded ? { marginLeft: "250px" } : { marginLeft: "80px" }
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Routes>
                {menuItems.map((item) => (
                  <Route
                    key={item.name}
                    path={item.name.toLowerCase().replace(" ", "")}
                    element={
                      <item.component
                        profileInfo={profileInfo}
                        setSelectedJob={setSelectedJob}
                      />
                    }
                  />
                ))}
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomePage;