import React from "react";
import { InputField } from "../common/InputField.tsx";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ setSearchValue, handleSearch }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="search-bar flex items-center">
        <InputField
          className="!rounded-s !rounded-e-none"
          onChange={(e) => setSearchValue(e.target.value)}
          item="Jobs"
          placeholder="Search for Jobs"
          showLabel={false}
        />
        <button
          type="submit"
          onClick={handleSearch}
          className="h-[38px] px-3 !rounded-s-none bg-[#03bd6c] hover:bg-green-700 transition-all duration-300"
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
