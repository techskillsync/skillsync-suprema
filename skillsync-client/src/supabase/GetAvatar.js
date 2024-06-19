import supabase from './supabaseClient'

// Returns a URL to the users PFP
// Meant to be used like: <img src={url} />
async function getAvatar() {
    const session = await supabase.auth.getSession()

    const user = session.data.session.user

    const { data, error } = await supabase
        .from('user_profiles')
        .select(`avatar_url`)
        .eq('id', user.id)
        .single()

    if (error) { console.warn(error.message); return null; }

    const { data: image, error: downloadError } = await supabase
        .storage
        .from('avatars')
        .download(data.avatar_url)

    if (downloadError) { console.warn(downloadError.message); return null; }

    return URL.createObjectURL(image)
}

export default getAvatar