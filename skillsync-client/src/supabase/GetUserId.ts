import supabase from "./supabaseClient"

async function GetUserId(): Promise<string> {
    const session = await supabase.auth.getSession()

    if (!session.data.session) { throw new Error('unable to get session, you probably need to login') }

    return session.data.session.user.id;
}

export { GetUserId }