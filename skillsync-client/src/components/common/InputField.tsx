import React from "react";
import CreatableSelect from "react-select/creatable";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";

const InputField = ({
  item,
  onChange,
  value = "",
  placeholder = "",
  showLabel = true,
  className = "",
  type = "text",
  id = "",
  required = false,
}) => (
  <div className="flex items-center w-full h-full">
    {showLabel && (
      <div className="max-w-1/2 h-full">
        <label
          className={
            " !h-full rounded-l flex items-center fblock text-sm font-semibold min-w-[60px] !text-white bg-emerald-600 px-3 py-2 whitespace-nowrap "
          }
          htmlFor={item.toLowerCase()}
        >
          {item}
        </label>
      </div>
    )}
    <input
      id={id ?? item.toLowerCase()}
      value={value ?? null}
      className={
        className +
        " !w-full appearance-none !text-base border border-[#b3b3b3] border-[0.3px] w-full focus:ring py-[7px] px-3 transition-all duration-300 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:shadow-outline "
      }
      required={required}
      onChange={onChange}
      type={type}
      placeholder={
        placeholder !== "" ? placeholder : "Enter your " + item.toLowerCase()
      }
    />
  </div>
);

const selectFieldStyle = {
  control: (base, state) => ({
    ...base,
    overflowX: "auto",
    whiteSpace: "nowrap",
    width: "100%",
    textAlign: "left",
    borderRadius: "0 3px 3px 0",
    height: "100%",
    ...(state.isFocused && {}),
  }),
  input: (base) => ({
    ...base,
  }),
  clearIndicator: (base) => ({
    ...base,
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 7,
  }),
  menuList: (base) => ({
    ...base,
    borderRadius: 7,
  }),
  singleValue: (base) => ({
    ...base,
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: 15,
  }),
  multiValue: (base) => ({
    ...base,
  }),
  multiValueRemove: (base) => ({
    ...base,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
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
  onChange: (
    newValue:
      | MultiValue<{ value: string; label: string }>
      | SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => void;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  item,
  list,
  onChange,
  value = null,
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
    <div className="w-full" style={{ position: "relative" }}>
      <div className="flex items-center w-full h-full">
        {showLabel && (
          <div className="max-w-1/2 h-full">
            <label
              className=" !h-9 rounded-l flex items-center text-sm font-semibold min-w-[60px] !text-white bg-emerald-600 px-3 py-2 whitespace-nowrap"
              htmlFor={item.toLowerCase()}
            >
              {item}
            </label>
          </div>
        )}
        {creatable ? (
          <CreatableSelect
            className={className + " w-full h-full"}
            onChange={onChange}
            id={id ?? item}
            required={required}
            formatCreateLabel={(inputValue) => `${inputValue}`}
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
            className={className + " w-full h-full"}
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
};

export { InputField, SelectField };
