import { useEffect, useState } from 'react'
import getAvatar from '../../supabase/GetAvatar'

function Avatar() {
    const [avatarUrl, setAvatarUrl] = useState(null)

    async function fetchPfpUrl() {
        setAvatarUrl(await getAvatar())
    }

    useEffect(() => {
        fetchPfpUrl()
    }, [])

    return(
        <div className="border w-[400px] border-emerald-400 p-4 rounded-md flex flex-col items-center justify-center">
            <h3>Current PFP: </h3>
            {avatarUrl ? <img src={avatarUrl} /> : <>profile image is null</>}
            <button onClick={fetchPfpUrl}>Refresh</button>
        </div>
    )
}

export default Avatar