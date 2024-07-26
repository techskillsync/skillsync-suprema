import { useEffect, useState } from "react";
import React from "react";
import { GetProfileInfo } from '../../supabase/ProfileInfo'
import { IoMdClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";

function SearchFilters({ setLocationKeys }) {
    const [userLocationText, setUserLocationText] = useState("");

    async function fetchAndSet() {
        const response = await GetProfileInfo('location, work_eligibility')
        if (!response) {
            console.warn('Could not get user location for Search Filter')
            return
        }
        const userLocation = response.location;
        setUserLocationText(userLocation)
        setLocationKeys(userLocation)
    }

    // useEffect(() => {
    //     fetchAndSet()
    // }, [])

    function removeLocation() {
        setUserLocationText("")
        setLocationKeys("")
    }

    return (
        <div id="filters" className="mt-4 flex">
            <div className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#03BD6C] border-[1px] flex justify-center items-center mr-3">
                Add Filters <GoPlus className="ml-1" />
            </div>
            {userLocationText === "" ?
                <></>
                :
                <div className="bg-[#1E1E1E] p-2 rounded-md text-white border-[#36B7FE] border-[1px]" >
                    {userLocationText} <IoMdClose className="inline mb-1 cursor-pointer" onClick={removeLocation} />
                </div>
            }
        </div>
    )
}

export default SearchFilters;