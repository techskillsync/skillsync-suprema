import React, { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBookmark,
  FaExclamationTriangle,
  FaLink,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaSave,
} from "react-icons/fa";
import { FaExclamation, FaUserGroup } from "react-icons/fa6";
import { IoBookmark, IoCashOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";
import getGlassDoorRating from "../../utilities/get_glassdoor_rating";
import {
  CheckExists,
  RemoveJob,
  SaveJob,
} from "../../supabase/JobApplicationTracker.ts";
import SharePopup from "../Feed/SharePopup.jsx";
import { confirmWrapper } from "../common/Confirmation.jsx";
import ReportPopup from "../Feed/ReportPopup.jsx";

const JobDescriptionCard = ({
  jobDescription,
  className = "",
  trackerDisplay = false,
  showGlassdoorRating = true,
  action = () => {},
}) => {
  const [glassdoorRating, setGlassdoorRating] = useState(null);
  const [saved, setSaved] = useState(false);

  const salary = parseSalary(jobDescription.description);

  const handleSave = async () => {
    if (saved) {
      // Remove from saved
      if (
        await confirmWrapper(
          "Are you sure you want to remove this job from your tracker?"
        )
      ) {
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

  return (
    <div
    //   onClick={action}
      className={
        className +
        " cursor-pointer job-description-card bg-white !text-black rounded-lg shadow-md flex w-500px"
      }
    >
      <div className=" relative job-details w-full px-6 py-4">
        {jobDescription.logo_url && (
          <img
            src={jobDescription.logo_url}
            alt={jobDescription.company}
            className={"absolute top-3 right-3 h-16 w-16 rounded"}
          />
        )}
        <div className="flex justify-between">
          <h2 className={"w-2/3 text-wrap !font-bold mb-2 text-lg font-bold"}>
            {jobDescription.company.substring(0, 19) +
              (jobDescription.company.length > 19 ? "..." : "")}
          </h2>
          <div className="w-1/3">
          </div>
        </div>
        <div className="flex items-center mb-2">
          <TiSpanner className="mr-2" />

          <p className={`max-w-[80%] text-base`}>
            {" "}
            {jobDescription.title.substring(0, 26) +
                (jobDescription.title.length > 26 ? "..." : "")}
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
          <p className="text-base">
            {jobDescription.location}
          </p>
        </div>
        {salary && (
          <div className="flex items-center mt-2">
            <FaMoneyBill className="mr-2" />
            <p className="text-base">{salary}</p>
          </div>
        )}
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
      </div>
    </div>
  );
};

function parseSalary(jobDescription) {
  const salaryPatterns = [
    /CAD\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?-\s?CAD\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?per\s?month/gi,
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
    /CA\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\s?-\s?CA\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\b/gi, // Matches CA$115,000/yr - CA$150,000/yr
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
