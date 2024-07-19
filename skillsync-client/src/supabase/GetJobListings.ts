import supabase from "./supabaseClient";
import { JobListing } from "../types/types";

// Fetches JobListings from Supabase.
// Returns false on error and the job listings on success
async function GetJobListings(): Promise<JobListing[]|false> {

    const { data, error } = await supabase
        .from('job_listings')
        .select();

    if (error) { return false; }

    return data;
}

async function GetJobListingsPaginate(from: number, to: number) {
    return await supabase.from('job_listings').select('*').range(from, to);
}

export default GetJobListings