import React from 'react'
import GetJobListings from '../../supabase/GetJobListings'
import { AddToSavedJobs, AddToAppliedJobs } from '../../supabase/JobListingTracker';
import { JobListing } from '../../types/types';
import { useState, useEffect } from 'react'
import JobDescriptionCard from './JobDescriptionCard';

function Feed() {
    const [listings, setListings] = useState<JobListing[]>([]);

    useEffect(() => {
        async function fetchListings() {
            const data = await GetJobListings()
            if (!data) { console.warn('error getting job listings'); return; }
            setListings(data)
        }
        fetchListings();
    }, [])

    return (
        listings.map((item, index) => (
            <div className='mb-3'>
                <JobDescriptionCard key={index} jobDescription={item} />
            </div>
        ))
        // <div className="w-[50%] mx-auto text-[24px]">
        //     <table className="w-full border-collapse table-fixed">
        //         <thead>
        //             <tr>
        //                 <th className="border border-black">.</th>
        //                 <th className="border border-black">Title</th>
        //                 <th className="border border-black">Company</th>
        //                 <th className="border border-black">Location</th>
        //                 <th className="border border-black">Link</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {listings.map((item, index) => (
        //                 <tr key={index} className="h-[2rem]">
        //                     <td className="border border-black text-sky-700 cursor-pointer" onClick={() => AddToAppliedJobs(item)}>Apply For Job</td>
        //                     <td className="border border-black text-emerald-700 cursor-pointer" onClick={() => AddToSavedJobs(item)}>Save Job</td>
        //                     <td className="border border-black">{item.title}</td>
        //                     <td className="border border-black">{item.company}</td>
        //                     <td className="border border-black">{item.location}</td>
        //                     <td className="border border-black"><a className="truncate block overflow-scroll" href={item.link}>{item.link}</a></td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    );
}

export default Feed