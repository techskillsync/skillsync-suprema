import supabase from './supabaseClient'
import { GetUserId } from './GetUserId'

// Returns a URL to the users PFP
// Meant to be used like: <img src={url} />
async function GetAvatar(): Promise<string> {
    try {

        const { data, error } = await supabase
            .from('user_profiles')
            .select(`avatar_url`)
            .eq('id', await GetUserId())
            .single()

        if (error) { console.warn(error.message); return ''; }

        const { data: image, error: downloadError } = await supabase
            .storage
            .from('avatars')
            .download(data.avatar_url)

        if (downloadError) { console.warn(downloadError.message); return ''; }

        return URL.createObjectURL(image)
    } catch (error) {
        console.warn("Error in GetSavedJobs - " + error)
        return ''
    }
}

async function SetAvatar(image): Promise<Boolean> {
    if (!image) { console.warn("I need an image to upload"); return false; }

    const fileExtension = image.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExtension}`

    try {
        const updates = {
            id: await GetUserId(),
            avatar_url: fileName
        }

        // First upload the avatar to supabase storage
        const { error: upload_error } = await supabase.storage.from('avatars').upload(fileName, image)
        if (upload_error) { throw new Error(upload_error.message) }

        // Then update the user profile to link to the image
        const { error } = await supabase.from('user_profiles').upsert(updates)
        if (error) { throw error.message }

        return true

    } catch (error) {
        console.warn(error)
        return false
    }
}

export { GetAvatar, SetAvatar }