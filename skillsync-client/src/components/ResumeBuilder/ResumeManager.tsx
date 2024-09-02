import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import ResumeBuilder from './ResumeBuilder';
import supabase from '../../supabase/supabaseClient';
import { GetProfileInfo } from '../../supabase/ProfileInfo';
import { GetWorkExperiences } from '../../supabase/WorkExperience';
import { GetUserId } from '../../supabase/GetUserId';
import { Resume, EducationSection, ExperienceSection, ProjectsSection, SkillsSection } from '../../types/types';

/*
 * Returns a list of the users saved resumes.
 */
async function getSavedResumes(): Promise<Resume[]|null> {
	try {
		const { data, error } = await supabase
			.from('resume_builder')
			.select('*')
			.eq('id', await GetUserId());
		
		if (error) { throw Error(error.message) }

		return data as Resume[];
	} catch (error) {
		console.warn("Could not get saved resumes - " + error);
		return null;
	}
}


/*
 * Sends a delete request to supabase based on resume_id
 */
async function deleteResume(resume_id:string):Promise<boolean>
{
	try {
		const { data, error } = await supabase
			.from('resume_builder')
			.delete()
			.eq('resume_id', resume_id)
			.select('resume_id');
		
		if (error) { throw Error(error.message); }

		return true;
	} catch(error) {
		console.warn('Could not delete resume - ' + error);
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
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			return months[date.getMonth()] + ' ' + date.getFullYear();
		} catch {
			return "--- -"
		}
	}

	try {
		const profile_data = await GetProfileInfo('name, last_name, phone_number, email, personal_website, linkedin, github, school, grad_year, program, specialization, location');
		if (profile_data === null) { throw Error('Could not fetch profile'); }
		const work_data = await GetWorkExperiences();
		if (work_data === null) { throw Error('Could not get work_data'); }

		const saved_resumes = await getSavedResumes();
		if (saved_resumes === null) { throw Error('Could not get saved resumes'); }
		let resume_label = profile_data.name + "'s resume "+ saved_resumes.length;
	
		let educations: EducationSection[] = [];
		let education: EducationSection = {
			institution: profile_data.school,
			location: profile_data.location,
			end_date: profile_data.grad_year,
			degree: profile_data.program + ' in ' + profile_data.specialization,
			highlights: [],
		}
		educations.push(education);

		let experiences: ExperienceSection[] = [];
		for (let e of work_data) {
			const experience: ExperienceSection = {
				job_title: e.title,
				company: e.company,
				start_day: e.startDate ? DateToMonthYear(e.startDate) : '',
				end_day: e.endDate ? DateToMonthYear(e.endDate) : '',
				location: e.location ?? '',
				highlights: e.description ? e.description.split('\n') : [],

			}
			experiences.push(experience);
		}

		return {
			resume_id: resume_id,
			label: resume_label,
			full_name: profile_data.name + ' ' + profile_data.last_name,
			phone_number: profile_data.phone_number,
			email: profile_data.email,
			personal_website: profile_data.personal_website,
			linkedin: profile_data.linkedin,
			github: profile_data.github,
			education: educations,
			experience: experiences,
			projects: [],
			technical_skills: [],
		}

	}
	catch (error) {
		console.warn('Error arranging resume info - ' + error)
		return {
			resume_id: resume_id,
			label: 'My Resume',
			full_name: 'John Doe',
			phone_number: '+1 234 567 8900',
			email: 'example@gmail.com',
			personal_website: 'example.github.io',
			linkedin: 'https://linkedin.com/example',
			github: 'https://github.com/example',
			education: [],
			experience: [],
			projects: [],
			technical_skills: [],
		}
	}
}



function ResumeManager() {
	const [savedResumes, setSavedResumes] = useState<Resume[]|null>([]);

	const [openedResume, setOpenedResume] = useState<Resume | null>(null);

	useEffect(() => {
		async function doAsync() {
			setSavedResumes(await getSavedResumes());
		}

		doAsync();
	})

	return (
		<>
			{openedResume ?
				<ResumeBuilder
					resume={openedResume}
					closeResume={()=>setOpenedResume(null)}/>
				:
				<div className='flex flex-col items-center justify-center'>
					<p>Select a resume:</p>
					<ul>
						{savedResumes ? (
							savedResumes.map((resume, index) => (
								<li key={index}>
									<button
										className="bg-white text-black"
										onClick={() => {
										setOpenedResume(resume)
									}}>
										{resume.label}
									</button>
									<button
										onClick={()=> {
											deleteResume(resume.resume_id);
										}}>
										🗑️
									</button>
								</li>
							))
							):(
							<p className="text-red-400 text-lg font-semibold">
								Coud not load resumes 😟
							</p>
						)}
					</ul>
					<div>
						<p>Create New</p>
						<button
							className="bg-white text-black"
							onClick={async ()=>{
								setOpenedResume(await assembleNewResume())
							}}
							>
							Create New Resume
						</button>
					</div>
				</div>
			}
		</>
	);
}

export default ResumeManager;
