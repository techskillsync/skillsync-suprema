import { useEffect, useState } from "react";
import React from "react";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import { IoMdClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { GetJobPreferences } from "../../supabase/JobPreferences";

function SearchFilters({
  setPreferencesLoaded,
  setLocationKeys,
  setJobModeKeys,
  setKeywordKeys,
}) {
  const [userLocationText, setUserLocationText] = useState("");
  const [userJobModes, setUserJobModes] = useState([]);
  const [userKeyWords, setUserKeyWords] = useState([]);

  async function fetchAndSet() {
    const response = await GetJobPreferences("location, job_mode, keywords");
    if (!response) {
      console.warn("Could not get user location for Search Filter");
      return;
    }
    console.log(response);
    const userLocation = response.location;
    setUserLocationText(userLocation);
    setLocationKeys(userLocation);
    setUserJobModes(response.job_mode);
    setJobModeKeys(response.job_mode);
    setUserKeyWords(response.keywords);
    setKeywordKeys(response.keywords);
    setPreferencesLoaded(true);
  }

  useEffect(() => {
    fetchAndSet();
  }, []);

  function removeLocation() {
    setUserLocationText("");
    setLocationKeys("");
  }

  function removeJobMode(mode) {
    const newModes = userJobModes.filter(
      (m: { label: string; value: string }) => m.value !== mode.value
    );
    // console.log("New modes:", newModes);
    setUserJobModes(newModes);
    setJobModeKeys(newModes);
  }

  function removeKeyword(keyword) {
    const newKeywords = userKeyWords.filter(
      (k: { label: string; value: string }) => k.value !== keyword.value
    );
    // console.log("New keywords:", newKeywords);
    setUserKeyWords(newKeywords);
    setKeywordKeys(newKeywords);
  }

  // console.log("User job modes:", userJobModes);
  // console.log("User keywords:", userKeyWords);

  return (
    <div id="filters" className="mt-4 flex">
      <div className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#03BD6C] border-[1px] flex justify-center items-center mr-3">
        Add Filters <GoPlus className="ml-1" />
      </div>
      {userLocationText === "" ? (
        <></>
      ) : (
        <div className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#36B7FE] border-[1px]">
          {userLocationText}{" "}
          <IoMdClose
            className="inline mb-1 cursor-pointer"
            onClick={removeLocation}
          />
        </div>
      )}
      {userJobModes?.map((mode: { label: string; value: string }, index) => (
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
      ))}
      {userKeyWords?.map((keyword: { label: string; value: string }, index) => (
        <div
          key={index}
          className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#36B7FE] border-[1px] ml-3"
        >
          {keyword.label}{" "}
          <IoMdClose
            className="inline mb-1 cursor-pointer"
            onClick={() => removeKeyword(keyword)}
          />
        </div>
      ))}
    </div>
  );
}

export default SearchFilters;
