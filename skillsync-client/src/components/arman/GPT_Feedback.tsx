import React from 'react'
import { useState } from 'react'

function GPT_Feedback() {
    const [file, setFile] = useState<File|null>(null)
    const [feedback, setFeedback] = useState<String|null>(null)

    async function handleSubmit(event) {
        event.preventDefault()

        if (!file) {
            setFeedback("you must select a pdf to submit"); return;
        }

        setFeedback("Getting feedback...")


        const formData = new FormData()
        formData.append('resume', file)

        try {
            await fetch('http://localhost:5000/api/upload-resume-feedback', {
                method: 'POST',
                body: formData,
            }).then((response) => {
                if (!response.ok) { throw new Error('Failed to send to backend'); }
                return response.json();
            }).then((json) => {
                setFeedback(json.message);
            });
        } catch (error) {
            console.error('error: ' + error)
        }
    }

    return(
        <div className="border w-[400px] border-emerald-400 p-4 rounded-md flex flex-col items-center justify-center">
            <h1 className="text-[24px] mb-3">GPT-Feedback generator</h1>
            <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
                <input type="file" name="resume" accept=".pdf" 
                    onChange={(e) => {
                        if (e.target.files) { setFile(e.target.files[0]) }
                        setFeedback(null);
                    }}
                    />
                <input type="submit" value="Upload Resume" className="border rounded-md p-2" />
            </form>
            <p>{feedback ? feedback : '' }</p>
        </div>
    )
}

export default GPT_Feedback