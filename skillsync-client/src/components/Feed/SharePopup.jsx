import React, { Children } from "react";

// Share popup intended for sharing Job Descriptions to SkillSync users
const SharePopup = ({ children, content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchEmail, setSearchEmail] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [fadeIn, setFadeIn] = React.useState(false);


  const handleSearch = async () => {
    // Fetch users from supabase
    data = [];
    setSearchResults(data);
  };

  React.useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
    }
  }, [isOpen]);

  return (
    <div>
      <div className="relative">
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
          });
        })}
        {isOpen && (
          <div className={`absolute bg-white shadow p-3 rounded-lg z-[99] top-12 left-0 ${fadeIn ? "fade-in" : ""}`}>
            <div className="flex">
              <input
                className="border border-gray-300 rounded-l py-2 px-4"
                type="text"
                placeholder="Search by email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 !rounded-l-none !rounded-r"
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
    </div>
  );
};
export default SharePopup;
