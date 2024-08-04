import supabase from "./supabaseClient";
import { GetUserId } from "./GetUserId";
import { UserProfile } from "../types/types";

const allowedKeys = `name, last_name, location, school, grad_year, program, specialization, industry, linkedin, github,
					date_of_birth, gender, race`;

// Param: columns - the columns you want from supabase, seperated with commas eg:
// `name, location, school, grad_year`
// Returns: { data, error } pair
async function GetProfileInfo(columns): Promise<UserProfile | null> {
  try {
    if (!columns) {
      throw new Error("need columns to fetch");
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select(columns)
      .eq("id", await GetUserId())
      .single();

    if (error) {
      throw new Error(error?.message);
    }

    return data as unknown as UserProfile;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

async function GetUserEmail(): Promise<string | null> {
  try {
    const session = await supabase.auth.getSession();
    const email = session?.data?.session?.user?.email || null;
    return email;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

// Param: updates - a dictionary where the keys are column names and the values are the new values, eg:
// { name: "Jeff", location: "NewYork" }
// Returns: { data, error } pair
async function SetProfileInfo(updates): Promise<true | false> {
  try {
    if (!updates) {
      throw new Error("no updates passed");
    }

    updates["id"] = await GetUserId();
    console.log("Updating profile info...");
    console.log(updates);

    // Filter updates to only include allowed keys
    const filteredUpdates: { [key: string]: any } = Object.keys(updates)
      .filter((key) => allowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (!filteredUpdates) {
      throw new Error("no valid updates passed");
    }

    if (typeof filteredUpdates.date_of_birth === "string") {
      if (filteredUpdates.date_of_birth === "") {
        delete filteredUpdates.date_of_birth;
      } else {
        filteredUpdates.date_of_birth = new Date(filteredUpdates.date_of_birth);
      }
    }

    const { error } = await supabase
      .from("user_profiles")
      .upsert(filteredUpdates);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

export { GetProfileInfo, GetUserEmail, SetProfileInfo };
