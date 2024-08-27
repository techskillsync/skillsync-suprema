import React from "react";
import Construction from "../../assets/Construction.svg";

const ComingSoon = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col bg-black !text-white">
      
      <h1 className="text-5xl font-bold">Coming Soon</h1>
      <img
        className="w-1/2 mt-[2%] mt-12"
        src={Construction}
        alt="Under Construction"
      />
      <p className="text-white mt-12 text-xl font-medium ml-4">
        This feature is under construction, please check back later. Thanks for
        waiting!
      </p>
    </div>
  );
};

export default ComingSoon;
