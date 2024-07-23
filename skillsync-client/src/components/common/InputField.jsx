import React from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

function InputField({
  item,
  onChange,
  placeholder = "",
  showLabel = true,
  className = "",
}) {
  return (
    <div className="flex items-center w-full">
      {showLabel && (
        <label
          className="block text-base font-semibold bg-green-200 px-2 py-2 rounded-l whitespace-nowrap"
          htmlFor={item.toLowerCase()}
        >
          {item}
        </label>
      )}
      <input
        className={
          className +
          "!w-full appearance-none !text-base border border-[#b3b3b3] border-[0.3px] rounded-r w-full focus:ring py-[7px] px-3 transition-all duration-300 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:shadow-outline"
        }
        id={item.toLowerCase()}
        onChange={onChange}
        type="text"
        placeholder={placeholder !== '' ? placeholder : "Enter your " + item.toLowerCase()}
      />
    </div>
  );
}

const selectFieldStyle = {
  control: (base, state) => ({
    ...base,
    textAlign: "left",
    borderRadius: "0 3px 3px 0",
    // backgroundColor:
    //   window.matchMedia &&
    // window.matchMedia("(prefers-color-scheme: dark)").matches
    //   ? "black"
    //   : "white",
    // color:
    // window.matchMedia &&
    // window.matchMedia("(prefers-color-scheme: dark)").matches
    //   ? "white"
    //   : "black",
    // "&:hover": {
    //   padding: "0.4rem",
    // },
    ...(state.isFocused && {
      // padding: "0.4rem",
      border: "1px solid #9dc0fa",
      outline: "2px solid #9dc0fa",
    }), // Add this line to change background color when focused
    // border:
    // window.matchMedia &&
    // window.matchMedia("(prefers-color-scheme: dark)").matches
    //   ? ""
    //   : "0.5px solid #f5f5f5",
    // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }),
  input: (base) => ({
    ...base,
    borderRadius: 7
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "white"
    //     : "black",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 7,
    // backgroundColor:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#333"
    //     : "#fff",
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#fff"
    //     : "#000",
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: 7,
    // backgroundColor:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#333"
    //     : "#fff",
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#fff"
    //     : "#000",
  }),
  singleValue: (base) => ({
    ...base,
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#fff"
    //     : "#000",
  }),
  multiValueLabel: (base) => ({
    ...base,
    // backgroundColor:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#333"
    //     : "#f5f5f5",
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#fff"
    //     : "#000",
  }),
  multiValue: (base) => ({
    ...base,
    // backgroundColor:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#333"
    //     : "#f5f5f5",
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#fff"
    //     : "#000",
  }),
  multiValueRemove: (base) => ({
    ...base,
    // backgroundColor:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#333"
    //     : "#f5f5f5",
    // color:
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "#fff"
    //     : "#000",
    // "&:hover": {
    //   backgroundColor:
    //     window.matchMedia &&
    //     window.matchMedia("(prefers-color-scheme: dark)").matches
    //       ? "#444"
    //       : "#e0e0e0",
    //   color:
    //     window.matchMedia &&
    //     window.matchMedia("(prefers-color-scheme: dark)").matches
    //       ? "#fff"
    //       : "#000",
    // },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      // backgroundColor: isFocused
      //   ? "#9dc0fa"
      //   : window.matchMedia &&
      //     window.matchMedia("(prefers-color-scheme: dark)").matches
      //   ? "#333"
      //   : "#fff",
      // color:
      //   window.matchMedia &&
      //   window.matchMedia("(prefers-color-scheme: dark)").matches
      //     ? "#fff"
      //     : "#000",
      // border:
      //   window.matchMedia &&
      //   window.matchMedia("(prefers-color-scheme: dark)").matches
      //     ? ""
      //     : "0.5px solid #f5f5f5",
    };
  },
};

function SelectField({
  item,
  list,
  onChange,
  allowMultiple = false,
  creatable = true,
}) {
  const options = list.map((item) => ({
    value: item,
    label: item,
  }));
  return (
    <div className="mb-4 w-full" style={{ position: "relative" }}>
      <div className="flex items-center">
        <label
            className="block text-base font-semibold bg-green-200 px-2 py-2 rounded-l whitespace-nowrap"
            htmlFor={item.toLowerCase()}
        >
          {item}
        </label>
        {creatable ? (
          <CreatableSelect
          className="w-full"
            onChange={onChange}
            id={item}
            options={options}
            isSearchable
            isMulti={allowMultiple}
            placeholder={"Enter your " + item.toLowerCase()}
            styles={selectFieldStyle}
          />
        ) : (
          <Select
          className="w-full"
            onChange={onChange}
            id={item}
            options={options}
            isSearchable
            isMulti={allowMultiple}
            placeholder={"Select your " + item.toLowerCase()}
            styles={selectFieldStyle}
          />
        )}
      </div>
    </div>
  );
}

export { InputField, SelectField };
