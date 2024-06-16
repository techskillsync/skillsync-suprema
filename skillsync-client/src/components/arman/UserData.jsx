import { useEffect, useState } from 'react'
import supabase from '../../supabase/supabaseClient'

function StoredData() {

    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    console.log(session)

    return (
        <div className="w-[400px] h-[200px] border border-emerald-400 text-left rounded-lg p-8 overflow-scroll">
            {!session ? <>you need to Login</> : 
                <div>
                    <p>Email: <strong>{session.user.email}</strong></p>
                    <p>User ID: <strong>{session.user.id}</strong></p>
                    <p>Last sign in: <strong>{session.user.last_sign_in_at}</strong></p>
                </div>
            }
        </div>
    )
}

export default StoredData