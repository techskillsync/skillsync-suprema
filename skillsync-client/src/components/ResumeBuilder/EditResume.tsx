import React from 'react';
import supabase from '../../supabase/supabaseClient';
import { EducationSection, ExperienceSection, ProjectsSection, SkillsSection } from '../../types/types';
import axios from 'axios';
import './StyleEditResume.css';

async function simpleGPT(messages:Array<Object>):Promise<string>
{
	try {
		const access_token = (await supabase.auth.getSession()).data.session?.access_token;
		if (!access_token) { throw Error('Could not get access token'); }

		const new_hi = await axios.post(
			'https://gpt-broker.skillsync.work/advanced-gpt-4o-mini-complete',
			messages,
			{
				headers: { Authorization:`Bearer ${access_token}` },
			}
		);

		if (typeof new_hi.data !== 'string') { throw Error('New highlight must be a string'); }

		return new_hi.data;
	} catch (error) {
		console.log(error);
		console.warn('Error generating education GPT highlights');
		return '';
	}
}

/*
 * Uses ChatGPT to generate a new highlight for education section
 */
async function genEducationGptHighlight(edu:EducationSection):Promise<string>
{
	let user_highlights = " Some of my highlights are: ";
	for (const hi of edu.highlights) {
		user_highlights + ', ' + hi;
	}
	
	const messages = [ {role:'system', content:"Using the name of this person's university/college, their degree, and highlights, can you generate a new highlight. You answer must be a single bullet point and it must mention a specific thing that would fit on their resume. Do not add any indents at the start Do not add any dashes or spaces at the start."},
	                   {role:'user'  , content:`I went to ${edu.institution} in ${edu.location}, with a ${edu.degree}. ${user_highlights}`}];

	const new_hi = await simpleGPT(messages);
	return new_hi;
}

/*
 * Uses ChatGPT to generate a new highlight for an experience section.
 */
async function genExperienceGptHighlight(exp:ExperienceSection):Promise<string>
{
	let user_highlights = "The highlights from this job are: ";
	for (const hi of exp.highlights) {
		user_highlights + ', ' + hi;
	}
	const messages = [ {role:"system", content:"Using this persons job title, company name and job highlights can you come up with a new unique highlight. Your answer should have wording like a bullet point but it must not have a dash or any leading punctuation."},
	                   {role:"user"  , content:`My job title was ${exp.job_title} and I worked at ${exp.company}. ${user_highlights}`}];
	const new_hi = await simpleGPT(messages);
	return new_hi;
}

/*
 * Uses ChatGPT to generate a new highlight for a projects section.
 */
async function genProjectGptHighlight(prj:ProjectsSection):Promise<string>
{
	let user_highlights = "My projects highlights are: " + prj.highlights.join(', ');
	const messages = [ {role:"system", content:"Using the name of this project, the technologies it uses, and some highlight about the project come up with a new unique highlight. It should be written like a bullet point but it should not have a leading dash or whitespace."},
	                   {role:"user"  , content:`My project ${prj.name} used: ${prj.technologies}. ${user_highlights}`} ];
	const new_hi = await simpleGPT(messages);
	return new_hi;
}

async function genSkillSection(skills:SkillsSection[], exp:ExperienceSection[], prj:ProjectsSection[], edu:EducationSection[]):Promise<SkillsSection>
{
	let past_skills = '';
	for (const sk of skills) {
		past_skills += sk.category + ', ';
	}
	let past_edu = '';
	for (const e of edu) {
		past_edu += e.degree + ', ';
	}
	let past_exp = '';
	for (const ex of exp) {
		past_exp += ex.job_title + ', ';
	}
	let past_prj = '';
	for (const p of prj) {
		past_prj += p.technologies + ', ';
	}
	
	const messages = [ {role:"system", content:"Generate a single category of skills. You answer must be a single word. For example if the user says they are a programmer a skills category could be 'languages' or 'framewokrs'"},
	                   {role:"user"  , content:`I already put these categories in my resume so yours must be different. ${past_skills}`},
	                   {role:"user"  , content:`Please base the new category on this information: ${past_edu}, ${past_exp}, ${past_prj} `}]
	const category = await simpleGPT(messages);
	const messages_2= [ {role:"system", content:`Generate a list of 4-6 skills that are applicable to ${category}. Your answer must be a string of keywords seperated by commas with no other punctuation`}]
	const new_skill = await simpleGPT(messages_2);
	return { category, skills:new_skill };
}

