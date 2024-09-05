import React, { useEffect, useState } from "react";
import { InputField, SelectField } from "../../common/InputField";
import jobSearchKeywords from "../../../constants/keywords";
import {
  GetJobPreferences,
  UpdateJobPreferences,
} from "../../../supabase/JobPreferences";
import toast, { Toaster } from "react-hot-toast";

const PreferencesSection = () => {
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobMode, setJobMode] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [citizenship, setCitizenship] = useState([]);
  const [recency, setRecency] = useState(null); // recency in days
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const [initialPreferences, setInitialPreferences] = useState({});
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    async function fetchPreferences() {
      const preferencesData = await GetJobPreferences();
      const preferences = {
        location: preferencesData.location,
        salaryRange: preferencesData.salary_range ?? "",
        jobMode: preferencesData.job_mode ?? [],
        keywords: preferencesData.keywords ?? [],
        citizenship: preferencesData.citizenship ?? [],
        recency: preferencesData.recency ?? null,
      };
      try {
        setLocation(preferences.location);
        setSalaryRange(preferences.salaryRange);
        setJobMode(preferences.jobMode);
        setKeywords(preferences.keywords);
        setCitizenship(preferences.citizenship);
        setRecency(preferences.recency);
        setInitialPreferences(preferences);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPreferences();
  }, []);

  // Track changes to check if any edits have been made
  useEffect(() => {
    if (
      location !== initialPreferences.location ||
      salaryRange !== initialPreferences.salaryRange ||
      jobMode !== initialPreferences.jobMode ||
      keywords !== initialPreferences.keywords ||
      citizenship !== initialPreferences.citizenship ||
      recency !== initialPreferences.recency
    ) {
      setChanges(true);
    } else {
      setChanges(false);
    }
  }, [location, salaryRange, jobMode, keywords, citizenship, recency]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preferences = {
      location,
      salary_range: salaryRange,
      job_mode: jobMode,
      keywords,
      citizenship,
      recency,
    };

    const updateJobPreferencesPromise = UpdateJobPreferences(preferences);
    toast.promise(updateJobPreferencesPromise, {
      loading: "Saving changes...",
      success: "Your preferences were updated!",
      error: "Failed to update preferences",
    });

    // Close modal on successful update
    setShowModal(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow  min-h-[300px] text-black h-full w-full md:w-[60%] overflow-y-auto scrollbar-hide">
      <Toaster />
      <div className="flex  mb-4 w-full justify-between items-center">
        <h2 className="text-lg font-medium">Job Search Preferences</h2>
        {/* Edit Button */}
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={() => setShowModal(true)}
        >
          Edit
        </button>
      </div>

      {/* Display Preferences (Non-editable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full">
          <p className="border rounded-md p-2">
            <strong>Location:</strong> {location || "Not specified"}
          </p>
        </div>
        <div className="w-full">
          <p className="border rounded-md p-2">
            <strong>Salary Range:</strong> {salaryRange || "Not specified"}
          </p>
        </div>
        <div className="w-full">
          <p className="border rounded-md p-2">
            <strong>Job Modes:</strong>{" "}
            {Array.isArray(jobMode) && jobMode.length
              ? jobMode
                  .map((mode) =>
                    typeof mode === "object" && mode.label ? mode.label : mode
                  )
                  .join(", ")
              : "Not specified"}
          </p>
        </div>
        <div className="w-full">
          <p className="border rounded-md p-2">
            <strong>Keywords:</strong>{" "}
            {Array.isArray(keywords) && keywords.length
              ? keywords
                  .map((keyword) =>
                    typeof keyword === "object" && keyword.label
                      ? keyword.label
                      : keyword
                  )
                  .join(", ")
              : "Not specified"}
          </p>
        </div>
        <div className="w-full">
          <p className="border rounded-md p-2">
            <strong>Recency:</strong> {recency || "Not specified"}
          </p>
        </div>
        <div className="w-full">
          <p className="border rounded-md p-2">
            <strong>Citizenship:</strong>{" "}
            {Array.isArray(citizenship) && citizenship.length
              ? citizenship
                  .map((citizen) =>
                    typeof citizen === "object" && citizen.label
                      ? citizen.label
                      : citizen
                  )
                  .join(", ")
              : "Not specified"}
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="w-full">
                  <InputField
                    className="rounded-r-md"
                    item={"Location"}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <InputField
                    className="rounded-r-md"
                    type="number"
                    item={"Salary Range"}
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="w-full">
                  <SelectField
                    item={"Modes"}
                    value={jobMode}
                    list={["Hybrid", "Onsite", "Remote"]}
                    onChange={setJobMode}
                    allowMultiple={true}
                    creatable={false}
                  />
                </div>
                <div className="w-full">
                  <SelectField
                    item={"Keywords"}
                    value={keywords}
                    list={jobSearchKeywords}
                    onChange={setKeywords}
                    allowMultiple={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="w-full">
                  <SelectField
                    item={"Recency"}
                    value={recency}
                    list={["1 day", "7 days", "14 days", "30 days", "1 year"]}
                    onChange={setRecency}
                    creatable={false}
                  />
                </div>
                <div className="w-full">
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

              {/* Modal Footer */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!changes}
                  className={`px-5 py-2 rounded-md transition duration-300 ease-in-out ${
                    changes
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesSection;
