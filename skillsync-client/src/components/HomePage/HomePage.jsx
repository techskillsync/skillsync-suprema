import React, { useState } from "react";
import { MenuBar, menuItems } from "./MenuBar";
import { GetProfileInfo } from "../../supabase/ProfileInfo";

const HomePage = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  React.useEffect(() => {
    async function fetchProfileInfo() {
      setProfileInfo(await GetProfileInfo("name, school"));
    }

    fetchProfileInfo();
  }, []);

  const renderComponent = () => {
    const selectedItem = menuItems.find((item) => item.name === selectedPage);
    return selectedItem ? (
      <selectedItem.component profileInfo={profileInfo} />
    ) : null;
  };

  return (
    <div className="h-full w-full">
      <div className="fixed left-0 top-0 h-screen w-1/5">
        <MenuBar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          profileInfo={profileInfo}
        />
      </div>
      <div className="flex">
        <div className="w-1/5"></div>
        <div className="w-4/5 h-full bg-white overflow-y-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
