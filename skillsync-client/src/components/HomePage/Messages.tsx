import React from "react";
import { useEffect, useState } from "react";
import { GetMessages } from "../../supabase/Messages";
import { JobListing, Message } from "../../types/types";
import JobDescriptionCard from "../Feed/JobDescriptionCard";
import { GetJobListingById } from "../../supabase/GetJobListings";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    async function fetchMessages() {
      const messages = await GetMessages();
      if (typeof messages === "boolean" && !messages) {
        console.error("Failed to fetch messages");
        return;
      } else {
        setMessages(messages);
      }
    }
    fetchMessages();
  }, []);

  return (
    <div className="p-3 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-4">Messages</h1>
      <div className="p-3">
        {messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}
      </div>
    </div>
  );
};

const MessageCard = (props: { message: Message }) => {
  const [job, setJob] = useState<JobListing>();

  useEffect(() => {
    if (props.message.content.type === "job description") {
      async function fetchJob() {
        const job = await GetJobListingById(props.message.content.payload);
        if (typeof job === "boolean" && !job) {
          console.error("Failed to fetch job");
          return;
        } else {
          setJob(job);
        }
      }
      fetchJob();
    }
  }, [props.message.content.payload]);

  if (props.message.content.type === "text") {
    return (
      <div className="bg-white p-4 rounded-md mb-4">
        <p className="text-lg font-semibold">{props.message.sender}</p>
        <p className="text-sm">{props.message.content.payload}</p>
      </div>
    );
  } else if (props.message.content.type === "job description") {
    return <JobDescriptionCard jobDescription={job} />;
  }
};

export default Messages;
