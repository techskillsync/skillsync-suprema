import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoBookmark, IoCashOutline } from "react-icons/io5";

const JobDetailsSlide = ({ jobDescription, className = "" }) => {
  if (jobDescription?.company || jobDescription?.title) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const descriptionClass = expanded ? "" : "h-[250px] overflow-hidden";

    return (
      <div
        className={
          className + " job-description-card rounded-lg shadow-md px-8"
        }
      >
        {jobDescription.logo_url ? (
          <div className="company-logo pt-12 pb-4 mx-auto rounded-lg">
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
          <div className="flex justify-between">
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-2">
                {jobDescription.company}
              </h2>
            </div>
            <div className="w-1/2">
              <div className="flex justify-end flex-row items-center">
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
            <div className="relative">
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
