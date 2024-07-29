import React, { useState } from "react";
import { MenuBar, menuItems } from "./MenuBar";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import JobDetailsSlide from "../Feed/JobDetailsSlide";

const HomePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  // For expanding job tiles in other parts of the app
  const [selectedJob, setSelectedJob] = useState(null);
  const [popupBackground, setPopupBackground] = useState(false);

  React.useEffect(() => {
    console.log(selectedJob);
    if (selectedJob && selectedPage !== "Jobs") {
      setPopupBackground(true);
    }
  }, [selectedJob]);

  React.useEffect(() => {
    async function fetchProfileInfo() {
      setProfileInfo(await GetProfileInfo("name, school"));
    }

    fetchProfileInfo();
  }, []);

  const renderComponent = () => {
    const selectedItem = menuItems.find((item) => item.name === selectedPage);
    return selectedItem ? (
      <selectedItem.component
        profileInfo={profileInfo}
        setSelectedJob={setSelectedJob}
      />
    ) : null;
  };

  return (
    <div className="h-full w-full">
      <div className="fixed left-0 top-0 h-screen w-1/5">
        <MenuBar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          profileInfo={profileInfo}
        />
      </div>
      {/* Todo: Make this 'Jobs' a constant or dynamic */}
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
      {selectedJob && selectedPage !== "Jobs" && (
        <div
          className={`fixed right-0 top-0 h-screen w-[26.66%] overflow-y-scroll bg-[#1e1e1e] z-[99] shadow-lg  ${
            selectedJob && selectedPage !== "Jobs" ? "slide-in" : "slide-out"
          }`}
        >
          <JobDetailsSlide jobDescription={selectedJob} />
        </div>
      )}
      <div className="flex">
        <div className="w-1/5"></div>
        <div className="w-4/5 h-full bg-black overflow-y-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
