import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const locationOptions = [
  { value: "Vancouver, Canada", label: "Vancouver, Canada" },
  { value: "Ottawa, Canada", label: "Ottawa, Canada" },
  { value: "Toronto, Canada", label: "Toronto, Canada" },
  { value: "Montreal, Canada", label: "Montreal, Canada" },
  { value: "New York, USA", label: "New York, USA" },
  { value: "San Francisco, USA", label: "San Francisco, USA" },
  { value: "Los Angeles, USA", label: "Los Angeles, USA" },
];

const LocationSelector = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    onSelectLocation(selectedOption);
  };

  return (
    <CreatableSelect
      value={selectedLocation}
      onChange={handleChange}
      options={locationOptions}
      className="w-full max-w-md"
      placeholder="Eg: Vancouver, Canada, or just Canada"
      formatCreateLabel={(inputValue) => `${inputValue}`}
      styles={{
        control: (styles) => ({ ...styles, backgroundColor: "white" }),
        option: (styles, { isFocused }) => {
          return {
            ...styles,
            backgroundColor: isFocused ? "#3787e1" : "white",
            color: isFocused ? "white" : "black",
          };
        },
        input: (styles) => ({ ...styles, color: "black" }),
        
      }}
    />
  );
};

export default LocationSelector;
