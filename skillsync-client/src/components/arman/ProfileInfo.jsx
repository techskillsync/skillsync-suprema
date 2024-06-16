import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Account from './Account'
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
  
    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        {!session ? <>you need to auth</> : <Account key={session.user.id} session={session} />}
      </div>
    )
}

export default StoredData