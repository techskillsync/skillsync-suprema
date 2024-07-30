import Dashboard from "./Dashboard/Dashboard";
import Feed from "../Feed/Feed";
import ResumeBuilder from "./ResumeBuilder";
import Messages from "./Messages.tsx";
import LogoDark from "../../assets/LogoDark.png";
import ProfileCard from "./ProfileCard";

import { MdSpaceDashboard, MdNewspaper, MdInbox } from "react-icons/md";
import { FaGear, FaSheetPlastic } from "react-icons/fa6";
import { BiSpreadsheet } from "react-icons/bi"
import EditProfileDetails from "../ProfilePage/EditProfileDetails";
import ProfilePage from "../ProfilePage/ProfilePage";
import JobApplicationTracker from "../Feed/JobApplicationTracker.tsx";
import { FaAcquisitionsIncorporated } from "react-icons/fa";
import { BsFileSpreadsheet } from "react-icons/bs";
import { GetUnreadMessagesCount } from "../../supabase/Messages.ts";
import { useEffect, useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    component: Dashboard,
    icon: <MdSpaceDashboard />,
    show: true,
  },
  { name: "Jobs", component: Feed, icon: <MdNewspaper />, show: true },
  {
    name: "Resume Builder",
    component: ResumeBuilder,
    icon: <FaSheetPlastic />,
    show: true,
  },
  { name: "Tracker", component: JobApplicationTracker, icon: <BiSpreadsheet />, show: true },
  { name: "Messages", component: Messages, icon: <MdInbox />, show: true },
  { name: "Profile", component: ProfilePage, show: false },
];

const MenuBar = ({ selectedPage, setSelectedPage, profileInfo }) => {
  const [notificationCounts, setNotificationCounts] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    async function fetchMessagesCount() {
      const messagesCount = await GetUnreadMessagesCount();
      setNotificationCounts({ 'Messages': messagesCount });
    }
    fetchMessagesCount();
  }
  , []);

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-white flex flex-col py-3 justify-between">
      <div className="w-full p-8">
        <img
          className="mx-auto"
          width={150}
          src={LogoDark}
          alt="SkillSync. Logo"
        />
      </div>
      <div>
        <ul className="text-left">
          {menuItems.map(
            (item) =>
              item.show && (
                <li
                  key={item.name}
                  className={`px-12 py-4 mx-3 my-1 rounded-lg cursor-pointer transition-bg duration-300
                    hover:bg-[#2e2e2e]
                    ${
                    selectedPage === item.name ? "bg-black" : ""
                  }`}
                  onClick={() => setSelectedPage(item.name)}
                >
                  <div className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.name}
                    {
                      notificationCounts[item.name] > 0 &&
                      <span className="ml-auto bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-semibold rounded-full px-2 py-0.5">
                        {notificationCounts[item.name]}
                      </span>
                    }
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
      <div className="p-4">
        <ProfileCard
          name={profileInfo?.name}
          school={profileInfo?.school}
          handleEditProfile={() => setSelectedPage("Profile")}
        />
      </div>
    </div>
  );
};

export { menuItems, MenuBar };
