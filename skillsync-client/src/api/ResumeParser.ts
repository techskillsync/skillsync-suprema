import { GetAccessToken } from '../supabase/supabaseClient';
// const API_BASE_URL = "http://127.0.0.1:8012";
const API_BASE_URL = "https://ss-api.skillsync.work";

async function parseResume(file: File): Promise<any> {
    const access_token = await GetAccessToken();
    const formData = new FormData();
    formData.append("resume", file);
    const response = await fetch(`${API_BASE_URL}/api/parseResume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}`, },
        body: formData,
    });
    return await response.json();
}

export { parseResume };