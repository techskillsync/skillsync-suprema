import { FaFileAlt, FaFlag, FaHourglass, FaSave } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { GetResumeCount } from "../../../supabase/Resumes";
import React from "react";
import { useState, useEffect } from "react";
import { GetJobsCount } from "../../../supabase/JobApplicationTracker";

const SummarySection = ({}) => {
  const [jobsSavedCount, setJobsSavedCount] = useState(0);
  const [jobsAppliedCount, setJobsAppliedCount] = useState(0);
  const [jobOffersCount, setJobOffersCount] = useState(0);
  const [resumesCount, setResumesCount] = useState(0);

  const stats = [
    { title: "Jobs Saved", value: jobsSavedCount, icon: FaSave },
    { title: "Jobs Applied", value: jobsAppliedCount, icon: BsFillSendFill },
    { title: "Job Offers", value: jobOffersCount, icon: FaFlag },
    { title: "Resumes", value: resumesCount, icon: FaFileAlt },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        setJobsSavedCount(await GetJobsCount(["saved", "applied", "interviewing", "testing", "offer"]));
        setJobsAppliedCount(await GetJobsCount(["applied", "interviewing", "testing", "offer"]));
        setJobOffersCount(await GetJobsCount(["offer"]));
        setResumesCount(await GetResumeCount());
      } catch (error) {
        console.error(error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-row space-x-3 text-white">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex flex-row items-center space-x-4 p-5 bg-[#1e1e1e] rounded-lg border border-2 border-cyan-700"
        >
          <div className="flex flex-col text-4xl">
            <stat.icon />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-xl font-bold text-green-400">{stat.value}</p>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
