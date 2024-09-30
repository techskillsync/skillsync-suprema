/*
 * NOTE TO ANYONE IMPORTING THIS
 * Preview resume will dynamically scale to with width of the parent.
 * This is important for nice previews, so its the parents responsibility
 * to set the width and height and to specify a height overflow setting.
 *
 * This component also exports a function getResumtHTML that returns the HTML of the resume.
 */

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, CSSProperties } from "react";
import { Resume } from "../../types/types";
import ReactDOM from "react-dom";

export type PreviewResumeRef = {
	getResumeHTML: () => string|undefined;
};

const PreviewResume = forwardRef<PreviewResumeRef, Resume>(function(props, ref) {
	const { full_name, phone_number, email, custom_contact, education, experience, projects, technical_skills }: Resume = props;
	const parentRef = useRef<HTMLDivElement>(null); // This is used to scale the resume to the parent div
	const resumeRef = useRef<HTMLDivElement>(null); // Passed to parent for generating PDF
	const [scale, setScale] = useState<number>(1);

	useImperativeHandle(ref, () => ({
		getResumeHTML: () => {return resumeRef.current?.outerHTML},
	}));

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

	const resumePreviewStyle:CSSProperties = {
		width: '8.5in',
		height: '11in',
		padding: '0.5in',
		backgroundColor: 'white',
		textAlign: 'left',
		color: 'black',
		fontFamily: 'Times New Roman,Times,Georgia,Cambria,serif',
		fontSize: '14px',
		overflowY: 'hidden',
		transformOrigin: 'top left',
		lineHeight: '20px',
	};

	const headerStyle:CSSProperties = {
		textAlign: 'center',
		fontSize: '28px',
		fontWeight: '600',
		marginBottom: '0.05in'
	};

	const linkStyle:CSSProperties = {
		textDecoration: 'underline',
		color: 'black',
	};

	const sectionHeader:CSSProperties = {
		width: 'full',
		borderBottom: '1px solid black',
		margin: '8px 0',
	}

	const sectionElementHeader:CSSProperties = {
		display: 'flex',
		justifyContent: 'space-between',
	}

	const bulletPoint:CSSProperties = {
		listStyleType: 'disc',
		listStylePosition: 'outside',
		marginLeft: '0.30in'
	}

	// Properly formats the nested arrays in a highlights section :D
	interface NestedStringArrayProps { highlights:string[]; };
	function DisplayHighlights({ highlights }:NestedStringArrayProps):React.JSX.Element
	{
		let jsx_points:React.JSX.Element[] = [];
		for (const hi of highlights)
		{
			jsx_points.push(<li key={jsx_points.length} >{hi}</li>);
		}
		return <ul style={bulletPoint}>{jsx_points}</ul>;
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
					<span style={linkStyle}>{phone_number}</span>&nbsp;&nbsp;&nbsp;
					<a style={linkStyle} href={`mailto:${email}`} >{email}</a>&nbsp;&nbsp;&nbsp;
					{custom_contact.map( (contact, index) => (
						<span key={index}><a style={linkStyle} href={contact.url} target="_blank">{contact.label}</a>&nbsp;&nbsp;&nbsp;</span>
					))}
				</h4>
				<h2 style={sectionHeader}>EDUCATION</h2>
				{education.map((ed, index:number) => (
					<div key={index} style={{marginLeft: '0.15in'}} >
						<span style={sectionElementHeader}>
							<p style={{ fontWeight: '600'}}>{ed.institution}</p><p>{ed.location}</p>
						</span>
						<span style={sectionElementHeader}>
							<p style={{fontStyle: 'italic', fontWeight: 'light'}}>{ed.degree}</p><p>{ed.end_date}</p>
						</span>
						<DisplayHighlights highlights={ed.highlights} />
					</div>
				))}
				<h2 style={sectionHeader} >EXPERIENCE</h2>
				{experience.map( (ex, index:number) => (
					<div key={index} style={{marginLeft: '0.15in'}}>
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
					<div key={index} style={{marginLeft: '0.15in'}} >
						<span style={sectionElementHeader}>
							<p><a style={linkStyle} href={pj.github_url} target="_blank"><b>{pj.name}</b></a> | <i>{pj.technologies}</i></p><p>{pj.start_day} &ndash; {pj.end_day}</p>
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
