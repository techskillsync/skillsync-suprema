import React, { useState, useEffect } from "react";
import {
  GetJobListingsPaginate,
  SearchJobs,
} from "../../supabase/GetJobListings";
import { JobListing } from "../../types/types";
import JobDescriptionCard from "./JobDescriptionCard";
import PaginationController from "./PaginationController";
import SearchBar from "./SearchBar";
import SearchFilters from "./SearchFilters"; // <---- Arman
import Spacer from "../common/Spacer";
import JobDetailsSlide from "./JobDetailsSlide";

function Feed() {
  const [locationKeys, setLocationKeys] = useState(""); // <---- Arman
  const [jobModeKeys, setJobModeKeys] = useState([]);
  const [keywordKeys, setKeywordKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const [listings, setListings] = useState<JobListing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedJob, setSelectedJob] = useState<JobListing | null>();

  useEffect(() => {
    if (preferencesLoaded) {
      fetchListings();
    }
  }, [currentPage, preferencesLoaded]);

  useEffect(() => {
    console.log("Search value changed", searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (preferencesLoaded) {
      console.log("Keys changed", locationKeys, jobModeKeys);
      fetchListings();
    }
  }, [locationKeys, jobModeKeys, keywordKeys]);

  async function fetchListings() {
    console.log("Refreshing listings...");
    console.log(searchValue);
    const pageSize = 3; // ? Number of listings per page minus 1
    const from = (currentPage - 1) * pageSize;
    const to = currentPage * pageSize;
    // Todo: add location searching (parameter currently empty string)
    let response;
    console.log("Job mode keys:", jobModeKeys);
    const queryTerms =
      searchValue +
      " " +
      keywordKeys
        .map((k) => (k as { label: string; value: string }).value)
        .join(" ") +
      " " +
      jobModeKeys
        .map((m) => (m as { label: string; value: string }).value)
        .join(" ");
    console.log("Query terms:", queryTerms);
    response = await SearchJobs(queryTerms, locationKeys, from, to);
    console.log("Response from search:", response);
    const { data, error, count } = response || {};

    if (error) {
      console.warn("Error getting job listings:", error);
      return;
    }

    setListings(data || []);
    // setCurrentPage(1);
    setTotalPages(Math.ceil(count ? count / pageSize : 0));
  }

  useEffect(() => {
    setSelectedJob(listings[0]);
  }, [listings]);

  useEffect(() => {
    console.log("Listings:", listings);
  }, [listings]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleSearch() {
    setCurrentPage(1);
    setTotalPages(0);
    setListings([]);
    fetchListings();
  }

  return (
    <div className="flex flex-row bg-black w-full h-full min-h-screen">
      <div className="px-10 py-8 h-full w-2/3">
        <SearchBar
          handleSearch={handleSearch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {/*  ------------- Arman ------------- */}
        <div className="overflow-x-auto">
          <SearchFilters
            setPreferencesLoaded={setPreferencesLoaded}
            setLocationKeys={setLocationKeys}
            setJobModeKeys={setJobModeKeys}
            setKeywordKeys={setKeywordKeys}
          />
        </div>
        {/*  ------------- Arman ------------- */}
        <div className="my-3 ml-20">
          {/* {PaginationController(handlePageChange, currentPage, totalPages)} */}
          <PaginationController
            key={listings.toString()}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
        {listings.map((item, index) => (
          <div
            className="mb-4"
            key={index}
            // onClick={() => setSelectedJob(item)}
          >
            <JobDescriptionCard
              key={item.id}
              jobDescription={item}
              action={() => setSelectedJob(item)}
            />
          </div>
        ))}
      </div>
      <div className="w-1/3 bg-[#1e1e1e] relative">
        <div className="absolute right-0 top-0 h-screen w-full overflow-y-scroll">
          <JobDetailsSlide jobDescription={selectedJob} />
        </div>
      </div>
    </div>
  );
}

export default Feed;
