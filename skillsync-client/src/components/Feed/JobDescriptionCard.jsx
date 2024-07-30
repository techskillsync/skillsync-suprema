import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBookmark,
  FaLink,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoBookmark, IoCashOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";
import getGlassDoorRating from "../../utilities/get_glassdoor_rating";
import {
  CheckExists,
  RemoveJob,
  SaveJob,
} from "../../supabase/JobApplicationTracker.ts";
import SharePopup from "./SharePopup.jsx";
import { confirmWrapper } from "../common/Confirmation.jsx";

const JobDescriptionCard = ({
  jobDescription,
  className = "",
  mini = false,
  showGlassdoorRating = true,
  action = () => {},
}) => {
  const [glassdoorRating, setGlassdoorRating] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (saved) {
      // Remove from saved
      if (await confirmWrapper('Are you sure you want to remove this job from your tracker?')) {
        if (await RemoveJob(jobDescription.id)) {
          setSaved(false);
        }
      }
    } else {
      // Add to saved
      if (await SaveJob(jobDescription.id)) {
        setSaved(true);
      }
    }
  };

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

  // console.log('Job Description Card');
  // console.log(jobDescription);

  // Get glassdoor rating:
  // useEffect(() => {
  //   const fetchGlassdoorRating = async () => {
  //     const rating = await getGlassDoorRating(jobDescription.company);
  //     setGlassdoorRating(rating);
  //   };
  //   fetchGlassdoorRating();
  // }, []);

  return (
    <div
      className={
        className +
        " fade-in job-description-card bg-white !text-black rounded-lg shadow-md flex " +
        (mini ? "w-500px" : "")
      }
    >
      {jobDescription.logo_url && !mini && (
        <div className={`company-logo bg-white rounded-lg`}>
          <img
            src={jobDescription.logo_url}
            alt={jobDescription.company}
            className="h-full rounded-s-lg object-cover w-[182px]"
          />
        </div>
      )}
      <div className=" relative job-details w-full py-4 pl-8 pr-5">
        {mini && jobDescription.logo_url && (
          <img
            src={jobDescription.logo_url}
            alt={jobDescription.company}
            className="absolute top-3 right-3 h-16 w-16 rounded"
          />
        )}
        <div className="flex justify-between">
          <h2 className="w-2/3 text-xl text-wrap font-bold mb-2">{jobDescription.company}</h2>
          <div className="w-1/3">
            {showGlassdoorRating && !mini && glassdoorRating && (
              <div className="flex">
                <h3 className="mr-2 bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent font-semibold">
                  Glassdoor rating:
                </h3>
                {glassdoorRating ? glassdoorRating : "Loading..."}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center mb-2">
          <TiSpanner className="mr-2" />

          <p className={mini ? "text-base" : "text-lg"}>
            {" "}
            {mini
              ? jobDescription.title.substring(0, 26) +
                (jobDescription.title.length > 26 ? "..." : "")
              : jobDescription.title}
          </p>
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
        <div className="flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          <p className={mini ? "text-base" : 'text-lg'}>{jobDescription.location}</p>
        </div>
        {/* <div>
          <p>{jobDescription.description.substring(0, 100) + '...'}</p>
        </div> */}
        {/* <div className="flex">
          <a className="mt-3" href="https://www.glassdoor.com/index.htm">
            powered by{' '}
            <img
              src="https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png"
              title="Job Search"
            />
          </a>
        </div> */}
        <div>
          <div className="flex mt-4">
          <button
                key="save"
                onClick={handleSave}
                className={`flex items-center text-gray-700 transition-all duration-150 rounded-full px-4 py-2 mr-4 ${saved ? 'bg-blue-200 hover:bg-red-200' : 'bg-gray-200 hover:bg-gray-400'}`}
              >
                <IoBookmark />
                {!mini && <span className="ml-2">{saved ? "Saved" : "Save"}</span>}
              </button>
            {actions.map((action) => (
              <button
                key={action.title}
                onClick={action.action}
                className="flex items-center bg-gray-200 text-gray-700 hover:bg-gray-400 transition-all duration-150 rounded-full px-4 py-2 mr-4"
              >
                {action.icon}
                {!mini && <span className="ml-2">{action.title}</span>}
              </button>
            ))}
            <SharePopup content={jobDescription.id}>
              <button className="flex items-center bg-gray-200 text-gray-700 hover:bg-gray-400 transition-all duration-150 rounded-full px-4 py-2">
                <FaUserGroup />
                {!mini && <span className="ml-2">Share</span>}
              </button>
            </SharePopup>
            {action && (
              <button
                onClick={action}
                className="ml-auto flex items-center bg-gray-200 text-gray-700 hover:bg-gray-400 transition-all duration-150 rounded-full px-4 py-2"
              >
                <FaArrowRight />
                {/* <span className="ml-2">Apply</span> */}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionCard;
