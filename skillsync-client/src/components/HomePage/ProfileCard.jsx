import React from "react";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import ProfilePicture from "../common/UserProfilePicture";

const ProfileCard = ({name, school, handleEditProfile}) => {
  return (
    <div className="p-[1.5px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg">
      <div className="relative">
        <div className="w-full h-full bg-[#1e1e27] rounded-md flex flex-col lg:flex-row space-x-3 text-lg p-5 items-center  pb-9">
          <div className="flex flex-col w-1/3 items-center justify-center rounded-full overflow-hidden">
            <ProfilePicture/>
          </div>
          <div className="flex flex-col w-2/3 justify-center text-left w-full lg:pl-2">
            <p className="font-semibold text-xl"> {name}</p>
            {school && <p className="text-sm mt-1">{school}</p>}
          </div>
        </div>
        <div className="absolute bottom-1 right-2">
          {/* <a href="/profile"> */}
          <a onClick={handleEditProfile} className="cursor-pointer">
            <p className="text-xs !font-normal text-gray-400">Edit Profile</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
