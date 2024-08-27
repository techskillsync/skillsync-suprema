import React, {useRef, useEffect} from "react";
import { FindAvatar, FindUser } from "../../supabase/OtherUsers";
import { FaUser } from "react-icons/fa";
import { SendMessage } from "../../supabase/Messages";
import toast, { Toaster } from 'react-hot-toast';

// Share popup intended for sharing Job Descriptions to SkillSync users
const SharePopup = ({ children, content }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchEmail, setSearchEmail] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [fadeIn, setFadeIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [empty, setEmpty] = React.useState(true);
  const shareref= useRef(null);

  async function handleSendMessage(recepientId) {
    const message = {
      receiver: recepientId,
      content: {
        type: "job description",
        payload: content,
      },
    };

    setIsOpen(false);
    console.log("Sending message...");
    const messageSentPromise = SendMessage(message);
    toast.promise(messageSentPromise, {
      loading: 'Sending message...',
      success: 'Message sent!',
      error: 'Failed to send message',
    });

  }

  async function handleSearch() {
    if (searchEmail === "") {
      setEmpty(true);
      return;
    }

    setEmpty(false);

    setLoading(true);

    const user = await FindUser(searchEmail);
    if (!user?.id) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    console.log(user.id);
    const pfpUrl = await FindAvatar(user.avatar_url);

    setSearchResults([
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: pfpUrl,
      },
    ]);

    setLoading(false);
  }

  React.useEffect(() => {
    if (isOpen) {
      setFadeIn(true);
    }
  }, [isOpen]);

  // qit the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (shareref.current && !shareref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareref]);


  return (
    <div className="text-black">
      <Toaster />
      <div className="relative">
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
          });
        })}
        {isOpen && (
          <div ref={shareref}
            className={`absolute bg-white w-[400px] shadow p-3 rounded-lg z-[99] right-[10px] bottom-[0px] md:left-[0px] md:bottom-[1px]  ${
              fadeIn ? "fade-in" : ""
            }`}
          >
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
                // disabled={!searchEmail || loading}
              >
                Search
              </button>
            </div>
            <div id="search results" className="mt-4 p-3">
              {loading ? (
                <p>Loading ...</p>
              ) : empty ? (
                <p></p>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="border border-gray-300 flex rounded p-4 mb-4"
                  >
                    <div className="w-1/5">
                      {user.avatar ? (
                        <img
                          className="rounded-full w-full h-full"
                          src={user.avatar}
                          alt="avatar"
                        />
                      ) : (
                        <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                          <p className="text-white text-xl">
                            <FaUser />
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-4/5 px-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg">{user.name}</p>
                        <button onClick={() => handleSendMessage(user.id)} className="bg-transparent border-none text-blue-500 hover:text-blue-800 !p-0 transition-all duration-200 text-sm p-0 rounded">
                          Share
                        </button>
                      </div>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
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
