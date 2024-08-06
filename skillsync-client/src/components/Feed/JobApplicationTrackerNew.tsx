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
import toast, { Toaster } from "react-hot-toast";

const jobStatusLabels = [
    {
      label: "Not Applied",
      value: "saved",
      color: "gray",
    },
    {
      label: "Applied",
      value: "applied",
      color: "blue",
    },
    {
      label: "Testing / OA",
      value: "testing",
      color: "purple",
    },
    {
      label: "Interviewing",
      value: "interviewing",
      color: "yellow",
    },
    {
      label: "Offer Received",
      value: "offer",
      color: "green",
    },
  ];


const JobApplicationTracker = ({setSelectedJob}) => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    async function fetchSavedJobs() {
      const jobs = await GetSavedJobs();
      console.log("Response from search:", jobs);

      setSavedJobs(jobs || []);
    }
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    console.log(savedJobs);
  }, [savedJobs]);

  const handleStatusChange = async (job: JobListing, newStatus: string) => {
    // * newStatus is currently configured to be the LABEL of the actual status value.
    // * This is because the SelectField component returns the label of the selected option. 
    console.log(job, newStatus);
    newStatus = jobStatusLabels.find((label) => label.label === newStatus)!.value;
    const updateJobStatusPromise = UpdateJob(job.id, newStatus);
    const updatedJobs = savedJobs.map((item) => {
      if (item.id === job.id) {
        const newItem = { ...item };
        newItem.status = newStatus as
          | "saved"
          | "applied"
          | "testing"
          | "interviewing"
          | "offer";
        return newItem;
      }
      return item;
    });
    toast.promise(updateJobStatusPromise, {
      loading: "Updating job status...",
      success: "Job status updated!",
      error: "Failed to update job status.",
    });
    setSavedJobs(updatedJobs);
  };

  useEffect(() => {
    console.log(savedJobs);
  }, [savedJobs]);

  const groupJobsByStatus = (jobs: JobListing[]) => {
    return jobs.reduce((acc, job) => {
      if (!acc[job.status!]) {
        acc[job.status!] = [];
      }
      acc[job.status!].push(job);
      return acc;
    }, {} as Record<string, JobListing[]>);
  };

  const groupedJobs = groupJobsByStatus(savedJobs);

  return (
    <div className="px-10 py-8 h-full w-full">
      <h1 className="text-white text-2xl font-bold mb-4">
        Job Application Tracker
      </h1>
      <Spacer className={"!w-full !h-[0.5px] my-4"} />
      <div className="flex overflow-x-auto gap-4">
        {Object.keys(groupedJobs).map((status) => (
          <div className="w-1/5" key={status}>
            <h2 className="text-xl font-bold mb-2">{status}</h2>
            {groupedJobs[status].map((job) => (
              <div className="mb-4" key={job.id}>
                <JobDescriptionCard
                  showGlassdoorRating={false}
                  jobDescription={job}
                  action={() => setSelectedJob(job)}
                  mini={true}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobApplicationTracker;