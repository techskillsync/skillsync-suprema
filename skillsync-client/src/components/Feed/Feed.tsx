import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  SearchJobs,
} from "../../supabase/GetJobListings";
import { JobListing } from "../../types/types";
import JobDescriptionCard from "./JobDescriptionCard";
import SearchBar from "./SearchBar";
import SearchFilters from "./SearchFilters"; // <---- Arman
import JobDetailsSlide from "./JobDetailsSlide";

function Feed() {
  const [locationKeys, setLocationKeys] = useState(""); // <---- Arman
  const [jobModeKeys, setJobModeKeys] = useState<string[]>([]);
  const [keywordKeys, setKeywordKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const [listings, setListings] = useState<JobListing[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  useEffect(() => {
    if (preferencesLoaded) {
      fetchListings();
    }
  }, [preferencesLoaded]);

  useEffect(() => {
    console.log("Search value changed", searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (preferencesLoaded) {
      console.log("Keys changed", locationKeys, jobModeKeys);
      resetListings(); // Reset listings when filters change
    }
  }, [locationKeys, jobModeKeys, keywordKeys]);

  async function fetchListings() {
    console.log("Fetching more listings...");
    const limit = 10; // Number of listings to load at a time
    const from = offset;
    const to = offset + limit;

    const response = await SearchJobs(
      searchValue + keywordKeys.join(" ") + jobModeKeys.join(" "),
      locationKeys,
      from,
      to
    );

    const { data, error, count } = response || {};

    if (error) {
      console.warn("Error getting job listings:", error);
      return;
    }

    if (data && data.length > 0) {
      setListings((prevListings) => [...prevListings, ...data]);
      setOffset(offset + limit);
    } else {
      setHasMore(false); // No more items to load
    }
  }

  function resetListings() {
    setListings([]);
    setOffset(0);
    setHasMore(true);
    fetchListings(); // Load the first batch with new filters
  }

  function handleSearch() {
    resetListings(); // Reset and load based on the search value
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
        <InfiniteScroll
          dataLength={listings.length}
          next={fetchListings}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: "center" }}>No more jobs available</p>}
        >
          {listings.map((item, index) => (
            <div
              className="mb-4"
              key={item.id || index}
            >
              <JobDescriptionCard
                key={item.id}
                jobDescription={item}
                action={() => setSelectedJob(item)}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
      <div className="w-1/3 bg-[#1e1e1e]">
        <div className="fixed right-0 top-0 h-screen w-[26.66%] overflow-y-scroll">
          <JobDetailsSlide jobDescription={selectedJob} />
        </div>
      </div>
    </div>
  );
}

export default Feed;
