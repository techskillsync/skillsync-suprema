import React, { useState } from "react";
import supabase from "../../supabase/supabaseClient";
import {
  CustomContact,
  EducationSection,
  ExperienceSection,
  ProjectsSection,
  SkillsSection,
} from "../../types/types";
import axios from "axios";
import "./StyleEditResume.css";
import {
  Trash2Icon,
  Building2,
  MapPin,
  GraduationCap,
  PlusIcon,
  BrainCircuit,
  Briefcase,
  HighlighterIcon,
} from "lucide-react";

async function simpleGPT(messages: Array<Object>): Promise<string> {
  try {
    const access_token = (await supabase.auth.getSession()).data.session
      ?.access_token;
    if (!access_token) {
      throw Error("Could not get access token");
    }

    const new_hi = await axios.post(
      "https://gpt-broker.skillsync.work/advanced-gpt-4o-mini-complete",
      messages,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (typeof new_hi.data !== "string") {
      throw Error("New highlight must be a string");
    }

    return new_hi.data;
  } catch (error) {
    console.log(error);
    console.warn("Error generating education GPT highlights");
    return "";
  }
}

/*
 * Uses ChatGPT to generate a new highlight for education section
 */
async function genEducationGptHighlight(
  edu: EducationSection
): Promise<string> {
  let user_highlights = " Some of my highlights are: ";
  for (const hi of edu.highlights) {
    user_highlights + ", " + hi;
  }

  const messages = [
    {
      role: "system",
      content:
        "Using the name of this person's university/college, their degree, and highlights, can you generate a new highlight. You answer must be a single bullet point and it must mention a specific thing that would fit on their resume. Do not add any indents at the start Do not add any dashes or spaces at the start.",
    },
    {
      role: "user",
      content: `I went to ${edu.institution} in ${edu.location}, with a ${edu.degree}. ${user_highlights}`,
    },
  ];

  const new_hi = await simpleGPT(messages);
  return new_hi;
}

/*
 * Uses ChatGPT to generate a new highlight for an experience section.
 */
async function genExperienceGptHighlight(
  exp: ExperienceSection
): Promise<string> {
  let user_highlights = "The highlights from this job are: ";
  for (const hi of exp.highlights) {
    user_highlights + ", " + hi;
  }
  const messages = [
    {
      role: "system",
      content:
        "Using this persons job title, company name and job highlights can you come up with a new unique highlight. Your answer should have wording like a bullet point but it must not have a dash or any leading punctuation.",
    },
    {
      role: "user",
      content: `My job title was ${exp.job_title} and I worked at ${exp.company}. ${user_highlights}`,
    },
  ];
  const new_hi = await simpleGPT(messages);
  return new_hi;
}

/*
 * Uses ChatGPT to generate a new highlight for a projects section.
 */
async function genProjectGptHighlight(prj: ProjectsSection): Promise<string> {
  let user_highlights =
    "My projects highlights are: " + prj.highlights.join(", ");
  const messages = [
    {
      role: "system",
      content:
        "Using the name of this project, the technologies it uses, and some highlight about the project come up with a new unique highlight. It should be written like a bullet point but it should not have a leading dash or whitespace.",
    },
    {
      role: "user",
      content: `My project ${prj.name} used: ${prj.technologies}. ${user_highlights}`,
    },
  ];
  const new_hi = await simpleGPT(messages);
  return new_hi;
}

async function genSkillSection(
  skills: SkillsSection[],
  exp: ExperienceSection[],
  prj: ProjectsSection[],
  edu: EducationSection[]
): Promise<SkillsSection> {
  let past_skills = "";
  for (const sk of skills) {
    past_skills += sk.category + ", ";
  }
  let past_edu = "";
  for (const e of edu) {
    past_edu += e.degree + ", ";
  }
  let past_exp = "";
  for (const ex of exp) {
    past_exp += ex.job_title + ", ";
  }
  let past_prj = "";
  for (const p of prj) {
    past_prj += p.technologies + ", ";
  }

  const messages = [
    {
      role: "system",
      content:
        "Generate a single category of skills. You answer must be a single word. For example if the user says they are a programmer a skills category could be 'languages' or 'framewokrs'",
    },
    {
      role: "user",
      content: `I already put these categories in my resume so yours must be different. ${past_skills}`,
    },
    {
      role: "user",
      content: `Please base the new category on this information: ${past_edu}, ${past_exp}, ${past_prj} `,
    },
  ];
  const category = await simpleGPT(messages);
  const messages_2 = [
    {
      role: "system",
      content: `Generate a list of 4-6 skills that are applicable to ${category}. Your answer must be a string of keywords seperated by commas with no other punctuation`,
    },
  ];
  const new_skill = await simpleGPT(messages_2);
  return { category, skills: new_skill };
}

// This ugly line is just to type the 3 million props for EditResume
interface EditResumeProps {
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setCustomContact: React.Dispatch<React.SetStateAction<CustomContact[]>>;
  setEducation: React.Dispatch<React.SetStateAction<EducationSection[]>>;
  setExperience: React.Dispatch<React.SetStateAction<ExperienceSection[]>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectsSection[]>>;
  setTechnicalSkills: React.Dispatch<React.SetStateAction<SkillsSection[]>>;
  label: string;
  full_name: string;
  phone_number: string;
  email: string;
  custom_contact: CustomContact[];
  education: EducationSection[];
  experience: ExperienceSection[];
  projects: ProjectsSection[];
  technical_skills: SkillsSection[];
}

function EditResume({
  setLabel,
  setFullName,
  setPhoneNumber,
  setEmail,
  setCustomContact,
  setEducation,
  setExperience,
  setProjects,
  setTechnicalSkills,
  label,
  full_name,
  phone_number,
  email,
  custom_contact,
  education,
  experience,
  projects,
  technical_skills,
}: EditResumeProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  // Converts a date in the format "Jul 2024"
  // to the format yyyy-mm, so that they can be 
  // set as the value attribute on an input of 
  // type="month"
  function convertFromResumeDate(human_date: string): string {
    const [monthStr, year] = human_date.split(" ")
    const monthMap: { [key: string]: string } = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
    const month = monthMap[monthStr]
    return `${year}-${month}`
  }

  function convertToResumeDate(html_date: string): string {
    const [year, month] = html_date.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  return (
    <div className="h-full w-full px-[5%] text-left text-black overflow-y-scroll">
      <div id="resumeInfo" className="m-4 pb-32">
        <div className="flex flex-col gap-4 border-b border-[green] pb-10">
          {/* Full Name Input */}
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-gray-400 focus-within:border-gray-500">
            <span className="text-gray-500 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </span>
            <input
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
              value={full_name}
            />
          </div>

          {/* Phone Number Input */}
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-gray-400 focus-within:border-gray-500">
            <span className="text-gray-500 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.91 15.91 0 006.58 6.58l2.2-2.2c.27-.27.67-.36 1.02-.27 1.12.3 2.33.46 3.58.46.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.01 21 3 13.99 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.16 2.46.46 3.58.09.35 0 .74-.27 1.02l-2.2 2.19z" />
              </svg>
            </span>
            <input
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phone_number}
            />
          </div>

          {/* Email Input */}
          <div className="flex items-center border border-gray-300 rounded-md p-2 hover:border-gray-400 focus-within:border-gray-500">
            <span className="text-gray-500 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </span>
            <input
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Custom Contact Info */}
          {custom_contact.map((cc, index) => (
            <div key={index} className="flex items-stretch">
              <div className="flex-grow border border-gray-300 rounded-md p-2 hover:border-gray-400 focus-within:border-gray-500">
                <div className="flex rounded-none items-center border-b border-gray-500">
                  <span className="text-gray-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></svg>
                  </span>
                  <input
                    className="flex-grow outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Label"
                    onChange={(e) => {
                      const new_cc = { label: e.target.value, url: cc.url }
                      let new_custom_contact = [...custom_contact]
                      new_custom_contact[index] = new_cc
                      setCustomContact(new_custom_contact)
                    }}
                    value={cc.label}
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </span>
                  <input
                    className="flex-grow outline-none text-gray-700 placeholder-gray-400"
                    placeholder="https://example.com"
                    onChange={(e) => {
                      let new_url = e.target.value;
                      if (new_url === 'https:/') {
                        new_url = new_url + '/';
                      }
                      else if (!new_url.startsWith('https://')) {
                        new_url = 'https://' + new_url;
                      }
                      const new_cc = { label: cc.label, url: new_url }
                      let new_custom_contact = [...custom_contact]
                      new_custom_contact[index] = new_cc
                      setCustomContact(new_custom_contact)
                    }}
                    value={cc.url}
                  />
                </div>
              </div>
              <div
                className="ml-2 p-2 text-white rounded-md flex justify-center items-center bg-red-500 hover:bg-red-600"
                onClick={() => {
                  let new_custom_contact = [...custom_contact]
                  new_custom_contact.splice(index, 1)
                  setCustomContact(new_custom_contact)
                }}>
                <Trash2Icon className="w-5 h-5" />
              </div>
            </div>
          ))}

          {/* Add Custom Contact button */}
          <button
            className="flex-grow bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
            onClick={() => {
              setCustomContact([...custom_contact, { label: '', url: 'https://' }])
            }}
          >
            <PlusIcon />
            Add Contact
          </button>

        </div>

        <h3 className="mt-5 py-5">EDUCATION:</h3>
        <div className="flex flex-col gap-6 border-b pb-10 border-[green]">
          {education.map((edu, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 shadow-md bg-[#161616]"
            >
              {/* Institution Input */}
              <div className="flex gap-4 items-center mb-4">
                <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 w-full focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-500 mr-2">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <input
                    className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                    placeholder="Institution"
                    onChange={(e) => {
                      const new_edu: EducationSection = {
                        ...edu,
                        institution: e.target.value,
                      };
                      let new_edus: EducationSection[] = [...education];
                      new_edus[index] = new_edu;
                      setEducation(new_edus);
                    }}
                    value={edu.institution}
                  />
                </div>
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  onClick={() => {
                    const new_educations = [...education];
                    new_educations.splice(index, 1);
                    setEducation(new_educations);
                  }}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>

              {/* Location Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-500 mr-2">
                  <MapPin className="w-5 h-5" />
                </span>
                <input
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Location"
                  onChange={(e) => {
                    const new_edu: EducationSection = {
                      ...edu,
                      location: e.target.value,
                    };
                    const new_edus: EducationSection[] = [...education];
                    new_edus[index] = new_edu;
                    setEducation(new_edus);
                  }}
                  value={edu.location}
                />
              </div>

              {/* Degree Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-500 mr-2">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <input
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Degree"
                  onChange={(e) => {
                    const new_edu: EducationSection = {
                      ...edu,
                      degree: e.target.value,
                    };
                    const new_edus: EducationSection[] = [...education];
                    new_edus[index] = new_edu;
                    setEducation(new_edus);
                  }}
                  value={edu.degree}
                />
              </div>

              {/* Graduation Date Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type="month"
                  className="flex-grow border-none bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Grad Date"
                  onChange={(e) => {
                    const new_edu: EducationSection = {
                      ...edu,
                      end_date: convertToResumeDate(e.target.value),
                    };
                    const new_edus: EducationSection[] = [...education];
                    new_edus[index] = new_edu;
                    setEducation(new_edus);
                  }}
                  value={convertFromResumeDate(edu.end_date)}
                />
              </div>

              {/* Highlights Section */}
              {edu.highlights.map((hi: string, hi_index: number) => (
                <div key={hi_index} className="flex items-center mb-2">
                  <textarea
                    className="flex-grow border border-gray-300 rounded-md p-2 mr-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Highlight"
                    onChange={(e) => {
                      let new_highlights: string[] = [...edu.highlights];
                      new_highlights[hi_index] = e.target.value;
                      const new_edu: EducationSection = {
                        ...edu,
                        highlights: new_highlights,
                      };
                      const new_edus: EducationSection[] = [...education];
                      new_edus[index] = new_edu;
                      setEducation(new_edus);
                    }}
                    value={hi}
                  />
                  <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                    onClick={() => {
                      let new_highlights: string[] = [...edu.highlights];
                      new_highlights.splice(hi_index, 1);
                      const new_edu: EducationSection = {
                        ...edu,
                        highlights: new_highlights,
                      };
                      const new_edus: EducationSection[] = [...education];
                      new_edus[index] = new_edu;
                      setEducation(new_edus);
                    }}
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Add Highlight Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-grow bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={() => {
                    const new_highlights: string[] = [...edu.highlights, ""];
                    const new_edu: EducationSection = {
                      ...edu,
                      highlights: new_highlights,
                    };
                    const new_edus: EducationSection[] = [...education];
                    new_edus[index] = new_edu;
                    setEducation(new_edus);
                  }}
                >
                  <PlusIcon />
                  Add Highlight
                </button>
                <button
                  className="flex-grow bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={async () => {
                    const new_hi = await genEducationGptHighlight(edu);
                    const new_highlights: string[] = [
                      ...edu.highlights,
                      new_hi,
                    ];
                    const new_edu: EducationSection = {
                      ...edu,
                      highlights: new_highlights,
                    };
                    const new_edus: EducationSection[] = [...education];
                    new_edus[index] = new_edu;
                    setEducation(new_edus);
                  }}
                >
                  <BrainCircuit />
                  Enhance with AI
                </button>
              </div>
            </div>
          ))}

          {/* Add New Education Section */}
          <button
            className="bg-black border-dashed border-white text-white mt-6 w-full p-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
            onClick={() => {
              const new_edu: EducationSection = {
                institution: "Institution",
                location: "NY, USA",
                degree: "Degree",
                end_date: "expected 2024",
                highlights: [],
              };
              const new_edus: EducationSection[] = [...education, new_edu];
              setEducation(new_edus);
            }}
          >
            <PlusIcon />
            Add Education Section
          </button>
        </div>

        <h3 className="mt-5 py-5 ">EXPERIENCE:</h3>
        <div className="flex flex-col gap-6 border-b pb-10 border-[green]">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 shadow-md bg-[#161616]"
            >
              {/* Job Title Input */}
              <div className="flex gap-4 items-center mb-4">
                <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 w-full focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="text-gray-500 mr-2">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <input
                    className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                    placeholder="Job Title"
                    onChange={(e) => {
                      const new_exp: ExperienceSection = {
                        ...exp,
                        job_title: e.target.value,
                      };
                      let new_exps: ExperienceSection[] = [...experience];
                      new_exps[index] = new_exp;
                      setExperience(new_exps);
                    }}
                    value={exp.job_title}
                  />
                </div>
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  onClick={() => {
                    const new_experiences = [...experience];
                    new_experiences.splice(index, 1);
                    setExperience(new_experiences);
                  }}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>

              {/* Company Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-500 mr-2">
                  <Building2 className="w-5 h-5" />
                </span>
                <input
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Company"
                  onChange={(e) => {
                    const new_exp: ExperienceSection = {
                      ...exp,
                      company: e.target.value,
                    };
                    let new_exps: ExperienceSection[] = [...experience];
                    new_exps[index] = new_exp;
                    setExperience(new_exps);
                  }}
                  value={exp.company}
                />
              </div>

              {/* Location Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-500 mr-2">
                  <MapPin className="w-5 h-5" />
                </span>
                <input
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Location"
                  onChange={(e) => {
                    const new_exp: ExperienceSection = {
                      ...exp,
                      location: e.target.value,
                    };
                    let new_exps: ExperienceSection[] = [...experience];
                    new_exps[index] = new_exp;
                    setExperience(new_exps);
                  }}
                  value={exp.location}
                />
              </div>

              {/* Start Date Input */}
              <div className="flex justify-between">
                <div className="bg-black flex-grow mr-2 border decoration-slate-200 border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="month"
                    className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400"
                    placeholder="Start Date"
                    onChange={(e) => {
                      const new_exp: ExperienceSection = {
                        ...exp,
                        start_day: convertToResumeDate(e.target.value),
                      };
                      let new_exps: ExperienceSection[] = [...experience];
                      new_exps[index] = new_exp;
                      setExperience(new_exps);
                    }}
                    value={convertFromResumeDate(exp.start_day)}
                  />
                </div>

                {/* End Date Input */}
                <div className="border flex-grow ml-2 bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="month"
                    className="w-full border-none bg-transparent outline-none text-white placeholder-gray-400"
                    placeholder="End Date"
                    onChange={(e) => {
                      const new_exp: ExperienceSection = {
                        ...exp,
                        end_day: convertToResumeDate(e.target.value),
                      };
                      let new_exps: ExperienceSection[] = [...experience];
                      new_exps[index] = new_exp;
                      setExperience(new_exps);
                    }}
                    value={convertFromResumeDate(exp.end_day)}
                  />
                </div>
              </div>

              {/* Highlights Section */}
              {exp.highlights.map((hi: string, hi_index: number) => (
                <div key={hi_index} className="flex items-center mb-2">
                  <textarea
                    className="flex-grow border border-gray-300 rounded-md p-2 mr-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Highlight"
                    onChange={(e) => {
                      let new_highlights: string[] = [...exp.highlights];
                      new_highlights[hi_index] = e.target.value;
                      const new_exp: ExperienceSection = {
                        ...exp,
                        highlights: new_highlights,
                      };
                      const new_exps: ExperienceSection[] = [...experience];
                      new_exps[index] = new_exp;
                      setExperience(new_exps);
                    }}
                    value={hi}
                  />
                  <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                    onClick={() => {
                      let new_highlights: string[] = [...exp.highlights];
                      new_highlights.splice(hi_index, 1);
                      const new_exp: ExperienceSection = {
                        ...exp,
                        highlights: new_highlights,
                      };
                      const new_exps: ExperienceSection[] = [...experience];
                      new_exps[index] = new_exp;
                      setExperience(new_exps);
                    }}
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Add Highlight Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-grow bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={() => {
                    const new_highlights: string[] = [...exp.highlights, ""];
                    const new_exp: ExperienceSection = {
                      ...exp,
                      highlights: new_highlights,
                    };
                    const new_exps: ExperienceSection[] = [...experience];
                    new_exps[index] = new_exp;
                    setExperience(new_exps);
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Highlight
                </button>
                <button
                  className="flex-grow bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={async () => {
                    const new_hi = await genExperienceGptHighlight(exp);
                    const new_highlights: string[] = [
                      ...exp.highlights,
                      new_hi,
                    ];
                    const new_exp: ExperienceSection = {
                      ...exp,
                      highlights: new_highlights,
                    };
                    const new_exps: ExperienceSection[] = [...experience];
                    new_exps[index] = new_exp;
                    setExperience(new_exps);
                  }}
                >
                  <BrainCircuit />
                  Enhance with AI
                </button>
              </div>
            </div>
          ))}

          {/* Add New Experience Section */}
          <button
            className="bg-black border-dashed border-white text-white mt-6 w-full p-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
            onClick={() => {
              const new_exp: ExperienceSection = {
                job_title: "Job Title",
                company: "Company",
                location: "Location",
                start_day: "2023",
                end_day: "2024",
                highlights: [],
              };
              const new_exps: ExperienceSection[] = [...experience, new_exp];
              setExperience(new_exps);
            }}
          >
            <PlusIcon />
            Add Experience Section
          </button>
        </div>

        <h3 className="text-white mt-5 py-5">PROJECTS:</h3>
        <div className="flex flex-col gap-6 border-b border-[green] pb-10">
          {projects.map((prj, index) => (
            <div
              key={index}
              className="border bg-[#161616] border-gray-300 rounded-lg p-6 shadow-md "
            >
              {/* Project Name Input */}
              <div className="flex gap-4 items-center mb-4">
                <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 w-full focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                    placeholder="Name"
                    onChange={(e) => {
                      const new_prj: ProjectsSection = {
                        ...prj,
                        name: e.target.value,
                      };
                      let new_prjs: ProjectsSection[] = [...projects];
                      new_prjs[index] = new_prj;
                      setProjects(new_prjs);
                    }}
                    value={prj.name}
                  />
                </div>
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  onClick={() => {
                    const new_projects = [...projects];
                    new_projects.splice(index, 1);
                    setProjects(new_projects);
                  }}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>

              {/* Github URL Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Github URL"
                  onChange={(e) => {
                    const new_prj: ProjectsSection = {
                      ...prj,
                      github_url: e.target.value,
                    };
                    let new_prjs: ProjectsSection[] = [...projects];
                    new_prjs[index] = new_prj;
                    setProjects(new_prjs);
                  }}
                  value={prj.github_url}
                />
              </div>

              {/* Technologies Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Technologies Used"
                  onChange={(e) => {
                    const new_prj: ProjectsSection = {
                      ...prj,
                      technologies: e.target.value,
                    };
                    let new_prjs: ProjectsSection[] = [...projects];
                    new_prjs[index] = new_prj;
                    setProjects(new_prjs);
                  }}
                  value={prj.technologies}
                />
              </div>

              {/* Start Date Input */}
              <div className="flex justify-between">
                <div className="w-full mr-2 flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="month"
                    className="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-400"
                    placeholder="Start date"
                    onChange={(e) => {
                      const new_prj: ProjectsSection = {
                        ...prj,
                        start_day: convertToResumeDate(e.target.value),
                      };
                      let new_prjs: ProjectsSection[] = [...projects];
                      new_prjs[index] = new_prj;
                      setProjects(new_prjs);
                    }}
                    value={convertFromResumeDate(prj.start_day)}
                  />
                </div>

                {/* End Date Input */}
                <div className="w-full ml-2 flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    type="month"
                    className="flex-grow bg-transparent border-none outline-none text-white placeholder-gray-400"
                    placeholder="End date"
                    onChange={(e) => {
                      const new_prj: ProjectsSection = {
                        ...prj,
                        end_day: convertToResumeDate(e.target.value),
                      };
                      let new_prjs: ProjectsSection[] = [...projects];
                      new_prjs[index] = new_prj;
                      setProjects(new_prjs);
                    }}
                    value={convertFromResumeDate(prj.end_day)}
                  />
                </div>
              </div>

              {/* Highlights Section */}
              {prj.highlights.map((hi: string, hi_index: number) => (
                <div key={hi_index} className="flex items-center mb-2">
                  <textarea
                    className="flex-grow border border-gray-300 rounded-md p-2 mr-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Highlight"
                    onChange={(e) => {
                      let new_highlights: string[] = [...prj.highlights];
                      new_highlights[hi_index] = e.target.value;
                      const new_prj: ProjectsSection = {
                        ...prj,
                        highlights: new_highlights,
                      };
                      const new_prjs: ProjectsSection[] = [...projects];
                      new_prjs[index] = new_prj;
                      setProjects(new_prjs);
                    }}
                    value={hi}
                  />
                  <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                    onClick={() => {
                      let new_highlights: string[] = [...prj.highlights];
                      new_highlights.splice(hi_index, 1);
                      const new_prj: ProjectsSection = {
                        ...prj,
                        highlights: new_highlights,
                      };
                      const new_prjs: ProjectsSection[] = [...projects];
                      new_prjs[index] = new_prj;
                      setProjects(new_prjs);
                    }}
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Add Highlight Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-grow bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={() => {
                    const new_highlights: string[] = [...prj.highlights, ""];
                    const new_prj: ProjectsSection = {
                      ...prj,
                      highlights: new_highlights,
                    };
                    const new_prjs: ProjectsSection[] = [...projects];
                    new_prjs[index] = new_prj;
                    setProjects(new_prjs);
                  }}
                >
                  <HighlighterIcon className="w-5 h-5 mr-2" />
                  Add Highlight
                </button>
                <button
                  className="flex-grow bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                  onClick={async () => {
                    const new_hi = await genProjectGptHighlight(prj);
                    const new_highlights: string[] = [
                      ...prj.highlights,
                      new_hi,
                    ];
                    const new_prj: ProjectsSection = {
                      ...prj,
                      highlights: new_highlights,
                    };
                    const new_prjs: ProjectsSection[] = [...projects];
                    new_prjs[index] = new_prj;
                    setProjects(new_prjs);
                  }}
                >
                  <BrainCircuit className="w-5 h-5 mr-2" />
                  Enhance with AI
                </button>
              </div>
            </div>
          ))}
          <button
            className="bg-black border-dashed border-white text-white mt-6 w-full p-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
            onClick={() => {
              const new_prj: ProjectsSection = {
                name: "Project",
                github_url: "https://github.com/",
                technologies: "JavaScript, OpenAI, Redux",
                start_day: "Feb 2020",
                end_day: "Jan 2024",
                highlights: [],
              };
              let new_prjs: ProjectsSection[] = [...projects, new_prj];
              setProjects(new_prjs);
            }}
          >
            <PlusIcon /> Add project
          </button>
        </div>

        <h3 className="text-white mt-5 py-5">TECHNICAL SKILLS:</h3>
        <div className="flex flex-col gap-6 border-b border-[green] pb-10">
          {technical_skills.map((skl, index: number) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-6 shadow-md bg-[#161616]"
            >
              {/* Category Input */}
              <div className="flex gap-4 items-center mb-4">
                <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 w-full focus-within:ring-2 focus-within:ring-blue-500">
                  <input
                    className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                    placeholder="Category"
                    onChange={(e) => {
                      const new_skl: SkillsSection = {
                        category: e.target.value,
                        skills: skl.skills,
                      };
                      const new_sklls: SkillsSection[] = [...technical_skills];
                      new_sklls[index] = new_skl;
                      setTechnicalSkills(new_sklls);
                    }}
                    value={skl.category}
                  />
                </div>
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  onClick={() => {
                    const new_skills: SkillsSection[] = [...technical_skills];
                    new_skills.splice(index, 1);
                    setTechnicalSkills(new_skills);
                  }}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              </div>

              {/* Skills Input */}
              <div className="flex items-center border bg-black border-gray-300 rounded-md p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                <textarea
                  className="flex-grow bg-transparent outline-none text-white placeholder-gray-400"
                  placeholder="Skills (comma separated)"
                  onChange={(e) => {
                    const new_skl: SkillsSection = {
                      category: skl.category,
                      skills: e.target.value,
                    };
                    const new_sklls: SkillsSection[] = [...technical_skills];
                    new_sklls[index] = new_skl;
                    setTechnicalSkills(new_sklls);
                  }}
                  value={skl.skills}
                />
              </div>
            </div>
          ))}

          {/* Add New Skills Section */}
          <div className="flex gap-2 ">
            <button
              className="bg-black border-dashed border-white text-white mt-6 w-full p-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
              onClick={() => {
                const new_skill: SkillsSection = {
                  category: "New Category",
                  skills: "",
                };
                setTechnicalSkills([...technical_skills, new_skill]);
              }}
            >
              <PlusIcon />
              Add Technical Skill
            </button>
            <button
              className="bg-black border-dashed border-white text-white mt-6 w-full p-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex gap-2 items-center justify-center"
              onClick={async () => {
                const new_skill = await genSkillSection(
                  technical_skills,
                  experience,
                  projects,
                  education
                );
                setTechnicalSkills([...technical_skills, new_skill]);
              }}
            >
              <BrainCircuit /> AI Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditResume;

