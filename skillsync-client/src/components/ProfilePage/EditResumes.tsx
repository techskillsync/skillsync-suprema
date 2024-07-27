import React from 'react'
import { GetResumes, GetResume, AddResume, DeleteResume } from '../../supabase/Resumes'

const EditResumes = () => {
    const [resumes, setResumes] = React.useState<any[]>([])
    const [file, setFile] = React.useState<File | null>(null)
    const [label, setLabel] = React.useState<string>("")
    const [loading, setLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>("")

    React.useEffect(() => {
        async function fetchResumes() {
            const resumes = await GetResumes()
            setResumes(resumes)
        }
        fetchResumes()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            setFile(files[0])
        }
    }

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value)
    }

    const handleAddResume = async () => {
        if (!file) {
            setError("Please select a file")
            return
        }
        if (!label) {
            setError("Please enter a label")
            return
        }
        setLoading(true)
        try {
            await AddResume(file, label)
            const resumes = await GetResumes()
            setResumes(resumes)
            setFile(null)
            setLabel("")
        } catch (error) {
            setError("Error adding resume")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteResume = async (resume_id: string) => {
        setLoading(true)
        try {
            await DeleteResume(resume_id)
            const resumes = await GetResumes()
            setResumes(resumes)
        } catch (error) {
            setError("Error deleting resume")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-black min-h-screen w-full pt-3">
            <div className="flex justify-center mb-3">
                <h1 className="text-white">Resumes</h1>
            </div>
            <div className="flex justify-center mb-3">
                <input type="file" onChange={handleFileChange} />
                <input type="text" placeholder="Label" value={label} onChange={handleLabelChange} />
                <button onClick={handleAddResume}>Add Resume</button>
            </div>
            {loading && <div className="text-white">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex justify-center">
                {resumes && resumes.map((resume) => (
                    <div key={resume.id} className="flex justify-center">
                        <div className="text-white">{resume.resume_label}</div>
                        <button onClick={() => handleDeleteResume(resume.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EditResumes