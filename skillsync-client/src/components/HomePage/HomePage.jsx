import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Feed from "./Feed";
import ResumeBuilder from "./ResumeBuilder";
import Messages from "./Messages";
import LogoDark from "../../assets/LogoDark.png";


const menuItems = [
  { name: "Dashboard", component: <Dashboard /> },
  { name: "Feed", component: <Feed /> },
  { name: "Resume Builder", component: <ResumeBuilder /> },
  { name: "Messages", component: <Messages /> },
];

const HomePage = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  const renderComponent = () => {
    const selectedItem = menuItems.find((item) => item.name === selectedMenu);
    return selectedItem ? selectedItem.component : null;
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-[#1e1e1e] text-white">
        <div className="w-full p-8">
          <img
            className="mx-auto"
            width={150}
            src={LogoDark}
            alt="SkillSync. Logo"
          />
        </div>
        <ul className="mt-8">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`px-4 py-4 mx-3 my-1 rounded-lg cursor-pointer transition-bg duration-300 ${
                selectedMenu === item.name ? "bg-black" : ""
              }`}
              onClick={() => setSelectedMenu(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-white">{renderComponent()}</div>
    </div>
  );
};

export default HomePage;

