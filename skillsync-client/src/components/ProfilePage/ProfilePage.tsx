import React, { useState } from "react";
    import EditProfileDetails from "./EditProfileDetails";
import EditWorkExperiences from "./EditWorkExperiences";
    // import EditWorkExperience from "./EditWorkExperience";
    // import EditResumes from "./EditResumes";

    const ProfilePage = () => {
      const [selectedTab, setSelectedTab] = useState("personalInfo");

      const tabOptions = [
        { id: "personalInfo", label: "Personal Information", component: <EditProfileDetails /> },
        { id: "workExperience", label: "Work Experience", component: <EditWorkExperiences /> },
        { id: "resumes", label: "Resumes", component: <div /> },
      ];

      const renderTabContent = () => {
        const selectedOption = tabOptions.find((option) => option.id === selectedTab);
        return selectedOption ? selectedOption.component : null;
      };

      return (
        <div className="bg-black min-h-screen w-full pt-3">
          <div className="flex justify-center mb-3">
            {tabOptions.map((option) => (
              <button
                key={option.id}
                className={`mr-4 ${
                  selectedTab === option.id ? "text-white" : "text-gray-400"
                }`}
                onClick={() => setSelectedTab(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="">{renderTabContent()}</div>
        </div>
      );
    };

    export default ProfilePage;