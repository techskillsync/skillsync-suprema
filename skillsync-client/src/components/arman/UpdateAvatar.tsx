import React, { useEffect, useState } from "react";
import { SetAvatar } from '../../supabase/ProfilePicture'

function UpdateAvater() {
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState('')

    function handleImageUpdate(event) {
        const file = event.target.files[0]
        setImage(file)
        setImageURL(URL.createObjectURL(file))
    }

    async function updateProfile(event) {
        event.preventDefault()
        SetAvatar(image)
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
            {imageURL !== '' ? <img src={imageURL} alt='avatar' /> : <></> }
            <button type="submit">Submit</button>
        </form>
    )
}

export default UpdateAvater