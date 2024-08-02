import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import jobSearchKeywords from "../../constants/keywords";

interface FilterPopupProps {
  children: React.ReactNode;
  preferences: any;
  setPreferences: (prefs: any) => void;
}

const selectFieldStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#3787e1" : "white",
      color: isFocused ? "white" : "black",
    };
  },
};

const FilterPopup: React.FC<FilterPopupProps> = ({
  children,
  preferences,
  setPreferences,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState({
    location: "",
    jobModes: [],
    keywords: [],
  });

  const handleSave = () => {
    // Add preferences to the existing global preferences (do not delete or duplicate)
    setPreferences({
      ...preferences,
      location: localPreferences.location,
      jobModes: [
        ...new Set([...preferences.jobModes, ...localPreferences.jobModes]),
      ],
      keywords: [
        ...new Set([...preferences.keywords, ...localPreferences.keywords]),
      ],
    });
    setIsOpen(false);
  };

  useEffect(() => {
    setLocalPreferences({
      location: "",
      jobModes: [],
      keywords: [],
    });
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <div className="fixed top-32 left-40 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-[200] mx-auto">
          <h3 className="text-lg text-black font-semibold mb-2">Add Filters</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 text-black rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={localPreferences.location}
              placeholder="Enter Location"
              onChange={(e) =>
                setLocalPreferences({
                  ...localPreferences,
                  location: e.target.value,
                })
              }
            />
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Job Modes
            </label>
            <Select
              isMulti
              options={[
                // @ts-ignore
                { value: "Onsite", label: "Onsite" },
                // @ts-ignore
                { value: "Remote", label: "Remote" },
                // @ts-ignore
                { value: "Hybrid", label: "Hybrid" },
              ]}
              value={localPreferences.jobModes}
              onChange={(selected) =>
                setLocalPreferences({
                  ...localPreferences,
                  jobModes: [...selected],
                })
              }
              styles={selectFieldStyles}
            />
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Keywords
            </label>
            <CreatableSelect
              isMulti
              // @ts-ignore
              options={jobSearchKeywords.map((k) => ({ value: k, label: k }))}
              value={localPreferences.keywords}
              onChange={(selected) =>
                setLocalPreferences({
                  ...localPreferences,
                  // @ts-ignore
                  keywords: [...selected],
                })
              }
              styles={selectFieldStyles}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleSave}
            >
              OK
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopup;
