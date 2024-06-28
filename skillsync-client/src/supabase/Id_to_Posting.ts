import supabase from "./supabaseClient";
import { JobListing } from "../types/types";

// Converts from a job id to a job_listing
async function IdToPosting(id: String): Promise<JobListing>
{
    try {

        const { data, error } = await supabase
            .from('job_listings')
            .select()
            .eq('id', id)
            .single()

        if (error) { throw new Error(error.message) }

        return data

    } catch (error) {
        return {
            id: '',
            created_at: '',
            title: '',
            company: '',
            location: '',
            link: '',
        }
    }
}

export default IdToPosting