// This ugly line is just to type the 3 million props for EditResume
interface EditResumeProps { setLabel: React.Dispatch<React.SetStateAction<string>>; setFullName: React.Dispatch<React.SetStateAction<string>>; setPhoneNumber: React.Dispatch<React.SetStateAction<string>>; setEmail: React.Dispatch<React.SetStateAction<string>>; setPersonalWebsite: React.Dispatch<React.SetStateAction<string>>; setLinkedin: React.Dispatch<React.SetStateAction<string>>; setGithub: React.Dispatch<React.SetStateAction<string>>; setEducation: React.Dispatch<React.SetStateAction<EducationSection[]>>; setExperience: React.Dispatch<React.SetStateAction<ExperienceSection[]>>; setProjects: React.Dispatch<React.SetStateAction<ProjectsSection[]>>; setTechnicalSkills: React.Dispatch<React.SetStateAction<SkillsSection[]>>; label: string; full_name: string; phone_number: string; email: string; personal_website: string; linkedin: string; github: string; education: EducationSection[]; experience: ExperienceSection[]; projects: ProjectsSection[]; technical_skills: SkillsSection[]; }

function EditResume({setLabel, setFullName, setPhoneNumber, setEmail, setPersonalWebsite, setLinkedin, setGithub, setEducation, setExperience, setProjects, setTechnicalSkills,
                     label   , full_name  , phone_number  , email   , personal_website  , linkedin   , github   , education   , experience,    projects   , technical_skills  , }:EditResumeProps):React.JSX.Element {

	return(
		<div className="h-full w-full px-[5%] text-left text-black overflow-y-scroll">
			<div id="resumeInfo" className="m-4 pb-32">
				<div className="flex flex-col">
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
				</div>
				<h3>EDUCATION:</h3>
				{education.map( (edu, index) => (
					<div key={index} className="flex flex-col mb-4">
						<div className="w-full h-full flex">
							<input
								className="flex-grow"
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
							<button
								className="bg-black p-0 px-4 hover:bg-slate-800 text-2xl"
								onClick={() => {
									const new_educations = [...education];
									new_educations.splice(index, 1);
									setEducation(new_educations);
								}}>
								❌
							</button>
						</div>
						<input
							placeholder='input'
							onChange={(e) => {
								const new_edu:EducationSection = { ...edu, location: e.target.value };
								const new_edus:EducationSection[] = [...education];
								new_edus[index] = new_edu;
								setEducation(new_edus);
							}}
							value={edu.location}/>
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
							<div key={hi_index} className="flex my-2">
								<textarea
									className="flex-grow bg-black h-auto text-white"
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
								<button
									className="bg-black p-0 px-4 text-xl hover:bg-slate-800"
									onClick={() => {
										let new_highlights:string[] = [...edu.highlights];
										new_highlights.splice(hi_index, 1);
										const new_edu:EducationSection = {...edu, highlights: new_highlights };
										const new_edus:EducationSection[] = [...education];
										new_edus[index] = new_edu;
										setEducation(new_edus);
 								}}>
									🗑️
								</button>
							</div>
						))}
						<div className="flex w-full mt-2">
							<button
								className="mr-2 flex-grow bg-black border-2 border-slate-700 hover:bg-slate-800 text-white"
								onClick={() => {
									const new_highlights:string[] = [...edu.highlights, ""];
									const new_edu:EducationSection = { ...edu, highlights: new_highlights };
									const new_edus:EducationSection[] = [...education];
									new_edus[index] = new_edu;
									setEducation(new_edus);
								}}>
								+ Highlight
							</button>
							<button
								className="ml-2 flex-grow bg-green-500 hover:bg-green-400"
								onClick={async ()=> {
									const new_hi = await genEducationGptHighlight(edu);
									const new_highlights:string[] = [...edu.highlights, new_hi];
									const new_edu:EducationSection = { ...edu, highlights: new_highlights };
									const new_edus:EducationSection[] = [...education];
									new_edus[index] = new_edu;
									setEducation(new_edus);
								}}>
								+ GPT Hightlight 🪄
							</button>
						</div>
					</div>
				))}
				<button
					className="bg-black text-white my-4 w-full border-2 border-slate-700 hover:bg-slate-800 p-1"
					onClick={() => {
						const new_edu:EducationSection = { institution:"Institution", location:"NY, USA", degree:"Degree", end_date:"expected 2024", highlights:[] };
						const new_edus:EducationSection[] = [...education, new_edu];
						setEducation(new_edus);
					}}>
					+ Education section
				</button>
				<h3>EXPERIENCE:</h3>
				{experience.map( (exp, index) => (
					<div key={index} className="flex flex-col mb-4">
						<div className="w-full h-full flex">
							<input
								className="flex-grow"
								placeholder="Job Title"
								onChange={(e) => {
									const new_exp:ExperienceSection = { ...exp, job_title: e.target.value };
									let new_exps:ExperienceSection[] = [...experience];
									new_exps[index] = new_exp;
									setExperience(new_exps);
								}}
								value={exp.job_title}/>
							<button
								className="bg-black p-0 px-4 hover:bg-slate-800 text-2xl"
								onClick={() => {
									const new_experiences = [...experience];
									new_experiences.splice(index, 1);
									setExperience(new_experiences);
								}}>
								❌
							</button>
						</div>
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
							<div key={hi_index} className="flex my-2">
								<textarea
									className="flex-grow bg-black h-auto text-white"
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
								<button
									className="bg-black p-0 px-4 text-xl hover:bg-slate-800"
									onClick={() => {
										let new_highlights:string[] = [...exp.highlights];
										new_highlights.splice(hi_index, 1);
										const new_edu:ExperienceSection= {...exp, highlights: new_highlights };
										const new_exps:ExperienceSection[] = [...experience];
										new_exps[index] = new_edu;
										setExperience(new_exps);
 								}}>
									🗑️
								</button>

							</div>
						))}
						<div className="flex w-full mt-2">
							<button
								className="mr-2 flex-grow bg-black border-2 border-slate-700 hover:bg-slate-800 text-white"
 								onClick={() => {
									const new_highlights:string[] = [...exp.highlights, ""];
									const new_exp:ExperienceSection = { ...exp, highlights: new_highlights };
									const new_exps:ExperienceSection[] = [...experience];
									new_exps[index] = new_exp;
									setExperience(new_exps);
								}}>
								Add highlight
							</button>
							<button
								className="ml-2 flex-grow bg-green-500 hover:bg-green-400"
								onClick={async () => {
									const new_hi = await genExperienceGptHighlight(exp);
									const new_highlights:string[] = [...exp.highlights, new_hi];
									const new_exp:ExperienceSection = { ...exp, highlights: new_highlights };
									const new_exps:ExperienceSection[] = [...experience];
									new_exps[index] = new_exp;
									setExperience(new_exps);
								}}>
								Add GPT Generated highlight 🪄
							</button>
						</div>
					</div>
				))}
				<button
					className="bg-black text-white my-4 w-full border-2 border-slate-700 hover:bg-slate-800 p-1"
					onClick={() => {
						const new_exp:ExperienceSection= { job_title:"Job Title", company:"Company", location:"Location", start_day:"2023", end_day:"2024", highlights:[] };
						const new_exps:ExperienceSection[] = [...experience, new_exp];
						setExperience(new_exps);
					}}>
					+ Experience section
				</button>

				<h3 className="text-white">PROJECTS:</h3>
				{projects.map( (prj, index) => (
					<div key={index} className="flex flex-col mb-4">
						<div className="w-full h-full flex">
							<input
								className="flex-grow"
								placeholder='Name'
								onChange={(e) => {
									const new_prj:ProjectsSection = { ...prj, name: e.target.value };
									let new_prjs:ProjectsSection[] = [...projects];
									new_prjs[index] = new_prj;
									setProjects(new_prjs);
								}}
								value={prj.name}/>
							<button
								className="bg-black p-0 px-4 hover:bg-slate text-2xl"
								onClick={() => {
									const new_projects = [...projects];
									new_projects.splice(index, 1);
									setProjects(new_projects);
								}}>
								❌
							</button>
						</div>
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
								<div key={hi_index} className="flex my-2">
									<textarea
										className="flex-grow bg-black h-auto text-white"
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
									<button
										className="bg-black p-0 px-4 text-xl hover:bg-slate-800"
										onClick={() => {
										let new_highlights:string[] = [...prj.highlights];
										new_highlights.splice(hi_index, 1);
										const new_prj:ProjectsSection= {...prj, highlights: new_highlights };
										const new_prjs:ProjectsSection[] = [...projects];
										new_prjs[index] = new_prj;
										setProjects(new_prjs);
 									}}>
										🗑️
									</button>
								</div>
							))}
							<div className="flex w-full">
								<button
									className="mr-2 flex-grow bg-black border-2 border-slate-700 hover:bg-slate-800 text-white"
									onClick={() => {
										const new_highlights:string[] = [...prj.highlights, ""];
										const new_prj:ProjectsSection= { ...prj, highlights: new_highlights };
										const new_prjs:ProjectsSection[] = [...projects];
										new_prjs[index] = new_prj;
										setProjects(new_prjs);
									}}>
									Add highlight
								</button>
								<button
									className="ml-2 flex-grow bg-green-500 hover:bg-green-400"
									onClick={async()=> {
										const new_hi = await genProjectGptHighlight(prj);
										const new_highlights:string[] = [...prj.highlights, new_hi];
										const new_prj:ProjectsSection = {...prj, highlights:new_highlights};
										const new_prjs:ProjectsSection[] = [...projects];
										new_prjs[index] = new_prj;
										setProjects(new_prjs);
									}}>
									Add GPT Generated highlight 🪄
								</button>
							</div>
						</div>
					))}
					<button
						className="bg-black text-white my-4 w-full border-2 border-slate-700 hover:bg-slate-800 p-1"
						onClick={() => {
						const new_prj:ProjectsSection = { name:"Project", github_url:"https://github.com/", technologies:"JavaScript, OpenAI, Redux", start_day:"Feb 2020", end_day:"Jan 2024", highlights: [] };
						let new_prjs:ProjectsSection[] = [...projects, new_prj];
						setProjects(new_prjs);
					}}>
						Add project
					</button>
				<h3 className="text-white">TECHNICAL SKILLS:</h3>
				{technical_skills.map( (skl, index:number) => (
					<div key={index} className="flex flex-col mb-4">
						<input
							placeholder='Category'
							onChange={(e) => {
								const new_skl:SkillsSection = { category: e.target.value, skills: skl.skills };
								const new_sklls:SkillsSection[] = [...technical_skills];
								new_sklls[index] = new_skl;
								setTechnicalSkills(new_sklls);
							}}
							value={skl.category}/>
						<div className="w-full h-full flex">
							<textarea
								className="flex-grow bg-black text-white"
								placeholder='Skills'
								onChange={(e) => {
									const new_skl:SkillsSection = { category: skl.category, skills: e.target.value };
									const new_sklls:SkillsSection[] = [...technical_skills];
									new_sklls[index] = new_skl;
									setTechnicalSkills(new_sklls);
								}}
								value={skl.skills}/>
							<button
								className="bg-black p-0 px-4 text-xl hover:bg-slate-800"
								onClick={() => {
								const new_skills:SkillsSection[] = [...technical_skills];
								new_skills.splice(index, 1);
								setTechnicalSkills(new_skills);
							}}>
								🗑️
							</button>
						</div>
					</div>
				))}
				<div className="flex w-full">
					<button
						className="mr-2 flex-grow bg-black border-2 border-slate-700 hover:bg-slate-800 text-white"
						onClick={() => {
							const new_skill:SkillsSection = { category:"Category", skills:""}
							setTechnicalSkills([...technical_skills, new_skill]);
						}}>
						+ Category
					</button>
					<button
						className="ml-2 flex-grow bg-green-500 hover:bg-green-400"
						onClick={async () => {
							const new_skill = await genSkillSection(technical_skills, experience, projects, education);
							setTechnicalSkills([...technical_skills, new_skill]);
						}}>
						+ GPT Generated Category 🪄
					</button>
				</div>
			</div>
		</div>
		);
}

export default EditResume;
