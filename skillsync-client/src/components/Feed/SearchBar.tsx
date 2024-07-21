import React from "react";
import { InputField } from "../common/InputField";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({setSearchValue}) => {
    return (
        <div className='search-bar flex items-center'>
            <InputField className='!rounded-s !rounded-e-none' onChange={setSearchValue} item="Jobs" placeholder="Search for Jobs" showLabel={false} />
            <button className="h-[38px] px-3 !rounded-s-none bg-[#03bd6c] hover:bg-green-700 transition-all duration-300">
                <FaSearch />
            </button>
        </div>
    );
}

export default SearchBar;