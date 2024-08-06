async function parseResume(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("resume", file);
    const response = await fetch("http://127.0.0.1:5000/api/parseResume", {
        method: "POST",
        body: formData,
    });
    return await response.json();
}

export { parseResume };