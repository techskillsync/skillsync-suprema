import ProfileInfo from './UserProfile'
import UpdateAvatar from './UpdateAvatar'
import Avatar from './Avatar'

function Interface() {
    return (
        <div className="flex flex-wrap justify-center items-center">
            <div className="m-4">
                <UpdateAvatar />
            </div>
            <div>
                <Avatar />
            </div>
            <div className="m-4">
                <ProfileInfo />
            </div>
        </div>
    )
}

export default Interface