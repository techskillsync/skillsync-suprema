/*
 * This file holds functions that take info from SkillSync profiles and 
 * assemble them into resume objects.
 */
import { v4 as uuidv4 } from "uuid";
import { GetProfileInfo } from "../../supabase/ProfileInfo";
import { GetWorkExperiences } from "../../supabase/WorkExperience";
import { getSavedResumes } from "./ResumeManager";
import {
	Resume,
	EducationSection,
	ExperienceSection,
	SkillsSection,
  } from "../../types/types";
import { GetResume, GetResumes } from '../../supabase/Resumes'

async function assembleNewResume(): Promise<Resume> {
	const resume_id = uuidv4();

	function DateToMonthYear(date_str: string): string {
		try {
			const date = new Date(date_str);
			const months = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
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

		let custom_resume: Resume = {
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

		if (typeof custom_resume.label !== "string") { custom_resume.label = "My Resume"; }
		if (typeof custom_resume.full_name !== "string") { custom_resume.full_name = "John Doe"; }
		if (typeof custom_resume.phone_number !== "string") { custom_resume.phone_number = "+1 234 567 8900"; }
		if (typeof custom_resume.email !== "string") { custom_resume.email = "example@gmail.com"; }
		if (!Array.isArray(custom_resume.education)) { custom_resume.education = []; }
		if (!Array.isArray(custom_resume.experience)) { custom_resume.experience = []; }

		return custom_resume;

	} catch (error) {
		console.warn("Error arranging resume info - " + error);
		const default_resume: Resume = {
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

/*
 * Given the resume_id of a user's imported resume. Will return the 
 * imported resume as a recognizable object.
 */
async function assembleForeignResume(foreign_resume_id: string): Promise<Resume> {

	// CALL BACKEND RESUME PARSER HERE THEN TURN IT INTO A RESUME
	const resume_id = uuidv4();



	try {


		throw Error("lol");

	} catch (error) {
		console.warn("Error arranging resume info - " + error);
		const default_resume: Resume = {
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

export { assembleNewResume }