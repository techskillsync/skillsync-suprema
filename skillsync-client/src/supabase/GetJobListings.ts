import supabase from "./supabaseClient";
import { JobListing } from "../types/types";
import { PostgrestTransformBuilder } from "@supabase/postgrest-js";
import axios from "axios";

// Fetches JobListings from Supabase.
// Returns false on error and the job listings on success
async function GetJobListings(): Promise<JobListing[]|false> {

    const { data, error } = await supabase
        .from('job_listings')
        .select();

    if (error) { return false; }

    return data;
}

/*
 * ------- WARNING ------- WARNING --------- WARNING ------- 
 * THIS IS SUPER SLOW. IF SPEED IS A CONCERN HANDLE SCRAPING AND 
 * SEARCHING SEPARATELY.
 * ------- WARNING ------- WARNING --------- WARNING -------
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
async function ScrapeThenSearch(query: string, location: string, from: number, to: number) {
    try {
        const response = await axios.post("http://localhost:5000/api/linkedin-jobs", {
            keywords: query,
            location: location
        });
        console.log('fetched and processed linkedin jobs')
    } catch (error) {
        console.error("Error fetching job listings:", error);
    }

    return SearchJobs(query, location, from, to);
}

/*
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
async function SearchJobs(query: string, location: string, from: number, to: number)
{
    let terms = query.replace(/ /g, ' | ').trim().replace(/^\|+|\|+$/g, '');
    const { data, error } = await supabase
        .rpc('ts_rank_search', {search_terms: terms})
        .order('rank', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching job listings:', error)
        return
    }

    return data
}

async function GetFirstJobListings(to: number) {
    return await GetJobListingsPaginate(0, to);
}

async function GetJobListingsPaginate(from: number, to: number) {
    return await supabase
        .from('job_listings')
        .select('*', { count: 'exact' }) // Include count in the query
        .range(from, to);
}

export {ScrapeThenSearch, SearchJobs, GetJobListings, GetJobListingsPaginate, GetFirstJobListings}