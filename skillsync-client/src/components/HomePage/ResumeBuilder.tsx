import React, { useState, useEffect, } from 'react'
import { Resume, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, } from '../../types/types';
import { GetProfileInfo } from '../../supabase/ProfileInfo';
import { GetWorkExperiences } from '../../supabase/WorkExperience';
import supabase from '../../supabase/supabaseClient';
import { GetUserId } from '../../supabase/GetUserId';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type SyncStatus = 'good' | 'loading' | 'failed';

async function syncResume(resume:Resume, setSyncStatus:React.Dispatch<React.SetStateAction<SyncStatus>>):Promise<boolean>
{
	const {
		label,
		full_name,
		phone_number,
		email,
		personal_website,
		linkedin,
		github,
		education,
		experience,
		projects,
		technical_skills,
	} = resume;

	setSyncStatus('loading');
	try
	{
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



/*
 * Saves the Resume Preview as a pdf
 */
async function saveAsPdf():Promise<boolean> {
	const resume_div = document.getElementById('ResumePreview');
	if (!resume_div) { return false; }
	const canvas = await html2canvas(resume_div, { scale: 2 });
	const img_data = canvas.toDataURL('image/png');

	const pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'pt',
		format: [612, 792], // 8.5x11 inches in points (72pt per inch)
	});

	const pdf_width = pdf.internal.pageSize.getWidth();
	const pdf_height = pdf.internal.pageSize.getHeight();

	pdf.addImage(img_data, 'PNG', 0, 0, pdf_width, pdf_height);
	pdf.save('resume.pdf');

	return true;
}

function PreviewResume({ label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills }: Resume) {

	// Properly formats the nested arrays in a highlights section :D
	interface NestedStringArrayProps { highlights:string[]; };
	function DisplayHighlights({ highlights }:NestedStringArrayProps):React.JSX.Element
	{
		let jsx_points:React.JSX.Element[] = [];
		for (const hi of highlights)
		{
			jsx_points.push(<li key={jsx_points.length} className="">{hi}</li>);
		}
		return <ul className="list-disc list-inside ml-[0.15in]">{jsx_points}</ul>;
	}
	
	return (
		<div className="h-full">
			<div id="ResumePreview" className="!w-[8.5in] !h-[11in] p-[0.5in] bg-white text-left text-black font-serif text-[11px]">
				<h1 className="text-center text-[17px]">{full_name}</h1>
				<h4 className="text-center underline">{phone_number} {email} {personal_website} {linkedin} {github}</h4>
				<h2 className="underline">EDUCATION</h2>
				{education.map((ed, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<p className="font-semibold">{ed.institution}</p>
						<p className="italic font-light">{ed.degree}</p>
						<p>{ed.end_date}</p>
						<DisplayHighlights highlights={ed.highlights} />
					</div>
				))}
				<h2 className="underline">EXPERIENCE</h2>
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
						<p>{pj.github_url}</p>
						<p>{pj.technologies}</p>
						<p>{pj.start_day}</p>
						<p>{pj.end_day}</p>
						<DisplayHighlights highlights={pj.highlights} />
					</div>
				))}
				<h2>TECHNICAL SKILLS</h2>
				{technical_skills.map( (skl, index:number) => (
					<p key={index}><strong>{skl.category}: </strong>{skl.skills}</p>
				))}
			</div>
	</div>
	);
}

// This ugly line is just to type the 3 million props for EditResume
interface EditResumeProps { setLabel: React.Dispatch<React.SetStateAction<string>>; setFullName: React.Dispatch<React.SetStateAction<string>>; setPhoneNumber: React.Dispatch<React.SetStateAction<string>>; setEmail: React.Dispatch<React.SetStateAction<string>>; setPersonalWebsite: React.Dispatch<React.SetStateAction<string>>; setLinkedin: React.Dispatch<React.SetStateAction<string>>; setGithub: React.Dispatch<React.SetStateAction<string>>; setEducation: React.Dispatch<React.SetStateAction<EducationSection[]>>; setExperience: React.Dispatch<React.SetStateAction<ExperienceSection[]>>; setProjects: React.Dispatch<React.SetStateAction<ProjectsSection[]>>; setTechnicalSkills: React.Dispatch<React.SetStateAction<SkillsSection[]>>; label: string; full_name: string; phone_number: string; email: string; personal_website: string; linkedin: string; github: string; education: EducationSection[]; experience: ExperienceSection[]; projects: ProjectsSection[]; technical_skills: SkillsSection[]; }

