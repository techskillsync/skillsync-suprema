import React, { useEffect, useState } from "react";
import { FaArrowRight, FaBookmark, FaLink, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoBookmark, IoCashOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";

// import getGlassDoorRating from '../utilities/get_glassdoor_rating.js';

const JobDescriptionCard = ({
  jobDescription,
  className = "",
  action = () => {},
}) => {
  const [glassdoorRating, setGlassdoorRating] = useState(null);

  const actions = [
    {
      title: "Save",
      icon: <IoBookmark />,
    },
    {
      title: "Copy Link",
      icon: <FaLink />,
      action: () => {
        navigator.clipboard.writeText(jobDescription.link);
      },
    },
    {
      title: "Share",
      icon: <FaUserGroup />,
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
        " job-description-card bg-white !text-black rounded-lg shadow-md flex"
      }
    >
      {jobDescription.logo_url && (
        <div className="company-logo w-[182px] bg-white rounded-lg">
          <img
            src={jobDescription.logo_url}
            alt={jobDescription.company}
            className="h-full rounded-s-lg object-cover"
          />
        </div>
      )}
      <div className="job-details w-full py-4 pl-8 pr-5">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-2">{jobDescription.company}</h2>
          <div className="flex">
            <h3 className="mr-2 bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent font-semibold">
              Glassdoor rating:
            </h3>
            {glassdoorRating ? glassdoorRating : "Loading..."}
          </div>
        </div>
        <div className="flex items-center mb-2">
          <TiSpanner className="mr-2" />

          <p className="text-lg">{jobDescription.title}</p>
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
          <p>{jobDescription.location}</p>
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
            {actions.map((action) => (
              <button
                key={action.title}
                onClick={action.action}
                className="flex items-center bg-gray-200 text-gray-700 hover:bg-gray-400 transition-all duration-150 rounded-full px-4 py-2 mr-4"
              >
                {action.icon}
                <span className="ml-2">{action.title}</span>
              </button>
            ))}
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
