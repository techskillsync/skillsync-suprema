import React, { useEffect, useState } from "react";
import { FaLink, FaSearch } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoBookmark, IoCashOutline } from "react-icons/io5";
import SharePopup from "./SharePopup";
import { FaUserGroup } from "react-icons/fa6";
import { CheckExists, SaveJob } from "../../supabase/JobApplicationTracker";

const JobDetailsSlide = ({ jobDescription, className = "" }) => {
  if (jobDescription?.company || jobDescription?.title) {
    const [expanded, setExpanded] = useState(false);
    // const [saved, setSaved] = useState(false);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const descriptionClass = expanded ? "" : "h-[250px] overflow-hidden";

    // const handleSave = async () => {
    //   if (saved) {
    //     // Remove from saved
    //     if (
    //       await confirmWrapper(
    //         "Are you sure you want to remove this job from your tracker?"
    //       )
    //     ) {
    //       if (await RemoveJob(jobDescription.id)) {
    //         setSaved(false);
    //       }
    //     }
    //   } else {
    //     // Add to saved
    //     if (await SaveJob(jobDescription.id)) {
    //       setSaved(true);
    //     }
    //   }
    // };

    useEffect(() => {
      async function checkExists(id) {
        const saved = await CheckExists(id);
        setSaved(saved);
      }
      checkExists(jobDescription.id);
    }, []);

    const actions = [
      // {
      //   title: !saved ? "Save" : "Saved",
      //   icon: <IoBookmark />,
      //   action: handleSave,
      // },
      {
        title: "Copy Link",
        icon: <FaLink />,
        action: () => {
          navigator.clipboard.writeText(jobDescription.link);
        },
        // },
        // {
        //   title: "Share",
        //   icon: <FaUserGroup />,
      },
    ];

    return (
      <div
        className={
          className + " job-description-card rounded-lg shadow-md px-8"
        }
      >
        {jobDescription.logo_url ? (
          <div className="company-logo pt-12 pb-4 mx-auto rounded-lg max-w-[100px]">
            <img
              src={jobDescription.logo_url}
              alt={jobDescription.company}
              className="h-full rounded-lg mx-auto object-cover"
            />
          </div>
        ) : (
          <div className="py-6"></div>
        )}
        <h3 className="mr-2 text-2xl text-center bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent font-semibold">
          {jobDescription.title}
        </h3>
        <div className={`job-details w-full pt-2 pb-4`}>
          <div
            className={
              jobDescription.company.length > 20 ||
              jobDescription.location.length > 20
                ? ""
                : "flex justify-between"
            }
          >
            <div className="w-full">
              <h2 className="text-xl font-bold">{jobDescription.company}</h2>
            </div>
            <div className="w-full">
              <div
                className={`flex flex-row items-center ${
                  jobDescription.company.length > 20 ||
                  jobDescription.location.length > 20
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <FaMapMarkerAlt className="mr-2" />
                <p>{jobDescription.location}</p>
              </div>
            </div>
          </div>
          {jobDescription.salary &&
            (jobDescription.salary.toString().length > 0 ||
              parseSalary(jobDescription.description)) && (
              <div className="flex items-center mb-2">
                <IoCashOutline className="mr-2" />
                <p>
                  {!jobDescription.salary || jobDescription.salary == ""
                    ? parseSalary(jobDescription.description)
                    : jobDescription.salary}
                </p>
              </div>
            )}
          <div>
            <div className="relative mt-2">
              <p className={`text-sm text-justify ${descriptionClass}`}>
                {jobDescription.description}
              </p>
              {!expanded && (
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
              )}
            </div>
          </div>
          {jobDescription.description.length > 200 && (
            <div className="">
              <a
                className="cursor-pointer text-blue-500 p-1 border-none font-semibold"
                onClick={toggleExpand}
              >
                {expanded ? "Show Less" : "Show More"}
              </a>
            </div>
          )}
          {/* <div className="my-2 flex">
            <SharePopup content={jobDescription.id}>
              <button className="text-[14px] flex items-center bg-[#2e2e2e] text-white hover:bg-[#1e1e1e] transition-all duration-150 rounded-full px-4 py-2 mr-4">
                <FaUserGroup />
                <span className="ml-2">Share</span>
              </button>
            </SharePopup>
            <button
              key="save"
              onClick={handleSave}
              className={`text-[14px] flex items-center text-white transition-all duration-150 rounded-full px-4 py-2 mr-4 ${
                saved
                  ? "bg-blue-200 hover:bg-red-200"
                  : "bg-[#2e2e2e] hover:bg-[#2e2e68]"
              }`}
            >
              <IoBookmark />

              <span className="ml-2">{saved ? "Saved" : "Save"}</span>
            </button>
            {actions.map((action) => (
              <button
                key={action.title}
                onClick={action.action}
                className="text-[14px] flex items-center !border-none bg-[#2e2e2e] text-white hover:bg-[#1e1e1e] transition-all duration-150 rounded-full px-4 py-2 mr-4"
              >
                {action.icon}
                <span className="ml-2">{action.title}</span>
              </button>
            ))}
          </div> */}
          <div className="py-5 flex items-center w-full" target>
            <a
              href={jobDescription.link}
              target="_blank"
              className="w-full"
              rel="noopener noreferrer"
            >
              <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 border-none text-black font-semibold py-2 px-4 rounded">
                Apply Now
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-auto w-full">
        <div className="h-auto w-full">
          <FaSearch className="mx-auto text-center text-4xl my-[50%]" />
        </div>
      </div>
    );
  }
};

export default JobDetailsSlide;
