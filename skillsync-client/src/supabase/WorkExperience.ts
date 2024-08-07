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

  // if (typeof workExperience.startDate === "string") {
  //   // Parse date by regex if in MM/YY format
  //   if ((workExperience.startDate as string).match(/^\d{2}\/\d{2}$/)) {
  //     const [month, year] = (workExperience.startDate as string).split("/");
  //     workExperience.startDate = new Date(+year, +month - 1);
  //   } else {
  //     workExperience.startDate = new Date(workExperience.startDate);
  //   }
  // }

  // if (typeof workExperience.endDate === "string") {
  //   if (workExperience.endDate === "" || workExperience.endDate === "Present") {
  //     workExperience.endDate = null;
  //   } else {
  //     if ((workExperience.endDate as string).match(/^\d{2}\/\d{2}$/)) {
  //       const [month, year] = (workExperience.endDate as string).split("/");
  //       workExperience.endDate = new Date(+year, +month - 1);
  //     } else {
  //       workExperience.endDate = new Date(workExperience.endDate);
  //     }
  //   }
  // }

  const updates = {
    user_id: user_id,
    work_experience_id: workExperience.id,
    job_title: workExperience.title,
    company_name: workExperience.company,
    job_description: workExperience.description,
    start_date: parseDateString(workExperience.startDate?.toString() || "") ?? new Date().toISOString().split('T')[0],
    end_date: parseDateString(workExperience.endDate?.toString() || ""),
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
  console.log("Saving NEW work experience");
  console.log("Start Date:", workExperience.startDate);
  console.log("End Date:", workExperience.endDate);
  const workExperienceData = {
    user_id: await GetUserId(),
    job_title: workExperience.title,
    company_name: workExperience.company,
    job_description: workExperience.description,
    start_date: parseDateString(workExperience.startDate?.toString() || "") ?? new Date().toISOString().split('T')[0],
    end_date: parseDateString(workExperience.endDate?.toString() || ""),
    location: workExperience.location,
  };

  console.log(workExperienceData);

  try {
    const { data, error } = await supabase
      .from("work_experiences")
      .insert(workExperienceData);

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

const parseDateString = (dateString: string): string | null => {
  try {
    if (dateString.match(/^\d{2}\/\d{2}$/)) {
      const [month, year] = dateString.split("/");
      const parsedDate = new Date(`20${year}-${month}-01`);
      return parsedDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
    } else if (dateString === "" || dateString.toLowerCase() === "present" || dateString.toLowerCase() === "current") {
      return null;
    }
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid Date");
    }
    return parsedDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
  } catch (error) {
    console.warn(error);
    return null;
  }
};

export {
  GetWorkExperiences,
  UpdateWorkExperience,
  SaveNewWorkExperience,
  DeleteWorkExperience,
};
