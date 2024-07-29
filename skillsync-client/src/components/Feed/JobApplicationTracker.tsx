import React, { useEffect, useState } from "react";
import { JobListing } from "../../types/types";
import { SelectField } from "../common/InputField";
import {
  SaveJob,
  UpdateJob,
  RemoveJob,
} from "../../supabase/JobApplicationTracker";
import { GetSavedJobs } from "../../supabase/JobApplicationTracker";
import Spacer from "../common/Spacer";
import JobDescriptionCard from "./JobDescriptionCard";
import JobDetailsSlide from "./JobDetailsSlide";

const JobApplicationTracker = ({}) => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const jobStatusLabels = [
    {
      label: "Not Applied",
      value: "saved",
      color: 'gray'
    },
    {
      label: "Applied",
      value: "applied",
      color: 'blue'
    },
    {
      label: "Testing / OA",
      value: "testing",
      color: 'purple'
    },
    {
      label: "Interviewing",
      value: "interviewing",
      color: 'yellow'
    },
    {
      label: "Offer Received",
      value: "offer",
      color: 'green'
    },
  ];

  useEffect(() => {
    async function fetchSavedJobs() {
      const jobs = await GetSavedJobs();
      console.log("Response from search:", jobs);

      setSavedJobs(jobs || []);
    }
    fetchSavedJobs();
  }, []);

  const handleStatusChange = async (job: JobListing, newStatus: string) => {
    UpdateJob(job.id, newStatus);
    const updatedJobs = savedJobs.map((item) => {
      if (item.id === job.id) {
        return { ...item, status: newStatus as "saved" | "applied" | "testing" | "interviewing" | "offer" | null };
      }
      return item;
    });
    setSavedJobs(updatedJobs);
  };

  return (
    <div className="h-screen p-5">
      {/* Div to load in all needed tailwind background color classes */}
      <div className="hidden">
        <div className="bg-gray-500"></div>
        <div className="bg-yellow-500"></div>
        <div className="bg-blue-500"></div>
        <div className="bg-purple-500"></div>
        <div className="bg-green-500"></div>
      </div>
      <div className="px-10 py-8 h-full w-2/3">
        <h1 className="text-white text-2xl font-bold mb-4">
          Job Application Tracker
        </h1>
        <Spacer className={"!w-full !h-[0.5px] my-4"} />
        {savedJobs.map((item, index) => (
          <div
            className="mb-4"
            key={index}
          >
            <div className="relative mb-4">
              <JobDescriptionCard
                showGlassdoorRating={false}
                jobDescription={item}
                action={() => setSelectedJob(item)}
              />
              <div className="absolute text-black top-2 right-2">
                <div className="flex items-center">
                  <div
                  className={`rounded-l p-1 h-[38px] bg-${
                    jobStatusLabels.find(
                      (label) => label.value === item.status
                    )?.color
                  }-500`}
                  ></div>
                  <SelectField
                    allowMultiple={false}
                    // @ts-ignore
                    value={jobStatusLabels.find(
                      (label) => label.value === item.status
                    )}
                    list={jobStatusLabels.map((label) => label.label)}
                    onChange={(newValue) => {
                      // @ts-ignore
                      handleStatusChange(item, newValue!.value);
                    }}
                    showLabel={false}
                    placeholder={"Select status"}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/3 !bg-[#1e1e1e] z-[99]">
        <div className="fixed right-0 top-0 h-screen w-[26.66%] overflow-y-scroll">
          <JobDetailsSlide
            className="h-full rounded-none bg-[#1e1e1e]"
            jobDescription={selectedJob}
          />
        </div>
      </div>
    </div>
  );
};

export default JobApplicationTracker;