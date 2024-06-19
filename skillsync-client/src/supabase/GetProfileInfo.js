import supabase from './supabaseClient'

// Param: columns - the columns you want from supabase, seperated with commas eg:
// `name, location, school, grad_year`
// Returns: { data, error } pair
async function getProfileInfo(columns) {
    if (!columns) { return true; }

    const session = await supabase.auth.getSession()
    const user = session.data.session.user

    const { data, error } = await supabase
        .from('user_profiles')
        .select(columns)
        .eq('id', user.id)
        .single()

    return { data, error }
}

export default getProfileInfo