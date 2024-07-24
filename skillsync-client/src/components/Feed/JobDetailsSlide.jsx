import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
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

// import getGlassDoorRating from '../utilities/get_glassdoor_rating.js';

const JobDetailsSlide = ({ jobDescription, className = "" }) => {
  const [glassdoorRating, setGlassdoorRating] = useState(null);

  if (jobDescription?.company || jobDescription?.title) {
    return (
      <div
        className={
          className + " job-description-card rounded-lg shadow-md px-8"
        }
      >
        {jobDescription.logo_url && (
          <div className="company-logo pt-12 pb-4 mx-auto rounded-lg">
            <img
              src={jobDescription.logo_url}
              alt={jobDescription.company}
              className="h-full rounded-lg mx-auto object-cover"
            />
          </div>
        )}
        <h3 className="mr-2 text-2xl text-center bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent font-semibold">
          {jobDescription.title}
        </h3>
        <div className="job-details w-full pt-2 pb-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-2">{jobDescription.company}</h2>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <p>{jobDescription.location}</p>
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
            <p className="text-justify">{jobDescription.description}</p>
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
