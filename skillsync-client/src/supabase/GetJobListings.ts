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

async function GetFirstJobListings(to: number) {
    return await GetJobListingsPaginate(0, to);
}

async function GetJobListingsPaginate(from: number, to: number) {
    return await supabase
        .from('job_listings')
        .select('*', { count: 'exact' }) // Include count in the query
        .range(from, to);
}

export {GetJobListings, GetJobListingsPaginate, GetFirstJobListings}