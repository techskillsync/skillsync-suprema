import React from "react";
import {
  GetFirstJobListings,
  SearchJobs,
} from "../../../supabase/GetJobListings";
import { useState, useEffect } from "react";
import JobDescriptionCard from "../../Feed/JobDescriptionCard";
import Spacer from "../../common/Spacer";
import { JobListing } from "../../../types/types";
import { GetJobPreferences } from "../../../supabase/JobPreferences";
import { IoRefresh } from "react-icons/io5";
import { fetchJobs } from "../../../DynamoDb/fetchCardData.js";

function SpotLightJobsSection({ setSelectedJob }) {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [jobPreferences, setJobPreferences] = useState({
    keywords: [],
    jobMode: [],
    location: "",
    citizenship: [],
    salaryRange: "",
    recency: "",
  });
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  async function fetchPreferences() {
    try {
      const preferencesData = await GetJobPreferences();
      const preferences = {
        location: preferencesData.location,
        salaryRange: preferencesData.salary_range ?? "",
        jobMode: preferencesData.job_mode ?? [],
        keywords: preferencesData.keywords ?? [],
        citizenship: preferencesData.citizenship ?? [],
        recency: preferencesData.recency ?? "",
      };
      setJobPreferences(preferences);
      setPreferencesLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
   
    fetchPreferences();
  }, []);

  async function fetchListings() {
    const pageSize = 2; // ? Number of listings per page minus 1
    // Todo: add location searching (parameter currently empty string)
    // const response = await SearchJobs(
    //   jobPreferences.keywords
    //     .map((k) => (k as { label: string; value: string }).value)
    //     .join(" ") +
    //     jobPreferences.jobMode
    //       .map((m) => (m as { label: string; value: string }).value)
    //       .join(" "),
    //   jobPreferences.location,
    //   0,
    //   3
    // );
    // console.log("Response from search:", response);
    //const { data, error, count } = response || {};

    const data = await fetchJobs(jobPreferences.keywords[0].value, jobPreferences.location, 4);


    // if (error) {
    //   console.warn("Error getting job listings:", error);
    //   return;
    // }

    setListings(data || []);
  }

  useEffect(() => {
    if (true) {
      fetchListings();
    }
  }, [preferencesLoaded]);

  return (
    <div className="p-5 rounded-lg bg-[#1e1e1e] mt-6 min-h-[17rem] my-eighth-step">
      <div className="flex justify-between">
        <h1 className="text-xl text-white">Spotlight Jobs</h1>
        <button
          className="text-white bg-[#3e3e3e] rounded-full !p-1 text-xl mr-3"
          onClick={async () => {
            console.log("Refreshing spotlight jobs");
            setPreferencesLoaded(false);
            await fetchPreferences();
            setPreferencesLoaded(true);
          }}
        >
          <IoRefresh />
        </button>
      </div>
      <Spacer className={"!w-full !h-[0.5px] my-4"} />
      <div className="flex flex-col gap-4  md:flex-row w-full space-x-2 md:overflow-x-auto pb-3">
        {listings.map((item, index) => (
          <div className="md:min-w-[400px] fade-in" key={index}>
            <JobDescriptionCard
            className="h-full"
              mini={true}
              jobDescription={item}
              action={() => {
                console.log("Setting selected job via callback");

                setSelectedJob(item);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotLightJobsSection;
