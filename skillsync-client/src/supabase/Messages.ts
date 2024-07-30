import { Message } from "../types/types";
import { GetUserId } from "./GetUserId";
import supabase from "./supabaseClient";

// Fetches messages from Supabase.
// Returns false on error and the messages on success
async function GetMessages(): Promise<Message[] | false> {
  const { data, error } = await supabase.from("messages").select();

  if (data) {
    const messages: Message[] = data.map((message: any) => {
      return {
        id: message.id,
        sender: message.sender_id,
        receiver: message.receiver_id,
        content: message.content,
        timestamp: message.time as Date,
        is_read: message.is_read as boolean;
      };
    });
    return messages;
  }
  if (error) {
    return false;
  }

  return false;
}

async function GetUnreadMessagesCount(): Promise<number | false> {
  const { data, error, count } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .eq("receiver_id", await GetUserId())
    .eq("is_read", false);

  if (count) {
    return count;
  }
  if (error) {
    return false;
  }

  return false;
}

// Sends a message to the receiver
// Returns false on error and true on success
async function SendMessage(message: Message): Promise<boolean> {
  const user_id = await GetUserId();
  const { error } = await supabase.from("messages").insert([
    {
      sender_id: user_id,
      receiver_id: message.receiver,
      content: message.content,
    },
  ]);

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  return true;
}

async function SetMessageRead(message_id: string): Promise<boolean> {
  console.log("Setting message as read:", message_id);
  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", message_id);

  if (error) {
    console.error("Error setting message as read:", error);
    throw error;
  }

  return true;
}

export { GetMessages, SendMessage, GetUnreadMessagesCount, SetMessageRead };
