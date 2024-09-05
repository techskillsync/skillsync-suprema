import React, { useState, useEffect, } from 'react'
import { Resume, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, } from '../../types/types';
import { GetProfileInfo } from '../../supabase/ProfileInfo';
import { GetWorkExperiences } from '../../supabase/WorkExperience';
import supabase from '../../supabase/supabaseClient';
import { GetUserId } from '../../supabase/GetUserId';
import PreviewResume from './PreviewResume';
import EditResume from './EditResume';
import { PiFiles } from "react-icons/pi";
// When blocked will not attempt to sync. Used so
// we dont sync values before they are loaded.
type SyncStatus = 'good' | 'loading' | 'blocked' | 'failed';



/*
 * Upsert resume data to Supabase using resume id.
 * and updates sync_status accordingly.
 */
async function syncResume(resume:Resume, sync_status:SyncStatus, setSyncStatus:React.Dispatch<React.SetStateAction<SyncStatus>>):Promise<boolean>
{
	if (sync_status === 'blocked') { return false; }

	const { label, resume_id, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills, } = resume;

	setSyncStatus('loading');

	try {
		const { error } = await supabase
			.from('resume_builder')
			.upsert(
				{ id: await GetUserId(), resume_id, label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills, },
				{ onConflict: 'resume_id'}
			)
			.select('resume_id');
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



type ResumeBuilderProps = { resume:Resume, closeResume:()=>void };
function ResumeBuilder({resume, closeResume}:ResumeBuilderProps) {
	const resume_id = resume.resume_id;
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
		
	}, []);

	useEffect( () => {
		async function doAsync()
		{
			const resume = { resume_id, label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills };
			syncResume(resume, sync_status, setSyncStatus);
		}

		doAsync();
	}, [label, full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills]);

	return (
		<div className="h-screen w-full bg-black flex flex-col ">
			<div className="h-20 flex-none flex">
				<button
					className="bg-black hover:bg-slate-800 text-white m-2 ml-4 p-0 px-2 rounded-2xl flex justify-center items-center"
					onClick={closeResume}>
					<PiFiles size="38" />
				</button>
				<input
					placeholder="Resume name"
					className="bg-black hover:bg-slate-800 m-2 px-3 rounded-2xl text-2xl font-semibold"
					
					value={label}
					onChange={(e)=>{setLabel(e.target.value)}}/>
				<div className="ml-auto text-xl flex items-center mr-4 font-semibold">
					{(() => {
						switch (sync_status) {
							case 'good':
								return (
									<>
										<p>Saved</p>
										<div className="w-6 h-6 bg-green-400 rounded-full ml-2" />
									</>
								);
              case 'loading':
              	return (
              		<>
              			<p>Saving</p>
										<div className="w-6 h-6 bg-neutral-400 rounded-full ml-2" />
									</>
              	);
              case 'blocked':
              	return (
              		<>
              			<p>Blocked</p>
										<div className="w-6 h-6 bg-orange-400 rounded-full ml-2" />
									</>
								);
              case 'failed':
              	return (
              		<>
              			<p>Not saved</p>
										<div className="w-6 h-6 bg-red-400 rounded-full ml-2" />
									</>
								);
						}
					})()}
				</div>
			</div>
			<div className="flex-grow overflow-y-scroll w-full flex">
				<div className="h-full  w-[50%]">
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
				<div className="h-full  w-[50%]">
					<PreviewResume
						resume_id={resume_id}
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
	);
};

export default ResumeBuilder;

