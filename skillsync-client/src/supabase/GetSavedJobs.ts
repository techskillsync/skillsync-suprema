import supabase from './supabaseClient'
import { SavedJobs } from '../types/types';

// Param: listing_id - the id of the job listing the user wants to save
// Returns: { data, error } object containing either the error message or the data updated
async function SaveJobListing(): Promise<{ data: SavedJobs, error: string | null }> {
    try {
        const session = await supabase.auth.getSession()

        if (!session.data.session) { throw new Error('unable to get session, you probably need to login') }

        const user = session.data.session.user

        const { data, error } = await supabase
            .from('user_listing_tracker')
            .select('saved_jobs')
            .eq('id', user.id)
            .single()

        if (error) { throw new Error(error.message) }

        return { data: data?.saved_jobs as SavedJobs, error };

    } catch (error) {
        return { data:[], error:error }
    }
}

export default SaveJobListing