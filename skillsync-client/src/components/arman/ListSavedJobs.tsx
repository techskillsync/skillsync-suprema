import React, { useState, useEffect } from "react";
import { JobListing } from "../../types/types";
import { GetSavedJobs, RemoveSavedJob } from "../../supabase/JobListingTracker";

function ListSavedJobs() {
    const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);

    async function GetThenSet() {
        GetSavedJobs()
            .then((resp) => { setSavedJobs(resp) })
    }

    useEffect(() => {
        GetThenSet();
    }, [])



    return (
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h3>Saved Jobs:</h3>
            {savedJobs.map((job, index) => (
                <div className="w-full text-left flex my-2" key={index}>
                    <div className="bg-red-700 p-1 mr-2 self-start cursor-pointer"
                        onClick={
                            () => RemoveSavedJob(job)
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