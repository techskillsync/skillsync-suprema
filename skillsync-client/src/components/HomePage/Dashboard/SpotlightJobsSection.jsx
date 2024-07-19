import React from 'react'
import GetJobListings from '../../../supabase/GetJobListings';
import {JobListing} from '../../../types/JobListing'
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
    );
}

export default Feed