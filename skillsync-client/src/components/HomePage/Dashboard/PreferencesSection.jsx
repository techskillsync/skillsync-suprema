import React, { useEffect, useState } from "react";
import { InputField, SelectField } from "../../common/InputField";
import jobSearchKeywords from "../../../constants/keywords";

const PreferencesSection = () => {
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobMode, setJobMode] = useState([]);
  const [keywords, setKeywords] = useState([]);

  const [changes, setChanges] = useState(false);
  useEffect(() => {
    if (
        location ||
        salaryRange ||
        jobMode.length > 0 ||
        keywords.length > 0
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
    // Handle form submission here
  };

  return (
    <div className="p-4 mt-6 bg-white rounded shadow text-black w-full">
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
                <InputField item={"Location"} onChange={handleLocationChange}/>
            </div>
            <div className="w-1/2 flex">
                <InputField item={"Salary Range"} onChange={handleSalaryRangeChange}/>
            </div>
        </div>
        <div className="flex space-x-6 flex-row mb-4">
            <div className="w-1/2 flex">
              <SelectField item={"Job Modes"} list={["Hybrid", "Onsite", "Remote"]} onChange={setJobMode} allowMultiple={true} creatable={false} />
            </div>
            <div className="w-1/2 flex">
                <SelectField item={"Keywords"} list={jobSearchKeywords} onChange={setKeywords} allowMultiple={true} />
            </div>
        </div>
      </form>
    </div>
  );
};

export default PreferencesSection;
