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

  if (typeof workExperience.startDate === "string") {
    // Parse date by regex if in MM/YY format
    if ((workExperience.startDate as string).match(/^\d{2}\/\d{2}$/)) {
      const [month, year] = (workExperience.startDate as string).split("/");
      workExperience.startDate = new Date(+year, +month - 1);
    } else {
      workExperience.startDate = new Date(workExperience.startDate);
    }
  }

  if (typeof workExperience.endDate === "string") {
    if (workExperience.endDate === "" || workExperience.endDate === "Present") {
      workExperience.endDate = null;
    } else {
      if ((workExperience.endDate as string).match(/^\d{2}\/\d{2}$/)) {
        const [month, year] = (workExperience.endDate as string).split("/");
        workExperience.endDate = new Date(+year, +month - 1);
      } else {
        workExperience.endDate = new Date(workExperience.endDate);
      }
    }
  }

  const updates = {
    user_id: user_id,
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
  
  if (typeof workExperience.startDate === "string") {
    workExperience.startDate = new Date(workExperience.startDate);
  }
  
  if (typeof workExperience.endDate === "string") {
    if (workExperience.endDate === "") {
      workExperience.endDate = null;
    } else {
      workExperience.endDate = new Date(workExperience.endDate);
    }
  }
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
