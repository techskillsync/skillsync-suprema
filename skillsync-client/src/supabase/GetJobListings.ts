import supabase from "./supabaseClient";
import { JobListing } from "../types/types";
import { PostgrestTransformBuilder } from "@supabase/postgrest-js";
import axios from "axios";
import { GetUserId } from "./GetUserId";

// Fetches JobListings from Supabase.
// Returns false on error and the job listings on success
async function GetJobListings(): Promise<JobListing[] | false> {
  const { data, error } = await supabase.from("job_listings").select();

  if (error) {
    return false;
  }

  return data;
}

async function GetJobListingById(id: string): Promise<JobListing | false> {
  const { data, error } = await supabase
    .from("job_listings")
    .select()
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return data[0];
}

/*
 ! ------- WARNING ------- WARNING --------- WARNING ------- 
 * THIS IS SUPER SLOW. IF SPEED IS A CONCERN HANDLE SCRAPING AND 
 * SEARCHING SEPARATELY.
 ! ------- WARNING ------- WARNING --------- WARNING -------
 * Waits for linkedin scraper to finish then:
 * Uses text search to return postings with high similarity to the
 * query words. 
 *  - Ranks listings based on how closely they match the query
 *  - Uses word stems to find any variation of the same word
 *  - Prioritizes matching words in the title than in the description
 * @param {string} query - Space separated list of words to match
 * @param {string} location - location we want to search (Vancouver BC, Canada)
 * @param {number} from - pagination start index
 * @param {number} to - pagination end index
 * @returns {Promise<PostgrestSingleResponse<any[]>>}
 */
async function ScrapeThenSearch(
  query: string,
  location: string,
  from: number,
  to: number
) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/linkedin-jobs",
      {
        keywords: query,
        location: location,
      }
    );
    console.log("fetched and processed linkedin jobs");
  } catch (error) {
    console.error("Error fetching job listings:", error);
  }

  return SearchJobs(query, location, from, to);
}

/*
 * Searches the database based on a query and location
 *  - Listings with matching location are always on top
 *  - Ranks listings based on how closely they match the query
 *  - Uses word stems to find any variation of the same query/location
 *  - Prioritizes matching words in the title than in the description
 *  - By default returns jobs that aren't already saved
 * 
 * @param {string} query - Space separated list of words to match
 * @param {string} location - Location keywords. eg: (Vancouver BC, Canada)
 * @param {number} from - pagination start index
 * @param {number} to - pagination end index
 * @returns {Promise<PostgrestSingleResponse<any[]>>}
 */
async function SearchJobs(
  query: string,
  location: string,
  from: number,
  to: number
) {
  if (typeof query !== "string") {
    console.error("Invalid query parameter:", query);
    return;
  }

  console.log("Searching jobs...");
  console.log(query);
  let query_terms = query
  .trim()
    .replace(/( )+/g, " | ")
    .trim()
    .replace(/^\|+|\|+$/g, "");
  let location_terms = location
  .trim()
    .replace(/ /g, " | ")
    .trim()
    .replace(/^\|+|\|+$/g, "");
  console.log(query_terms);
  console.log(location_terms);
  const { data, error, count } = await supabase
    .rpc(
      "ts_rank_search",
      { search_terms: query_terms, location_search_terms: location_terms },
      { count: "exact" }
    )
    .order("rank", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching job listings:", error);
    return;
  }

  return { data, error, count };
}

async function GetFirstJobListings(to: number) {
  return await GetJobListingsPaginate(0, to);
}

async function GetJobListingsPaginate(from: number, to: number) {
  return await supabase
    .from("job_listings")
    .select("*", { count: "exact" }) // Include count in the query
    .range(from, to);
}

export {
  ScrapeThenSearch,
  SearchJobs,
  GetJobListings,
  GetJobListingById,
  GetJobListingsPaginate,
  GetFirstJobListings,
};
