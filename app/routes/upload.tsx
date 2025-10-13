import Navbar from "~/components/Navbar";
import { useReducer, useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdfToImage";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

interface UploadState {
  isProcessing: boolean;
  statusText: string;
  file: File | null;
}

interface Action {
  type: "SET_PROCESSING" | "SET_STATUS_TEXT" | "SET_FILE";
  payload: boolean | string | File | null;
}

function reducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing:
          typeof action.payload === "boolean"
            ? action.payload
            : state.isProcessing,
      };
    case "SET_STATUS_TEXT":
      return {
        ...state,
        statusText:
          typeof action.payload === "string"
            ? action.payload
            : state.statusText,
      };
    case "SET_FILE":
      return {
        ...state,
        file:
          action.payload instanceof File || action.payload === null
            ? action.payload
            : state.file,
      };
    default:
      return state;
  }
}

const Upload = () => {
  const [state, dispatch] = useReducer(reducer, {
    isProcessing: false,
    statusText: "",
    file: null,
  });
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const handleFileSelect = (file: File | null) => {
    dispatch({ type: "SET_FILE", payload: file });
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "SET_STATUS_TEXT", payload: "Uploading resume..." });

    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile)
      return dispatch({
        type: "SET_STATUS_TEXT",
        payload: "Error: File upload failed",
      });
    dispatch({
      type: "SET_STATUS_TEXT",
      payload: "Converting Resume to Image...",
    });

    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return dispatch({
        type: "SET_STATUS_TEXT",
        payload: "Error: PDF to Image conversion failed",
      });

    dispatch({ type: "SET_STATUS_TEXT", payload: "Analyzing resume..." });
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage)
      return dispatch({
        type: "SET_STATUS_TEXT",
        payload: "Error: Image upload failed",
      });

    dispatch({ type: "SET_STATUS_TEXT", payload: "Preparing data..." });
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    dispatch({ type: "SET_STATUS_TEXT", payload: "Getting AI feedback..." });

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback)
      return dispatch({
        type: "SET_STATUS_TEXT",
        payload: "Error: AI feedback generation failed",
      });

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;
    data.feedback = feedbackText;
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    dispatch({
      type: "SET_STATUS_TEXT",
      payload: "Analysis complete! Redirecting...",
    });
    console.log("Analysis complete:", JSON.parse(data.feedback));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDesc = formData.get("job-desc") as string;

    if (!state.file) return;

    handleAnalyze({
      companyName,
      jobTitle: jobTitle,
      jobDescription: jobDesc,
      file: state.file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          {state.isProcessing ? (
            <>
              {state.statusText}
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
          {!state.isProcessing && (
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
                  placeholder="job description"
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
