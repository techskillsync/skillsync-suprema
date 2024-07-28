import React, { Children } from "react";

// Share popup intended for sharing Job Descriptions to SkillSync users
const SharePopup = ({ content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchEmail, setSearchEmail] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = async () => {
    // Fetch users from supabase
    data = [];
    setSearchResults(data);
  };

  return (
    <div>
        <div>{content}</div>
      {isOpen && (
        <div className="mt-4">
          <div className="flex">
            <input
              className="border border-gray-300 rounded-l py-2 px-4"
              type="text"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div id="search results" className="mt-4">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-300 rounded p-4 mb-4"
                >
                  <p className="font-bold">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                    Share
                  </button>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SharePopup;
