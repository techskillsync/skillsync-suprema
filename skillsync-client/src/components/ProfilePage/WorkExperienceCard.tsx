import React from "react";
import { useState } from "react";
import { WorkExperience } from "../../types/types";
import {
  UpdateWorkExperience,
  SaveNewWorkExperience,
  DeleteWorkExperience,
} from "../../supabase/WorkExperience";

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
    if (typeof deleteWorkExperienceCallback === "function") {
      console.log("Deleting work experience", workExperienceState);
      deleteWorkExperienceCallback(workExperienceState.id);
    } else {
      console.error("deleteWorkExperienceCallback is not a function");
    }
    DeleteWorkExperience(workExperienceState);
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
    <div className="!text=white mx-8 mb-4 rounded-lg bg-[#1e1e1e] p-4">
      <div className="flex flex-col">
        {WorkExperienceInputField({
          item: "title",
          value: workExperience.title,
          onChange: (e) => handleInputChange("title", e.target.value),
          placeholder: "Title",
          editable,
          className: "text-2xl font-bold",
        })}
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

      {editable ? (
        <div className="flex">
          <button
            onClick={() => {
              handleSaveWorkExperience();
              setEditable(false);
            }}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditable(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex">
          <button
            onClick={() => setEditable(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteWorkExperience}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      )}
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
