import supabase from './supabaseClient'
import { JobListing } from '../types/types';

async function GetUserId() {
    const session = await supabase.auth.getSession()

    if (!session.data.session) { throw new Error('unable to get session, you probably need to login') }

    return session.data.session.user.id
}

// Fetches the user's saved jobs from supabase's public.user_listing_tracker table
// Returns: JobListing[], an array of JSON objects representing job listings
async function GetSavedJobs(): Promise<JobListing[]> {
    try {
        const { data, error } = await supabase
            .from('user_listing_tracker')
            .select('saved_jobs')
            .eq('id', await GetUserId())
            .single()

        if (error) { throw new Error(error.message) }

        return data?.saved_jobs as JobListing[];

    } catch (error) {
        console.warn("Error in GetSavedJobs - " + error)
        return []
    }
}

// Appends new_listing to the users saved jobs, if it does not already exist
// Param: new_listing - the JobListing object the user wants to save
// Returns: true/false based on if the operation succeeded/failed
async function AddToSavedJobs(new_listing: JobListing): Promise<true|false>
{
    try {
        if (!new_listing) { throw new Error("Listing not given to AddToSavedJob") }

        const saved_jobs = await GetSavedJobs();
        
        for (let job of saved_jobs) {
            if (job.id === new_listing.id) {
                throw new Error('job already saved')
            }
        }

        let updates = {}

        updates['id'] = await GetUserId()
        updates['saved_jobs'] = [...saved_jobs, new_listing]

        const { data, error } = await supabase
            .from('user_listing_tracker')
            .upsert(updates)
            .select()

        if (error) { throw new Error(error.message) }

        return true;

    } catch (error) {
        console.warn(error)
        return false
    }
}

// Removes new_listing from the user's saved jobs
// Param: new_listing - the JobListing to be removed
// Returns: true/false
async function RemoveSavedJob(new_listing: JobListing): Promise<true|false>
{
    try {
        if (!new_listing) { throw new Error('no listing id provided to RemoveSavedJob') }

        const saved_jobs = await GetSavedJobs();

        const filtered_saved_jobs = saved_jobs.filter((job) => job.id !== new_listing.id);

        let updates = {}

        updates['id'] = await GetUserId()
        updates['saved_jobs'] = [...filtered_saved_jobs]

        const { error } = await supabase
            .from('user_listing_tracker')
            .upsert(updates)
            .select()

        if (error) { throw new Error(error.message) }

        return true;

    } catch (error) {
        console.warn(error)
        return false
    }
}

// Returns the user's applied jobs as a list of JobListing objects
async function GetAppliedJobs(): Promise<JobListing[]> {
    try {
        const { data, error } = await supabase
            .from('user_listing_tracker')
            .select('applied_jobs')
            .eq('id', await GetUserId())
            .single()

        if (error) { throw new Error(error.message) }

        return data?.applied_jobs as JobListing[];

    } catch (error) {
        console.warn("Error in GetAppliedJobs - " + error)
        return []
    }
}

// Param: new_listing - the JobListing object to add to the user's applied jobs
// Returns: true/false
async function AddToAppliedJobs(new_listing: JobListing): Promise<true|false> {
    try {
        if (!new_listing) { throw new Error("Listing not given to AddToAppliedJobs") }

        const applied_jobs = await GetAppliedJobs();
        
        for (let job of applied_jobs) {
            if (job.id === new_listing.id) {
                throw new Error('job already applied for')
            }
        }

        let updates = {}

        updates['id'] = await GetUserId()
        updates['applied_jobs'] = [...applied_jobs, new_listing]

        const { error } = await supabase
            .from('user_listing_tracker')
            .upsert(updates)
            .select()

        if (error) { throw new Error(error.message) }

        return true;

    } catch (error) {
        console.warn(error)
        return false
    }
}

// Removes all instances of new_listing for the user's applied jobs.
// Param: new_listing - the object the user wants removed
// Returns: true/false
async function RemoveAppliedJob(new_listing: JobListing): Promise<true|false>
{
    try {
        if (!new_listing) { throw new Error('no listing id provided to RemoveAppliedJob') }

        const applied_jobs = await GetAppliedJobs();

        const filtered_applied_jobs = applied_jobs.filter((job) => job.id !== new_listing.id);

        let updates = {}

        updates['id'] = await GetUserId()
        updates['applied_jobs'] = [...filtered_applied_jobs]

        const { error } = await supabase
            .from('user_listing_tracker')
            .upsert(updates)
            .select()

        if (error) { throw new Error(error.message) }

        return true;

    } catch (error) {
        console.warn(error)
        return false
    }
}

export { GetSavedJobs, AddToSavedJobs, RemoveSavedJob }
export { GetAppliedJobs, AddToAppliedJobs, RemoveAppliedJob }