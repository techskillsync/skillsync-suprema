import query_gpt_broker from "./QueryGptBroker"
import { Resume } from "../../types/types"

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
		{ "role": "system", "content": "I would like you to score this persons resume from 0 to 100 (including both 0 and 100).Return a number in the range [0, 100], do not include any explanations, only provide a number." },
  	{ "role": "user", "content": `Here is my resume: \n ${resume_text}`}
	]
	const response = await query_gpt_broker(messages)

	return Number(response)
}

export { get_ats_score }