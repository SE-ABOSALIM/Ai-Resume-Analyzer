import { Link } from "react-router";
import PercentageCircle from "./PercentageCircle";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card fade-in animate-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-gray-500 text-lg break-words">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <PercentageCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="gradient-border relative w-full overflow-hidden rounded-2xl h-64">
        <img
          src={imagePath}
          alt="Resume Preview"
          className="w-full h-full object-cover object-top rounded-xl"
        />
      </div>
    </Link>
  );
};

export default ResumeCard;
