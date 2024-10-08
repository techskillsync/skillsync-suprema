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
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

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

const JobApplicationTracker = ({ setSelectedJob }) => {
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (job, newStatus, oldStatus) => {
    // Update the job status locally
    const updatedJobs = savedJobs.map((item) => {
      if (item.id === job.id) {
        const newItem = { ...item };
        newItem.status = newStatus;
        return newItem;
      }
      return item;
    });

    setSavedJobs(updatedJobs);

    // Call the backend update function
    if (newStatus !== oldStatus) {
      handleStatusChange(job, newStatus);
    }
  };

  const determineNewStatusBasedOnPosition = (x, oldStatus) => {
    console.log(x);
    let newStatus = oldStatus;
    const width = window.innerWidth;
    const threshold = width / 5;
    if (x < threshold) {
      newStatus = "saved";
    } else if (x < threshold * 2) {
      newStatus = "applied";
    } else if (x < threshold * 3) {
      newStatus = "testing";
    } else if (x < threshold * 4) {
      newStatus = "interviewing";
    } else {
      newStatus = "offer";
    }
    console.log(newStatus);
    return newStatus;
  };

  useEffect(() => {
    async function fetchSavedJobs() {
      const jobs = await GetSavedJobs();
      console.log("Response from search:", jobs);

      setSavedJobs(jobs || []);
    }
    fetchSavedJobs();
  }, []);

  // useEffect(() => {
  // console.log(savedJobs);
  // }, [savedJobs]);

  const handleStatusChange = async (job: JobListing, newStatus: string) => {
    // * newStatus is currently configured to be the LABEL of the actual status value.
    // * This is because the SelectField component returns the label of the selected option.
    console.log(job, newStatus);
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
    // Initialize the accumulator with all statuses
    const initialAcc = jobStatusLabels
      .map((label) => label.value)
      .reduce((acc, status) => {
        acc[status] = [];
        return acc;
      }, {} as Record<string, JobListing[]>);

    return jobs.reduce((acc, job) => {
      if (!acc[job.status!]) {
        acc[job.status!] = [];
      }
      acc[job.status!].push(job);
      return acc;
    }, initialAcc);
  };

  const groupedJobs = groupJobsByStatus(savedJobs);

  return (
    <div className="px-10 py-8 min-h-screen w-full bg-black">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white text-2xl font-bold">
          Job Application Tracker
        </h1>
        <p className="text-gray-500">
          Drag and drop the job cards to change their status
        </p>
      </div>
      <Spacer className={"!w-full !h-[0.5px] mt-4"} />
      <div className="sticky top-0 w-full bg-black bg-opacity-90 backdrop-blur z-[6] mb-2">
        <div className="flex gap-4">
          {Object.keys(groupedJobs)
            .sort(
              (a, b) =>
                jobStatusLabels.findIndex((label) => label.value === a) -
                jobStatusLabels.findIndex((label) => label.value === b)
            )
            .map((status) => (
              <div className="flex py-2 mt-4 w-1/5 justify-between items-center pl-2 pr-4">
                <h2 className="text-xl font-bold">
                  {
                    jobStatusLabels.find((label) => label.value === status)!
                      .label
                  }
                </h2>
                <div
                  className={`rounded-full px-3 py-1 bg-${
                    jobStatusLabels.find((label) => label.value === status)!
                      .color
                  }-500`}
                >
                  {groupedJobs[status].length}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex gap-4">
        {Object.keys(groupedJobs)
          .sort(
            (a, b) =>
              jobStatusLabels.findIndex((label) => label.value === a) -
              jobStatusLabels.findIndex((label) => label.value === b)
          )
          .map((status) => (
            <div className="w-1/5 h-full" key={status}>
              <div className="fade-in">
                {groupedJobs[status].map((job) => (
                  <motion.div
                  // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    onClick={() => {
                      if (!isDragging) {
                        setSelectedJob(job);
                      }
                    }}
                    className="mb-4"
                    key={job.id}
                    drag
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={(event, info) => {
                      setIsDragging(false);
                      const newStatus = determineNewStatusBasedOnPosition(
                        info.point.x,
                        status
                      ); // Implement this function to determine the new status based on drop position
                      if (newStatus) {
                        handleDragEnd(job, newStatus, status);
                      }
                    }}
                  >
                    <JobDescriptionCard
                      className="cursor-pointer"
                      showGlassdoorRating={false}
                      jobDescription={job}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default JobApplicationTracker;
