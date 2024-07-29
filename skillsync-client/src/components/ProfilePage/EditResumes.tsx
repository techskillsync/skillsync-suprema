import React from "react";
import {
  GetResumes,
  GetResume,
  AddResume,
  DeleteResume,
} from "../../supabase/Resumes";

const EditResumes = () => {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [file, setFile] = React.useState<File | null>(null);
  const [label, setLabel] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    async function fetchResumes() {
      const resumes = await GetResumes();
      console.log(resumes);
      setResumes(resumes);
    }
    fetchResumes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleAddResume = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }
    if (!label) {
      setError("Please enter a label");
      return;
    }
    setLoading(true);
    try {
      await AddResume(file, label);
      const resumes = await GetResumes();
      setResumes(resumes);
      setFile(null);
      setLabel("");
    } catch (error) {
      setError("Error adding resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resume_id: string) => {
    setLoading(true);
    try {
      await DeleteResume(resume_id);
      const resumes = await GetResumes();
      setResumes(resumes);
    } catch (error) {
      setError("Error deleting resume");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="bg-black min-h-screen w-full pt-3">
        <div className="flex justify-center mb-3">
            <h1 className="text-white">Resumes</h1>
        </div>
        <div className="flex justify-center mb-3">
            <div className="file-upload">
                <input type="file" onChange={handleFileChange} />
                <div className="file-upload-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div className="file-upload-text">
                    Drag and drop or click to upload
                </div>
            </div>
            <input
                type="text"
                placeholder="Label"
                value={label}
                onChange={handleLabelChange}
                className="ml-3 px-2 py-1 border border-gray-300 rounded"
            />
            <button
                onClick={handleAddResume}
                className="ml-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Resume
            </button>
        </div>
        {loading && <div className="text-white">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-center">
            {resumes &&
                resumes.map((resume) => (
                    <div
                        key={resume.id}
                        className="resume-card bg-white rounded shadow-md p-3 m-3 cursor-pointer"
                        onClick={() => window.open(resume.resume_file, "_blank")}
                    >
                        <div className="resume-preview flex items-center justify-center h-16 w-16 bg-blue-500 text-white rounded-full">
                            <i className="far fa-file-pdf"></i>
                        </div>
                        <div className="resume-details ml-3">
                            <div className="resume-filename text-lg font-medium">
                                {resume.resume_label}
                            </div>
                            <div className="resume-actions mt-2">
                                <button
                                    onClick={() => handleDeleteResume(resume.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <a
                                    href={resume.resume_url}
                                    download
                                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    <i className="fas fa-download"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    </div>
);
};

export default EditResumes;
