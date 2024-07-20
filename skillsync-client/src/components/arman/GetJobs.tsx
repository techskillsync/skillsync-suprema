import React from "react";
import { SearchJobs } from "../../supabase/GetJobListings";


function GetJobs() {
    let jobs:Array<Object>|null = []
    async function initJobs() {
        jobs = await SearchJobs('Software', 0 , 10);
        console.log(jobs);
    }
    initJobs();
    return(
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h3>Get Jobs</h3>

        </div>
    );
}

export { GetJobs }