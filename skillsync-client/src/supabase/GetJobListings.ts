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
 * First returns jobs with the query words in the title,
 * then jobs with the query words in the description,
 * then returns the rest of the jobs
 * @param {string} query - Space separated list of words to match
 * @returns {Promise<PostgrestSingleResponse<any[]>>}
 */
async function SearchJobs(keywords: string, from: number, to: number) {
    const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .ilike('description', `%${keywords}%`)
        .order('created_at', { ascending: false })
        .range(from, to);
    
    if (error) {
        console.error(error)
        return null;
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