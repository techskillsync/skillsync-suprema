import { useEffect, useState } from "react";
import React from "react";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import { IoMdClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { GetJobPreferences } from "../../supabase/JobPreferences";
import FilterPopup from "./FilterPopup";

interface UserPreferences {
  location: string;
  jobModes: {
    label: string;
    value: string;
  }[];
  recency: number;
  salaryRange: number;
  citizenship: string;
  keywords: {
    label: string;
    value: string;
  }[];
}

function SearchFilters({ preferences, setPreferences, setPreferencesLoaded }) {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    location: "",
    jobModes: [],
    keywords: [],
    // Todo: use below preferences too
    recency: 7,
    salaryRange: 0,
    citizenship: "",
  });

  async function fetchAndSet() {
    const urlParams = new URLSearchParams(window.location.search);
  const location = urlParams.get('location');
  const jobModes = urlParams.get('jobModes');
  const keywords = urlParams.get('keywords');

  if (location || jobModes || keywords) {
    setUserPreferences({
      ...userPreferences,
      location: location || userPreferences.location,
      jobModes: jobModes ? jobModes.split(',').map((mode) => ({ label: mode, value: mode })) : userPreferences.jobModes,
      keywords: keywords ? keywords.split(',').map((keyword) => ({ label: keyword, value: keyword })) : userPreferences.keywords,
    });
    setPreferencesLoaded(true);
  } else {
    const response = await GetJobPreferences("location, job_mode, keywords");
    if (!response) {
      console.warn("Could not get user location for Search Filter");
      return;
    }
    console.log(response);
    setUserPreferences({
      ...userPreferences,
      location: response.location,
      jobModes: response.job_mode,
      keywords: response.keywords,
    });
    setPreferencesLoaded(true);
  }
  }

  useEffect(() => {
    fetchAndSet();
  }, []);

  function removeLocation() {
    setUserPreferences({
      ...userPreferences,
      location: "",
    });
  }

  function removeJobMode(mode) {
    const newModes = userPreferences.jobModes.filter(
      (m: { label: string; value: string }) => m.value !== mode.value
    );
    setUserPreferences({
      ...userPreferences,
      jobModes: newModes,
    });
  }

  function removeKeyword(keyword) {
    const newKeywords = userPreferences.keywords.filter(
      (k: { label: string; value: string }) => k.value !== keyword.value
    );
    setUserPreferences({
      ...userPreferences,
      keywords: newKeywords,
    });
  }
  // Trigger setState callback for Feed.ts
  useEffect(() => {
    setPreferences({
      location: userPreferences.location,
      jobModes: userPreferences.jobModes,
      keywords: userPreferences.keywords,
    });
  }, [userPreferences]);

  // console.log("User job modes:", userJobModes);
  // console.log("User keywords:", userKeyWords);

  return (
    <div
      id="filters"
      className="mt-4 mb-2 flex flex-nowrap overflow-x-auto space-x-2 h-10 w-screen !scrollbar-hide"
    >
      <FilterPopup
        preferences={userPreferences}
        setPreferences={setUserPreferences}
      >
        <div className="bg-[#1E1E1E] h-10 p-2 min-w-max cursor-pointer rounded-md text-white border-[#03BD6C] border-[1px] flex justify-center items-center mr-3">
          Add Filters <GoPlus className="ml-1" />
        </div>
      </FilterPopup>
      {userPreferences.location === "" ? (
        <></>
      ) : (
        <div className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#8080ff] border-[1px]">
          {userPreferences.location}{" "}
          <IoMdClose
            className="inline mb-1 cursor-pointer"
            onClick={removeLocation}
          />
        </div>
      )}
      {userPreferences.jobModes?.map(
        (mode: { label: string; value: string }, index) => (
          <div
            key={index}
            className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#36B7FE] border-[1px] ml-3"
          >
            {mode.label}{" "}
            <IoMdClose
              className="inline mb-1 cursor-pointer"
              onClick={() => removeJobMode(mode)}
            />
          </div>
        )
      )}
      {userPreferences.keywords?.map(
        (keyword: { label: string; value: string }, index) => (
          <div
            key={index}
            className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#1de8bb] border-[1px] ml-3"
          >
            {keyword.label}{" "}
            <IoMdClose
              className="inline mb-1 cursor-pointer"
              onClick={() => removeKeyword(keyword)}
            />
          </div>
        )
      )}
    </div>
  );
}

export default SearchFilters;
