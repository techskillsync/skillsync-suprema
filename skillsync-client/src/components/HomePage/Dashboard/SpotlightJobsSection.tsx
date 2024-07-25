import React from "react";
import { GetFirstJobListings } from "../../../supabase/GetJobListings";
import { useState, useEffect } from "react";
import JobDescriptionCard from "../../Feed/JobDescriptionCard";
import Spacer from "../../common/Spacer";
import { JobListing } from "../../../types/types";

function SpotLightJobsSection() {
  const [listings, setListings] = useState<JobListing[]>([]);

  useEffect(() => {
    async function fetchListings() {
      const pageSize = 2; // ? Number of listings per page minus 1
      // Todo: add location searching (parameter currently empty string)
      const response = await GetFirstJobListings(pageSize);
      console.log("Response from search:", response);
      const { data, error, count } = response || {};

      if (error) {
        console.warn("Error getting job listings:", error);
        return;
      }

      setListings(data || []);
    }
    fetchListings();
  }, []);

  return (
    <div className="p-5 rounded-lg bg-[#1e1e1e] mt-6">
      <h1 className="text-xl">Spotlight Jobs</h1>
      <Spacer className={"!w-full !h-[0.5px] my-4"} />
      <div className="flex w-full space-x-2">
          {listings.map((item, index) => (
            <div className="flex-col w-full" key={index}>
              <JobDescriptionCard mini={true} jobDescription={item} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default SpotLightJobsSection;
