import React from "react";
import { useState } from "react";
import { WorkExperience } from "../../types/types";
import {
  UpdateWorkExperience,
  SaveNewWorkExperience,
  DeleteWorkExperience,
} from "../../supabase/WorkExperience";
import { confirm, confirmWrapper } from "../common/Confirmation";

import { IoIosClose } from "react-icons/io";
import { FaCross, FaPencilAlt, FaSave, FaTrash, FaXing } from "react-icons/fa";

const WorkExperienceCard: React.FC<{
  workExperience: WorkExperience;
  deleteWorkExperienceCallback: (workExperienceId: string) => void;
}> = ({ workExperience, deleteWorkExperienceCallback }) => {
  const [workExperienceState, setWorkExperienceState] =
    useState<WorkExperience>(workExperience);

  const [editable, setEditable] = useState(workExperience.title === "");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof WorkExperience, value: string) => {
    setWorkExperienceState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleDeleteWorkExperience = async () => {
    console.log("Deleting work experience confirmation");
    if (
      await confirmWrapper(
        "Are you sure you want to delete this work experience?"
      )
    ) {
      if (typeof deleteWorkExperienceCallback === "function") {
        console.log("Deleting work experience", workExperienceState);
        deleteWorkExperienceCallback(workExperienceState.id);
      } else {
        console.error("deleteWorkExperienceCallback is not a function");
      }
      DeleteWorkExperience(workExperienceState);
    } else {
    }
  };

  const handleSaveWorkExperience = async () => {
    // Validate
    if (
      workExperienceState.title === "" ||
      workExperienceState.company === ""
    ) {
      return;
    }
    setLoading(true);

    console.log("Saving work experience", workExperienceState);
    if (workExperienceState.id) {
      await UpdateWorkExperience(workExperienceState);
    } else {
      await SaveNewWorkExperience(workExperienceState);
    }

    setEditable(false);
  };

  return (
    <div className="!text=white fade-in mx-8 mb-6 rounded-lg bg-[#1e1e1e] p-4">
      <div className="flex flex-col">
        <div className="flex justify-between">
          {WorkExperienceInputField({
            item: "title",
            value: workExperience.title,
            onChange: (e) => handleInputChange("title", e.target.value),
            placeholder: "Title",
            editable,
            className: "text-2xl font-bold",
          })}
          {editable ? (
            <div className="flex h-6">
              <button
              title="Save"
                onClick={() => {
                  handleSaveWorkExperience();
                  setEditable(false);
                }}
                disabled={loading}
                className="text-green-500 px-2 py-1 rounded-md mr-2"
              >
                <FaSave/>
              </button>
              <button
              title="Cancel"
                onClick={() => {
                  setEditable(false);
                }}
                className="text-red-500 px-2 py-1 rounded-md flex items-center text-3xl"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex h-6">
              <button
              title="Edit"
                onClick={() => setEditable(true)}
                className="text-green-400  px-2 py-1 rounded-md mr-2"
              >
                <FaPencilAlt/>
              </button>
              <button
              title="Delete"
                onClick={handleDeleteWorkExperience}
                className="text-red-500  px-2 py-1 rounded-md"
              >
                <FaTrash/>
              </button>
            </div>
          )}
        </div>
        {WorkExperienceInputField({
          item: "company",
          value: workExperience.company,
          onChange: (e) => handleInputChange("company", e.target.value),
          placeholder: "Company",
          editable,
          className: "text-xl font-semibold",
        })}
        <div className="flex items-center">
          {WorkExperienceInputField({
            item: "startDate",
            value: workExperience.startDate,
            onChange: (e) => handleInputChange("startDate", e.target.value),
            placeholder: "Start Date",
            editable,
            className: "mr-2",
            type: "date",
          })}
          <span className="mb-2 mr-8 text-white">--</span>
          {!editable && !workExperience.endDate ? (
            <span className="text-xl text-white mb-2 font-medium">Present</span>
          ) : (
            WorkExperienceInputField({
              item: "endDate",
              value: workExperience.endDate,
              onChange: (e) => handleInputChange("endDate", e.target.value),
              placeholder: "End Date",
              editable,
              type: "date",
            })
          )}
        </div>
        {WorkExperienceInputField({
          item: "location",
          value: workExperience.location,
          onChange: (e) => handleInputChange("location", e.target.value),
          placeholder: "Location",
          editable,
          type: "text",
        })}
      </div>

      {WorkExperienceInputField({
        item: "description",
        value: workExperience.description,
        onChange: (e) => handleInputChange("description", e.target.value),
        placeholder: "Description",
        editable,
        className: "w-full",
        isTextArea: true,
      })}
    </div>
  );
};

export default WorkExperienceCard;

function WorkExperienceInputField({
  item,
  value,
  onChange,
  placeholder,
  editable,
  className,
  type = "text",
  isTextArea = false,
}: {
  item: keyof WorkExperience;
  value: any;
  placeholder: string;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  editable: boolean;
  className?: string;
  type?: string;
  isTextArea?: boolean;
}) {
  return isTextArea ? (
    <textarea
      placeholder={placeholder}
      defaultValue={value}
      onChange={onChange}
      className={`bg-transparent rounded-md p-2 mb-2 text-white ${
        editable ? "border-green-700" : "border-none bg-[#282828]"
      } ${className}`}
      disabled={!editable}
    />
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      onChange={onChange}
      className={`bg-transparent rounded-md p-1 mb-1 text-white ${
        editable ? "border-green-700" : "border-none"
      } ${className}`}
      disabled={!editable}
    />
  );
}
