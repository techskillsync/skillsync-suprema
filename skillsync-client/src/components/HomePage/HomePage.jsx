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
    return selectedItem ? <selectedItem.component profileInfo={profileInfo} /> : null;
  };

  return (
    <div className="flex h-screen">
      <MenuBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} profileInfo={profileInfo} />
      <div className="w-4/5 bg-white">{renderComponent()}</div>
    </div>
  );
};

export default HomePage;
