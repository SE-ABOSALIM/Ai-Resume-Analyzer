interface ATSProps {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  // Determine gradient background based on score
  const getGradientClass = () => {
    if (score >= 70) return "from-green-100";
    if (score > 49 && score < 69) return "from-yellow-100";
    return "from-red-100";
  };

  // Determine icon based on score
  const getIconPath = () => {
    if (score >= 70) return "/icons/ats-good.svg";
    if (score > 49 && score < 69) return "/icons/ats-warning.svg";
    return "/icons/ats-bad.svg";
  };

  return (
    <div className={`bg-gradient-to-br ${getGradientClass()} to-white rounded-lg p-6 shadow-lg`}>
      {/* Top Section */}
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={getIconPath()} 
          alt="ATS Score Icon" 
          className="w-12 h-12"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            ATS Score - {score}/100
          </h2>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Applicant Tracking System Compatibility
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Your resume's compatibility with Applicant Tracking Systems (ATS) software. 
          Higher scores indicate better formatting and keyword optimization for automated screening.
        </p>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3 mb-6">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3">
            <img 
              src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"} 
              alt={suggestion.type === "good" ? "Good" : "Warning"} 
              className="w-5 h-5 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-gray-700">{suggestion.tip}</p>
          </div>
        ))}
      </div>

      {/* Closing Line */}
      <div className="text-center">
        <p className="text-sm text-gray-600 italic">
          Keep improving your resume to increase your chances of passing ATS screening!
        </p>
      </div>
    </div>
  );
};

export default ATS;
