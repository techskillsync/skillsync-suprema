import React from "react";
import { FindAvatar, FindUser } from "../../supabase/OtherUsers";
import { FaUser } from "react-icons/fa";
import { SendMessage } from "../../supabase/Messages";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { ReportJobListing } from "../../supabase/ReportJobListing";

const typeOptions = [
  { label: "Job listing expired", value: "job-listing-expired" },
  { label: "Inappropriate content", value: "inappropriate-content" },
  { label: "Other", value: "other" },
];

// Share popup intended for sharing Job Descriptions to SkillSync users
const ReportPopup = ({ children, content }) => {
  const [fadeIn, setFadeIn] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState({
    label: "Job listing expired",
    value: "job-listing-expired",
  });
  const [description, setDescription] = React.useState("");

  const handleReport = async () => {
    console.log(type.value, description);
    console.log(content);
    setIsOpen(false);
    console.log("Reporting Job Listing...");
    const jobListingReportPromise = ReportJobListing(
      content,
      type.value,
      description
    );
    toast.promise(jobListingReportPromise, {
      loading: "Reporting Job Listing...",
      success: "Thank you for reporting this job listing!",
      error: "Failed to report job listing",
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
    }
  }, [isOpen]);

  return (
    <div>
      <Toaster />
      <div className="relative">
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
          });
        })}
        {isOpen && (
          <div
            className={`absolute bg-white shadow p-3 rounded-lg z-[99] top-12 left-0 ${
              fadeIn ? "fade-in" : ""
            }`}
          >
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <Select
                className="mt-2"
                type="text"
                options={typeOptions}
                placeholder="Reason for reporting"
                value={type}
                onChange={setType}
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-2 border border-gray-300 rounded-l py-2 px-4"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-3"
                onClick={handleReport}
                // disabled={!searchEmail || loading}
              >
                Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ReportPopup;
