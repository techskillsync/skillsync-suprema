import React, { useEffect } from "react";
import { FaArrowRight, FaBookmark, FaEye, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";


const JobCard = ({ job }) => {
    return (
      <aside className="max-w-[600px]">
      <div className="bg-[#0d2c48] rounded-xl p-6 text-white flex gap-4 shadow-md ">
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center min-w-max" >
          <img src={job.logo} alt={`${job.company} logo`} className="object-contain w-full h-full" />
        </div>
        
        {/* Job Info */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-2xl font-bold">{job.title}</h3>
          <p className="text-lg text-gray-400">{job.company}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-gray-300">
              <FaMoneyBillWave className="mr-1" /> {job.salaryRange} | Annually
            </div>
            <div className="flex items-center text-gray-300 min-w-max">
              <FaMapMarkerAlt className="mr-1" /> {job.location}
            </div>
          </div>
        </div>
  
        {/* Job Type */}
        <div className="flex items-start">
          <span className="bg-gray-600 rounded-full px-4 py-2 text-sm min-w-max">{job.jobType}</span>
        </div>
  
        
      </div>
      {/* Bottom buttons */}
      <div className="flex justify-around mt-8">
      <button className="text-white border-2 border-white rounded-full px-4 py-2 flex items-center gap-2">
        <FaEye /> View Details
      </button>
      <button className="text-white border-2 border-white rounded-full px-4 py-2 flex items-center gap-2">
        <FaBookmark /> Save
      </button>
      <button className="text-white bg-gradient-to-r from-blue-500 to-green-500 rounded-full px-6 py-2 flex items-center gap-2">
        Apply <FaArrowRight />
      </button>
    </div>
    </aside>
  
    );
  };

  
  export default JobCard