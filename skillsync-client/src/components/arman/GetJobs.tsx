import React, { useState } from "react";
import { SearchJobs } from "../../supabase/GetJobListings";
import { JobListing } from "../../types/types";


function GetJobs() {
    const [searchValue, setSearchValue] = useState("");
    const [locationValue, setLocationValue] = useState("")
    const [jobs, setJobs] = useState<Array<JobListing>>([]);

    async function initJobs() {
        const response = await SearchJobs(searchValue, locationValue, 0, 10)
        const { data, error, count } = response || {};

        if (error) {
            console.warn("Error getting job listings:", error);
            return;
        }

        setJobs(data || []);
    }

    return (
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h3>Get Jobs</h3>
            <input className="border border-black rounded-lg p-1"
                type="text"
                placeholder="Search for jobs"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <input className="border border-black rounded-lg p-1"
                type="text"
                placeholder="Location"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
            />
            <button onClick={initJobs} >Search</button>
            <table>
                <tbody className="block">
                    {jobs.map((job, index) => (
                        <tr key={index}>
                            <td>
                                <div>
                                    <p>{job.title}</p>
                                    <p>{job.company}</p>
                                    <p>{job.location}</p>
                                    <a href={job.link ? job.link : '#'} target="_blank" rel="noopener noreferrer">Link</a>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { GetJobs }