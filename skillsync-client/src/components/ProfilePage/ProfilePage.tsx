import React from "react";
import UpdateAvater from "../arman/UpdateAvatar";
import Avatar from "../arman/DisplayAvatar";
import EditProfilePicture from "./EditProfilePicture";
import EditProfileDetails from "./EditProfileDetails";

const ProfilePage = () => {
  return (
    <div className="bg-black min-h-screen w-full p-12">
      {/* <h1>Profile Page</h1> */}
      <div className="">
        <EditProfileDetails />
      </div>
    </div>
  );
};

export default ProfilePage;
