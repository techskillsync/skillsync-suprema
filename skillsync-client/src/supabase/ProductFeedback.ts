import supabase from "./supabaseClient";
import { GetUserId } from "./GetUserId";

export async function addFeedback(type: string, feedback: string) {
  const user_id = await GetUserId();
  const { data, error } = await supabase
    .from("product_feedback")
    .insert([{ user_id, type, feedback }]);
  if (error) {
    console.error("error", error);
  }
  return data;
}
