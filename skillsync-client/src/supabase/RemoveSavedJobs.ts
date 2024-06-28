import supabase from './supabaseClient'
import { SavedJobs } from '../types/types'

async function GetSavedJobs(id): Promise<SavedJobs>
{
    const { data } = await supabase
        .from('user_listing_tracker')
        .select('saved_jobs')
        .eq('id', id)
        .single()
        
    const saved_jobs: SavedJobs = data?.saved_jobs

    if (!saved_jobs) {
        return [];
    }

    return saved_jobs
}

// Removed listing_id from the users saved jobs if it exists
// Param: listing_id - the id of the job listing the user wants to save
// Returns: { data, error } object containing either the error message or the data updated
async function SaveJobListing(listing_id: string): Promise<{ data:object|null, error:string|null }>
{
    try {
        if (!listing_id) { throw new Error('no listing id provided to AddSavedJob') }

        const session = await supabase.auth.getSession()

        if (!session.data.session) { throw new Error('Could not get session in AddSavedJob'); }

        const user = session.data.session.user

        const saved_jobs = await GetSavedJobs(user.id);

        const filtered_saved_jobs = saved_jobs.filter((job) => job.listing_id !== listing_id);

        let updates = {}

        updates['id'] = user.id
        updates['saved_jobs'] = [...filtered_saved_jobs]

        const { data, error } = await supabase
            .from('user_listing_tracker')
            .upsert(updates)
            .select()

        if (error) { throw new Error(error.message) }

        return { data, error };

    } catch (error) {
        console.warn(error)
        return { data:null, error:error }
    }
}

export default SaveJobListing