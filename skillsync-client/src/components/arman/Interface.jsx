import PdfResumeUpload from './pdfResumeUpload'
import StoredData from './StoredData'

/*
User needs:
 - Location
 - Name
 - Email
 - School
 - Grad Year
 - Program + Specialization
 - Industry
 - Work Experience
 - SkillSets
 - LinkedIN
 - GitHub
 - PlumProfile 
 - Work Eligibility
 - Date of birth
 - Gender + Race
 - Profile Pic

*/

function Interface() {
    return (
        <div className="flex justify-center items-center">
            <div className="m-4">
                <PdfResumeUpload />
            </div>
            <div className="m-4">
                <StoredData />
            </div>
        </div>
    )
}

export default Interface