function EditResume({setLabel, setFullName, setPhoneNumber, setEmail, setPersonalWebsite, setLinkedin, setGithub, setEducation, setExperience, setProjects, setTechnicalSkills,
                     label   , full_name  , phone_number  , email   , personal_website  , linkedin   , github   , education   , experience,    projects   , technical_skills  , }:EditResumeProps):React.JSX.Element {

	return(
		<div className="text-left text-black">
			<div id="resumeInfo" className="m-4">
				<h3>Resume Label:</h3>
				<input
					placeholder='label'
					onChange={(e) => setLabel(e.target.value)}
					value={label}/>
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
				{education.map( (edu, index) => (
					<div key={index}>
						<input
							placeholder='Institution'
							onChange={(e) => {
								// Here we create our new education object then
								// create a copy of the old education array and
								// replace the old index with our new one.
								// ** We use [...education] to make a new array
								//    so that react detects the state change **
								const new_edu:EducationSection = { ...edu, institution: e.target.value };
								let new_edus:EducationSection[] = [...education];
								new_edus[index] = new_edu;
								setEducation(new_edus);
							}}
							value={edu.institution}/>
						<input
							placeholder='Degree'
							onChange={(e) => {
								const new_edu:EducationSection = { ...edu, degree: e.target.value };
								const new_edus:EducationSection[] = [...education];
								new_edus[index] = new_edu;
								setEducation(new_edus);
							}}
							value={edu.degree}/>
						<input
							placeholder='Grad Date'
							onChange={(e) => {
								const new_edu:EducationSection = { ...edu, end_date: e.target.value };
								const new_edus:EducationSection[] = [...education];
								new_edus[index] = new_edu;
								setEducation(new_edus);
							}}
							value={edu.end_date}/>
						{edu.highlights.map( (hi:string, hi_index:number) => (
							<div key={hi_index}>
								<input
									placeholder="Highlight"
									onChange={(e) => {
										let new_highlights:string[] = [...edu.highlights];
										new_highlights[hi_index] = e.target.value;
										const new_edu:EducationSection = {...edu, highlights: new_highlights };
										const new_edus:EducationSection[] = [...education];
										new_edus[index] = new_edu;
										setEducation(new_edus);
									}}
									value={hi}/>
							</div>
						))}
						<button
							onClick={() => {
								const new_highlights:string[] = [...edu.highlights, ""];
								const new_edu:EducationSection = { ...edu, highlights: new_highlights };
								const new_edus:EducationSection[] = [...education];
								new_edus[index] = new_edu;
								setEducation(new_edus);
							}}>
							Add highlight
						</button>
					</div>
				))}
				<button
					onClick={() => {
						const new_edu:EducationSection = { institution:"Institution", degree:"Degree", end_date:"expected 2024", highlights:[] };
						const new_edus:EducationSection[] = [...education, new_edu];
						setEducation(new_edus);
					}}>
					Add education section
				</button>
				<h3 className="text-white">EXPERIENCE:</h3>
				{experience.map( (exp, index) => (
					<div key={index}>
						<input
							placeholder="Job Title"
							onChange={(e) => {
								const new_exp:ExperienceSection = { ...exp, job_title: e.target.value };
								let new_exps:ExperienceSection[] = [...experience];
								new_exps[index] = new_exp;
								setExperience(new_exps);
							}}
							value={exp.job_title}/>
						<input
							placeholder="Compnay"
							onChange={(e) => {
								const new_exp:ExperienceSection = { ...exp, company: e.target.value };
								let new_exps:ExperienceSection[] = [...experience];
								new_exps[index] = new_exp;
								setExperience(new_exps);				
							}}
							value={exp.company}/>
						<input
							placeholder="Start date"
							onChange={(e) => {
								const new_exp:ExperienceSection = { ...exp, start_day: e.target.value };
								let new_exps:ExperienceSection[] = [...experience];
								new_exps[index] = new_exp;
								setExperience(new_exps);				
							}}
							value={exp.start_day}/>
						<input
							placeholder="End date"
							onChange={(e) => {
								const new_exp:ExperienceSection = { ...exp, end_day: e.target.value };
								let new_exps:ExperienceSection[] = [...experience];
								new_exps[index] = new_exp;
								setExperience(new_exps);				
							}}
							value={exp.end_day}/>
						{exp.highlights.map( (hi:string, hi_index:number) => (
							<div key={hi_index}>
								<input
									placeholder="Highlight"
									onChange={(e) => {
										let new_highlights:string[] = [...exp.highlights];
										new_highlights[hi_index] = e.target.value;
										const new_exp:ExperienceSection= {...exp, highlights: new_highlights };
										const new_exps:ExperienceSection[] = [...experience];
										new_exps[index] = new_exp;
										setExperience(new_exps);
									}}
									value={hi}/>
							</div>
						))}
						<button
							onClick={() => {
								const new_highlights:string[] = [...exp.highlights, ""];
								const new_exp:ExperienceSection = { ...exp, highlights: new_highlights };
								const new_exps:ExperienceSection[] = [...experience];
								new_exps[index] = new_exp;
								setExperience(new_exps);
							}}>
							Add highlight
						</button>
					</div>
				))}
				<button
					onClick={() => {
						const new_exp:ExperienceSection= { job_title:"Job Title", company:"Company", location:"Location", start_day:"2023", end_day:"2024", highlights:[] };
						const new_exps:ExperienceSection[] = [...experience, new_exp];
						setExperience(new_exps);
					}}>
					Add experience section
				</button>

				<h3 className="text-white">PROJECTS:</h3>
				{projects.map( (prj, index) => (
					<div key={index}>
						<input
							placeholder='Name'
							onChange={(e) => {
								const new_prj:ProjectsSection = { ...prj, name: e.target.value };
								let new_prjs:ProjectsSection[] = [...projects];
								new_prjs[index] = new_prj;
								setProjects(new_prjs);
							}}
							value={prj.name}/>
						<input/>
						<input
							placeholder='Github URL'
							onChange={(e) => {
								const new_prj:ProjectsSection = { ...prj, github_url: e.target.value };
								let new_prjs:ProjectsSection[] = [...projects];
								new_prjs[index] = new_prj;
								setProjects(new_prjs);
							}}
							value={prj.github_url}/>
						<input
							placeholder='Start date'
							onChange={(e) => {
								const new_prj:ProjectsSection = {...prj, technologies: e.target.value };
								let new_prjs:ProjectsSection[] = [...projects];
								new_prjs[index] = new_prj;
								setProjects(new_prjs);
							}}
							value={prj.technologies}/>
						<input
							placeholder='Start date'
							onChange={(e) => {
								const new_prj:ProjectsSection = {...prj, start_day: e.target.value };
								let new_prjs:ProjectsSection[] = [...projects];
								new_prjs[index] = new_prj;
								setProjects(new_prjs);
							}}
							value={prj.start_day}/>
						<input
							placeholder='End date'
							onChange={(e) => {
								const new_prj:ProjectsSection = {...prj, end_day: e.target.value };
								let new_prjs:ProjectsSection[] = [...projects];
								new_prjs[index] = new_prj;
								setProjects(new_prjs);
							}}
							value={prj.end_day}/>
							{prj.highlights.map( (hi:string, hi_index:number) => (
								<div key={hi_index}>
									<input
										placeholder="Highlight"
										onChange={(e) => {
											let new_highlights:string[] = [...prj.highlights];
											new_highlights[hi_index] = e.target.value;
											const new_prj:ProjectsSection= {...prj, highlights: new_highlights };
											const new_prjs:ProjectsSection[] = [...projects];
											new_prjs[index] = new_prj;
											setProjects(new_prjs);
										}}
										value={hi}/>
								</div>
							))}
							<button
								onClick={() => {
									const new_highlights:string[] = [...prj.highlights, ""];
									const new_prj:ProjectsSection= { ...prj, highlights: new_highlights };
									const new_prjs:ProjectsSection[] = [...projects];
									new_prjs[index] = new_prj;
									setProjects(new_prjs);
								}}>
								Add highlight
							</button>
						</div>
					))}
					<button onClick={() => {
						const new_prj:ProjectsSection = { name:"Project", github_url:"https://github.com/", technologies:"JavaScript, OpenAI, Redux", start_day:"Feb 2020", end_day:"Jan 2024", highlights: [] };
						let new_prjs:ProjectsSection[] = [...projects, new_prj];
						setProjects(new_prjs);
					}}>
						Add project
					</button>
				<h3>TECHNICAL SKILLS:</h3>
				{technical_skills.map( (skl, index:number) => (
					<div key={index}>
						<input
							placeholder='Category'
							onChange={(e) => {
								const new_skl:SkillsSection = { category: e.target.value, skills: skl.skills };
								const new_sklls:SkillsSection[] = [...technical_skills];
								new_sklls[index] = new_skl;
								setTechnicalSkills(new_sklls);
							}}
							value={skl.category}/>
						<input
							placeholder='Skills'
							onChange={(e) => {
								const new_skl:SkillsSection = { category: skl.category, skills: e.target.value };
								const new_sklls:SkillsSection[] = [...technical_skills];
								new_sklls[index] = new_skl;
								setTechnicalSkills(new_sklls);
							}}/>
					</div>
				))}
				<button
					onClick={() => {
						const new_skill:SkillsSection = { category:"Category", skills:""}
						setTechnicalSkills([...technical_skills, new_skill]);
					}}>
					Add Category
				</button>
				</div>
			</div>
		);
}

function ResumeBuilder() {
	type SyncStatus = 'good' | 'loading' | 'failed';
	const [sync_status, setSyncStatus] = useState<SyncStatus>('good');
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

	useEffect( () => {
		async function doAsync()
		{
			const resume = { label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills };
			syncResume(resume, setSyncStatus);
		}

		doAsync();
	}, [label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills]);

	return (
		<div className="min-h-screen w-full">
			<div className="flex justify-around">
				<p className="text-center mt-4">Sync Status: {sync_status}</p>
				<button onClick={()=>saveAsPdf()}>Save Resume</button>
			</div>
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

