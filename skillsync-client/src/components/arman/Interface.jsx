import ProfileInfo from './UserProfile'
import UpdateAvatar from './UpdateAvatar'
import Avatar from './Avatar'
import SetEligibility from './SetEligibility.tsx'
import GetEligibility from './GetEligibility.tsx'
import GPT_Feedback from './GPT_Feedback.tsx'
import ListSavedJobs from './ListSavedJobs.tsx'

function Interface() {
    return (
        <div className="flex flex-wrap justify-center items-center">
            <div className="m-4">
                <UpdateAvatar />
            </div>
            <div className="m-4">
                <Avatar />
            </div>
            <div className="m-4">
                <ProfileInfo />
            </div>
            <div className="m-4">
                <SetEligibility />
            </div>
            <div className="m-4">
                <GetEligibility />
            </div>
            <div className="m-4">
                <GPT_Feedback />
            </div>
            <div className="m-4">
                <ListSavedJobs />
            </div>
        </div>
    )
}

export default Interface