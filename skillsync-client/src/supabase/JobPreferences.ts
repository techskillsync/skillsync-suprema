import { GetUserId } from "./GetUserId";
import supabase from "./supabaseClient";


async function GetJobPreferences(): Promise<any> {
  const { data, error } = await supabase.from("user_job_preferences").select();
  if (error) {
    console.error("Error fetching job preferences:", error);
    return false;
  }
  return data;
}

async function UpdateJobPreferences(preferences: any): Promise<any> {
  const user_id = await GetUserId();
  if (!user_id) {
    console.error("User not logged in");
    return false;
  }

  const { error } = await supabase
    .from("user_job_preferences")
    .upsert([
      {
        id: user_id,
        ...preferences,
      },
    ]);
  if (error) {
    console.error("Error updating job preferences:", error);
    return false;
  }
  return true;
}



export { GetJobPreferences, UpdateJobPreferences }