import supabase from './supabaseClient'

// Param: image - the user's new profile picture
// Returns: true on success, false on failure
async function setAvatar(image) {
    if (!image) { console.warn("I need an image to upload"); return false; }

    const session = await supabase.auth.getSession()

    const user = session.data.session.user

    const fileExtension = image.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExtension}`

    const updates = {
        id: user.id,
        avatar_url: fileName
    }

    try {
        // First upload the avatar to supabase storage
        const { upload_error } = await supabase.storage.from('avatars').upload(fileName, image)
        if (upload_error) { throw error }

        // Then update the user profile to link to the image
        const { error } = await supabase.from('user_profiles').upsert(updates)
        if (error) { throw error }

        return true

    } catch (error) {
        console.warn(error.message)
        return false
    }
}

export default setAvatar