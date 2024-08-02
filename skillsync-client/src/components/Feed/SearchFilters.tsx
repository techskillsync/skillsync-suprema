import { useEffect, useState } from "react";
import React from "react";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import { IoMdClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { GetJobPreferences } from "../../supabase/JobPreferences";
import { InputField, SelectField } from "../common/InputField";
import jobSearchKeywords from "../../constants/keywords";

function SearchFilters({
  setPreferencesLoaded,
  setLocationKeys,
  setJobModeKeys,
  setKeywordKeys,
  handleSubmit,
  changes,
  location,
  handleLocationChange,
  salaryRange,
  handleSalaryRangeChange,
  jobMode,
  setJobMode,
  keywords,
  setKeywords,
  recency,
  setRecency,
  citizenship,
  setCitizenship,
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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Job Search Preferences</h2>
        <button
          type="submit"
          disabled={!changes}
          className=" !p-0 font-normal bg-transparent border-none text-gray-900 hover:text-green-500 transition-all duration-200 disabled:text-gray-300"
        >
          Save Changes
        </button>
      </div>
      <div className="flex space-x-6 flex-row mb-4">
        <div className="w-1/2 flex">
          <InputField
            className="rounded-r-md"
            item={"Location"}
            value={location}
            onChange={handleLocationChange}
          />
        </div>
        <div className="w-1/2 flex">
          <InputField
            className="rounded-r-md"
            item={"Salary Range"}
            value={salaryRange}
            onChange={handleSalaryRangeChange}
          />
        </div>
      </div>
      <div className="flex space-x-6 flex-row mb-4">
        <div className="w-1/2 flex">
          <SelectField
            item={"Modes"}
            value={jobMode}
            list={["Hybrid", "Onsite", "Remote"]}
            onChange={setJobMode}
            allowMultiple={true}
            creatable={false}
          />
        </div>
        <div className="w-1/2 flex">
          <SelectField
            item={"Keywords"}
            value={keywords}
            list={jobSearchKeywords}
            onChange={setKeywords}
            allowMultiple={true}
          />
        </div>
      </div>
      <div className="flex space-x-6 flex-row mb-4">
        <div className="w-1/2 flex">
          <SelectField
            item={"Recency"}
            value={recency}
            list={["1 day", "7 days", "14 days", "30 days", "1 year"]}
            onChange={setRecency}
            creatable={false}
          />
        </div>
        <div className="w-1/2 flex">
          <SelectField
            item={"Citizenship"}
            value={citizenship}
            list={["N/A", "USA", "Canada"]}
            onChange={setCitizenship}
            creatable={true}
            allowMultiple={true}
          />
        </div>
      </div>
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
    </form>
  );
}

export default SearchFilters;
