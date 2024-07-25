import React from "react";
import { InputField } from "../common/InputField.tsx";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ setSearchValue, handleSearch }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="search-bar h-[40px] flex items-center">
        <InputField
          className="h-[40px] !rounded-l-lg !rounded-r-none"
          onChange={(e) => setSearchValue(e.target.value)}
          item="Jobs"
          placeholder="Search for Jobs"
          showLabel={false}
        />
        <button
          type="submit"
          onClick={handleSearch}
          className=" h-full px-3 !rounded-l-none bg-[#03bd6c] hover:bg-green-700 transition-all duration-300"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
