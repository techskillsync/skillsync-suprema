import React, { useEffect, useState } from "react";
import { GetAvatar } from "../../supabase/ProfilePicture";
import { FaUser } from "react-icons/fa";

function ProfilePicture({ height, width }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  async function fetchPfpUrl() {
    setAvatarUrl(await GetAvatar());
  }

  useEffect(() => {
    fetchPfpUrl();
  }, []);

  return (
    <div className="w-12 h-12 rounded-full">
      {avatarUrl ? (
        <img className="fade-in rounded-full w-full h-full object-cover" src={avatarUrl} />
      ) : (
        <div className="rounded-full bg-gray-800 w-full h-full">
          <FaUser className="text-gray-200 w-full h-full p-3" />
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;
