import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Resume } from "../../types/types";

export type PreviewResumeRef = {
	getResumeHTML: () => string|undefined;
};

const PreviewResume = forwardRef<PreviewResumeRef, Resume>(function(props, ref) {
	const { full_name, phone_number, email, personal_website, linkedin, github, education, experience, projects, technical_skills }: Resume = props;
	const parentRef = useRef<HTMLDivElement>(null); // This is used to scale the resume to the parent div
	const resumeRef = useRef<HTMLDivElement>(null); // Passed to parent for generating PDF
	const [scale, setScale] = useState<number>(1);

	useImperativeHandle(ref, () => ({
		getResumeHTML: () => {return resumeRef.current?.outerHTML},
	}));

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

	useEffect(() => {
		function handleResize() {
			if (!parentRef.current) { return; }
			const parentWidth = parentRef.current.offsetWidth;
			const resumeWidth = 8.5 * 96;
			setScale(parentWidth/resumeWidth);
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		}

	}, []);

	/* -- Styles used for Backend resume parsing -- */

	const resumePreviewStyle = {
		width: '8.5in',
		height: '11in',
		padding: '0.5in',
		backgroundColor: 'white',
		textAlign: 'left',
		color: 'black',
		fontFamily: 'ui-serif,Georgia,Cambria,Times New Roman,Times,serif',
		fontSize: '12px',
		overflowY: 'hidden',
		transformOrigin: 'top left'
	};

	const headerStyle = {
		textAlign: 'center',
		fontSize: '28px',
		fontWeight: '600'
	};

	const linkStyle = {
		textDecoration: 'underline'
	};

	const sectionHeader = {
		width: 'full',
		borderBottom: '1px solid black',
		margin: '8px 0',
	}

	const sectionElementHeader = {
		display: 'flex',
		justifyContent: 'space-between',
	}

	return (
		/*
		 * !!! IMPORTANT NOTE !!!
		 * You cannot use Tailwindcss in this component because it has 
		 * compatibility issues with our PDF generator. I decided to use 
		 * a style tag which is dangerous but im preventing it from 
		 * interfering with the rest of the documents css using the 
		 * ResumePreview tag.
		 */
		<div ref={parentRef} className="w-full h-full"
		     style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
			<div ref={resumeRef} id="ResumePreview" style={resumePreviewStyle}>
				<h1 style={headerStyle}>{full_name}</h1>
				<h4 style={{ textAlign: 'center' }}>
					<span style={linkStyle}>{phone_number}</span> | 
					<a style={linkStyle} href={`mailto:${email}`} >{email}</a> | 
					<a style={linkStyle} href={personal_website} target="_blank">Portfolio</a> | 
					<a style={linkStyle} href={linkedin} target="_blank">LinkedIn</a> | 
					<a style={linkStyle} href={github} target="_blank">GitHub</a>
				</h4>
				<h2 style={sectionHeader}>EDUCATION</h2>
				{education.map((ed, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<span style={sectionElementHeader}>
							<p style={{ fontWeight: '600'}}>{ed.institution}</p><p>{ed.location}</p>
						</span>
						<span style={sectionElementHeader}>
							<p className="italic font-light">{ed.degree}</p><p>{ed.end_date}</p>
						</span>
						<DisplayHighlights highlights={ed.highlights} />
					</div>
				))}
				<h2 style={sectionHeader} >EXPERIENCE</h2>
				{experience.map( (ex, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<span style={sectionElementHeader}>
							<p style={{ fontWeight: '600'}}>{ex.job_title}</p><p>{ex.start_day} &ndash; {ex.end_day}</p>
						</span>
						<span style={sectionElementHeader}>
							<p><i>{ex.company}</i></p><p>{ex.location}</p>
						</span>
						<DisplayHighlights highlights={ex.highlights} />
					</div>
				))}
				<h2 style={sectionHeader}>PROJECTS</h2>
				{projects.map( (pj, index:number) => (
					<div key={index} className="ml-[0.15in]">
						<span style={sectionElementHeader}>
							<p><a href={pj.github_url} target="_blank"><b>{pj.name}</b></a> | <i>{pj.technologies}</i></p><p>{pj.start_day} &ndash; {pj.end_day}</p>
						</span>
						<DisplayHighlights highlights={pj.highlights} />
					</div>
				))}
				<h2 style={sectionHeader}>TECHNICAL SKILLS</h2>
				{technical_skills.map( (skl, index:number) => (
					<p key={index}><strong>{skl.category}: </strong>{skl.skills}</p>
				))}
			</div>
	</div>
	);
});

export default PreviewResume;
