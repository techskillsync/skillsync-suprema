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

export default PreviewResume;