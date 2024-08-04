import React from "react";
import {
  GetResumes,
  GetResume,
  AddResume,
  DeleteResume,
} from "../../supabase/Resumes";
import { FaDownload, FaPagelines, FaTrash } from "react-icons/fa";
import { IoDocument, IoDownload } from "react-icons/io5";
import { FaSheetPlastic } from "react-icons/fa6";
import { confirmWrapper } from "../common/Confirmation";

const EditResumes = () => {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
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
      setSelectedFile(files[0]);
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleOpenResume = async (resume: any) => {
    const resumeData = await GetResume(resume.resume_id);
    console.log("resumeData", resumeData);
    if (resumeData) {
      console.log(resumeData.resume_url);
      window.open(resumeData.resume_url, "_blank");
    }
  };

  const handleDownloadResume = async (resume: any) => {
    const resumeData = await GetResume(resume.resume_id);
    console.log("resumeData", resumeData);
    if (resumeData) {
      const a = document.createElement("a");
      a.href = resumeData.resume_url;
      a.download = resume.resume_label;
      a.click();
    }
  };

  const handleAddResume = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    if (!label) {
      setError("Please enter a label");
      return;
    }
    setLoading(true);
    try {
      await AddResume(selectedFile, label);
      const resumes = await GetResumes();
      setResumes(resumes);
      setSelectedFile(null);
      setLabel("");
    } catch (error) {
      setError("Error adding resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resume_id: string) => {
    if (await confirmWrapper("Are you sure you want to delete this resume?")) {
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
    } else {
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-black min-h-screen w-full pt-3">
      <div className="file-upload-container p-6 m-8 bg-[#301a8b] rounded-lg">
        <div className="mb-4 ml-1">
          <h1 className="text-white text-2xl font-bold">Upload new resume</h1>
        </div>
        <div className="flex h-full">
          <div className="flex flex-col w-1/2">
            <div
              className="file-upload-dropzone h-full"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                onChange={handleFileChange}
                className="file-input h-full"
              />
              <div className="file-upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <div className="file-upload-text">
                {selectedFile
                  ? selectedFile.name
                  : "Drag and drop or click to upload"}
              </div>
            </div>
            {selectedFile && (
              <div className="file-preview">
                <p>Selected File: {selectedFile.name}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col w-1/2">
            <input
              type="text"
              placeholder="Label"
              value={label}
              onChange={handleLabelChange}
              className="ml-3 px-2 py-3 border-none shadow text-lg mb-3 bg-[#2e2067]  rounded"
            />
            <button
              onClick={handleAddResume}
              className="ml-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Resume
            </button>
          </div>
        </div>
      </div>
      {loading && <div className="text-white">Loading...</div>}
      {/* {error && <div className="text-red-500">{error}</div>} */}
      <div className="border-solid border-gray-600 border-2 m-8 rounded-lg p-6">
        <div className="mb-4 ml-1">
          <h1 className="text-white text-2xl font-bold">Your resumes</h1>
        </div>
        <div className="flex gap-4 flex-wrap">
          {resumes &&
            resumes.map((resume) => (
              <div
                key={resume.id}
                className="resume-card min-w-48 bg-[#1e1e1e] rounded shadow-md p-3 cursor-pointer"
              >
                <div
                  className="mx-auto resume-preview flex items-center justify-center h-16 w-16 bg-blue-500 text-white rounded
                "
                  onClick={() => handleOpenResume(resume)}
                >
                  <IoDocument className="text-4xl" />
                </div>
                <div className="resume-details mt-3">
                  <div className="resume-filename text-lg text-center font-medium">
                    {resume.resume_label}
                  </div>
                  <div className="resume-actions mt-2 flex space-x-2 items-center justify-center">
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-0 bg-transparent text-red-700 rounded"
                    >
                      <FaTrash />
                    </button>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadResume(resume);
                      }}
                      className="p-0 bg-transparent text-green-500 rounded text-xl"
                    >
                      <IoDownload />
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditResumes;
