import supabase from './supabaseClient'
import { GetUserId } from './GetUserId';
import { UserProfile } from '../types/types';

// Param: columns - the columns you want from supabase, seperated with commas eg:
// `name, location, school, grad_year`
// Returns: { data, error } pair
async function GetProfileInfo(columns): Promise<UserProfile | null> {
    try {
        if (!columns) { throw new Error('need columns to fetch') }

        const { data, error } = await supabase
            .from('user_profiles')
            .select(columns)
            .eq('id', await GetUserId())
            .single()

        if (error) { throw new Error(error?.message) }

        return data as unknown as UserProfile;

    } catch (error) {
        console.warn(error);
        return null;
    }
}

async function GetUserEmail(): Promise<string | null> {
    try {
        const session = await supabase.auth.getSession();
        const email = session?.data?.session?.user?.email || null;
        return email;
    } catch (error) {
        console.warn(error);
        return null;
    }
}

// Param: updates - a dictionary where the keys are column names and the values are the new values, eg:
// { name: "Jeff", location: "NewYork" }
// Returns: { data, error } pair
async function SetProfileInfo(updates): Promise<true | false> {
    console.log('Updating profile info...')
    console.log(updates)
    try {
        if (!updates) { throw new Error('no updates passed')}

        updates['id'] = await GetUserId()

        const { error } = await supabase.from('user_profiles').upsert(updates)

        if (error) { throw new Error(error.message) }

        return true
    } catch (error) {
        console.warn(error)
        return false;
    }
}

export { GetProfileInfo, GetUserEmail, SetProfileInfo }