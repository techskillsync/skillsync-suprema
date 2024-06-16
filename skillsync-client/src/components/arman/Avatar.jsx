import { useEffect, useState } from 'react'
import supabase from '../../supabase/supabaseClient'

function Avatar() {
    const [session, setSession] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(null)

    async function getAvatar() {

        if (!session) { return }

        const { user } = session

        const { data, error } = await supabase
            .from('user_profiles')
            .select(`avatar_url`)
            .eq('id', user.id)
            .single()
        
        const { data: image, error: downloadError } = await supabase.storage.from('avatars').download(data.avatar_url)
        if (downloadError) { console.error(downloadError.message) }
        const url = URL.createObjectURL(image)
        setAvatarUrl(url)
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    useEffect(() => {
            getAvatar()
    }, [session])

    return(
        <div className="border w-[400px] border-emerald-400 p-4 rounded-md flex flex-col items-center justify-center">
            <h3>Current PFP: </h3>
            {avatarUrl ? <img src={avatarUrl} /> : <>profile image is null</>}
            <button onClick={getAvatar}>Refresh</button>
        </div>
    )
}

export default Avatar