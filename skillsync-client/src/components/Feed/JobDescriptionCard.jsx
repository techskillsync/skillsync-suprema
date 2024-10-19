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
import SharePopup from "./SharePopup.jsx";
import { confirmWrapper } from "../common/Confirmation.jsx";
import ReportPopup from "./ReportPopup.jsx";
import MobileActionsMenu from "./MobileActionsMenu.jsx"; 

const JobDescriptionCard = ({
  jobDescription,
  className = "",
  mini = false,
  trackerDisplay = false,
  showGlassdoorRating = true,
  action = () => {},
}) => {
  const [glassdoorRating, setGlassdoorRating] = useState(null);
  const [saved, setSaved] = useState(false);

  const salary = parseSalary(jobDescription.jobDescription);

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

  // useEffect(() => {
  //   async function checkExists(id) {
  //     const saved = await CheckExists(id);
  //     setSaved(saved);
  //   }
  //   checkExists(jobDescription.id);
  // }, []);

  const actions = [
    {
      title: "Copy Link",
      icon: <FaLink />,
      action: () => {
        navigator.clipboard.writeText(jobDescription.link);
      },
    },
    // Other actions can be added here as needed
  ];

  return (
    <div
      className={
        className +
        " fade-in job-description-card bg-white !text-black rounded-lg shadow-md flex " +
        (mini ? "w-500px" : "")
      }
    >
      <div className="relative job-details w-full py-4 pl-8 pr-5">
        {jobDescription.logo_url && (
          <img
            src={jobDescription.logo_url}
            alt={jobDescription.companyName}
            className={
              mini ? "absolute top-3 right-3 h-16 w-16 rounded"
              : "absolute top-3 right-3 h-24 w-24 rounded"
            }
          />
        )}
        <div className="flex justify-between">
          <h2
            className={
              "w-2/3 text-wrap !font-bold mb-2 " + mini
                ? "text-lg font-bold"
                : "text-xl"
            }
          >
            {mini
              ? jobDescription.companyName.substring(0, 19) +
                (jobDescription.companyName.length > 19 ? "..." : "")
              : jobDescription.companyName}
          </h2>
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
          <p className={`max-w-[80%]  ${mini ? "text-base" : "text-lg"}`}>
            {mini
              ? jobDescription.jobTitle.substring(0, 26) +
                (jobDescription.jobTitle.length > 26 ? "..." : "")
              : jobDescription.jobTitle}
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
          <p className={mini ? "text-base" : "text-lg"}>
            {jobDescription.location}
          </p>
        </div>
        {salary && (
          <div className="flex items-center mt-2">
            <FaMoneyBill className="mr-2" />
            <p className={mini ? "text-base" : "text-lg"}>{salary}</p>
          </div>
        )}

        <div className="mt-4">
          <div className="block md:hidden">
            {/* Show actions in vertical dots menu on mobile view */}
            <MobileActionsMenu actions={actions} />
          </div>
          <div className="hidden md:flex">
            {/* Show actions as buttons on desktop view */}
            <button
              key="save"
              onClick={handleSave}
              className={`flex items-center text-gray-700 transition-all duration-150 rounded-full px-4 py-2 mr-4 ${
                saved
                  ? "bg-blue-200 hover:bg-red-200"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              <IoBookmark />
              {!mini && (
                <span className="ml-2">{saved ? "Saved" : "Save"}</span>
              )}
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
            <ReportPopup content={jobDescription.id}>
              <button className="ml-4 flex items-center bg-gray-200 text-gray-700 hover:bg-red-200 transition-all duration-150 rounded-full px-4 py-2">
                <FaExclamationTriangle />
                {!mini && <span className="ml-2">Report</span>}
              </button>
            </ReportPopup>
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

function parseSalary(jobDescription) {
  const salaryPatterns = [
    /CAD\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?-\s?CAD\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?per\s?month/gi,
    /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?-\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)\s?-\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\s?-\s?\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\b/gi,
    /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?-\s?\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/gi,
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars|pounds|euros|CAD)\s?-\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars|pounds|euros|CAD)\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /£\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:GBP)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /€\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:EUR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:dollars|pounds|rupees|euros|CAD)\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s?(?:k|K)\s?(?:USD|CAD|GBP|EUR|CAN|INR)?\s?(?:annually|monthly|yearly|\/yr|\/mo)?\b/gi,
    /CA\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\s?-\s?CA\$\d{1,3}(?:,\d{3})?(?:k|K)?\/yr\b/gi
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
