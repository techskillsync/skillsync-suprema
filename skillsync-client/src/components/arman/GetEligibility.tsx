import React from 'react'
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";
import { get } from 'http';

function GetEligibility() {
    const [countries, setCountries] = useState(['']);

    async function getEligibility() {

        const session = await supabase.auth.getSession();

        if (!session || !session.data.session ) { console.warn("could not get user session"); return false }

        const user = session.data.session.user

        const { data, error } = await supabase
            .from('user_profiles')
            .select(`work_eligibility`)
            .eq('id', user.id)
            .single()

        setCountries(data?.work_eligibility)
    }
    useEffect(() => {
        getEligibility()
    }, [])

    return (
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            	<p>{countries.toString()}</p>
                <button onClick={getEligibility}>Refresh</button>
        </div>
    )
}

export default GetEligibility