import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import ResumeBuilder from "./ResumeBuilder";
import supabase from "../../supabase/supabaseClient";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import { GetWorkExperiences } from "../../supabase/WorkExperience";
import { GetUserId } from "../../supabase/GetUserId";
import {
  Resume,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
} from "../../types/types";

/*
 * Returns a list of the users saved resumes.
 */
async function getSavedResumes(): Promise<Resume[] | null> {
  try {
    const { data, error } = await supabase
      .from("resume_builder")
      .select("*")
      .eq("id", await GetUserId());

    if (error) {
      throw Error(error.message);
    }

    return data as Resume[];
  } catch (error) {
    console.warn("Could not get saved resumes - " + error);
    return null;
  }
}

/*
 * Sends a delete request to supabase based on resume_id
 */
async function deleteResume(resume_id: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("resume_builder")
      .delete()
      .eq("resume_id", resume_id)
      .select("resume_id");

    if (error) {
      throw Error(error.message);
    }

    return true;
  } catch (error) {
    console.warn("Could not delete resume - " + error);
    return false;
  }
}

/*
 * Fetches user data and formats it into a Resume object.
 */
async function assembleNewResume(): Promise<Resume> {
  const resume_id = uuidv4();

  // Returns the month abbr and year like: "Jun 2024"
  function DateToMonthYear(date_str: string): string {
    try {
      const date = new Date(date_str);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months[date.getMonth()] + " " + date.getFullYear();
    } catch {
      return "--- -";
    }
  }

  try {
    const profile_data = await GetProfileInfo(
      "name, last_name, phone_number, email, personal_website, linkedin, github, school, grad_year, program, specialization, location"
    );
    if (profile_data === null) {
      throw Error("Could not fetch profile");
    }
    const work_data = await GetWorkExperiences();
    if (work_data === null) {
      throw Error("Could not get work_data");
    }

    const saved_resumes = await getSavedResumes();
    if (saved_resumes === null) {
      throw Error("Could not get saved resumes");
    }
    let resume_label = profile_data.name + "'s resume " + saved_resumes.length;

    let educations: EducationSection[] = [];
    let education: EducationSection = {
      institution: profile_data.school,
      location: profile_data.location,
      end_date: profile_data.grad_year,
      degree: profile_data.program + " in " + profile_data.specialization,
      highlights: [],
    };
    educations.push(education);

    let experiences: ExperienceSection[] = [];
    for (let e of work_data) {
      const experience: ExperienceSection = {
        job_title: e.title,
        company: e.company,
        start_day: e.startDate ? DateToMonthYear(e.startDate) : "",
        end_day: e.endDate ? DateToMonthYear(e.endDate) : "",
        location: e.location ?? "",
        highlights: e.description ? e.description.split("\n") : [],
      };
      experiences.push(experience);
    }

    return {
      resume_id: resume_id,
      label: resume_label,
      full_name: profile_data.name + " " + profile_data.last_name,
      phone_number: profile_data.phone_number,
      email: profile_data.email,
      personal_website: profile_data.personal_website,
      linkedin: profile_data.linkedin,
      github: profile_data.github,
      education: educations,
      experience: experiences,
      projects: [],
      technical_skills: [],
    };
  } catch (error) {
    console.warn("Error arranging resume info - " + error);
    return {
      resume_id: resume_id,
      label: "My Resume",
      full_name: "John Doe",
      phone_number: "+1 234 567 8900",
      email: "example@gmail.com",
      personal_website: "example.github.io",
      linkedin: "https://linkedin.com/example",
      github: "https://github.com/example",
      education: [],
      experience: [],
      projects: [],
      technical_skills: [],
    };
  }
}

function ResumeManager() {
  const [savedResumes, setSavedResumes] = useState<Resume[] | null>([]);

  const [openedResume, setOpenedResume] = useState<Resume | null>(null);

  useEffect(() => {
    async function doAsync() {
      setSavedResumes(await getSavedResumes());
    }

    doAsync();
  });

  return (
    <>
      {openedResume ? (
        <ResumeBuilder
          resume={openedResume}
          closeResume={() => setOpenedResume(null)}
        />
      ) : (
        <main className="flex flex-col h-screen mt-5 md:px-10 w-full">
          <section className="flex flex-col gap-2  justify-center items-start">
            <h1 className="font-bold mt-5">Select a resume:</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
              {savedResumes ? (
                savedResumes.map((resume, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {resume.label}
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => {
                          setOpenedResume(resume);
                        }}
                      >
                        Open
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        onClick={() => {
                          deleteResume(resume.resume_id);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-lg font-semibold col-span-full text-center">
                  Could not load resumes 😟
                </p>
              )}
            </div>

            <div className="flex justify-center items-center my-8">
              <div
                className="flex flex-col justify-center items-center w-48 h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-300"
                onClick={async () => {
                  setOpenedResume(await assembleNewResume());
                }}
              >
                <div className="text-4xl font-bold text-gray-500 mb-2">+</div>
                <p className="text-sm text-gray-500">Create New Resume</p>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}

export default ResumeManager;
