import React, { useEffect, useState } from "react";
import { FaBookmark, FaLink, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoBookmark, IoCashOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";

// import getGlassDoorRating from '../utilities/get_glassdoor_rating.js';

const JobDescriptionCard = ({ jobDescription, className = "" }) => {
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
        navigator.clipboard.writeText(window.location.href);
      }
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
      <div className="job-details w-full p-4 pl-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

function parseSalary(jobDescription) {
  const salaryPatterns = [
    /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?-\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches $115,100 - $161,200 CAN Annually
    /\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)\s?-\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches 50,000 USD - 70,000 USD (annually)
    /\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\s?-\s?\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\b/gi, // Matches $135K/yr - $195K/yr
    /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?-\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/gi, // Matches $112,000 - $140,000
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars|pounds|euros|CAD)\s?-\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars|pounds|euros|CAD)\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches 50,000 dollars - 70,000 dollars (annually)
    /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches $50,000 USD (annually)
    /£\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:GBP)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches £50,000 GBP (annually)
    /€\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:EUR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches €50,000 EUR (annually)
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches 50,000 USD (annually)
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars|pounds|rupees|euros|CAD)\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches 50,000 dollars (annually)
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:k|K)\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi, // Matches 50k CAD (annually)
  ];

  for (const pattern of salaryPatterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      if (
        /\$|\b(USD|CAD|GBP|EUR|CAN|INR)\b|\b(annually|monthly|yearly|\/yr|\/mo)\b/.test(
          match[0]
        )
      ) {
        {
          return match[0];
        }
      }
    }
  }

  return false;
}

export default JobDescriptionCard;
