import React, { useState } from "react";
import { SearchJobs } from "../../supabase/GetJobListings";


function GetJobs() {
    const [searchValue, setSearchValue] = useState("");
    const [jobs, setJobs] = useState([]);
    
    async function initJobs() {
        setJobs(await SearchJobs(searchValue, 0 , 10));
    }

    return(
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h3>Get Jobs</h3>
            <input className="border border-black rounded-lg p-1"
                   type="text"
                   placeholder="Search for jobs" 
                   value={searchValue} 
                   onChange={(e) => setSearchValue(e.target.value)} 
                />
            <button onClick={initJobs} >Search</button>
            <table>
                <tbody className="flex flex-col">
                    {jobs.map((job, index) => (
                        <tr key={index}>
                            <td className="overflow-scroll">{job.title}</td>
                            < br/>
                            <td className="overflow-scroll">{job.company}</td>
                            < br/>
                            <td className="overflow-scroll"><a href={job.link}>Link</a></td>
                            < br/>< br/>< br/>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { GetJobs }