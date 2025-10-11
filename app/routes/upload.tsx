import Navbar from "~/components/Navbar";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";

const Upload = () => {
  // CONVERT TO USE REDUCER
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!file) return alert("Please upload a resume file.");
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDesc = formData.get("job-desc") as string;

    console.log({ companyName, jobTitle, jobDesc, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          {isProcessing ? (
            <>
              {statusText}
              <img
                src="/images/resume-scan.gif"
                alt="scan"
                className="w-64 h-80"
              />
            </>
          ) : (
            <h2 className="!text-3xl">
              Drop your resume for an Application Tracking System score and
              improvement tips
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-10"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  id="company-name"
                  type="text"
                  name="company-name"
                  placeholder="company name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  id="job-title"
                  type="text"
                  name="job-title"
                  placeholder="job title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-desc">Job Description</label>
                <textarea
                  id="job-desc"
                  rows={5}
                  name="job-desc"
                  placeholder="jod description"
                  className="resize-none"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button">Analyze Resume</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
