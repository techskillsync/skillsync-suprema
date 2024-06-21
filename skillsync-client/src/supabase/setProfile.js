import supabase from './supabaseClient'

// Param: updates - a dictionary where the keys are column names and the values are the new values, eg:
// { name: "Jeff", location: "NewYork" }
// Returns: { data, error } pair
async function setProfile(updates) {
    if (!updates) { return true; }

    const session = await supabase.auth.getSession()
    const user = session.data.session.user

    updates['id'] = user.id

    const { error } = await supabase.from('user_profiles').upsert(updates)
    if (error) { console.warn(error.message); return false; }

    return true
}

export default setProfile