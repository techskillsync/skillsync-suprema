import supabase from './supabaseClient'
import { GetUserId } from './GetUserId'


async function AddResume(resume_file, resume_label): Promise<Boolean> {
    if (!resume_file) { console.warn("Resume file missing"); return false; }
    alert("Adding reumse")

    const user_id = await GetUserId();
    const fileExtension = resume_file.name.split('.').pop()
    const fileName = `${user_id}_${Math.random()}.${fileExtension}`

alert("1")

    try {
        const updates = {
            user_id: user_id,
            resume_label: resume_label,
            resume_url: fileName
        }

        // First upload the avatar to supabase storage
        const { error: upload_error } = await supabase.storage.from('resumes').upload(fileName, resume_file)
        if (upload_error) { throw new Error(upload_error.message); alert(upload_error?.message) }

        // Then update the user profile to link to the image
        const { error } = await supabase.from('user_resumes').insert(updates)
        if (error) { throw error.message; alert(error?.message) }

        alert("Done")

        return true

    } catch (error) {
        console.warn(error)
        alert(error)
        return false
    }
}

async function GetResumes(): Promise<any> {
    const user_id = await GetUserId();
    const { data, error } = await supabase
        .from('user_resumes')
        .select('id, resume_label, resume_url')
        .eq('id', user_id)
    if (error) { console.warn(error) }
    return data
}

// Rturn the resume id, label, and file url
async function GetResume(resume_id): Promise<any> {
    const user_id = await GetUserId();
    const { data, error } = await supabase
        .from('user_resumes')
        .select('id, resume_label, resume_url')
        .eq('id', user_id)
        .eq('resume_id', resume_id).single()
    if (error) { console.warn(error) }
    const { data: resume_file, error: downloadError } = await supabase
            .storage
            .from('resumes')
            .download(data?.resume_url)

        if (downloadError) { console.warn(downloadError.message); return ''; }
        return {
            id: data?.id,
            resume_label: data?.resume_label,
            resume_file: URL.createObjectURL(resume_file)
        }
}

async function DeleteResume(resume_id): Promise<Boolean> {
    const user_id = await GetUserId();
    const { error } = await supabase
        .from('user_resumes')
        .delete()
        .eq('id', user_id)
        .eq('resume_id', resume_id)
    if (error) { console.warn(error) 
        return false;
    }
    return true;
}

async function GetResumeCount(): Promise<Number | null> {
    const user_id = await GetUserId();
    const { data, error, count } = await supabase
        .from('user_resumes')
        .select('*', { count: 'exact' })
        .eq('id', user_id)
    if (error) { console.warn(error); return null;}
    return count;}

export { GetResumeCount, GetResumes, GetResume, AddResume, DeleteResume }