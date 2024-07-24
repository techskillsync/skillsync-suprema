import React from "react";
import CreatableSelect from "react-select/creatable";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";

const InputField = ({
  item,
  onChange,
  value = '',
  placeholder = "",
  showLabel = true,
  className = "",
  type = "text",
  id = "",
  required = false,
}) => {
  return (
    <div className="flex items-center w-full">
      {showLabel && (
        <div className="max-w-1/2">
          <label
            className="block text-base font-semibold min-w-[120px] !text-white bg-emerald-600 px-3 py-2 rounded-l whitespace-nowrap"
            htmlFor={item.toLowerCase()}
          >
            {item}
          </label>
        </div>
      )}
      <input
        id={id ?? item.toLowerCase()}
        value={value}
        itemType={type}
        className={
          className +
          "!w-full appearance-none !text-base border border-[#b3b3b3] border-[0.3px] rounded-r w-full focus:ring py-[7px] px-3 transition-all duration-300 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:shadow-outline"
        }
        required={required}
        onChange={onChange}
        type="text"
        placeholder={
          placeholder !== "" ? placeholder : "Enter your " + item.toLowerCase()
        }
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
    borderRadius: 7,
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

interface SelectFieldProps {
  id: string;
  item: string;
  list: string[] | number[];
  value: { value: string; label: string } | null;
  allowMultiple: boolean | undefined;
  placeholder: string | undefined;
  showLabel: boolean | undefined;
  creatable: boolean | undefined;
  required: boolean;
  onChange: (newValue: MultiValue<{ value: string; label: string; }> | SingleValue<{ value: string; label: string; }>, actionMeta: ActionMeta<{ value: string; label: string; }>) => void;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  item,
  list,
  onChange,
  value=null,
  allowMultiple = false,
  creatable = true,
  placeholder = "",
  showLabel = true,
  className = "",
  id = "",
  required = false,
}) => {
  const options = list.map((item) => ({
    value: item,
    label: item,
  }));
  return (
    <div className="mb-4 w-full" style={{ position: "relative" }}>
      <div className="flex items-center">
        {showLabel && (
          <div className="max-w-1/2">
            <label
              className="block text-base font-semibold min-w-[120px] !text-white bg-emerald-600 px-3 py-2 rounded-l whitespace-nowrap"
              htmlFor={item.toLowerCase()}
            >
              {item}
            </label>
          </div>
        )}
        {creatable ? (
          <CreatableSelect
            className={className + " w-full"}
            onChange={onChange}
            id={id ?? item}
            required={required}
            value={value}
            options={options}
            isSearchable
            isMulti={allowMultiple}
            placeholder={
              placeholder !== ""
              ? placeholder
              : "Enter your " + item.toLowerCase()
            }
            styles={selectFieldStyle}
          />
        ) : (
          <Select
          
          className={className + " w-full"}
          onChange={onChange}
          id={id ?? item}
          value={value}
          required={required}
          options={options}
            isSearchable
            isMulti={allowMultiple}
            placeholder={
              placeholder !== ""
                ? placeholder
                : "Select your " + item.toLowerCase()
            }
            styles={selectFieldStyle}
          />
        )}
      </div>
    </div>
  );
}

export { InputField, SelectField };
