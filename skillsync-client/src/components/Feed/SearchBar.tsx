import React from "react";
import { InputField } from "../common/InputField";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({setSearchValue, handleSearch}) => {
    return (
        <div className='search-bar flex items-center'>
            <InputField className='!rounded-s !rounded-e-none' onChange={(e) => setSearchValue(e.target.value)} item="Jobs" placeholder="Search for Jobs" showLabel={false} />
            <button onClick={handleSearch} className="h-[38px] px-3 !rounded-s-none bg-[#03bd6c] hover:bg-green-700 transition-all duration-300">
                <FaSearch />
            </button>
        </div>
    );
}

export default SearchBar;