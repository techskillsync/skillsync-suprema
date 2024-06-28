import React, { useState, useEffect } from "react";
import { SavedJobs, JobListing } from "../../types/types";
import GetSavedJobs from '../../supabase/GetSavedJobs'
import RemoveSavedJobs from '../../supabase/RemoveSavedJobs'
import Id_to_Posting from '../../supabase/Id_to_Posting'


function ListSavedJobs() {
    const [savedJobs, setSavedJobs] = useState<SavedJobs>([]);
    const [jobPostings, setJobPostings] = useState<JobListing[]>([]);

    async function GetThenSet() {
        GetSavedJobs()
            .then((resp) => { setSavedJobs(resp.data) })
    }

    useEffect(() => {
        GetThenSet();
    }, [])

    useEffect(() => {
        async function syncJobPostings() {
            let temp_jobPostings: JobListing[] = []
            for (let job of savedJobs) {
                let full_job = await Id_to_Posting(job.listing_id)
                temp_jobPostings.push(full_job)
            }
            setJobPostings(temp_jobPostings)
            console.log(temp_jobPostings)
        }
        syncJobPostings()
    }, [savedJobs])

    return (
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h3>Saved Jobs:</h3>
            {jobPostings.map((job, index) => (
                <div className="w-full text-left flex my-2" key={index}>
                    <div className="bg-red-700 p-1 mr-2 self-start"
                        onClick={
                            () => RemoveSavedJobs(job.id)
                                .then(() => GetThenSet())
                        }>
                        rm

                    </div>
                    <div className="block mb-3">
                        <p><strong>{job.title}</strong></p>
                        <p>{job.company}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ListSavedJobs