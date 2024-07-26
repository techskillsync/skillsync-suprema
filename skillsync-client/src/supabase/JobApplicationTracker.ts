import supabase from './supabaseClient'
import { GetUserId } from './GetUserId';
import { UserProfile } from '../types/types';

// Param: columns - the job ID to save to the current user's tracker
// Returns: true/false whether successful
// Saves Jobs using the user_job_listing_tracker table
async function SaveJob(jobId : string): Promise<boolean> {
    console.log('Saving Job', jobId);
    try {
        const userID = await GetUserId();
        if (!userID) { throw new Error('Not signed in') }
        await supabase.from('user_job_listing_tracker').insert([
            {
                user_id: userID,
                job_listing_id: jobId,
                status: 'saved'
            }
        ]);
        return true;

    } catch (error) {
        console.warn(error);
        return false;
    }
}

async function RemoveJob(jobId: string): Promise<boolean> {
    try {
        const userID = await GetUserId();
        if (!userID) { throw new Error('Not signed in') }
        await supabase.from('user_job_listing_tracker').delete().eq('user_id', userID).eq('job_listing_id', jobId);
        return true;

    } catch (error) {
        console.warn(error);
        return false;
    }
}

async function CheckExists(jobId: string): Promise<boolean> {
    console.log('Checking if job exists', jobId);
    try {
        const userID = await GetUserId();
        if (!userID) { throw new Error('Not signed in'); }

        const { count, error } = await supabase
            .from('user_job_listing_tracker')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userID)
            .eq('job_listing_id', jobId);

        if (error) { throw error; }
        const result = ((count ?? 0) > 0);
        console.log('Job exists:', result);
        return result;
    } catch (error) {
        console.warn(error);
        return false;
    }
}

export { SaveJob, RemoveJob, CheckExists }