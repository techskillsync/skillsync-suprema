import supabase from "./supabaseClient";
import { JobListing } from "../types/types";
import { PostgrestTransformBuilder } from "@supabase/postgrest-js";

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
 * First returns jobs with any of the query words in the description,
 * @param {string} query - Space separated list of words to match
 * @returns {Promise<PostgrestSingleResponse<any[]>>}
 */
async function SearchJobs(query: string, from: number, to: number) {
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

export {SearchJobs, GetJobListings, GetJobListingsPaginate, GetFirstJobListings}