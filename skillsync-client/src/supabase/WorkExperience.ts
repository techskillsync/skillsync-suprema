import supabase from "./supabaseClient";
import { GetUserId } from "./GetUserId";
import { UserProfile, WorkExperience } from "../types/types";

// Returns: { data, error } pair
async function GetWorkExperiences(): Promise<WorkExperience[] | null> {
  try {
    const { data, error } = await supabase
      .from("work_experiences")
      .select("*")
      .eq("user_id", await GetUserId());

    if (data) {
      console.log(data);
      const workExperiences: WorkExperience[] = data.map((item: any) => {
        console.log(item);
        const workExperience: WorkExperience = {
          id: item.work_experience_id,
          company: item.company_name,
          title: item.job_title,
          description: item.job_description,
          startDate: item.start_date,
          endDate: item.end_date,
          location: item.location,
        };
        return workExperience;
      });
      return workExperiences;
    } else {
      return null;
    }
  } catch (error) {
    console.warn(error);
    return null;
  }
}

async function UpdateWorkExperience(
  workExperience: WorkExperience
): Promise<boolean> {
    const user_id = await GetUserId();
  const updates = {
    user_id:   user_id,
    work_experience_id: workExperience.id,
    job_title: workExperience.title,
    company_name: workExperience.company,
    job_description: workExperience.description,
    start_date: workExperience.startDate,
    end_date: workExperience.endDate,
    location: workExperience.location,
  };
  console.log("Updating existing work experience", updates);
  try {
    const { data, error } = await supabase
      .from("work_experiences")
      .upsert(updates);

      console.log(data);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function SaveNewWorkExperience(
  workExperience: WorkExperience
): Promise<boolean> {
  console.log("Saving NEW work experience", workExperience);
  try {
    const { data, error } = await supabase.from("work_experiences").insert({
      user_id: await GetUserId(),
      job_title: workExperience.title,
      company_name: workExperience.company,
      job_description: workExperience.description,
      start_date: workExperience.startDate,
      end_date: workExperience.endDate,
      location: workExperience.location,
    });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

async function DeleteWorkExperience(
  workExperience: WorkExperience
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("work_experiences")
      .delete()
      .eq("work_experience_id", workExperience.id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

export {
  GetWorkExperiences,
  UpdateWorkExperience,
  SaveNewWorkExperience,
  DeleteWorkExperience,
};
