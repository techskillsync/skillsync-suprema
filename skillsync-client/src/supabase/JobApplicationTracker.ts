import supabase from "./supabaseClient";
import { GetUserId } from "./GetUserId";
import { JobListing, UserProfile } from "../types/types";

// Returns: true/false whether successful
// Saves Jobs using the user_job_listing_tracker table
async function SaveJob(jobId: string): Promise<boolean> {
  console.log("Saving Job", jobId);
  try {
    const userID = await GetUserId();
    if (!userID) {
      throw new Error("Not signed in");
    }
    await supabase.from("user_job_listing_tracker").insert([
      {
        user_id: userID,
        job_listing_id: jobId,
        status: "saved",
      },
    ]);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function UpdateJob(jobId: string, status: string): Promise<boolean> {
  console.log("Updating Job", jobId, status);
  try {
    const userID = await GetUserId();
    if (!userID) {
      throw new Error("Not signed in");
    }
    await supabase
      .from("user_job_listing_tracker")
      .update({ status: status })
      .eq("user_id", userID)
      .eq("job_listing_id", jobId);
    console.log("Updated");
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function RemoveJob(jobId: string): Promise<boolean> {
  try {
    const userID = await GetUserId();
    if (!userID) {
      throw new Error("Not signed in");
    }
    await supabase
      .from("user_job_listing_tracker")
      .delete()
      .eq("user_id", userID)
      .eq("job_listing_id", jobId);
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function CheckExists(jobId: string): Promise<boolean> {
  console.log("Checking if job exists", jobId);
  try {
    const userID = await GetUserId();
    if (!userID) {
      throw new Error("Not signed in");
    }

    const { count, error } = await supabase
      .from("user_job_listing_tracker")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userID)
      .eq("job_listing_id", jobId);

    if (error) {
      throw error;
    }
    const result = (count ?? 0) > 0;
    console.log("Job exists:", result);
    return result;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function GetSavedJobs(): Promise<JobListing[]> {
  console.log("Getting saved jobs");
  try {
    const userID = await GetUserId();
    if (!userID) {
      throw new Error("Not signed in");
    }

    const { data, error } = await supabase
      .from("user_job_listing_tracker")
      .select(
        `
            job_listings (
            *
            ),
            status
        `
      )
      .eq("user_id", userID);

    // const jobIds = data?.map((job) => job.job_id) ?? [];
    // console.log("Job IDs:", jobIds);

    // const { data: jobs, error: jobError } = await supabase
    //   .from("job_listing")
    //   .select("*")
    //   .in("id", jobIds);

    if (error) {
      throw error;
    }

    console.log(data);

    // @ts-ignore
    return data.map((job) => {
      return {
        ...job.job_listings,
        status: job.status,
      };
    });
  } catch (error) {
    console.warn(error);
    return [];
  }
}

export {
  SaveJob,
  RemoveJob,
  CheckExists,
  UpdateJob,
  GetSavedJobs,
  //   GetJobsCount,
};
