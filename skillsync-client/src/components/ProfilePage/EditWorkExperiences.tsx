import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import WorkExperienceCard from "./WorkExperienceCard";
import { WorkExperience } from "../../types/types";
import { DeleteWorkExperience, GetWorkExperiences } from "../../supabase/WorkExperience";

const EditWorkExperiences: React.FC = () => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [editableIndex, setEditableIndex] = useState<number | null>(null);

  const handleAddWorkExperience = () => {
    const newWorkExperience: WorkExperience = {
      id: "",
      title: "",
      company: "",
      description: "",
      startDate: null,
      endDate: null,
      location: "",
    };
    setWorkExperiences([...workExperiences, newWorkExperience]);
  };

  useEffect(() => {
    async function getWorkExperiences() {
      const workExperiences = await GetWorkExperiences();
      if (workExperiences) {
        setWorkExperiences(workExperiences);
      }
    }

    getWorkExperiences();
  }, []);

  const handleDeleteWorkExperience = async (index: number) => {
    const updatedWorkExperiences = [...workExperiences];
    updatedWorkExperiences.splice(index, 1);
    await DeleteWorkExperience(workExperiences[index]);
    setWorkExperiences(updatedWorkExperiences);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-8 mb-4">
        <h1 className="text-white text-2xl font-bold mb-4">Work Experiences</h1>
        <button
          onClick={handleAddWorkExperience}
          className="flex items-center bg-transparent border border-green-700 border-[2px] text-white px-4 py-2 rounded-md"
        >
          <FaPlus className="mr-2" />
          Add Work Experience
        </button>
      </div>
      {workExperiences.map((workExperience, index) => (
        <WorkExperienceCard
          key={index}
          workExperience={workExperience}
          handleDeleteWorkExperience={() => handleDeleteWorkExperience(index)}
        />
      ))}
    </div>
  );
};

export default EditWorkExperiences;
