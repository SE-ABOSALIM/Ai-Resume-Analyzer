import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({
  title,
  score,
}: {
  title: string;
  score: number | null;
}) => {
  const display = typeof score === "number" ? `${score}/100` : "—";
  return (
    <div className="resume-summary flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <span>{title}</span>
        {typeof score === "number" && <ScoreBadge score={score} />}
      </div>
      <span
        className={
          typeof score === "number"
            ? "text-green-600 font-semibold"
            : "text-gray-400 font-semibold"
        }
      >
        {display}
      </span>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback | null }) => {
  const overall = feedback?.overallScore ?? 0;
  const toneScore = feedback?.toneAndStyle?.score ?? null;
  const contentScore = feedback?.content?.score ?? null;
  const structureScore = feedback?.structure?.score ?? null;
  const skillsScore = feedback?.skills?.score ?? null;

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8 ">
        <ScoreGauge score={overall} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <Category title="Tone & Style" score={toneScore} />
      <Category title="Content" score={contentScore} />
      <Category title="Structure" score={structureScore} />
      <Category title="Skills" score={skillsScore} />
    </div>
  );
};

export default Summary;
