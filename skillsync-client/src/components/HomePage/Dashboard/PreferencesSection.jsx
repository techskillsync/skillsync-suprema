import React, { useEffect, useState } from "react";
import { InputField, SelectField } from "../../common/InputField";
import jobSearchKeywords from "../../../constants/keywords";
import { GetJobPreferences, UpdateJobPreferences } from "../../../supabase/JobPreferences";

const PreferencesSection = () => {
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobMode, setJobMode] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const [initialPreferences, setInitialPreferences] = useState({});

  const [changes, setChanges] = useState(false);

  useEffect(() => {
    async function fetchPreferences() {
      const preferencesData = await GetJobPreferences();
      console.log(preferencesData);
      const preferences = {
        location: preferencesData[0].location,
        salaryRange: preferencesData[0].salary_range ?? "",
        jobMode: preferencesData[0].job_mode ?? [],
        keywords: preferencesData[0].keywords ?? [],
      };
      try {
        setLocation(preferences.location);
        setSalaryRange(preferences.salaryRange);
        setJobMode(preferences.jobMode);
        setKeywords(preferences.keywords);
        setInitialPreferences(preferences);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPreferences();
  }, []);

  // Track changes whether changed from previous supabase values
  useEffect(() => {
    if (
      location !== initialPreferences.location ||
      salaryRange !== initialPreferences.salaryRange ||
      jobMode !== initialPreferences.jobMode ||
      keywords !== initialPreferences.keywords
    ) {
      setChanges(true);
    } else {
      setChanges(false);
    }
  }, [location, salaryRange, jobMode, keywords]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSalaryRangeChange = (e) => {
    setSalaryRange(e.target.value);
  };

  const handleJobModeChange = (e) => {
    const selectedModes = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setJobMode(selectedModes);
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const preferences = {
      location,
      // salary_range: salaryRange,
      job_mode: jobMode,
      keywords,
    };

    UpdateJobPreferences(preferences);

  };

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow text-black w-full">
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
              item={"Job Modes"}
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
      </form>
    </div>
  );
};

export default PreferencesSection;
