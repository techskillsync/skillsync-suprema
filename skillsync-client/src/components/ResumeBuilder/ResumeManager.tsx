import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import ResumeBuilder from "./ResumeBuilder";
import PreviewResume from "./PreviewResume";
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
import { Trash2Icon } from "lucide-react";

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

async function assembleNewResume(): Promise<Resume> {
  const resume_id = uuidv4();

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
      "name, last_name, phone_number, email, school, grad_year, program, specialization, location"
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

    let custom_resume:Resume = {
      resume_id: resume_id,
      label: resume_label,
      full_name: profile_data.name + " " + profile_data.last_name,
      phone_number: profile_data.phone_number,
      email: profile_data.email,
      custom_contact: [],
      education: educations,
      experience: experiences,
      projects: [],
      technical_skills: [],
    };

    if (typeof custom_resume.label !== "string")            { custom_resume.label = "My Resume"; }
    if (typeof custom_resume.full_name !== "string")        { custom_resume.full_name = "John Doe"; }
    if (typeof custom_resume.phone_number !== "string")     { custom_resume.phone_number = "+1 234 567 8900"; }
    if (typeof custom_resume.email !== "string")            { custom_resume.email = "example@gmail.com"; }
    if (!Array.isArray(custom_resume.education))            { custom_resume.education = []; }
    if (!Array.isArray(custom_resume.experience))           { custom_resume.experience = []; }

    return custom_resume;

  } catch (error) {
    console.warn("Error arranging resume info - " + error);
    const default_resume:Resume = {
      resume_id: resume_id,
      label: "My Resume",
      full_name: "John Doe",
      phone_number: "+1 234 567 8900",
      email: "example@gmail.com",
      custom_contact: [],
      education: [],
      experience: [],
      projects: [],
      technical_skills: [],
    }

    return default_resume;
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
  }, [openedResume]);

  return (
    <>
      {openedResume ? (
        <ResumeBuilder
          resume={openedResume}
          closeResume={() => setOpenedResume(null)}
        />
      ) : (
        <main className="flex flex-col min-h-screen mt-5 md:px-10 w-full">
          <section className="flex flex-col gap-2 justify-center items-start">
            <h1 className="font-bold mt-5 text-white">Select a resume:</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-6 py-4">
              {savedResumes && savedResumes.length > 0 ? (
                savedResumes.map((resume, index) => (
                  <div
                    key={index}
                    className="bg-white cursor-pointer max-h-[350px] shadow-md  rounded-lg p-4 flex flex-col justify-between items-center hover:shadow-lg transition-shadow duration-300"
                    onClick={() => {
                      setOpenedResume(resume);
                    }}
                  >
                    <div className="flex justify-between items-center w-full mb-2">
                      <h6 className="text-black font-semibold text-left text-xl w-full ml-2"> {resume.label}</h6>
                      <button
                        className="bg-red-500 flex min-w-max gap-2 text-white px-1 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        onClick={async(event) => {
                          event.stopPropagation();
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this resume?"
                          );
                          if (!confirmDelete) { return }
                          if (!await deleteResume(resume.resume_id)) { return }
                          await setSavedResumes(await getSavedResumes()) // Refresh list of resumes
                        }}
                      >
                        <Trash2Icon />
                      </button>
                    </div>
                    <div className="w-full h-full overflow-y-scroll">
                      <PreviewResume
                        resume_id={resume.resume_id}
                        label={resume.label}
                        full_name={resume.full_name}
                        phone_number={resume.phone_number}
                        email={resume.email}
                        custom_contact={resume.custom_contact}
                        education={resume.education}
                        experience={resume.experience}
                        projects={resume.projects}
                        technical_skills={resume.technical_skills}
                      />
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
