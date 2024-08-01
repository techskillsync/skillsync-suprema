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
      className={`rounded-lg p-[1.5px] bg-gradient-to-r 
       ${
         collapsed
           ? "from-[#1e1e1e] via-[#1e1e1e] to-[#1e1e1e]"
           : "from-green-400 via-blue-500 to-purple-600"
       }
     `}
    >
      <div className="relative">
        <div
          className={`h-full transition-all duration-200 bg-[#1e1e27] rounded-md flex flex-col items-center lg:flex-row space-x-3 text-lg py-5 pb-9
            ${collapsed ? "px-3 w-18" : "px-5 w-56 "}
         `}
        >
            <div
              className={`flex flex-col items-center justify-center rounded-full overflow-hidden 
                ${collapsed ? "w-full" : 'w-1/3'}`}
            >
              <ProfilePicture />
            </div>
          <div
            className={`flex flex-col justify-center text-left fade-in ${
              collapsed ? "hidden w-0" : "w-2/3"
            }`}
          >
            <p className="font-semibold text-lg"> {name}</p>
            {school && <p className="text-xs mt-1">{school}</p>}
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
