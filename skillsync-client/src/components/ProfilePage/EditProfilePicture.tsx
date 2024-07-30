import React, { useEffect, useState } from "react";
import { GetAvatar, SetAvatar } from "../../supabase/ProfilePicture";
import { FaEdit, FaHourglass, FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

function EditProfilePicture() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarURL, setAvatarURL] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [newAvatarURL, setNewAvatarURL] = useState("");

  function handleImageUpdate(event) {
    const file = event.target.files[0];
    setNewAvatar(file);
    setNewAvatarURL(URL.createObjectURL(file));
  }

  async function updateProfile(event) {
    event.preventDefault();
    setIsLoading(true);
    await SetAvatar(newAvatar);
    setAvatarURL(newAvatarURL);
    setNewAvatar(null);
    setNewAvatarURL("");
    setIsLoading(false);
  }

  async function fetchPfpUrl() {
    setAvatarURL(await GetAvatar());
  }
  useEffect(() => {
    fetchPfpUrl();
  }, []);

  return (
    <div className="rounded-md flex flex-col items-center justify-center">
      <div className="relative">
        {avatarURL !== "" || newAvatarURL ? (
          <img
            className="rounded-full"
            width={"200px"}
            src={newAvatarURL ? newAvatarURL : avatarURL}
          />
        ) : (
          <div className="w-[200px] h-[200px]">
            <div className="rounded-full bg-gray-800 w-full h-full flex items-center justify-center">
              <FaUser className="text-white w-1/2 h-1/2 m-auto" />
            </div>
          </div>
        )}
        <div className="absolute right-1 bottom-1">
          <div className="flex space-x-2">
            <label htmlFor="single" className="bg-green-500 rounded-full">
              <div className="cursor-pointer p-3 [bg-#1e1e1e]">
                <FaEdit />
              </div>
            </label>
            <input
              style={{ visibility: "hidden", position: "absolute" }}
              type="file"
              id="single"
              accept="image/*"
              onChange={handleImageUpdate}
            />
            {newAvatar && (
              <button
                disabled={isLoading}
                id="submit"
                className="!p-3 rounded-full bg-green-500"
                onClick={updateProfile}
              >
                {isLoading ? <FaHourglass /> : <FaCheck />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePicture;
