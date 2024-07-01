import React, { useState, useEffect } from "react";
import { JobListing } from "../../types/types";
import { GetAppliedJobs, RemoveAppliedJob } from "../../supabase/JobListingTracker";

function ListAppliedJobs() {
    const [appliedJobs, setAppliedJobs] = useState<JobListing[]>([]);

    async function GetThenSet() {
        GetAppliedJobs()
            .then((resp) => { setAppliedJobs(resp) })
    }

    useEffect(() => {
        GetThenSet();
    }, [])



    return (
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h3>Applied Jobs:</h3>
            {appliedJobs.map((job, index) => (
                <div className="w-full text-left flex my-2" key={index}>
                    <div className="bg-red-700 p-1 mr-2 self-start cursor-pointer"
                        onClick={
                            () => RemoveAppliedJob(job)
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

export default ListAppliedJobs