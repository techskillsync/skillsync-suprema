import React, { useState, useEffect } from 'react';
import { GetJobListingsPaginate } from '../../supabase/GetJobListings';
import { AddToSavedJobs, AddToAppliedJobs } from '../../supabase/JobListingTracker';
import { JobListing } from '../../types/types';
import JobDescriptionCard from './JobDescriptionCard';

function Feed() {
    const [listings, setListings] = useState<JobListing[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchListings();
    }, [currentPage]);

    async function fetchListings() {
        const pageSize = 3; // Number of listings per page
        const from = (currentPage - 1) * pageSize;
        const to = currentPage * pageSize;
        const { data, error, count } = await GetJobListingsPaginate(from, to);
        if (error) {
            console.warn('Error getting job listings:', error);
            return;
        }

        setListings(data || []);
        setTotalPages(Math.ceil(count ? count / pageSize : 0));
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
    }

    return (
        <div>
            <div className='pagination text-black'>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='bg-transparent'
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                    if (totalPages <= 5) {
                        return (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`${currentPage === index + 1 ? 'active' : ''} bg-transparent`}
                            >
                                {index + 1}
                            </button>
                        );
                    } else {
                        if (index === 0 || index === totalPages - 1 || (index >= currentPage - 2 && index <= currentPage + 2)) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`${currentPage === index + 1 ? 'active' : ''} bg-transparent`}
                                >
                                    {index + 1}
                                </button>
                            );
                        } else if (index === currentPage - 3 || index === currentPage + 3) {
                            return (
                                <button
                                    key={index}
                                    disabled
                                    className='bg-transparent'
                                >
                                    ...
                                </button>
                            );
                        } else {
                            return null;
                        }
                    }
                })}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='bg-transparent'
                >
                    Next
                </button>
            </div>
            {listings.map((item, index) => (
                <div className='mb-3' key={index}>
                    <JobDescriptionCard jobDescription={item} />
                </div>
            ))}
        </div>
    );
}

export default Feed;