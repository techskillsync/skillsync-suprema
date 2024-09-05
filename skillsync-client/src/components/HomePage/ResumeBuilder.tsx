import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, PDFDownloadLink, Link } from '@react-pdf/renderer';


function PreviewResume({ name, phone, email, github, linkedin, website, eduInstitution}) {

	Font.register({
		family: 'Times-New-Roman',
		src: 'https://skillsync.work/fonts/cmunbx.ttf',
	});	

	const styles = StyleSheet.create({
		viewer: {
			width: '100%',
			height: '100%',
		},
		page: {
			backgroundColor: 'white',
			marginLeft: '0.4in',
			marginRight: '0.4in',
			marginTop: '0.6in',
			fontFamily: 'Times-Roman',
		},
		section: {
		},
	});

	return (
		<>
			{ /* <PDFDownloadLink
				document={<Document/>}
				fileName="resume.pdf"
				className='bg-white p-3 text-black rounded-md'
			>
				{({ blob, url, loading, error }) =>
					loading ? "Loading" : "Download"
				}
			</PDFDownloadLink> */ }
			<PDFViewer style={styles.viewer}>
				<Document>
					<Page size="A4" style={styles.page} orientation='portrait' >
						<View style={styles.section}>
							<Text>Section #1</Text>
							<Text>
								Name: {name}, 
								Phone: {phone}, 
								Email: {email},
								Github: {github},
								Linkedin: {linkedin},
								Website: {website},
								Education: {eduInstitution},
							</Text>
							<Link src="https://github.com/ArmanDris">GitHub</Link>
						</View>
						<View style={styles.section} >
							<Text>Section #2</Text>
						</View>
					</Page>
				</Document>
			</PDFViewer>
		</>
	);
}

function EditResume({setName, setPhone, setEmail, setGithub, setLinkedin, setWebsite, setEduInstitution}) {
	return(
		<div className="text-left text-black">
			<div id="resumeInfo" className="m-4">
				<h2 className="text-white">Contact Info</h2>
				<input placeholder='name' onChange={(e) => setName(e.target.value)} />
				<input placeholder='number' onChange={(e) => setPhone(e.target.value)} />
				<input placeholder='email' onChange={(e) => setEmail(e.target.value)} />
				<input placeholder='github profile' onChange={(e) => setGithub(e.target.value)} />
				<input placeholder='linkedin profile' onChange={(e) => setLinkedin(e.target.value)} />
				<input placeholder='website' onChange={(e) => setWebsite(e.target.value)} />
			</div>
			<div id="education" className="m-4">
				<h2 className="text-white">Education</h2>
				<input placeholder='institution' onChange={(e) => setWebsite(e.target.value)} />
			</div>
		</div>
	);
}

function ResumeBuilder() {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [github, setGithub] = useState('');
	const [linkedin, setLinkedin] = useState('');
	const [website, setWebsite] = useState('');
	const [eduInstitution, setEduInstitution] = useState('');

	return (
		<div className="min-h-screen w-full">
			<div className="h-screen w-full flex">
				<div className="box-border w-[50%] text-center m-4 border border-white">
					<h1 className="m-4">Edit</h1>
					<EditResume
						setName={setName}
						setPhone={setPhone}
						setEmail={setEmail}
						setGithub={setGithub}
						setLinkedin={setLinkedin}
						setWebsite={setWebsite}
						setEduInstitution={setEduInstitution}
						/>
				</div>
				<div className="box-border w-[50%] text-center m-4 border border-white">
					<h1 className="m-4">Preview</h1>
					<div className="my-4" />
						<PreviewResume 
							name={name}
							phone={phone}
							email={email}
							github={github}
							linkedin={linkedin}
							website={website}
							eduInstitution={eduInstitution}
							/>
				</div>
			</div>
		</div>
	);
};

export default ResumeBuilder;

