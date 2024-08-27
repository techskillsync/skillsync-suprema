import React, { useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { addFeedback } from "../../supabase/ProductFeedback";

const feedback_options = [
  { value: "general", label: "General Feedback" },
  { value: "bug", label: "Bug Report" },
  { value: "request", label: "Feature Request" },
  { value: "other", label: "Other" },
];

const FeedbackPage = () => {
  const [feedbackType, setFeedbackType] = useState(feedback_options[0]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback Type: ", feedbackType);
    console.log("Feedback: ", feedback);

    if (!feedbackType) {
      toast.error("Please select a feedback type");
      return;
    }
    if (feedback === "") {
      toast.error("Please enter your feedback");
      return;
    }

    if (feedback.length < 10) {
      toast.error("Please enter at least 10 characters");
      return;
    }

    addFeedback(feedbackType.value, feedback);

    setSubmitted(true);
  };

  return (
    <div className="w-1/2 mx-auto">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="feedback-form"
            initial={{ opacity: 0, y: 50 }} // Start below the screen
            animate={{ opacity: 1, y: 0 }} // Move to the center
            exit={{ opacity: 0, y: -50 }} // Move above the screen
            className="mt-4 w-full"
          >
            <form onSubmit={handleFeedbackSubmit}>
              {/* Feedback Type */}
              <label htmlFor="feedback-type" className="block mt-4">
                Feedback Type
              </label>
              <Select
                name="feedback-type"
                id="feedback-type"
                className="w-full mt-2 rounded-lg text-black"
                options={feedback_options}
                value={feedbackType}
                initialValue={feedback_options[0]}
                required={true}
                onChange={(selectedOption) => setFeedbackType(selectedOption)}
              ></Select>
              <p
                className={`transition-all text-sm duration-300 ${
                  feedbackType.value === "bug"
                    ? "h-6 mt-2 text-gray-400 "
                    : "h-0 text-transparent"
                }`}
              >
                Thank you for reporting a bug. We may reach out to you for more
                information regarding the bug.
              </p>
              {/* Feedback */}
              <label htmlFor="feedback" className="block mt-4">
                Feedback
              </label>
              <textarea
                className="w-full text-black h-40 mt-2 p-2 rounded-lg border border-gray-400"
                placeholder="Enter your feedback here..."
                value={feedback}
                required={true}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
              {/* Submit Button */}
              <div className="">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#03BD6C] to-[#36B7FE] text-white mt-6 py-2 px-6 rounded-lg mx-auto"
                  onClick={handleFeedbackSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="feedback-submitted"
            initial={{ opacity: 0, y: 50 }} // Start below the screen
            animate={{ opacity: 1, y: 0 }} // Move to the center
            exit={{ opacity: 0, y: -50 }} // Move above the screen
            className="mt-4 w-full flex-col"
          >
            <p className="fade-in text-xl mt-4 text-center">
              Thank you for your feedback!
            </p>
            <div className="my-8">
              <div className="fade-in h-24 w-24 bg-green-500 rounded-full mx-auto mt-4 flex items-center justify-center">
                <FaCheck className="fade-in-long text-white text-4xl mx-auto" />
              </div>
            </div>
            <div className="flex flex-col">
              <button
                className="fade-in text-white mt-0 py-2 px-6 rounded-lg mx-auto"
                onClick={() => {
                  setFeedbackType(feedback_options[0]);
                  setFeedback("");
                  setSubmitted(false);
                }}
              >
                Submit Another Feedback
              </button>
              <button
                className="fade-in-long text-white mt-2 py-2 px-6 rounded-lg mx-auto bg-transparent border-none text-gray-400"
                onClick={() => {
                  navigate("/home/dashboard");
                }}
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackPage;
