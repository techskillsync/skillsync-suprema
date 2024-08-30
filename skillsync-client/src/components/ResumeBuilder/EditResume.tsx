import React from 'react';
import { EducationSection, ExperienceSection, ProjectsSection, SkillsSection } from '../../types/types';

// This ugly line is just to type the 3 million props for EditResume
interface EditResumeProps { setLabel: React.Dispatch<React.SetStateAction<string>>; setFullName: React.Dispatch<React.SetStateAction<string>>; setPhoneNumber: React.Dispatch<React.SetStateAction<string>>; setEmail: React.Dispatch<React.SetStateAction<string>>; setPersonalWebsite: React.Dispatch<React.SetStateAction<string>>; setLinkedin: React.Dispatch<React.SetStateAction<string>>; setGithub: React.Dispatch<React.SetStateAction<string>>; setEducation: React.Dispatch<React.SetStateAction<EducationSection[]>>; setExperience: React.Dispatch<React.SetStateAction<ExperienceSection[]>>; setProjects: React.Dispatch<React.SetStateAction<ProjectsSection[]>>; setTechnicalSkills: React.Dispatch<React.SetStateAction<SkillsSection[]>>; label: string; full_name: string; phone_number: string; email: string; personal_website: string; linkedin: string; github: string; education: EducationSection[]; experience: ExperienceSection[]; projects: ProjectsSection[]; technical_skills: SkillsSection[]; }

function EditResume({setLabel, setFullName, setPhoneNumber, setEmail, setPersonalWebsite, setLinkedin, setGithub, setEducation, setExperience, setProjects, setTechnicalSkills,
                     label   , full_name  , phone_number  , email   , personal_website  , linkedin   , github   , education   , experience,    projects   , technical_skills  , }:EditResumeProps):React.JSX.Element {

	return(
		<div className="text-left text-black">
			<div id="resumeInfo" className="m-4">
				<h3 className="text-white">Resume Label:</h3>
				<input
					placeholder='label'
					onChange={(e) => setLabel(e.target.value)}
					value={label}/>
				<h3 className="text-white">Personal Info:</h3>
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
				<h3 className="text-white">EDUCATION:</h3>
				{education.map( (edu, index) => (
					<div key={index} className="flex flex-col my-4">
						<button
							onClick={() => {
								const new_educations = [...education];
								new_educations.splice(index, 1);
								setEducation(new_educations);
							}}>
							remove this section
						</button>
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
							<div key={hi_index}>
								<textarea
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
								<button onClick={() => {
										let new_highlights:string[] = [...edu.highlights];
										new_highlights.splice(hi_index, 1);
										const new_edu:EducationSection = {...edu, highlights: new_highlights };
										const new_edus:EducationSection[] = [...education];
										new_edus[index] = new_edu;
										setEducation(new_edus);
 								}}>
									rm
								</button>
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
						const new_edu:EducationSection = { institution:"Institution", location:"NY, USA", degree:"Degree", end_date:"expected 2024", highlights:[] };
						const new_edus:EducationSection[] = [...education, new_edu];
						setEducation(new_edus);
					}}>
					Add education section
				</button>
				<h3 className="text-white">EXPERIENCE:</h3>
				{experience.map( (exp, index) => (
					<div key={index} className="flex flex-col my-4">
						<button
							onClick={() => {
								const new_experiences = [...experience];
								new_experiences.splice(index, 1);
								setExperience(new_experiences);
							}}>
							rm experience
						</button>
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
								<textarea
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
								<button onClick={() => {
										let new_highlights:string[] = [...exp.highlights];
										new_highlights.splice(hi_index, 1);
										const new_edu:ExperienceSection= {...exp, highlights: new_highlights };
										const new_exps:ExperienceSection[] = [...experience];
										new_exps[index] = new_edu;
										setExperience(new_exps);
 								}}>
									rm
								</button>

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
					<div key={index} className="flex flex-col my-4">
						<button
							onClick={() => {
								const new_projects = [...projects];
								new_projects.splice(index, 1);
								setProjects(new_projects);
							}}>
							rm project
						</button>
						<input
							placeholder='Name'
							onChange={(e) => {
								const new_prj:ProjectsSection = { ...prj, name: e.target.value };
								let new_prjs:ProjectsSection[] = [...projects];
								new_prjs[index] = new_prj;
								setProjects(new_prjs);
							}}
							value={prj.name}/>
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
									<textarea
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
									<button onClick={() => {
										let new_highlights:string[] = [...prj.highlights];
										new_highlights.splice(hi_index, 1);
										const new_prj:ProjectsSection= {...prj, highlights: new_highlights };
										const new_prjs:ProjectsSection[] = [...projects];
										new_prjs[index] = new_prj;
										setProjects(new_prjs);
 									}}>
										rm
									</button>
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
				<h3 className="text-white">TECHNICAL SKILLS:</h3>
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
						<textarea
							placeholder='Skills'
							onChange={(e) => {
								const new_skl:SkillsSection = { category: skl.category, skills: e.target.value };
								const new_sklls:SkillsSection[] = [...technical_skills];
								new_sklls[index] = new_skl;
								setTechnicalSkills(new_sklls);
							}}
							value={skl.skills}/>
						<button onClick={() => {
							const new_skills:SkillsSection[] = [...technical_skills];
							new_skills.splice(index, 1);
							setTechnicalSkills(new_skills);
						}}>
							rm
						</button>
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

export default EditResume;
