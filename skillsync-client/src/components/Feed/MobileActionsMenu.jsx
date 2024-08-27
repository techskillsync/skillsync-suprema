import React, { useEffect, useState, useRef } from "react";
import {
  FaArrowRight,
  FaBookmark,
  FaExclamationTriangle,
  FaLink,
  FaEllipsisV,
} from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { IoBookmark } from "react-icons/io5";

import SharePopup from "./SharePopup.jsx";
import ReportPopup from "./ReportPopup.jsx";

const MobileActionsMenu = ({ handleSave, saved, action, jobDescriptionId }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // qit the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative ">
      <button
        onClick={() => setOpen(!open)}
        className="absolute  left-[90%] bottom-[5%] m-2  flex items-center bg-gray-200 text-gray-700 hover:bg-gray-400 transition-all duration-150 rounded-full p-2"
      >
        <FaEllipsisV />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        >
          <button
            onClick={() => {
              handleSave();
              setOpen(false);
            }}
            className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              saved ? "bg-blue-200" : ""
            }`}
          >
            <span className="flex items-center">
              <IoBookmark />
              <span className="ml-2">{saved ? "Saved" : "Save"}</span>
            </span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(jobDescriptionId);
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <span className="flex items-center">
              <FaLink />
              <span className="ml-2">Copy Link</span>
            </span>
          </button>
          <SharePopup content={jobDescriptionId}>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              <span className="flex items-center">
                <FaUserGroup />
                <span className="ml-2">Share</span>
              </span>
            </button>
          </SharePopup>
          <ReportPopup content={jobDescriptionId}>
            <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              <span className="flex items-center">
                <FaExclamationTriangle />
                <span className="ml-2">Report</span>
              </span>
            </button>
          </ReportPopup>
          {action && (
            <button
              onClick={() => {
                action();
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <span className="flex items-center">
                <FaArrowRight />
                <span className="ml-2">Apply</span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileActionsMenu;
