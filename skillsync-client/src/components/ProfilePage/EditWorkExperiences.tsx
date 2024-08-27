import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import WorkExperienceCard from "./WorkExperienceCard";
import { WorkExperience } from "../../types/types";
import {
  DeleteWorkExperience,
  GetWorkExperiences,
} from "../../supabase/WorkExperience";

const EditWorkExperiences: React.FC = () => {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);

  const handleDeleteWorkExperienceCallback = (workExperienceId: string) => {
    console.log('Callback to delete work experience', workExperienceId);
    const newWorkExperiences = workExperiences.filter(
      (workExperience) => workExperience.id !== workExperienceId
    );
    console.log(newWorkExperiences)
    setWorkExperiences(newWorkExperiences);
  };

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
      {workExperiences
        .sort((a, b) =>
          a.startDate && b.startDate
            ? new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
            : 0
        )
        .map((workExperience, index) => (
          <WorkExperienceCard
            key={workExperience.id}
            workExperience={workExperience}
            deleteWorkExperienceCallback={handleDeleteWorkExperienceCallback}
          />
        ))}
    </div>
  );
};

export default EditWorkExperiences;
