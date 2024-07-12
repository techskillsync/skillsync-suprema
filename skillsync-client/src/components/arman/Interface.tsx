import React from 'react'
import ProfileInfo from './UserProfile.jsx'
import UpdateAvatar from './UpdateAvatar.tsx'
import Avatar from './DisplayAvatar.tsx'
import SetEligibility from './SetEligibility.tsx'
import GetEligibility from './GetEligibility.tsx'
import GPT_Feedback from './GPT_Feedback.tsx'
import ListSavedJobs from './ListSavedJobs.tsx'
import ListAppliedJobs from './ListAppliedJobs.tsx'
import { ArmanLogin } from './GoogleAuth.tsx'

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
            <div className="m-4">
                <ListAppliedJobs />
            </div>
            <div className="m-4">
                <ArmanLogin/>
            </div>
        </div>
    )
}

export default Interface