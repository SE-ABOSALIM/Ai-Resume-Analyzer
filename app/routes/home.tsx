import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-20">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            <p className="text-gray-600 mt-4">Loading your resumes...</p>
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-container">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Get Started</h3>
              <p className="text-gray-600 mb-6">Upload your first resume to receive AI-powered feedback</p>
            </div>
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold px-8 py-4"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
