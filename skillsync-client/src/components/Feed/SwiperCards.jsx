import React, { useState, useRef } from "react";
import {
  FaHeart,
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaChartLine,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import { LinearProgress } from "@mui/material";

// Sound files
import likeSound from "/like.mp3";
import dislikeSound from "/dislike.mp3";
import { BackpackIcon, Linkedin, LinkedinIcon, Mail, Search, Wrench } from "lucide-react";

const SwiperCard = ({ job, onSwipeLeft, onSwipeRight }) => {
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // Track swipe direction (left or right)
  const startPos = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);

  const likeAudio = useRef(new Audio(likeSound)); // Like sound effect
  const dislikeAudio = useRef(new Audio(dislikeSound)); // Dislike sound effect

  const handleMouseDown = (event) => {
    if (!expanded) {
      setIsDragging(true);
      startPos.current = { x: event.clientX, y: event.clientY };
      dragDistance.current = 0;
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - startPos.current.x;
      const deltaY = event.clientY - startPos.current.y;
      dragDistance.current = Math.abs(deltaX);

      const rotate = deltaX * 0.1;
      setPosition({ x: deltaX, y: deltaY });
      setRotation(rotate);
      setSwipeDirection(deltaX > 0 ? "right" : "left"); // Determine swipe direction
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 150;
    if (position.x > threshold) {
      likeAudio.current.play();
      onSwipeRight(job);
      resetPosition();
    } else if (position.x < -threshold) {
      dislikeAudio.current.play();
      onSwipeLeft(job);
      resetPosition();
    } else {
      resetPosition();
    }
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setSwipeDirection(null); // Reset swipe direction
  };

  const handleCardClick = (e) => {
    if (dragDistance.current < 10) {
      setExpanded(!expanded);
    } else {
      e.preventDefault();
    }
  };

  const fadeEffect = 1 - Math.min(Math.abs(position.x) / 300, 1);

  return (
    <div
      className="swiper relative w-full h-full flex flex-col justify-start items-center min-h-[70vh] "
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* LIKE and DISLIKE Indicators */}
      {swipeDirection === "right" && (
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500 to-transparent flex items-center justify-center text-white text-6xl font-bold opacity-80">
          LIKE
        </div>
      )}
      {swipeDirection === "left" && (
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-500 to-transparent flex items-center justify-center text-white text-6xl font-bold opacity-80">
          DISLIKE
        </div>
      )}

      {/*SWIPER CARD */}
      <div
        className="swiper--card select-none cursor-grab active:cursor-grabbing bg-[#032233] text-white rounded-lg shadow-lg p-6 md:w-8/12 sm:w-80 h-auto  flex flex-col justify-start items-center text-center transition-transform duration-300"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          opacity: fadeEffect,
          transition: isDragging
            ? "none"
            : "transform 0.3s ease-out, opacity 0.3s ease-out",
          boxShadow: `0px ${Math.abs(position.x) / 10}px ${
            Math.abs(position.x) / 5
          }px rgba(0, 0, 0, 0.2)`,
        }}
        onClick={handleCardClick}
      >
        <div className="flex flex-col gap-2 w-full text-left">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-4">
            {/*TOP ROW WITH IMG */}
            <article className="flex w-full justify-between">
              <div className="flex flex-col justify-between">
                <h4 className="text-lg mt-2 text-white flex items-center">
                  {job?.company || "Company Name"}
                </h4>
                <h3 className="text-lg mt-2 flex text-white flex-col items-start font-bold ">
                  <span className="text-sm text-gray-500 flex gap-1 font-regular items-center justify-center ">
                    <Search width={"16px"} />
                    Looking For
                  </span>
                  {job?.title || "Job Title"}
                </h3>
              </div>
              {job?.logo_url ? (
                <img
                  src={job?.logo_url}
                  alt={job?.company}
                  className="min-h-24 min-w-24 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="min-h-24 min-w-24 h-24 w-24 rounded-md bg-gray-300 flex items-center justify-center">
                  no img
                </div>
              )}
            </article>
          </div>

          {/* Main Details */}
          <article className="flex gap-2 items-center  justify-between mt-4">
            <div className="flex flex-wrap gap-6 text-white justify-start items-start w-10/12">
              <p className="text-sm  flex items-center">
                <FaMapMarkerAlt className="mr-2" />{" "}
                {job?.location || "Location"}
              </p>
              {job?.salary ? (
                <div className="text-sm  flex items-center">
                  <FaDollarSign className="mr-2 text-yellow-500" />
                  <strong className="mr-1">Salary:</strong>{" "}
                  {job?.salary || "Not Provided"}
                </div>
              ) : (
                <div className="text-sm  flex items-center">
                  <FaDollarSign className="mr-2 text-yellow-500" />
                  <strong className="mr-1">Salary:</strong> Not Provided
                </div>
              )}
              {/*  */}

              {job?.rank ? (
                <div className="text-sm flex items-center  ">
                  <FaChartLine className="mr-2 text-green-500" />
                  <strong className="mr-1">Rank:</strong> {job?.rank.toFixed(2)}
                </div>
              ) : (
                <div className="text-sm  flex items-center">
                  <FaChartLine className="mr-2 text-green-500" />
                  <strong className="mr-1">Rank:</strong> Not Provided
                </div>
              )}

              {job?.due_date ? (
                <div className="text-sm  flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <strong className="mr-1">Due Date:</strong>{" "}
                  {new Date(job?.due_date).toLocaleDateString()}
                </div>
              ) : (
                <div className="text-sm flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <strong className="mr-1">Due Date:</strong>
                  Expired
                </div>
              )}
            </div>
          </article>

          <div className="w-full py-2 flex flex-col items-start  mt-6">
            <h1 className="flex gap-2 items-center justify-center text-sm text-gray-500 font-bold">
              <Wrench /> Required Skills
            </h1>
            <div className="w-full py-2 flex flex-wrap gap-2 ">
              <span className="bg-[#175e83] px-2 py-1 text-white rounded-full">
                {" "}
                Node Js
              </span>
              <span className="bg-[#175e83] px-2 py-1 text-white rounded-full">
                {" "}
                Python
              </span>
              <span className="bg-[#175e83] px-2 py-1 text-white rounded-full">
                {" "}
                Kafka
              </span>
              <span className="bg-[#175e83] px-2 py-1 text-white rounded-full">
                {" "}
                Postgre SQL
              </span>
              <span className="bg-[#175e83] px-2 py-1 text-white rounded-full">
                {" "}
                Microservices
              </span>
            </div>
          </div>

          {/* rate competency bar*/}
          <div className="py-2 relative mt-10 min-w-max ">
  {job?.rank ? (
    <div className="text-sm text-gray-600 flex-col justify-center items-center hidden md:flex w-full">
      <div className="relative w-full h-2 bg-gray-300 rounded-full">
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${job.rank * 100}%`,
            background: "linear-gradient(to right, #00c853, #1de9b6, #00e5ff)",
          }}
        />
        {/* Text overlay centered within the progress */}
        <div
          className="absolute top-[-25px] text-xs font-semibold text-white"
          style={{
            left: `${job.rank * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          Your Competency: {Math.round(job.rank * 100)}%
        </div>
      </div>
    </div>
  ) : (
    <div className="text-sm text-gray-600 flex-col justify-center items-center hidden md:flex w-full">
      <div className="relative w-full h-2 bg-gray-300 rounded-full">
        {/* Empty Progress Bar */}
        <div className="absolute top-0 left-0 h-full rounded-full bg-gray-400" style={{ width: "0%" }} />
        {/* Default text when no rank is available */}
        <div className="absolute top-[-25px] text-xs font-semibold text-white left-0">
          Your Competency: none
        </div>
      </div>
    </div>
  )}
</div>


          {!expanded && (
            <span className="text-center text-[12px] w-full text-[grey]">
              {" "}
              click to view more
            </span>
          )}

          {/* Expandable Content */}
          {expanded && (
            <>
              {/*Job Desc */}
              <div className="mt-4 text-sm text-gray-400">
                <h4 className="font-bold mb-2 flex gap-2 text-white items-center justify-start"> <BackpackIcon/> Job Description</h4>
                <p>{job?.description || "No description provided"}</p>
              </div>



              {/* APPLICATION */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500 border rounded-lg p-4">
                <p className="font-bold text-white">Apply to this job</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (job?.apply_url) {
                      window.open(job?.apply_url, "_blank");
                    }
                  }}
                  className={`text-white text-sm px-6 py-2 rounded-full flex items-center justify-center transition-colors ${
                    job?.apply_url
                      ? "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!job?.apply_url}
                >
                  {job?.apply_url ? "Apply" : "Application Expired"}
                </button>
              </div>

              {/*HR DETAILS */}
              <div className="flex flex-col mt-4 text-sm text-gray-600 border rounded-md p-4">
                <h4 className="font-bold mb-2 text-white">Hiring Manager Details</h4>
                <div className="w-full flex p-1">
                  {/*HR PFP */}
                  <div className="mr-4 ">
                    <img
                      src="https://cdn.britannica.com/68/216668-050-DD3A9D0A/United-States-President-Donald-Trump-2017.jpg?w=400&h=300&c=crop"
                      alt="HR Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/*HR details */}
                  <div className="flex  w-full  flex-wrap justify-between items-center gap-2">
                    {/* Name and Short Description */}
                    <div className="flex flex-col justify-center items-start">
                      <h5 className="text-lg font-semibold text-white">
                        John Doe
                      </h5>
                      <p className="text-sm text-gray-300">
                        Senior HR Manager at XYZ Corp. Specialized in IT hiring.
                      </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex space-x-2  justify-start min-w-max">
                      {/* Email Resume */}
                      <button
                        className="bg-transparent text-white text-sm px-4 py-2 rounded-full border-2 flex gap-2 items-center justify-start border-blue-600 hover:border-green-600 transition-colors"
                        onClick={() =>
                          (window.location.href =
                            "mailto:hr@company.com?subject=Job Application&body=Please find my resume attached.")
                        }
                      >
                        <Mail /> Email Resume
                      </button>

                      {/* Follow on LinkedIn */}
                      <button
                        className="bg-white text-blue-600 text-sm p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                        onClick={() =>
                          window.open(
                            "https://www.linkedin.com/in/hrprofile",
                            "_blank"
                          )
                        }
                      >
                       <LinkedinIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {expanded && (
            <span className="text-center text-[12px] w-full text-[grey]">
              {" "}
              close to swipe
            </span>
          )}
        </div>
      </div>

      {/* Swiping Buttons */}
<div className="swiper--buttons flex space-x-4 mt-4 z-10">
  {/* Dislike Button */}
  <button
    onClick={() => {
      onSwipeLeft(job);
      dislikeAudio.current.play();
    }}
    className="p-4 bg-white text-red-500 rounded-full shadow-md text-2xl hover:bg-red-500 hover:text-white transition"
  >
    <FaTimes />
  </button>

  {/* Like Button */}
  <button
    onClick={() => {
      onSwipeRight(job);
      likeAudio.current.play();
    }}
    className="p-4 bg-white rounded-full shadow-md text-2xl text-green-400 hover:bg-green-400 hover:text-white  transition"
  >

    <FaHeart />
  </button>
</div>

    </div>
  );
};

export default SwiperCard;
