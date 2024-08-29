import React, { useState, useEffect, JSXElementConstructor } from 'react'
import { Resume, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, NestedStringArray } from '../../types/types';
import { GetProfileInfo } from '../../supabase/ProfileInfo';
import { GetWorkExperiences } from '../../supabase/WorkExperience';

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
		const profile_data = await GetProfileInfo('name, last_name, phone_number, email, personal_website, linkedin, github, school, grad_year, program, specialization');
		if (profile_data === null) { throw Error('Could not fetch profile'); }
		const work_data = await GetWorkExperiences();
		if (work_data === null) { throw Error('Could not get work_data'); }

		let educations: EducationSection[] = [];
		let education: EducationSection = {
			institution: profile_data.school,
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
			technical_skills: {},
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
			technical_skills: {}
		}
	}

}

function PreviewResume({ label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills }: Resume) {

	// Properly formats the nested arrays in a highlights section :D
	interface NestedStringArrayProps { highlights:NestedStringArray; };
	function DisplayHighlights({ highlights }:NestedStringArrayProps):React.JSX.Element
	{
		let jsx_points:React.JSX.Element[] = [];
		for (const hi of highlights)
		{
			if (hi instanceof Array) {
				console.log("UNTESTED BEHAVIOUR, MAKE SURE THIS RECURSION WORKS!");
				jsx_points.push(<DisplayHighlights highlights={hi}/>);
			} else
			{
				jsx_points.push(<li key={jsx_points.length} className="">{hi}</li>);
			}
		}
		return <ul className="list-disc list-inside ml-[0.15in]">{jsx_points}</ul>;
	}
	
	return (
		<div className="relative h-full w-full">
			<div id="ResumePreview" className="!w-[8.5in] !h-[11in] p-[0.5in] bg-white text-left text-black font-serif text-[11px]">
				<h1 className="text-center text-[17px]">{full_name}</h1>
				<h4 className="text-center underline">{phone_number} {email} {personal_website} {linkedin} {github}</h4>
				<h2>EDUCATION</h2>
				<div id="line" className="w-full h-[1px] bg-black" />
				{education.map((ed, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<p className="font-semibold">{ed.institution}</p>
						<p className="italic font-light">{ed.degree}</p>
						<p>{ed.end_date}</p>
						<DisplayHighlights highlights={ed.highlights} />
					</div>
				))}
				<h2>EXPERIENCE</h2>
				<div id="line" className="w-full h-[1px] bg-black" />
				{experience.map( (ex, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<p className="font-semibold">{ex.job_title}</p>
						<p className="italic">{ex.company}</p>
						<p>{ex.start_day}</p>
						<p>{ex.end_day}</p>
						<DisplayHighlights highlights={ex.highlights} />
					</div>
				))}
				<h2>PROJECTS</h2>
				{projects.map( (pj, index:number) => (
					<div key={index}>
						<p>{pj.name}</p>
						<p>{pj.technologies}</p>
						<DisplayHighlights highlights={pj.highlights} />
					</div>
				))}
				<h2>TECHNICAL SKILLS</h2>
				{Object.entries(technical_skills).map(([category, skills]) => (
					<p key={category}><strong>{category}:</strong>{skills}</p>
				))}
			</div>
	</div>
	);
}

function EditResume({setLabel, setFullName, setPhoneNumber, setEmail, setPersonalWebsite, setLinkedin, setGithub, setEducation, setExperience, setProjects, setTechnicalSkills,
										 label   , full_name  , phone_number  , email   , personal_website  , linkedin   , github   , education   , experience,    projects   , technical_skills  , }) {
	return(
		<div className="text-left text-black">
			<div id="resumeInfo" className="m-4">
				<h3 className="text-white">Personal Info:</h3>
				<input
					placeholder='Full Name'
					onChange={(e) => setFullName(e.target.value)}
					value={full_name}/>
				<input
					placeholder='Phone Number'
					onChange={(e) => setPhoneNumber(e.target.value)}
					value={phone_number}/>
				<input
					placeholder='Email'
					onChange={(e) => setEmail(e.target.value)}
					value={email}/>
				<input
					placeholder='Website'
					onChange={(e) => setPersonalWebsite(e.target.value)}
					value={personal_website}/>
				<input
					placeholder='LinkedIn'
					onChange={(e) => setLinkedin(e.target.value)}
					value={linkedin}/>
				<input
					placeholder='Github'
					onChange={(e) => setGithub(e.target.value)}
					value={github}/>
				<h3 className="text-white">EDUCATION:</h3>
				<input
					placeholder='Institution'
					onChange={(e) => setEducation({...education, institution: e.target.value})}
					/>
			</div>
		</div>
	);
}

function ResumeBuilder() {
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
	const [technical_skills, setTechnicalSkills] = useState<SkillsSection>({});

	useEffect( () =>
	{
		async function doAsync()
		{
			const resume:Resume = await assembleResume();
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
		}

		doAsync();
		
	}, []);

	return (
		<div className="min-h-screen w-full">
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
					<h1 className="m-4">Preview</h1>
					<div className="h-full">
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

