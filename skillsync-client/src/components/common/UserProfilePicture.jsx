import React, { useEffect, useState } from 'react'
import { GetAvatar } from '../../supabase/ProfilePicture'

function ProfilePicture({height, width}) {
    const [avatarUrl, setAvatarUrl] = useState(null)

    async function fetchPfpUrl() {
        setAvatarUrl(await GetAvatar())
    }

    useEffect(() => {
        fetchPfpUrl()
    }, [])


    return(
            (avatarUrl && <img src={avatarUrl}  />)
    )
}

export default ProfilePicture