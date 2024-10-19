import React, { useState, useEffect, useRef } from "react";
import { SearchJobs } from "../../supabase/GetJobListings";
import { JobListing } from "../../types/types"; // Assuming you have a `JobListing` type defined in your `types` file
import SearchFilters from "./SearchFilters";
import SwiperCard from "./SwiperCards";
import LoadingCard from "./LoadingCard";
import { BookmarkPlus, GalleryHorizontal, ListTree, Save } from "lucide-react";
import { Eye, Bookmark, MapPin, ArrowRight } from "lucide-react";
import { GetUserId } from "../../supabase/GetUserId";
import { fetchCardData, initLastEvalute, initUser, updateUserPreferences } from "../../DynamoDb/fetchCardData";

interface Preferences {
  location: string;
  jobModes: {
    label: string;
    value: string;
  }[];
  keywords: {
    label: string;
    value: string;
  }[];
}

function Feed() {
  const [preferences, setPreferences] = useState<Preferences>({
    location: "",
    jobModes: [],
    keywords: [],
  });
  //const [searchValue, setSearchValue] = useState<string>("");
  const [preferencesLoaded, setPreferencesLoaded] = useState<boolean>(false);
  const [listings, setListings] = useState<JobListing[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMoreJobs, setHasMoreJobs] = useState<boolean>(true);
  const [swipeMode, setSwipeMode] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (preferencesLoaded) {
      initLastEvalute();
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
      preferences.keywords.map((k) => k.value).join(" ") +
      " " +
      preferences.jobModes.map((m) => m.value).join(" ");

    try {
      const response = await SearchJobs(
        queryTerms,
        preferences.location,
        from,
        to
      );
      //const { data, error } = response || {};
      const data = await fetchCardData(preferences.keywords, preferences.location);
      // if (error) {
      //   console.warn("Error getting job listings:", error);
      //   setIsLoading(false);
      //   return;
      // }

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

  function handleSwipeLeft(job: JobListing) {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      console.log(job, " not liked");
    } else if (hasMoreJobs) {
      setCurrentIndex(listings.length);
      setIsLoading(true);
      fetchListings(true);
    } else {
      console.log("No more jobs to load.");
    }
  }

  async function handleSwipeRight(job: JobListing) {
    if (currentIndex < listings.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      await updateUserPreferences(job.Category, job.JobId);
      console.log(job, " liked");
    } else if (hasMoreJobs) {
      setCurrentIndex(listings.length);
      setIsLoading(true);
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
        loadMoreObserver.observe(lastCard);
      }
    }

    observer.current = loadMoreObserver;

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [listings, hasMoreJobs, isLoading]);

  return (
    <div className="flex flex-col bg-black w-full h-full min-h-screen ">
      <div className="px-10 py-8 h-full w-full">
        <div className="flex  mb-4 gap-3 items-center justify-center ">
          <SearchFilters
            setPreferencesLoaded={setPreferencesLoaded}
            setPreferences={setPreferences}
            preferences={preferences}
          />

          <button
            onClick={() => {
              setSwipeMode(!swipeMode);
            }}
            className="flex gap-2 items-center justify-center min-w-max border rounded-lg px-4 py-2 max-h-min"
          >
            {swipeMode ? <GalleryHorizontal /> : <ListTree />}{" "}
            {swipeMode ? "Swipe Mode" : "List Mode"}
          </button>
        </div>
        <aside className="flex flex-col w-full h-full  items-center mt-20 justify-center">
          <div className="w-8/12 flex gap-"></div>
          {swipeMode ? (
            listings.length > 0 &&
            currentIndex < listings.length && (
              <SwiperCard
                job={listings[currentIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            )
          ) : (
            // List Mode
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-9/12 relative mb-20">
              {listings.map((job, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-[#0B243F] p-6 rounded-lg shadow-md justify-between transition-all hover:shadow-xl hover:bg-[#102D53]"
                >
                  <div className="flex items-start justify-between">
                    {/* Company Logo */}
                    <img
                      src={
                        job?.logo_url ??
                        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                      alt={job.companyName ?? "Unknown company"}
                      className="w-16 h-16 mr-4 rounded-md border border-gray-200"
                    />
                    <div className="ml-3">
                      {/* Job Title */}
                      <h2 className="text-lg font-semibold text-white">
                        {job.jobTitle}
                      </h2>
                      {/* Company Name */}
                      <p className="text-gray-400">{job.company}</p>
                      {/* Location */}
                      <div className="flex items-center mt-1 text-gray-400 min-w-max">
                        <MapPin className="w-4 h-4 mr-1" />
                        <p>{job.location}</p>
                      </div>
                    </div>
                    {/* Full-Time/Part-Time Tag */}
                    <span className="text-xs px-3 py-1 bg-gray-700 rounded-full text-white ml-auto min-w-max">
                      {job.type ?? "Full-Time"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-6 space-x-4">
                    <button className="flex items-center bg-transparent border-2 min-w-max border-green-400 px-4 py-2 rounded-lg text-white hover:bg-green-400 hover:text-white transition-all">
                      <Eye className="w-5 h-5 mr-2" />
                      View Details
                    </button>
                    <button className="flex items-center bg-transparent border-2 min-w-max border-green-400 px-4 py-2 rounded-lg text-white hover:bg-green-400 hover:text-white transition-all">
                      Save
                      <BookmarkPlus className="w-5 h-5 ml-2" />
                    </button>

                    <button className="flex items-center px-4 py-2 bg-gradient-to-r min-w-max from-blue-400 to-green-400 text-white font-semibold rounded-lg shadow-lg hover:opacity-80 transition-all">
                      Apply
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ))}

              {hasMoreJobs && !isLoading && (
                <div className="flex justify-center items-center mt-5 absolute bottom-[-52px] right-[40%]">
                  <button
                    onClick={() => fetchListings(true)}
                    className="px-6 py-2 bg-rezerv-dark text-white rounded-md border border-green-400 hover:bg-blue-400"
                  >
                    Load More Jobs
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading && currentIndex === listings.length && (
            <div className="flex justify-center items-center mt-5">
              <LoadingCard /> {/* Show the loading card */}
            </div>
          )}
        </aside>

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
