import React, { useEffect, useState } from "react";
import ResumeBuilder from "./ResumeBuilder";
import PreviewResume from "./PreviewResume";
import supabase from "../../supabase/supabaseClient";
import { GetUserId } from "../../supabase/GetUserId";
import { Resume } from "../../types/types";
import { Trash2Icon } from "lucide-react";
import { GetResumes } from "../../supabase/Resumes";
import { SlNote } from "react-icons/sl";
import { assembleNewResume, assembleForeignResume } from "./AssembleResumes";
import toast, { Toaster } from "react-hot-toast";

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

function ResumeManager() {
  const [savedResumes, setSavedResumes] = useState<Resume[] | null>([]);
  const [existingResumes, setExistingResumes] = useState<any[] | null>([]);
  const [openedResume, setOpenedResume] = useState<Resume | null>(null);

  useEffect(() => {
    async function doAsync() {
      setSavedResumes(await getSavedResumes());
      setExistingResumes(await GetResumes());
    }

    doAsync();
  }, [openedResume]);

  return (
    <>
      {openedResume ? (
        <ResumeBuilder
          imported_resume={openedResume}
          closeResume={() => setOpenedResume(null)}
        />
      ) : (
        <main className="flex flex-col min-h-screen mt-5 md:px-10 w-full">
          <section className="flex flex-col mb-16 gap-2 justify-center items-start">
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
                      <h6 className="text-black font-semibold text-left text-xl w-full ml-2">
                        {" "}
                        {resume.label}
                      </h6>
                      <button
                        className="bg-red-500 flex min-w-max gap-2 text-white px-1 py-1 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        onClick={async (event) => {
                          event.stopPropagation();
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this resume?",
                          );
                          if (!confirmDelete) {
                            return;
                          }
                          if (!(await deleteResume(resume.resume_id))) {
                            return;
                          }
                          await setSavedResumes(await getSavedResumes()); // Refresh list of resumes
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
            <h1 className="font-bold mt-5 mb-4 text-white">
              Or import an existing Resume:
            </h1>
            <div className="flex">
              {existingResumes?.map((res, index) => (
                <div
                  key={index}
                  className="bg-white text-black cursor-pointer w-[250px] h-[300px] shadow-md  rounded-lg p-4 m-4 flex flex-col justify-between items-center hover:shadow-lg transition-shadow duration-300"
                  onClick={async () => {
                    const loadingToastId = toast.loading("Importing resume...")
                    const resume = await assembleForeignResume(res.resume_id)
                    toast.dismiss(loadingToastId)
                    setOpenedResume(resume)
                  }}
                >
                  <Toaster />
                  <h6 className="text-black font-semibold text-left text-xl w-full ml-2">
                    {" "}
                    {res.resume_label}
                  </h6>
                  <div className="w-full h-full flex justify-center items-center">
                    <SlNote size={96} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </>
  );
}

export default ResumeManager;
export { getSavedResumes };
