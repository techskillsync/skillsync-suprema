import React, { useState } from 'react';

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
        <div className='w-full'>
            <h1 className="text-2xl font-bold mb-4">Add Work Experiences</h1>
            {workExperiences.map((workExperience, index) => (
                <div key={index} className="mb-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={workExperience.title}
                        onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 mb-2"
                        disabled={editableIndex !== index}
                    />
                    <input
                        type="text"
                        placeholder="Company"
                        value={workExperience.company}
                        onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 mb-2"
                        disabled={editableIndex !== index}
                    />
                    <div className="flex">
                        <input
                            type="date"
                            placeholder="Start Date"
                            value={workExperience.startDate}
                            onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                            className="border border-gray-300 rounded-md p-2 mr-2 text-sm"
                            disabled={editableIndex !== index}
                        />
                        <input
                            type="date"
                            placeholder="End Date"
                            value={workExperience.endDate}
                            onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                            className="border border-gray-300 rounded-md p-2 text-sm"
                            disabled={editableIndex !== index}
                        />
                    </div>
                    <textarea
                        placeholder="Description"
                        value={workExperience.description}
                        onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                        className="border border-gray-300 rounded-md p-2 h-24 resize-none"
                        disabled={editableIndex !== index}
                    />
                    {editableIndex === index ? (
                        <div className="flex">
                            <button
                                onClick={() => handleSaveWorkExperience(index)}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditableIndex(null)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex">
                            <button
                                onClick={() => handleEditWorkExperience(index)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteWorkExperience(index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleAddWorkExperience} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Add Work Experience
            </button>
        </div>
    );
};

export default EditWorkExperiences;