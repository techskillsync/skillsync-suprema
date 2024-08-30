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
 * Upserts resume data to Supabase using user id.
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
		<div className="min-h-screen w-full bg-black">
			<div className="flex justify-center mt-4">
				<button
					className="bg-white text-black mr-12"
					onClick={closeResume}>
					file menu
				</button>
				<p className="text-center mt-4">Sync Status: {sync_status}</p>
			</div>
			<div className="h-full w-full flex">
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
					<div className="h-full w-full">
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
		</div>
	);
};

export default ResumeBuilder;

