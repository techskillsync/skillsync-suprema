import Dashboard from "./Dashboard/Dashboard";
import Feed from "../Feed/Feed";
import ResumeBuilder from "./ResumeBuilder";
import Messages from "./Messages";
import LogoDark from "../../assets/LogoDark.png";
import ProfileCard from "./ProfileCard";

import { MdSpaceDashboard, MdNewspaper, MdInbox } from "react-icons/md";
import { FaGear, FaSheetPlastic } from "react-icons/fa6";


const menuItems = [
  { name: "Dashboard", component: Dashboard , icon: <MdSpaceDashboard /> },
  { name: "Jobs", component: Feed , icon: <MdNewspaper /> },
  { name: "Resume Builder", component: ResumeBuilder , icon: <FaSheetPlastic /> },
  { name: "Messages", component: Messages , icon: <MdInbox /> },
  { name: "Settings", component: Messages , icon: <FaGear /> },
];

const MenuBar = ({ selectedPage, setSelectedPage, profileInfo }) => {
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
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`px-12 py-4 mx-3 my-1 rounded-lg cursor-pointer transition-bg duration-300 ${
                selectedPage === item.name ? "bg-black" : ""
              }`}
              onClick={() => setSelectedPage(item.name)}
            >
              <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <ProfileCard name={profileInfo?.name} school={profileInfo?.school} />
      </div>
    </div>
  );
};

export { menuItems, MenuBar };
