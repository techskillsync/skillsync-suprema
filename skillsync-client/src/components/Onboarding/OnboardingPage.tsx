import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import LogoDark from "../../assets/LogoDark.png";
import { motion, AnimatePresence } from "framer-motion";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import Select from "react-select";
import LocationSelector from "./LocationSelector";
import { redirectUser } from "../../utilities/redirect_user";
import { AddResume } from "../../supabase/Resumes";
import { UpdateJobPreferences } from "../../supabase/JobPreferences";
import FinishScreen from "./FinishScreen";
import { parseResume } from "../../api/ResumeParser";

const importantInNewRoleOptions = [
  "Teamwork",
  "Work-Life Balance",
  "Challenge",
  "Growth",
  "Salary",
  "Location",
  "Company Culture",
  "Benefits",
];

const workAuthorizationOptions = [
  "Citizen",
  "Permanent Resident",
  "Work Permit",
  "Student Visa",
  "I require sponsorship",
];

const startDateOptions = [
  "Immediately",
  "Within 3 months",
  "Within 6 months",
  "Within the next year",
  "Just exploring right now",
];

const levelOptions = [
  "Internship",
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive",
];

const OnboardingPage = () => {
  const [page, setPage] = useState(0);

  const [preferences, setPreferences] = useState({
    name: "",
    lastName: "",
    email: "",
    location: "",
    workAuthorization: "",
    startDate: "Immediately",
    level: ["Internship"],
    selectedNewRoleOptions: ["Teamwork", "Challenge", "Growth"],
  });

  const handleLocationChange = (selectedOption) => {
    setPreferences({
      ...preferences,
      location: selectedOption.value,
    });
  };

  const handleNewRoleOptionClick = (option: string) => {
    if (preferences.selectedNewRoleOptions.includes(option)) {
      setPreferences({
        ...preferences,
        selectedNewRoleOptions: preferences.selectedNewRoleOptions.filter(
          (opt) => opt !== option
        ),
      });
    } else if (preferences.selectedNewRoleOptions.length < 3) {
      setPreferences({
        ...preferences,
        selectedNewRoleOptions: [...preferences.selectedNewRoleOptions, option],
      });
    }
  };

  const handleWorkAuthorizationOptionClick = (option: string) => {
    setPreferences({
      ...preferences,
      workAuthorization: option,
    });
  };

  const handleLevelOptionClick = (option: string) => {
    if (preferences.level.includes(option)) {
      setPreferences({
        ...preferences,
        level: preferences.level.filter((opt) => opt !== option),
      });
    } else {
      setPreferences({
        ...preferences,
        level: [...preferences.level, option],
      });
    }
  };

  const handleStartDateOptionClick = (option: string) => {
    setPreferences({
      ...preferences,
      startDate: option,
    });
  };

  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loadedInitialPreferences, setLoadedInitialPreferences] =
    React.useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedResumeFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedResumeFile(files[0]);
    }
  };

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    async function setInitialPreferences() {
      const profile = await GetProfileInfo("name, last_name");
      if (!profile) {
        console.warn(
          "could not fetch first and last name in introduction slideshow"
        );
      } else {
        const name = profile.name;
        const last_name = profile.last_name;

        setPreferences({
          ...preferences,
          name: name,
          lastName: last_name,
        });
      }
      setLoadedInitialPreferences(true);
    }
    setInitialPreferences();
  }, []);

  const pages = [
    <div className="w-full h-full flex flex-col items-center justify-center pt-12">
      <p className="text-[22px]">Welcome to SkillSync, {preferences.name}</p>
      <p className="text-[16px] mt-2 text-center">
        We are excited to have you onboard. Let's get your name first.
      </p>
      <div className="flex mt-4">
        <input
          type="text"
          placeholder="First Name"
          className="py-2 px-4 mt-2 w-1/2 border border-gray-300 rounded-md bg-[#1e1e1e]"
          value={preferences.name}
          onChange={(e) =>
            setPreferences({ ...preferences, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Last Name"
          className="py-2 px-4 mt-2 w-1/2 border border-gray-300 rounded-md ml-2 bg-[#1e1e1e]"
          value={preferences.lastName}
          onChange={(e) =>
            setPreferences({ ...preferences, lastName: e.target.value })
          }
        />
      </div>
    </div>,
    <div className="w-full h-full flex flex-col items-center justify-center pt-12">
      <p className="text-[22px]">Upload a resume</p>
      <p className="text-[16px] mt-2 text-center">
        We will attempt to autofill your profile details using your resume.{" "}
        <br />
        If you do not have one, you can skip this step for now.
      </p>
      <div className="flex flex-col w-1/2 mt-3 h-[200px]">
        <div
          className="file-upload-dropzone h-full bg-[#0e0e1e]"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleDropzoneClick}
        >
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="file-input h-full w-full"
          />
          <div className="file-upload-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <div className="file-upload-text">
            {selectedResumeFile
              ? selectedResumeFile.name
              : "Drag and drop or click to upload"}
          </div>
        </div>
        <div className={`file-preview ${!selectedResumeFile && ""}`}>
          {selectedResumeFile ? (
            <p>Selected File:{selectedResumeFile.name}</p>
          ) : (
            <p>No file selected</p>
          )}
        </div>
      </div>
    </div>,
    <div className="w-full h-full flex flex-col items-center justify-center pt-12">
      <p className="text-[22px]">
        Which 3 are most important to you in a new role?
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-4 w-1/2">
        {importantInNewRoleOptions.map((option) => (
          <div
            key={option}
            className={`p-4 border border-emerald-500 rounded cursor-pointer bg-[#1e1e1e] transition-opacity duration-200 ${
              preferences.selectedNewRoleOptions.includes(option)
                ? "opacity-100"
                : "opacity-50"
            }`}
            onClick={() => handleNewRoleOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>,
    <div className="w-full h-full flex flex-col items-center justify-center pt-12">
      <p className="text-[22px] mb-3 ">Where would you like to work?</p>
      <LocationSelector onSelectLocation={handleLocationChange} />
    </div>,
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-[22px]">Visa Requirements</p>
      <p className="text-[16px] mt-2 text-center">
        What work authorization do you currently have to work in this location?
      </p>
      <div className="mt-3 flex flex-col justify-center space-y-2 w-1/2">
        {workAuthorizationOptions.map((option) => (
          <div
            key={option}
            className={`p-4 border border-emerald-500 rounded cursor-pointer bg-[#1e1e1e] transition-opacity duration-200 ${
              preferences.workAuthorization === option
                ? "opacity-100"
                : "opacity-50"
            }`}
            onClick={() => handleWorkAuthorizationOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>,
    <div className="w-full h-full flex flex-col items-center justify-center pb-12">
      <p className="text-[22px]">When can you start?</p>
      <p className="text-[16px] mt-2 text-center">
        When are you looking to start your next role?
      </p>
      <div className="mt-3 flex flex-col justify-center space-y-2 w-1/2">
        {startDateOptions.map((option) => (
          <div
            key={option}
            className={`p-4 border border-emerald-500 rounded cursor-pointer bg-[#1e1e1e] transition-opacity duration-200 ${
              preferences.startDate === option ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => handleStartDateOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>,

    <div className="w-full h-full flex flex-col items-center justify-center pb-12">
      <p className="text-[22px]">Experience Level</p>
      <p className="text-[16px] mt-2 text-center">
        At what experience levels are you looking for jobs?
      </p>
      <div className="mt-3 flex flex-col justify-center space-y-2 w-1/2">
        {levelOptions.map((option) => (
          <div
            key={option}
            className={`p-4 border border-emerald-500 rounded cursor-pointer bg-[#1e1e1e] transition-opacity duration-200 ${
              preferences.level.includes(option) ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => handleLevelOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>,

    <FinishScreen preferences={preferences} resumeFile={selectedResumeFile} page={page} setPage={setPage}/>,
  ];

  return (
    <div className="min-h-screen w-full p-3 bg-black">
      <div className="w-full flex p-3 items-center">
        <div className="w-40">
          <img src={LogoDark} />{" "}
        </div>{" "}
        <p className="text-[22px] mt-0.5 ml-3">{"Setup"}</p>
      </div>
      <div
        id="progress-bar"
        className="fade-in mt-2 rounded-md w-[80%] mx-auto bg-[#1e1e1e] p-6"
      >
        <div className="flex items-center space-x-2">
          <div className="w-full bg-[#f5f5f5] h-4 rounded-full">
            <div
              className="h-4 bg-gradient-to-r  from-[#03BD6C] to-[#36B7FE]  transition-all ease-in-out duration-500 rounded-full"
              style={{
                width: `${((page / (pages.length - 1)) * 100).toFixed(0)}%`,
              }}
            ></div>
          </div>
          <div>
            <span>{((page / (pages.length - 1)) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
      <div className="p-4 min-h-[400px]">
        {loadedInitialPreferences && (
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div id="controls" className="flex justify-end space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            if (page < pages.length - 1) {
              console.log(page);
              setPage(page + 1);
            }
          }}
        >
          {page === pages.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
