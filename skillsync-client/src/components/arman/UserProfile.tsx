import React, { useState, useEffect } from 'react'
import supabase from '../../supabase/supabaseClient'
import { GetProfileInfo, SetProfileInfo } from '../../supabase/ProfileInfo.ts'
import setProfile from '../../supabase/setProfile'
import { Session } from '../../../node_modules/@supabase/auth-js/src/lib/types.ts'

function DisplayUserData({ session }) {
	const [loading, setLoading] = useState(true)
	const [name, setName] = useState('')
	const [location, setLocation] = useState('')
	const [school, setSchool] = useState('')
	const [grad_year, setGradYear] = useState('')
	const [program, setProgram] = useState('')
	const [specialization, setSpecialization] = useState('')
	const [industry, setIndustry] = useState('')
	const [workExperience, setWorkExperience] = useState('')
	const [skillSets, setSkillSets] = useState('')
	const [linkedin, setLinkedIn] = useState('')
	const [github, setGithub] = useState('')
	const [plumProfile, setPlumProfile] = useState('')
	const [workEligibility, setWorkEligibility] = useState('')
	const [date_of_birth, setDateOfBirth] = useState('')
	const [gender, setGender] = useState('')
	const [race, setRace] = useState('')

	useEffect(() => {
		let ignore = false
		async function getProfile() {
			setLoading(true)

			const columns = `name, location, school, grad_year, program, specialization, industry, linkedin, github,
					date_of_birth, gender, race`

			const data = await GetProfileInfo(columns)

			if (!data) { return; }

			if (!ignore) {
				setName(data.name)
				setLocation(data.location)
				setSchool(data.school)
				setGradYear(data.grad_year)
				setProgram(data.program)
				setSpecialization(data.specialization)
				setIndustry(data.industry)
				setLinkedIn(data.linkedin)
				setGithub(data.github)
				setDateOfBirth(data.date_of_birth)
				setGender(data.gender)
				setRace(data.race)
			}
			setLoading(false)
		}

		getProfile()

		return () => {
			ignore = true
		}
	}, [session])

	async function UpdateProfile(event) {
		event.preventDefault()
		setLoading(true)

		const updates = {
			name,
			location,
			school,
			grad_year,
			program,
			specialization,
			industry,
			linkedin,
			github,
			date_of_birth,
			gender,
			race,
		}

		await SetProfileInfo(updates)

		setLoading(false)
	}

	return (
		<form onSubmit={UpdateProfile} className="form-widget border border-emerald-300 rounded-md p-2">
			<div>
				<label htmlFor="email">Email</label>
				<input id="email" type="text" value={session.user.email} disabled className="bg-slate-200 rounded-md px-2 m-2" />
			</div>
			<div>
				<label htmlFor="username">Name</label>
				<input
					id="name"
					type="text"
					required
					value={name || ''}
					onChange={(e) => setName(e.target.value)}
					className="border border-black rounded-md px-2 mx-2"
				/>
			</div>

			<div>
				<label htmlFor="username">Location</label>
				<input
					id="location"
					type="text"
					required
					value={location || ''}
					onChange={(e) => setLocation(e.target.value)}
					className="border border-black rounded-md px-2 mx-2"
				/>
			</div>

			<div>
				<label htmlFor="username">School</label>
				<input
					id="school"
					type="text"
					required
					value={school || ''}
					onChange={(e) => setSchool(e.target.value)}
					className="border border-black rounded-md px-2 mx-2"
				/>
			</div>

			<div>
				<label htmlFor="username">Grad Year</label>
				<input value={grad_year || ''} onChange={(e) => setGradYear(e.target.value)} id="gradYear" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">Program</label>
				<input value={program || ''} onChange={(e) => setProgram(e.target.value)} id="program" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">Specialization</label>
				<input value={specialization || ''} onChange={(e) => setSpecialization(e.target.value)} id="specialization" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">Industry</label>
				<input value={industry || ''} onChange={(e) => setIndustry(e.target.value)} id="industry" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">GitHub</label>
				<input value={github || ''} onChange={(e) => setGithub(e.target.value)} id="github" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">LinkedIn</label>
				<input value={linkedin || ''} onChange={(e) => setLinkedIn(e.target.value)} id="linkedin" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">DOB</label>
				<input value={date_of_birth || ''} onChange={(e) => setDateOfBirth(e.target.value)} id="dateOfBirth" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">Race</label>
				<input value={race || ''} onChange={(e) => setRace(e.target.value)} id="race" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<label htmlFor="username">Gender</label>
				<input value={gender || ''} onChange={(e) => setGender(e.target.value)} id="gender" type="text" required className="border border-black rounded-md px-2 mx-2" />
			</div>

			<div>
				<button className="button block primary" type="submit" disabled={loading}>
					{loading ? 'Loading ...' : 'Update'}
				</button>
			</div>

			<div>
				<button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
					Sign Out
				</button>
			</div>
		</form>
	)
}

function UserProfile() {
	const [session, setSession] = useState<Session|null>(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

		supabase.auth.onAuthStateChange((_event, session) => setSession(session))
	}, [])

	return (
		<div className="container" style={{ padding: '50px 0 100px 0' }}>
			{!session ? <>you need to sign in</> : <DisplayUserData session={session} />}
		</div>
	)
}

export default UserProfile