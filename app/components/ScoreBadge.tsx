import React from "react";

const ScoreBadge = ({ score }: { score: number }) => {
  // Determine label and classes based on score
  let bgClass = "bg-badge-yellow";
  let textClass = "text-yellow-700";
  let label = "Good";

  if (score >= 70) {
    bgClass = "bg-badge-green";
    textClass = "text-green-600";
    label = "Strong";
  } else if (score <= 69 && score > 49) {
    bgClass = "bg-badge-yellow";
    textClass = "text-yellow-700";
    label = "Good";
  } else {
    bgClass = "bg-badge-red";
    textClass = "text-red-700";
    label = "Needs Work";
  }

  return (
    <div className={`px-3 py-1 rounded-full inline-block ${bgClass}`}>
      <p className={`text-sm font-semibold ${textClass}`}>{label}</p>
    </div>
  );
};

export default ScoreBadge;
