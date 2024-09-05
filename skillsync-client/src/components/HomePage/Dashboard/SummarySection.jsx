import { FaFileAlt, FaFlag, FaHourglass, FaSave } from "react-icons/fa";
import { BsFillSendFill, BsPeopleFill } from "react-icons/bs";
import { GetResumeCount } from "../../../supabase/Resumes";
import React from "react";
import { useState, useEffect } from "react";
import { GetJobsCount } from "../../../supabase/JobApplicationTracker";

const SummarySection = ({}) => {
  const [jobsSavedCount, setJobsSavedCount] = useState(0);
  const [jobsAppliedCount, setJobsAppliedCount] = useState(0);
  const [jobsInterviewingCount, setJobsInterviewingCount] = useState(0);
  const [jobOffersCount, setJobOffersCount] = useState(0);
  const [resumesCount, setResumesCount] = useState(0);

  const stats = [
    { title: "Jobs Saved", value: jobsSavedCount, icon: FaSave, class: "my-first-step"},
    { title: "Jobs Applied", value: jobsAppliedCount, icon: BsFillSendFill, class: "my-second-step" },
    { title: "Interviews", value: jobsInterviewingCount, icon: BsPeopleFill, class: "my-third-step"},
    { title: "Job Offers", value: jobOffersCount, icon: FaFlag, class: "my-fourth-step" },
    { title: "Resumes", value: resumesCount, icon: FaFileAlt, class: "my-fifth-step" },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        setJobsSavedCount(
          await GetJobsCount([
            "saved",
            "applied",
            "interviewing",
            "testing",
            "offer",
          ])
        );
        setJobsAppliedCount(
          await GetJobsCount(["applied", "interviewing", "testing", "offer"])
        );
        setJobsInterviewingCount(await GetJobsCount(["interviewing", "offer"]));
        setJobOffersCount(await GetJobsCount(["offer"]));
        setResumesCount(await GetResumeCount());
      } catch (error) {
        console.error(error);
      }
    }
    fetchStats();
  }, []);

  return (
<div className="grid grid-cols-2 md:flex w-full gap-4 text-white">
  {stats.map((stat) => (
        <div
          key={stat.title}
          className={`flex cursor-pointer w-full items-center gap-4 p-5 bg-[#1e1e1e] rounded-lg  border-2 border-cyan-700 ${stat.class}`}
          onClick={() => {
            window.location.href = "/home/tracker";
          }}
        >
          <div className="flex flex-col text-4xl">
            <stat.icon />
          </div>
          <div className="flex flex-col text-left">
            <p className="text-2xl font-bold text-green-400">{stat.value}</p>
            <p className="text-base">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
