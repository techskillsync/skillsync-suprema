import supabase from "./supabaseClient";
import { GetUserId } from "./GetUserId";

async function AddResume(resume_file, resume_label): Promise<Boolean> {
  if (!resume_file) {
    console.warn("Resume file missing");
    return false;
  }
  console.log("Adding reumse");

  const user_id = await GetUserId();
  const fileExtension = resume_file.name.split(".").pop();
  const fileName = `${Math.random()
    .toString()
    .replace(".", "")}.${fileExtension}`;

  console.log(
    `Uploading resume for user ${user_id} with label ${resume_label} and file name ${fileName}`
  );

  try {
    const updates = {
      user_id: user_id,
      resume_url: fileName,
      resume_label: resume_label,
    };

    console.log(updates);

    // First upload the avatar to supabase storage
    const { error: upload_error } = await supabase.storage
      .from(`resumes/${user_id}`)
      .upload(fileName, resume_file, { cacheControl: "max-age=31536000" });
    if (upload_error) {
      throw new Error(upload_error.message);
    }

    // Then update the user profile to link to the image
    const { error } = await supabase.from("user_resumes").insert(updates);
    if (error) {
      throw error.message;
    }

    console.log("Done");

    return true;
  } catch (error) {
    console.warn(error);
    console.log(error);
    return false;
  }
}

async function GetResumes(): Promise<any> {
  const user_id = await GetUserId();
  const { data, error } = await supabase
    .from("user_resumes")
    .select("resume_id, resume_label, resume_url")
    .eq("user_id", user_id);
  if (error) {
    console.warn(error);
  }
  return data;
}

// Rturn the resume id, label, and file url
async function GetResume(resume_id): Promise<any> {
  const user_id = await GetUserId();
  const { data, error } = await supabase
    .from("user_resumes")
    .select("resume_id, resume_label, resume_url")
    .eq("user_id", user_id)
    .eq("resume_id", resume_id)
    .single();
  if (error) {
    console.warn(error);
  }
  console.log("Trying to get resume: ", `${user_id}/${data?.resume_url}`);
  const { data: resume_file, error: downloadError } = await supabase.storage
    .from("resumes")
    .download(`${user_id}/${data?.resume_url}`);

  if (downloadError) {
    console.warn(downloadError);
    return null;
  }
  console.log(resume_file);

  if (!resume_file) {
    console.warn("Resume file not found");
    return null;
  }

  return {
    id: data?.resume_id,
    resume_label: data?.resume_label,
    resume_url: URL.createObjectURL(resume_file!),
  };
}


async function DeleteResume(resume_id): Promise<Boolean> {
  const user_id = await GetUserId();

  const storage_path = await supabase
    .from("user_resumes")
    .select()
    .eq("id", user_id)
    .eq("resume_id", resume_id)
    .single()
    .then((res) => {
      return res.data.resume_url;
    });

  const { error } = await supabase
    .from("user_resumes")
    .delete()
    .eq("user_id", user_id)
    .eq("resume_id", resume_id);

  const { error: deleteError } = await supabase.storage
    .from(`resumes/${user_id}`)
    .remove([storage_path]);

  if (error) {
    console.warn(error);
    return false;
  }
  return true;
}

async function GetResumeCount(): Promise<Number | null> {
  console.log("Getting resume count");
  const user_id = await GetUserId();
  const { data, error, count } = await supabase
    .from("user_resumes")
    .select("*", { count: "exact" })
    .eq("user_id", user_id);
  if (error) {
    console.warn(error);
    return null;
  }
  console.log("Resume count: ", count);
  return count;
}

export { GetResumeCount, GetResumes, GetResume, AddResume, DeleteResume };
