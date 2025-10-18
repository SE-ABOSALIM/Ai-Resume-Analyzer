import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => {
  return [
    { title: "Resume | Review" },
    { name: "description", content: "Detailed view of the resume." },
  ];
};

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);
      const resumeBlob = await fs.read(data.resumePath);

      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);

      if (!imageBlob) return;

      const imgBlob = new Blob([imageBlob], { type: "image/png" });

      if (!imgBlob) return;

      const imageUrl = URL.createObjectURL(imgBlob);
      setImageUrl(imageUrl);

      // `data.feedback` is saved as a JSON string in upload.tsx; normalize it here
      let fb: Feedback | null = null;
      if (data.feedback) {
        if (typeof data.feedback === "string") {
          try {
            fb = JSON.parse(data.feedback) as Feedback;
          } catch (err) {
            console.error(
              "Failed to parse stored feedback JSON",
              err,
              data.feedback
            );
            fb = null;
          }
        } else {
          fb = data.feedback as Feedback;
        }
      }

      setFeedback(fb);
      console.log({ resumeUrl, imageUrl, feedback: fb });
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 font-semibold text-sm">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
        <section className="lg:w-1/2 w-full bg-[url('/images/bg-small.svg')] bg-cover min-h-[50vh] lg:min-h-screen flex items-center justify-center p-4">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-w-md w-full">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-auto object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="lg:w-1/2 w-full px-4 lg:px-8 py-6 lg:py-8 overflow-y-auto">
          <h2 className="text-4xl !text-black font-bold mb-8">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
