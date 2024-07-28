import React, { useState, useEffect } from "react";
import { FindUser } from '../../supabase/OtherUsers'
import { PublicUserProfiles } from '../../types/types';
import { FindAvatar } from "../../supabase/OtherUsers";

function ShareJob() {

    const [email, setEmail] = useState('');
    const [user, setUser] = useState<PublicUserProfiles | null>(null);
    const [pfpUrl, setPfpUrl] = useState<string | null>(null);

    async function handleFindUser() {
        const user = await FindUser(email);
        if (!user?.id) { return }
        console.log(user.id)
        const pfpUrl = await FindAvatar(user.avatar_url);

        setUser(user);
        setPfpUrl(pfpUrl);
    }

    return (
        <div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
            <h1 className="text-[24px] font-bold">Share Job</h1>
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="email" className="px-2 border border-black rounded-md" />
            <button onClick={handleFindUser}>Find User</button>
            <div className="flex">
                {pfpUrl ?
                    <img src={pfpUrl} alt='lol' className="mr-4 w-[64px] h-[64px]" />
                    :
                    <></>

                }
                {user ?
                    <div>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export { ShareJob }