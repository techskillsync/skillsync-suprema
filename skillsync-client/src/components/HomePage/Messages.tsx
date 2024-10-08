import React from "react";
import { useEffect, useState } from "react";
import { GetMessages, SetMessageRead } from "../../supabase/Messages";
import { JobListing, Message } from "../../types/types";
import JobDescriptionCard from "../Feed/JobDescriptionCard";
import { GetJobListingById } from "../../supabase/GetJobListings";
import { FindAvatar, FindUserById } from "../../supabase/OtherUsers";
import { FaEnvelope, FaMailBulk } from "react-icons/fa";

const Messages = ({ setSelectedJob }) => {
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
    <div className="px-10 py-8 min-h-screen">
      <h1 className="text-white pl-1 text-2xl font-bold mb-4">Messages</h1>
      {messages.length > 0 ? <div className="">
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            message={message}
            setSelectedJob={setSelectedJob}
          />
        ))}
      </div> 
      : <div className="h-full">
        <FaEnvelope className="mt-24 text-6xl text-white mx-auto" />
        <p className="text-center mt-3 text-lg">You have no messages</p>
      </div>  
    }
    </div>
  );
};

const MessageCard = (props: {
  message: Message;
  setSelectedJob: (job: JobListing) => void;
}) => {
  const [job, setJob] = useState<JobListing>();
  const [sender, setSender] = useState<{
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  }>();
  // console.log("Message:", props.message);

  useEffect(() => {
    if (!props!.message!.is_read) {
      console.log("Setting message", props!.message!.id , "as read");
      SetMessageRead(props!.message!.id!);
    }
  }, []);

  useEffect(() => {
    async function fetchSender() {
      console.log("Sender ID:", props.message.sender);
      const sender = await FindUserById(props.message.sender);
      if (typeof sender === "boolean" && !sender) {
        console.error("Failed to fetch sender");
        return;
      } else {
        const pfpUrl = await FindAvatar(sender!.avatar_url);

        setSender({
          id: sender!.id,
          name: sender!.name,
          email: sender!.email,
          avatar: pfpUrl,
        });
      }
    }
    fetchSender();
  }, []);

  useEffect(() => {
    if (props.message.content.type === "job description") {
      async function fetchJob() {
        console.log("Job ID:", props.message.content.payload);
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
      <div id={props!.message!.id!} className="bg-white p-4 rounded-md mb-4">
        <p className="text-lg font-semibold">{props.message.sender}</p>
        <p className="text-sm">{props.message.content.payload}</p>
      </div>
    );
  } else if (
    props.message.content.type === "job description" &&
    job?.id &&
    sender?.id
  ) {
    return (
      <div
        id={props!.message!.id!}
        className="fade-in p-5 bg-[#1e1e1e] rounded-lg mb-4"
      >
        <div>
          <div className="flex items-center">
            <img
              src={sender.avatar || "/default-pfp.svg"}
              alt="Profile Picture"
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-3 flex justify-between items-center w-full">
              <p className="">
                <span className="text-lg font-semibold">
                  {sender.name ?? sender.email}
                </span>
                {" sent you a job listing"}
              </p>
              <p id="timestamp" className="text-right ml-auto">
                <span className="text-sm">
                  {new Date(props.message.timestamp).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
        <JobDescriptionCard
          className="mt-3"
          mini={false}
          jobDescription={job}
          action={() => {
            console.log("Setting selected job via callback");
            props.setSelectedJob(job);
          }}
        />
      </div>
    );
  }
};

export default Messages;
