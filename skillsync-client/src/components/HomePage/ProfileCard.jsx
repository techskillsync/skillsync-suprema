import React from "react";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import ProfilePicture from "../common/UserProfilePicture";

const ProfileCard = ({
  name,
  school,
  handleEditProfile,
  collapsed = false,
}) => {
  return (
    <div
      className={`rounded-lg
       ${
         collapsed
           ? "p-2"
           : "fade-in p-[1.5px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
       }
     `}
    >
      <div className="relative">
        <div
          className={`w-full h-full bg-[#1e1e27] rounded-md flex flex-col items-center 
          ${collapsed ? "p-2" : " lg:flex-row space-x-3 text-lg p-5  pb-9"}`}
        >
          <div
            className={`flex flex-col items-center justify-center rounded-full overflow-hidden ${
              collapsed ? "w-full" : "w-1/3"
            }`}
          >
            <ProfilePicture />
          </div>
          <div
            className={`flex flex-col w-2/3 justify-center text-left w-full lg:pl-2 fade-in ${
              collapsed ? "hidden" : ""
            }`}
          >
            <p className="font-semibold text-xl"> {name}</p>
            {school && <p className="text-sm mt-1">{school}</p>}
          </div>
        </div>
        <div
          className={`absolute bottom-1 right-2 fade-in ${
            collapsed ? "hidden" : ""
          }`}
        >
          <a onClick={handleEditProfile} className="cursor-pointer">
            <p className="text-xs !font-normal text-gray-400">Edit Profile</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
