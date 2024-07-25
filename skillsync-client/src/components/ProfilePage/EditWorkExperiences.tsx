import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import WorkExperienceCard from './WorkExperienceCard';

type WorkExperience = {
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate: string;
};


const EditWorkExperiences: React.FC = () => {
    const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
    const [editableIndex, setEditableIndex] = useState<number | null>(null);

    const handleAddWorkExperience = () => {
        const newWorkExperience: WorkExperience = {
            title: '',
            company: '',
            description: '',
            startDate: '',
            endDate: '',
        };
        setWorkExperiences([...workExperiences, newWorkExperience]);
    };

    const handleEditWorkExperience = (index: number) => {
        setEditableIndex(index);
    };

    const handleSaveWorkExperience = (index: number) => {
        setEditableIndex(null);
    };

    const handleDeleteWorkExperience = (index: number) => {
        const updatedWorkExperiences = [...workExperiences];
        updatedWorkExperiences.splice(index, 1);
        setWorkExperiences(updatedWorkExperiences);
    };

    const handleInputChange = (index: number, field: keyof WorkExperience, value: string) => {
        const updatedWorkExperiences = [...workExperiences];
        updatedWorkExperiences[index][field] = value;
        setWorkExperiences(updatedWorkExperiences);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between px-8 mb-4">
                <h1 className="text-2xl font-bold mb-4">Work Experiences</h1>
                <button onClick={handleAddWorkExperience} className="flex items-center bg-transparent border border-green-700 border-[2px] text-white px-4 py-2 rounded-md">
               <FaPlus className='mr-2' />
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

export {WorkExperience}
export default EditWorkExperiences;