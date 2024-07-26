import React from "react";
import { useState } from "react";
import { WorkExperience } from "./EditWorkExperiences";

const WorkExperienceCard: React.FC<{
    workExperience: WorkExperience;
    handleDeleteWorkExperience: () => void;
}> = ({ workExperience, handleDeleteWorkExperience }) => {
    const [editable, setEditable] = useState(workExperience.title === "");

    const handleInputChange = (
        index: number,
        field: keyof WorkExperience,
        value: string
    ) => {
        // handle input change logic
    };

    const handleSaveWorkExperience = () => {
        setEditable(false);
    };

    const handleEditWorkExperience = (index: number) => {
        setEditable(true);
    };

    const handleToggleEdit = () => {
        setEditable(!editable);
    };

    return (
        <div className="mx-8 mb-4 rounded-lg bg-[#1e1e1e] p-4">
            <div className="flex flex-col">
                {WorkExperienceInputField({
                    item: "title",
                    value: workExperience.title,
                    placeholder: "Title",
                    editable,
                    className: "text-2xl font-bold",
                })}
                {WorkExperienceInputField({
                    item: "company",
                    value: workExperience.company,
                    placeholder: "Company",
                    editable,
                    className: "text-xl font-semibold",
                })}
                <div className="flex items-center">
                    {WorkExperienceInputField({
                        item: "startDate",
                        value: workExperience.startDate,
                        placeholder: "Start Date",
                        editable,
                        className: "mr-2",
                        type: "date",
                    })}
                    <span className="mb-2 mr-8">--</span>
                    {WorkExperienceInputField({
                        item: "endDate",
                        value: workExperience.endDate,
                        placeholder: "End Date",
                        editable,
                        type: "date",
                    })}
            </div>
            </div>

            {WorkExperienceInputField({
                item: "description",
                value: workExperience.description,
                placeholder: "Description",
                editable,
                className: "w-full",
                isTextArea: true,
            })
            }
            
            {editable ? (
                <div className="flex">
                    <button
                        onClick={() => {
                            handleSaveWorkExperience();
                            handleToggleEdit();
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleToggleEdit}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="flex">
                    <button
                        onClick={handleToggleEdit}
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
    placeholder,
    editable,
    className,
    type='text',
    isTextArea=false
}: {
  item: keyof WorkExperience;
  value: any;
  placeholder: string;
  editable: boolean;
  className?: string;
  type?: string;
    isTextArea?: boolean;
}) {
  return (
    isTextArea ? <textarea
      placeholder={placeholder}
    //   value={value}
    //   onChange={(e) => handleInputChange(index, item, e.target.value)}
        className={`bg-transparent rounded-md p-2 mb-2 ${editable ? 'border-green-700' : 'border-none'} ${className}`}
        disabled={!editable}
    /> :
    <input
      type={type}
      placeholder={placeholder}
    //   value={value}
    //   onChange={(e) => handleInputChange(index, item, e.target.value)}
      className={`bg-transparent rounded-md p-2 mb-2 ${editable ? 'border-green-700' : 'border-none'} ${className}`}
      disabled={!editable}
    />
  );
}
