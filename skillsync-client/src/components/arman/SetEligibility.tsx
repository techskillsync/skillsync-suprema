import React from 'react'
import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";

function SetEligibility() {
    const [countries, setCountries] = useState('');

    async function uploadEligibility(eligibleCountries: string[]) {

        const session = await supabase.auth.getSession();

        if (!session || !session.data.session ) { console.warn("could not get user session"); return false }

        const user = session.data.session.user

        const updates = {
            'id': user.id,
            'work_eligibility': eligibleCountries
        }

        const { error } = await supabase.from('user_profiles').upsert(updates)
        if (error) { console.warn(error.message); return false; }

        return true
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const countryArray = countries.split(",").map((country) => country.trim());
        console.log(countryArray)
        uploadEligibility(countryArray)
    }

    return (
        <form onSubmit={handleSubmit} className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            	<label htmlFor="username">Eligible countries (comma separated list) </label>
				<input 
                    required 
                    className="border border-black rounded-md px-2 mx-2" 
                    placeholder='Canada, USA, UAE, ...'
                    onChange={(e) => setCountries(e.target.value)}
                    value={countries}
                    />
                <button type="submit">Submit</button>
        </form>
    )
}

export default SetEligibility