import React from "react";
import UpdateAvater from "../arman/UpdateAvatar";
import Avatar from "../arman/DisplayAvatar";
import EditProfilePicture from "./EditProfilePicture";

const ProfilePage = () => {
  return (
    <div>
      <h1>Profile Page</h1>
      <div className="m-4">
        <EditProfilePicture />
      </div>
      {/* <div className="m-4">
                < />
            </div> */}
    </div>
  );
};

export default ProfilePage;
