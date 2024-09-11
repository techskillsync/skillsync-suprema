import React, { useState, useEffect, useRef } from "react";
import { SearchJobs } from "../../supabase/GetJobListings";
import { JobListing } from "../../types/types";
import SearchBar from "./SearchBar";
import SearchFilters from "./SearchFilters";
import SwiperCard from "./SwiperCards";
import LoadingCard from "./LoadingCard";

function Feed() {
  const [preferences, setPreferences] = useState({
    location: "",
    jobModes: [],
    keywords: [],
  });
  const [searchValue, setSearchValue] = useState("");
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (preferencesLoaded) {
      fetchListings();
    }
  }, [preferences]);

  async function fetchListings(loadMore = false) {
    if (!hasMoreJobs || isLoading) return;

    setIsLoading(true);
    console.log("Fetching jobs...");

    const pageSize = 14;
    const from = loadMore ? listings.length : 0;
    const to = from + pageSize;

    const queryTerms =
      searchValue +
      " " +
      preferences.keywords
        .map((k) => (k as { label: string; value: string }).value)
        .join(" ") +
      " " +
      preferences.jobModes
        .map((m) => (m as { label: string; value: string }).value)
        .join(" ");

    try {
      const response = await SearchJobs(
        queryTerms,
        preferences.location,
        from,
        to
      );
      const { data, error } = response || {};

      if (error) {
        console.warn("Error getting job listings:", error);
        setIsLoading(false);
        return;
      }

      console.log("Fetched jobs: ", data);

      if (data.length === 0) {
        setHasMoreJobs(false);
      } else if (loadMore) {
        setListings((prevListings) => [...prevListings, ...(data || [])]);
      } else {
        setListings(data || []);
      }
    } catch (err) {
      console.error("Error fetching jobs: ", err);
    }

    setIsLoading(false);
  }

  function handleSearch() {
    setCurrentIndex(0);
    setHasMoreJobs(true);
    fetchListings();
  }

  function handleSwipeLeft(job) {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      console.log(job, " not liked");
    } else if (hasMoreJobs) {
      setCurrentIndex(listings.length);
      setIsLoading(true)
      fetchListings(true);
    } else {
      console.log("No more jobs to load.");
    }
  }

  function handleSwipeRight(job) {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      console.log(job, " liked");
    } else if (hasMoreJobs) {
      setCurrentIndex(listings.length);
      setIsLoading(true)

      fetchListings(true);
    } else {
      console.log("No more jobs to load.");
    }
  }

  useEffect(() => {
    if (isLoading || !hasMoreJobs) return;

    const loadMoreObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMoreJobs && !isLoading) {
          console.log("Fetching more jobs...");
          fetchListings(true);
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (listings.length > 0) {
      const lastCard = document.querySelector(".swiper--card:last-child");
      if (lastCard) {
        loadMoreObserver.observe(lastCard); // Observe the last card
      }
    }

    observer.current = loadMoreObserver;

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [listings, hasMoreJobs, isLoading]);

  return (
    <div className="flex flex-col bg-gray-900 w-full h-full min-h-screen ">
      <div className="px-10 py-8 h-full w-full">
        {/* <SearchBar
          handleSearch={handleSearch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        /> */}
        <div className="flex flex-wrap mb-4">
          <SearchFilters
            setPreferencesLoaded={setPreferencesLoaded}
            setPreferences={setPreferences}
            preferences={preferences}
          />
        </div>
        <aside className="flex flex-col w-full h-full  mt-20 justify-center">
          {listings.length > 0 && currentIndex < listings.length && (
            <SwiperCard
              job={listings[currentIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          )}

          {isLoading && currentIndex === listings.length && (
            <div className="flex justify-center items-center mt-5">
              <LoadingCard /> {/* Show the loading card */}
            </div>
          )}
        </aside>

        {/* Load More Button
        {hasMoreJobs && !isLoading && (
          <div className="flex justify-center items-center mt-5">
            <button
              onClick={() => fetchListings(true)}
              className="px-6 py-2 bg-rezerv-dark text-white rounded-md hover:bg-purple-600"
            >
              Load More Jobs
            </button>
          </div>
        )} */}

        {/* No More Jobs Indicator */}
        {!hasMoreJobs && !isLoading && (
          <div className="flex justify-center items-center mt-5">
            <p>No more jobs to load.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
