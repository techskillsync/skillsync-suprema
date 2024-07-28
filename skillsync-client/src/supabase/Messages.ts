import { Message } from "../types/types";
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
        timestamp: message.created_at,
      };
    });
    return messages;
  }
  if (error) {
    return false;
  }

  return false;
}

// Sends a message to the receiver
// Returns false on error and true on success
async function SendMessage(message: Message): Promise<boolean> {
  const { error } = await supabase.from("messages").insert([
    {
      sender_id: message.sender,
      receiver_id: message.receiver,
      content: message.content,
    },
  ]);

  if (error) {
    return false;
  }

  return true;
}

export { GetMessages };

