import React, { useState, useEffect, } from 'react'
import { Resume, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, } from '../../types/types';
import { GetProfileInfo } from '../../supabase/ProfileInfo';
import { GetWorkExperiences } from '../../supabase/WorkExperience';
import supabase from '../../supabase/supabaseClient';
import { GetUserId } from '../../supabase/GetUserId';
import PreviewResume from './PreviewResume';
import EditResume from './EditResume';

// When blocked will not attempt to sync. Used so
// we dont sync values before they are loaded.
type SyncStatus = 'good' | 'loading' | 'blocked' | 'failed';

/*
 * Tries to load the user's saved resume. If
 * none is found will call assembleResume() 
 * and return that resume instead.
 */
async function loadResume():Promise<Resume>
{
	try {
		const { data, error } = await supabase
			.from('resume_builder')
			.select('*')
			.eq('id', await GetUserId())
			.single();
		
		if (error) { throw Error(error.message); }

		return data as Resume;
	} catch (error) {
		console.warn('Did not fin a saved resume');
		return await assembleResume();
	}
}



/*
 * Upserts resume data to Supabase using user id.
 * and updates sync_status accordingly.
 */
async function syncResume(resume:Resume, sync_status:SyncStatus, setSyncStatus:React.Dispatch<React.SetStateAction<SyncStatus>>):Promise<boolean>
{
	if (sync_status === 'blocked') { return false; }

	const { label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills, } = resume;

	setSyncStatus('loading');

	try {
		const { error } = await supabase
			.from('resume_builder')
			.upsert(
				{ id: await GetUserId(), label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills, },
				{ onConflict: 'id'}
			)
			.select('id');
		if (error) { throw Error(error.message); }
		setSyncStatus('good');
		return true;
	} catch(error) 
	{
		console.warn("Error syncing resume - " + error);
		setSyncStatus('failed');
		return false;
	}
}



/*
 * Fetches user data and formats it into a Resume object.
 */
async function assembleResume(): Promise<Resume> {
	/*
	 * Start Helper functions:
	 */
	// Returns the month abbr and year like: "Jun 2024"
	function DateToMonthYear(date_str:string): string
	{
		try {
			const date = new Date(date_str);
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			return months[date.getMonth()] + ' ' + date.getFullYear();	
		} catch {
			return "--- -"
		}
	}
	/*
	 * End helper functions
	 */

	try
	{
		const profile_data = await GetProfileInfo('name, last_name, phone_number, email, personal_website, linkedin, github, school, grad_year, program, specialization, location');
		if (profile_data === null) { throw Error('Could not fetch profile'); }
		const work_data = await GetWorkExperiences();
		if (work_data === null) { throw Error('Could not get work_data'); }

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
		for (let e of work_data)
		{
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
			label: 'default_resume',
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
	catch (error)
	{
		console.warn('Error arranging resume info - ' + error)
		return {
			label: 'template_resume',
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



function ResumeBuilder() {
	const [sync_status, setSyncStatus] = useState<SyncStatus>('blocked');
	const [label, setLabel] = useState<string>('');
	const [full_name, setFullName] = useState<string>('');
	const [phone_number, setPhoneNumber] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [personal_website, setPersonalWebsite] = useState<string>('');
	const [linkedin, setLinkedin] = useState<string>('');
	const [github, setGithub] = useState<string>('');
	const [education, setEducation] = useState<EducationSection[]>([]);
	const [experience, setExperience] = useState<ExperienceSection[]>([]);
	const [projects, setProjects] = useState<ProjectsSection[]>([]);
	const [technical_skills, setTechnicalSkills] = useState<SkillsSection[]>([]);

	useEffect( () =>
	{
		async function doAsync()
		{
			const resume:Resume = await loadResume();
			setLabel(resume.label);
			setFullName(resume.full_name);
			setPhoneNumber(resume.phone_number);
			setEmail(resume.email);
			setPersonalWebsite(resume.personal_website);
			setLinkedin(resume.linkedin);
			setGithub(resume.github);
			setEducation(resume.education);
			setExperience(resume.experience);
			setProjects(resume.projects);
			setTechnicalSkills(resume.technical_skills);

			setSyncStatus('good');
		}

		doAsync();
		
	}, []);

	useEffect( () => {
		async function doAsync()
		{
			const resume = { label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills };
			syncResume(resume, sync_status, setSyncStatus);
		}

		doAsync();
	}, [label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills]);

	return (
		<div className="min-h-screen w-full">
			<p className="text-center mt-4">Sync Status: {sync_status}</p>
			<div className="h-screen w-full flex">
				<div className="box-border w-[50%] text-center m-4 border border-white">
					<h1 className="m-4">Edit</h1>
					<EditResume
						setLabel={setLabel} label={label}
						setFullName={setFullName} full_name={full_name}
						setPhoneNumber={setPhoneNumber} phone_number={phone_number}
						setEmail={setEmail} email={email}
						setPersonalWebsite={setPersonalWebsite} personal_website={personal_website}
						setLinkedin={setLinkedin} linkedin={linkedin}
						setGithub={setGithub} github={github}
						setEducation={setEducation} education={education}
						setExperience={setExperience} experience={experience}
						setProjects={setProjects} projects={projects}
						setTechnicalSkills={setTechnicalSkills} technical_skills={technical_skills}
						/>
				</div>
				<div className="box-border w-[50%] text-center m-4 border border-white">
					<h1 className="m-4">{label}</h1>
					<div className="h-full w-full bg-yellow-300">
						<PreviewResume 
							label={label}
							full_name={full_name}
							phone_number={phone_number}
							email={email}
							personal_website={personal_website}
							linkedin={linkedin}
							github={github}
							education={education}
							experience={experience}
							projects={projects}
							technical_skills={technical_skills}
							/>
						</div>
				</div>
			</div>
		</div>
	);
};

export default ResumeBuilder;

