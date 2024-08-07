// const API_BASE_URL = "http://127.0.0.1:5000";
const API_BASE_URL = "http://ss-api.skillsync.work";

async function parseResume(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("resume", file);
    const response = await fetch(`${API_BASE_URL}/api/parseResume`, {
        method: "POST",
        body: formData,
    });
    return await response.json();
}

export { parseResume };