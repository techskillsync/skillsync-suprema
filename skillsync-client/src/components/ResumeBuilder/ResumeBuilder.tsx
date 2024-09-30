import React, { useState, useEffect, useRef, } from 'react'
import { Resume, EducationSection, ExperienceSection, ProjectsSection, SkillsSection, CustomContact, } from '../../types/types';
import supabase from '../../supabase/supabaseClient';
import { GetUserId } from '../../supabase/GetUserId';
import PreviewResume from './PreviewResume';
import EditResume from './EditResume';
import { PiArrowLeft } from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";
// When blocked will not attempt to sync. Used so
// we dont sync values before they are loaded.
type SyncStatus = 'good' | 'loading' | 'blocked' | 'failed';



/*
 * Upsert resume data to Supabase using resume id.
 * and updates sync_status accordingly.
 */
async function syncResume(resume: Resume, sync_status: SyncStatus, setSyncStatus: React.Dispatch<React.SetStateAction<SyncStatus>>): Promise<boolean> {
	if (sync_status === 'blocked') { return false; }

	const { label, resume_id, full_name, phone_number, email, custom_contact, education, experience, projects, technical_skills, } = resume;

	setSyncStatus('loading');

	try {
		const { error } = await supabase
			.from('resume_builder')
			.upsert(
				{ id: await GetUserId(), resume_id, label, full_name, phone_number, email, custom_contact, education, experience, projects, technical_skills, },
				{ onConflict: 'resume_id' }
			)
			.select('resume_id');
		if (error) { throw Error(error.message); }
		setSyncStatus('good');
		return true;
	} catch (error) {
		console.warn("Error syncing resume - " + error);
		setSyncStatus('failed');
		return false;
	}
}



/*
 * Calls js-api to generate a PDF version of the resume, then
 * prompts the user to download the PDF resume.
 */
async function downloadResumePDF(label:string, htmlContent: string) {
	const resume = await generateResumePDF(htmlContent);
	if (!resume) {
		console.warn("downloadResumePDF did not receive a valid PDF 😵");
		return;
	}

	const url = window.URL.createObjectURL(resume);
	const link = document.createElement('a');
	link.href = url;
	link.download = label;
	document.body.appendChild(link); // Required for Firefox
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}



async function generateResumePDF(htmlContent: string):Promise<null|Blob>
{
	if (!htmlContent) {
		console.warn('Attempt to generate resume with no content');
		return null;
	}

	try {
		const response = await fetch('https://js-api.skillsync.work/htmlToPdf', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ htmlContent })
		});

		const body = await response.json();
		if (body.error) { return null; }
		// Convert Base64 encoded PDF to a Uint8Array
		const base64Pdf = body.data;

		const binaryString = atob(base64Pdf);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		// Create a Blob from the ArrayBuffer
		const blob = new Blob([bytes], { type: 'application/pdf' });
		return blob;
	} catch (error) {
		console.error('Error:', error);
        return null;
	}
}

type ResumeBuilderProps = { resume: Resume, closeResume: () => void };
function ResumeBuilder({ resume, closeResume }: ResumeBuilderProps) {
	const resume_id = resume.resume_id;
	const [sync_status, setSyncStatus] = useState<SyncStatus>('blocked');
	const [label, setLabel] = useState<string>('');
	const [full_name, setFullName] = useState<string>('');
	const [phone_number, setPhoneNumber] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [custom_contact, setCustomContact] = useState<CustomContact[]>([]);
	const [education, setEducation] = useState<EducationSection[]>([]);
	const [experience, setExperience] = useState<ExperienceSection[]>([]);
	const [projects, setProjects] = useState<ProjectsSection[]>([]);
	const [technical_skills, setTechnicalSkills] = useState<SkillsSection[]>([]);

	type PreviewResumeRef = { getResumeHTML: () => string|undefined; };
	const previewResumeRef = useRef<PreviewResumeRef | null>(null); // So we can access PreviewResume's getResumeHTML function
	const [downloadButtonText, setDownloadButtonText] = useState<string>("Download PDF");

	useEffect(() => {
		setLabel(resume.label);
		setFullName(resume.full_name);
		setPhoneNumber(resume.phone_number);
		setEmail(resume.email);
		setCustomContact(resume.custom_contact);
		setEducation(resume.education);
		setExperience(resume.experience);
		setProjects(resume.projects);
		setTechnicalSkills(resume.technical_skills);

		setSyncStatus('good');

	}, []);

	useEffect(() => {
		async function doAsync() {
			const resume = { resume_id, label, full_name, phone_number, email, custom_contact, education, experience, projects, technical_skills };
			syncResume(resume, sync_status, setSyncStatus);
		}

		doAsync();
	}, [label, full_name, phone_number, email, custom_contact, education, experience, projects, technical_skills]);

	function getResumeHTML() {
		if (!previewResumeRef.current) { return undefined; }
		return previewResumeRef.current.getResumeHTML();
	}
	return (
		<div className="h-screen w-full bg-black flex flex-col ">
			<div className="h-20 flex-none flex">
				<button
					className="bg-black hover:bg-slate-800 text-white m-2 ml-4 p-0 px-2 rounded-2xl flex justify-center items-center"
					onClick={closeResume}>
					<PiArrowLeft size="38" />
				</button>
				<input
					placeholder="Resume name"
					className="bg-black hover:bg-slate-800 m-2 px-3 rounded-2xl text-2xl font-semibold"

					value={label}
					onChange={(e) => { setLabel(e.target.value) }} />
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
						setCustomContact={setCustomContact} custom_contact={custom_contact}
						setEducation={setEducation} education={education}
						setExperience={setExperience} experience={experience}
						setProjects={setProjects} projects={projects}
						setTechnicalSkills={setTechnicalSkills} technical_skills={technical_skills}
					/>
				</div>
				<div className="h-full w-[50%] overflow-y-scroll">
					<button className="block text-center mx-auto mb-4 w-[50%] bg-[#03BD6C] text-white" 
							onClick={async () => {
								setDownloadButtonText("Downloading...")
								const resumeHTML = getResumeHTML();
								if (!resumeHTML) { return; }
								await downloadResumePDF(label, resumeHTML);
								setDownloadButtonText("Download PDF")
							}}>
						{downloadButtonText}
					</button>
					<PreviewResume
						ref={previewResumeRef}
						resume_id={resume_id}
						label={label}
						full_name={full_name}
						phone_number={phone_number}
						email={email}
						custom_contact={custom_contact}
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

