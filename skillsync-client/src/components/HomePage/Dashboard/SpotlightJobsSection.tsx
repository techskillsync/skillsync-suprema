import React from "react";
import { GetFirstJobListings } from "../../../supabase/GetJobListings";
import { useState, useEffect } from "react";
import JobDescriptionCard from "../../Feed/JobDescriptionCard";
import Spacer from "../../common/Spacer";
import { JobListing } from "../../../types/types";

function SpotLightJobsSection() {
  const [listings, setListings] = useState<JobListing[]>([]);

    // useEffect(() => {
    //     async function fetchListings() {
    //         const data = await GetFirstJobListings(3)
    //         if (!data) { console.warn('error getting job listings'); return; }
    //         setListings(data)
    //     }
    //     fetchListings();
    // }, [])

  return (
    <div className="p-3 rounded-lg bg-[#1e1e1e] mt-6">
      <h1 className="text-xl">Spotlight Jobs</h1>
      <Spacer className={"!w-full !h-[0.5px] my-3"} />
      {/* {listings.map((item, index) => (
        <div className="mb-3" key={index} >
          <JobDescriptionCard jobDescription={item} />
        </div>
      ))} */}
    </div>
  );
}

export default SpotLightJobsSection;
