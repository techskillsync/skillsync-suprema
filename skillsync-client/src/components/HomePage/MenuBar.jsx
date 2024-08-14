import Dashboard from "./Dashboard/Dashboard";
import Feed from "../Feed/Feed";
import ResumeBuilder from "./ResumeBuilder";
import Messages from "./Messages.tsx";
import LogoDarkText from "../../assets/LogoDarkText.png";
import ProfileCard from "./ProfileCard";
import { MdSpaceDashboard, MdNewspaper, MdInbox } from "react-icons/md";
import { FaGear, FaSheetPlastic } from "react-icons/fa6";
import { BiSpreadsheet } from "react-icons/bi";
import EditProfileDetails from "../ProfilePage/EditProfileDetails";
import ProfilePage from "../ProfilePage/ProfilePage";
import JobApplicationTracker from "../JobApplicationTracker/JobApplicationTrackerNew.tsx";
import { FaAcquisitionsIncorporated } from "react-icons/fa";
import { BsFileSpreadsheet } from "react-icons/bs";
import { GetUnreadMessagesCount } from "../../supabase/Messages.ts";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { IoChatbox, IoDocument } from "react-icons/io5";
import FeedbackPage from "./FeedbackPage.jsx";

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
    icon: <IoDocument />,
    show: true,
  },
  {
    name: "Tracker",
    component: JobApplicationTracker,
    icon: <BiSpreadsheet />,
    show: true,
  },
  { name: "Messages", component: Messages, icon: <MdInbox />, show: true },
  {
    name: "Feedback",
    icon: <IoChatbox />,
    component: FeedbackPage,
    show: false,
  },
  { name: "Profile", component: ProfilePage, show: false },
];

const MenuBar = ({
  selectedPage,
  handleMenuItemClick,
  profileInfo,
  setSidebarExpanded,
}) => {
  const [notificationCounts, setNotificationCounts] = useState({});
  const [collapsed, setCollapsed] = useState(true);

  const location = useLocation();

  const fetchMessagesCount = async () => {
    const newMessagesCount = await GetUnreadMessagesCount(); // Replace with your actual fetch logic
    setNotificationCounts((prevCounts) => {
      if (newMessagesCount !== prevCounts.Messages) {
        console.log(
          "Messages count changed from",
          prevCounts.Messages,
          "to",
          newMessagesCount
        );
        if (newMessagesCount > prevCounts.Messages) {
          setTimeout(() => {
            toast("You have new messages!", { icon: "📬" });
          }, 2000);
        }
        return { Messages: newMessagesCount };
      }
      return prevCounts;
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessagesCount();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div
      className={`h-full z-[150] bg-[#1e1e1e] text-white flex flex-col py-3 justify-between transition-all duration-200 ease-in-out z-auto ${
        collapsed ? "w-20" : "w-64"
      }`}
      onMouseEnter={() => {
        setCollapsed(false);
        setSidebarExpanded(true);
      }}
      onMouseLeave={() => {
        setCollapsed(true);
        setSidebarExpanded(false);
      }}
    >
      <Toaster />
      <div className="w-full p-5 ml-0.5 flex flex-row items-center">
        <img className="w-10 h-10" src="/icon-128.png" alt="SkillSync. Logo" />
        <div className={`flex items-center fade-in ${collapsed && "hidden"}`}>
          <img
            className={`h-10 ml-4`}
            src={LogoDarkText}
            alt="SkillSync. Logo"
          />
          <div className="text-[10px] ml-2 mt-1 h-6 border-green-500 p-1 text-green-500 border border-1px rounded-lg">
            BETA
          </div>
        </div>
      </div>
      <div className="overflow-x-hidden">
        <ul className="text-left">
          {menuItems.map(
            (item) =>
              item.show && (
                <li
                  key={item.name}
                  className={`px-4 py-4 mx-3 my-1 rounded-lg cursor-pointer transition-bg duration-300 flex items-center ${
                    location.pathname.includes(item.name.toLowerCase().replace(" ", ""))
                      ? "bg-black"
                      : "hover:bg-[#2e2e2e]"
                  }`}
                  onClick={() => {
                    handleMenuItemClick(item.name);
                  }}
                >
                  {item.icon && (
                    <span className="text-2xl mr-6">{item.icon}</span>
                  )}
                  <div className={`fade-in w-64 ${collapsed && "hidden"}`}>
                    <span className="whitespace-nowrap">{item.name}</span>
                    {notificationCounts[item.name] > 0 && (
                      <span className="ml-auto  bg-gradient-to-r  from-[#03BD6C] to-[#36B7FE]  text-white text-sm font-semibold rounded-full px-2 py-0.5">
                        {notificationCounts[item.name]}
                      </span>
                    )}
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
      <div className="h-1/4 flex">
        <div
          className={`mt-auto transition-all duration-300 py-4 ${
            !collapsed && "px-4 "
          }`}
        >
          <ProfileCard
            name={profileInfo?.name}
            school={profileInfo?.school}
            handleEditProfile={() => handleMenuItemClick("Profile")}
            collapsed={collapsed}
          />
        </div>
      </div>
    </div>
  );
};

export { menuItems, MenuBar };
