import React, { useEffect, useState } from "react";
import { GetAvatar } from "../../supabase/ProfilePicture";
import { FaUser } from "react-icons/fa";

function ProfilePicture({ height, width, avatarUrlDefault }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  async function fetchPfpUrl() {
    setAvatarUrl(await GetAvatar());
  }

  useEffect(() => {
    if (!avatarUrlDefault) {
      fetchPfpUrl();
    }      
  }, []);

  return avatarUrl ? (
    <img className="fade-in" src={avatarUrlDefault ?? avatarUrl} />
  ) : (
    <div className="w-12 h-12">
      <div className="rounded-full bg-gray-800 w-full h-full">
        <FaUser className="text-gray-200 w-full h-full p-3" />
      </div>
    </div>
  );
}

export default ProfilePicture;
