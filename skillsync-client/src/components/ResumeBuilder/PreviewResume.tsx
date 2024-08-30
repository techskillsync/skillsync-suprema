import React from "react";
import { Resume } from "../../types/types";

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
		return <ul className="list-disc list-outside ml-[0.30in]">{jsx_points}</ul>;
	}
	
	return (
		<div className="h-full">
			<div id="ResumePreview" className="!w-[8.5in] !h-[11in] p-[0.5in] bg-white text-left text-black font-serif text-[12px] overflow-y-hidden">
				<h1 className="text-center text-[28px] font-semibold">{full_name}</h1>
				<h4 className="text-center">
					<span className="underline">{phone_number}</span> | 
					<a className="underline" href={`mailto:${email}`} >{email}</a> | 
					<a className="underline" href={personal_website} target="_blank">Portfolio</a> | 
					<a className="underline" href={linkedin} target="_blank">LinkedIn</a> | 
					<a className="underline" href={github} target="_blank">GitHub</a>
				</h4>
				<h2 className="w-full border-b-[1px] border-black my-2">EDUCATION</h2>
				{education.map((ed, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<span className="flex justify-between">
							<p className="font-semibold">{ed.institution}</p><p>{ed.location}</p>
						</span>
						<span className="flex justify-between">
							<p className="italic font-light">{ed.degree}</p><p>{ed.end_date}</p>
						</span>
						<DisplayHighlights highlights={ed.highlights} />
					</div>
				))}
				<h2 className="w-full border-b-[1px] border-black my-2">EXPERIENCE</h2>
				{experience.map( (ex, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<span className="flex justify-between">
							<p className="font-semibold">{ex.job_title}</p><p>{ex.start_day} &ndash; {ex.end_day}</p>
						</span>
						<span className="flex justify-between">
							<p className="italic">{ex.company}</p><p>{ex.location}</p>
						</span>
						<DisplayHighlights highlights={ex.highlights} />
					</div>
				))}
				<h2 className="w-full border-b-[1px] border-black my-2">PROJECTS</h2>
				{projects.map( (pj, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<span className="flex justify-between">
							<p><a href={pj.github_url} target="_blank"><b>{pj.name}</b></a> | <i>{pj.technologies}</i></p><p>{pj.start_day} &ndash; {pj.end_day}</p>
						</span>
						<DisplayHighlights highlights={pj.highlights} />
					</div>
				))}
				<h2 className="w-full border-b-[1px] border-black my-2">TECHNICAL SKILLS</h2>
				{technical_skills.map( (skl, index:number) => (
					<p key={index}><strong>{skl.category}: </strong>{skl.skills}</p>
				))}
			</div>
	</div>
	);
}

export default PreviewResume;
