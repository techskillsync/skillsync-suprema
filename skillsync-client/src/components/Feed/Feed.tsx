import React from 'react'
import supabase from '../../supabase/supabaseClient';
import { useState, useEffect } from 'react'

interface JobListing {
    id: string;
    created_at: string;
    title: string;
    company: string;
    location: string;
    link: string;
}

function Feed() {
    const [table, setTable] = useState<JobListing[]>([]);

    async function getProfileInfo() {

        const session = await supabase.auth.getSession()

        if (!session || !session.data.session) { console.warn("Error getting session"); return }

        const user = session.data.session.user
    
        const { data, error } = await supabase
            .from('job_listings')
            .select()
    
        setTable(data || [])
        console.log(data)
    }

    useEffect(() => {
        getProfileInfo()
    }, [])


    return(
        <div className="w-[50%] mx-auto leading-[82px] text-[24px]">
            {table.map((item, index) => (
                <a key={index} href={item.link} target="_blank" className="">
                    {item.title} | {item.company} | {item.location}
                </a>
            ))}
        </div>
    )
}

export default Feed