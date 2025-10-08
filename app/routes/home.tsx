import type { Route } from "./+types/home";
import { resumes } from "constants/index";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Analyze Resume" },
    { name: "description", content: "Best Resume, Dream Job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          <h1>Analyze, Rank, and Perfect Your Resume with AI</h1>
          <h2 className="!mb-10">
            AI-powered analysis to refine and improve your resumes.
          </h2>
        </div>

        {resumes.length > 0 && (
          <div className="resumes-container">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
