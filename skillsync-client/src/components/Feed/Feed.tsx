import React, { useState, useEffect } from "react";
import { GetJobListingsPaginate } from "../../supabase/GetJobListings";
import {
  AddToSavedJobs,
  AddToAppliedJobs,
} from "../../supabase/JobListingTracker";
import { JobListing } from "../../types/types";
import JobDescriptionCard from "./JobDescriptionCard";
import PaginationController from "./PaginationController";
import SearchBar from "./SearchBar";
import Spacer from "../common/Spacer";
import JobDetailsSlide from "./JobDetailsSlide";

function Feed() {
  const [searchValue, setSearchValue] = useState("");

  const [listings, setListings] = useState<JobListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedJob, setSelectedJob] = useState<JobListing | null>();

  useEffect(() => {
    fetchListings();
  }, [currentPage]);

  async function fetchListings() {
    const pageSize = 3; // Number of listings per page
    const from = (currentPage - 1) * pageSize;
    const to = currentPage * pageSize;
    const { data, error, count } = await GetJobListingsPaginate(from, to);
    if (error) {
      console.warn("Error getting job listings:", error);
      return;
    }

    setListings(data || []);
    setTotalPages(Math.ceil(count ? count / pageSize : 0));
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="flex flex-row bg-black w-full h-full min-h-screen">
      <div className="px-10 py-8 h-full w-2/3">
        <SearchBar setSearchValue={setSearchValue} />
        <div className="my-3">
          {PaginationController(handlePageChange, currentPage, totalPages)}
        </div>
        {listings.map((item, index) => (
          <div
            className="mb-4"
            key={index}
            // onClick={() => setSelectedJob(item)}
          >
            <JobDescriptionCard
              jobDescription={item}
              action={() => setSelectedJob(item)}
            />
          </div>
        ))}
      </div>
      <div className="w-1/3 bg-[#1e1e1e]">
        <div className="fixed right-0 top-0 h-screen w-[26.66%]">
         <JobDetailsSlide jobDescription={selectedJob} />
        </div>
      </div>
    </div>
  );
}

export default Feed;
