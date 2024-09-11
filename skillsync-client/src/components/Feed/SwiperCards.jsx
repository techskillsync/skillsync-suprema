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
      className="swiper relative w-full h-full flex flex-col justify-start items-center min-h-[70vh]"
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
        className="swiper--card select-none cursor-grab active:cursor-grabbing bg-white rounded-lg shadow-lg p-6 md:w-8/12 sm:w-80 h-auto  flex flex-col justify-start items-center text-center transition-transform duration-300"
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
                <h3 className="text-xl font-bold text-gray-900">
                  {job?.title || "Job Title"}
                </h3>
                <h4 className="text-lg mt-2 text-gray-600 flex items-center">
                  <FaBuilding className="mr-2" />{" "}
                  {job?.company || "Company Name"}
                </h4>
                <p className="text-sm text-gray-500 flex items-center mt-2">
                  <FaMapMarkerAlt className="mr-2" />{" "}
                  {job?.location || "Location"}
                </p>
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
          <article className="flex gap-2 items-center  justify-between">
            <div className="flex flex-col gap-2 justify-start">
              {job?.salary ? (
                <div className="text-sm text-gray-600 flex items-center">
                  <FaDollarSign className="mr-2 text-yellow-500" />
                  <strong className="mr-1">Salary:</strong>{" "}
                  {job?.salary || "Not Provided"}
                </div>
              ) : (
                <div className="text-sm text-gray-600 flex items-center">
                  <FaDollarSign className="mr-2 text-yellow-500" />
                  <strong className="mr-1">Salary:</strong> Not Provided
                </div>
              )}
              {/*  */}

              {job?.rank ? (
                <div className="text-sm text-gray-600 flex items-center  ">
                  <FaChartLine className="mr-2 text-green-500" />
                  <strong className="mr-1">Rank:</strong> {job?.rank.toFixed(2)}
                </div>
              ) : (
                <div className="text-sm text-gray-600 flex items-center">
                  <FaChartLine className="mr-2 text-green-500" />
                  <strong className="mr-1">Rank:</strong> Not Provided
                </div>
              )}

              {job?.due_date ? (
                <div className="text-sm text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <strong className="mr-1">Due Date:</strong>{" "}
                  {new Date(job?.due_date).toLocaleDateString()}
                </div>
              ) : (
                <div className="text-sm text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <strong className="mr-1">Due Date:</strong>
                  Expired
                </div>
              )}
            </div>
          </article>

          <div className="w-full py-2 flex flex-wrap gap-2">
          <span className="bg-[#c8c8c8] px-2 py-1 text-black rounded-md">
          {" "}
              Node Js
            </span>
            <span className="bg-[#c8c8c8] px-2 py-1 text-black rounded-md">
              {" "}
              Python
            </span>
            <span className="bg-[#c8c8c8] px-2 py-1 text-black rounded-md">
              {" "}
              Kafka
            </span>
            <span className="bg-[#c8c8c8] px-2 py-1 text-black rounded-md">
              {" "}
              Postgre SQL
            </span>
            <span className="bg-[#c8c8c8] px-2 py-1 text-black rounded-md">
              {" "}
              Microservices
            </span>
           
          </div>

          {/* rate competency bar*/}
          <div className="py-2 relative mt-10 min-w-max">
            {job?.rank ? (
              <div className="text-sm text-gray-600 flex-col justify-center items-center hidden md:flex w-full">
                <LinearProgress
                  variant="determinate"
                  value={job?.rank.toFixed(2) * 100}
                  sx={{
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "green",
                    },
                    backgroundColor: "lightgray",
                  }}
                  className="w-full h-2 rounded-lg"
                />
                {/* Text overlay positioned according to rank */}
                <h6
                  className="text-[12px] absolute top-[-35px] min-w-max text-gray-900 border-[green] rounded-md border-2 p-2 bg-white "
                  style={{
                    left: `${job?.rank.toFixed(2) * 100}%`,
                    transform: "translateX(-50%)",
                    transition: "left 0.5s ease",
                  }}
                >
                  Your chances: {job?.rank.toFixed(2) * 100}%
                </h6>
              </div>
            ) : (
              <div className="text-sm text-gray-600 flex-col justify-center items-center hidden md:flex w-full">
                <LinearProgress
                  variant="determinate"
                  value={0}
                  className="w-full h-2 rounded-lg"
                />
                <h6 className="text-[12px] absolute top-[-20px] left-0 text-gray-900">
                  Your chances: none
                </h6>
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
              <div className="mt-4 text-sm text-gray-600">
                <h4 className="font-bold mb-2">Job Description</h4>
                <p>{job?.description || "No description provided"}</p>
              </div>
              {/* APPLICATION */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-600 border rounded-md p-4">
                <p className="font-bold">Apply to this job</p>
                <button
                  onClick={(e) => {
                    e.preventDefault(); 
                    if (job?.apply_url) {
                      window.open(job?.apply_url, "_blank");
                    }
                  }}
                  className={`bg-blue-500 text-white text-sm px-4 py-2 rounded-md transition-colors ${
                    job?.apply_url
                      ? "hover:bg-blue-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!job?.apply_url}
                >
                  {job?.apply_url ? "Apply" : "Application Expired"}
                </button>
              </div>

              {/*HR DETAILS */}
              <div className="flex flex-col mt-4 text-sm text-gray-600 border rounded-md p-4">
                <h4 className="font-bold mb-2">Hiring Manager Details</h4>
                <div className="w-full flex p-1">
                  {/*HR PFP */}
                  <div className="mr-4">
                    <img
                      src="https://cdn.britannica.com/68/216668-050-DD3A9D0A/United-States-President-Donald-Trump-2017.jpg?w=400&h=300&c=crop"
                      alt="HR Profile"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  </div>

                  {/*HR details */}
                  <div className="flex flex-col justify-center">
                    {/* Name and Short Description */}
                    <div className="mb-2">
                      <h5 className="text-lg font-semibold text-gray-900">
                        John Doe
                      </h5>
                      <p className="text-sm text-gray-500">
                        Senior HR Manager at XYZ Corp. Specialized in IT hiring.
                      </p>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex space-x-2 mt-2">
                      {/* Email Resume */}
                      <button
                        className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        onClick={() =>
                          (window.location.href =
                            "mailto:hr@company.com?subject=Job Application&body=Please find my resume attached.")
                        }
                      >
                        Email Resume
                      </button>

                      {/* Follow on LinkedIn */}
                      <button
                        className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() =>
                          window.open(
                            "https://www.linkedin.com/in/hrprofile",
                            "_blank"
                          )
                        }
                      >
                        Follow on LinkedIn
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
        <button
          onClick={() => {
            onSwipeLeft(job);
            dislikeAudio.current.play();
          }}
          className="p-4 bg-red-500 text-white rounded-full shadow-md text-2xl hover:bg-red-600 transition"
        >
          <FaTimes />
        </button>
        <button
          onClick={() => {
            onSwipeRight(job);
            likeAudio.current.play();
          }}
          className="p-4 bg-green-500 text-white rounded-full shadow-md text-2xl hover:bg-green-600 transition"
        >
          <FaHeart />
        </button>
      </div>
    </div>
  );
};

export default SwiperCard;
