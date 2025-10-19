import { Link } from "react-router";
import ScoreCircle from "./PercentageCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card group hover:scale-105 transition-transform duration-300"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {companyName && (
            <h2 className="text-xl font-bold text-gray-900 truncate">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-sm text-gray-600 truncate">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="text-xl font-bold text-gray-900">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="px-6 pb-6">
          <div className="relative overflow-hidden rounded-xl bg-gray-50">
            <img
              src={resumeUrl}
              alt="resume preview"
              className="w-full h-[280px] object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;
