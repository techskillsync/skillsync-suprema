import supabase from "./supabaseClient";
import { GetUserId } from "./GetUserId";

async function ReportJobListing(
  job_listing_id: string,
  type: string,
  description: string
) {
  const user_id = await GetUserId();
  if (!user_id) {
    console.error("Could not get user id for reporting job listing");
    return;
  }

  console.log("Reporting job listing:", job_listing_id, type, description);

  const { data, error } = await supabase.from("job_listing_reports").insert([
    {
      job_listing_id,
      user_id,
      type,
      description,
    },
  ]);

  if (error) {
    console.error("Error reporting job listing:", error);
    return false;
  }

  console.log("Reported job listing:", data);
}

export { ReportJobListing };