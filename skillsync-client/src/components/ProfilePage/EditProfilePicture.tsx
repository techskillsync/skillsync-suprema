import React, { useEffect, useState } from "react";
import { GetAvatar, SetAvatar } from "../../supabase/ProfilePicture";
import { FaEdit, FaHourglass } from "react-icons/fa";
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
      {avatarURL !== "" ? (
        <div className="relative">
          <img
            className="rounded-lg"
            height={"250px"}
            width={"250px"}
            src={newAvatarURL ? newAvatarURL : avatarURL}
          />
          <div className="absolute right-1 bottom-1">
            <div className="flex space-x-2">
              <label htmlFor="single" className="bg-[#1e1e1e] rounded-lg">
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
                  className="!p-3"
                  onClick={updateProfile}
                >
                  {isLoading ? <FaHourglass /> : <FaCheck />}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>profile image is null</>
      )}
    </div>
  );
}

export default EditProfilePicture;
