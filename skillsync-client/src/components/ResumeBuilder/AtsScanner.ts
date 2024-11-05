import React from 'react' // For the types lol
import query_gpt_broker from "./QueryGptBroker"
import { Resume } from "../../types/types"

let ats_on_cooldown:boolean = false
let most_recent_resume:Resume|null = null


/*
 * This function will ensure that get_ats score is called at 
 * most once every 5 seconds. If called many times quickly 
 * then after the 5 seconds is up it will call get_ats_score 
 * with the most recent resume and use set_ats_score to update
 * the ats score.
 * This is done to prevent get_ats_score from being spammed 
 * which would cause the user to hit their gpt-broker limit 
 * very quickly.
 */
async function queue_ats_score(
	resume:Resume,
	set_ats_score:React.Dispatch<React.SetStateAction<number | null>>
) {
	most_recent_resume = resume

	if (ats_on_cooldown) { return }

	ats_on_cooldown = true
	await new Promise((resolve) => setTimeout(resolve, 5000))
	set_ats_score(await get_ats_score(most_recent_resume))
	ats_on_cooldown = false
}

/*
 * Extracts the text from a resume object and 
 * uses chat gpt to rate it from 0 - 100
 */
async function get_ats_score(resume: Resume): Promise<number> {
	// Now we make one big string with all the Resume fields
	let custom_contact:string = ""
	for (const c of resume.custom_contact) {
		custom_contact += c.label + "(" + c.url + ")"
	}
	let education:string = "Education:\n"
	for (const e of resume.education) {
		education += e.institution + " " + e.location + "\n" + e.degree + e.end_date
		for (const hi of e.highlights) {
			education += "\t" + hi
		}
	}
	let experience:string = "Experience:\n"
	for (const e of resume.experience) {
		experience += e.job_title + " " + e.start_day + "-" + e.end_day + "\n" + e.company + " " + e.location
		for (const hi of e.highlights) {
			experience += "\t" + hi + "\n"
		}
	}
	let projects:string = "Projects:\n"
	for (const p of resume.projects) {
		projects += p.name + " " + p.technologies + " " + p.start_day + "-" + p.end_day
		for (const hi of p.highlights) {
			projects += "\t" + hi + "\n"
		}
	}
	let technical_skills = "Technical Skills:\n"
	for (const t of resume.technical_skills) {
		technical_skills += t.category + ": " + t.skills + "\n"
	}
	
	const resume_text = `${resume.full_name}, ${resume.email}, ${resume.phone_number}
${education}
${experience}
${projects}
${technical_skills}
`
	const messages = [
		{ "role": "system", "content": "You are an advanced Applicant Tracking System (ATS) designed to evaluate resumes based on overall quality and effectiveness in the job market. Analyze the following resume and assign a score between 0 and 100 (inclusive), where 0 indicates a very weak resume and 100 indicates an exceptional resume. Consider factors such as clarity, organization, relevant skills, experience, education, keywords, and professional achievements. Do not include any explanations or additional text; only provide a single numerical score" },
  	{ "role": "user", "content": `Here is my resume: \n ${resume_text}`}
	]
	const response = await query_gpt_broker(messages)

	return Number(response)
}

export { queue_ats_score }