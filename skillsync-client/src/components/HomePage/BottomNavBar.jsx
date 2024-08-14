import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdSpaceDashboard, MdNewspaper, MdInbox } from "react-icons/md";
import { BiSpreadsheet } from "react-icons/bi";
import { IoChatbox, IoDocument } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import ProfileCard from "./ProfileCard";
import { GetUnreadMessagesCount } from "../../supabase/Messages.ts";

const bottomMenuItems = [
  {
    name: "Dashboard",
    icon: <MdSpaceDashboard />,
    show: true,
  },
  { name: "Jobs", icon: <MdNewspaper />, show: true },
  {
    name: "Resume Builder",
    icon: <IoDocument />,
    show: true,
  },
  {
    name: "Tracker",
    icon: <BiSpreadsheet />,
    show: true,
  },
  { name: "Messages", icon: <MdInbox />, show: true },
  {
    name: "Feedback",
    icon: <IoChatbox />,
    show: false,
  },
];

const BottomNavBar = ({
  selectedPage,
  handleMenuItemClick,
  profileInfo,
  setSidebarExpanded,
}) => {
  const [notificationCounts, setNotificationCounts] = useState({});
  const location = useLocation();

  const fetchMessagesCount = async () => {
    const newMessagesCount = await GetUnreadMessagesCount(); 
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

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] text-white flex justify-around py-2 z-[150]">
      <Toaster />
      {bottomMenuItems.map(
        (item) =>
          item.show && (
            <div
              key={item.name}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                location.pathname.includes(item.name.toLowerCase().replace(" ", ""))
                  ? "text-[#36B7FE]"
                  : "text-white"
              }`}
              onClick={() => handleMenuItemClick(item.name)}
            >
              {item.icon && <span className="text-2xl">{item.icon}</span>}
              <span className="text-sm">{item.name}</span>
              {notificationCounts[item.name] > 0 && (
                <span className="bg-gradient-to-r from-[#03BD6C] to-[#36B7FE] text-white text-xs font-semibold rounded-full px-2 py-0.5 mt-1">
                  {notificationCounts[item.name]}
                </span>
              )}
            </div>
          )
      )}
    </div>
  );
};

export { bottomMenuItems, BottomNavBar };
