import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient";

function UpdateAvater() {
    const [session, setSession] = useState(null)
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState(null)

    useEffect(() => {
        // Set session variable
        supabase.auth.getSession().then(({ data: { session } }) => { setSession(session) })
        supabase.auth.onAuthStateChange((_event, session) => { setSession(session) })

    }, [])

    function handleImageUpdate(event) {
        const file = event.target.files[0]
        setImage(file)
        setImageURL(URL.createObjectURL(file))
    }


    async function updateProfile(event) {
        event.preventDefault()

        if (!image) {
            console.error('You must select an image to upload.')
            return
        }

        const { user } = session

        const fileExtension = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExtension}`

        const updates = {
            id: user.id,
            avatar_url: fileName
        }

        try {
            // First upload the avatar to supabase storage
            const { upload_error } = await supabase.storage.from('avatars').upload(fileName, image)
            if (upload_error) { throw upload_error }

            // Then update the user profile to link to the image
            const { error } = await supabase.from('user_profiles').upsert(updates)
            if (error) { throw error }


        } catch (error) {
            console.error('Error - ' + error.message)
        }
    }

    return (
        <form onSubmit={updateProfile} className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h1 className="text-[26px] font-bold">Update Profile Picture</h1>
            <label htmlFor="single" className="p-2 bg-slate-200 rounded-md">Select Image</label>
            <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type="file"
                id="single"
                accept="image/*"
                onChange={handleImageUpdate}
            />
            {imageURL ? <img src={imageURL} alt='avatar' /> : <></> }
            <button type="submit">Submit</button>
        </form>
    )
}

export default UpdateAvater