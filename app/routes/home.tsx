import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Analyze Resume" },
    { name: "description", content: "Best Resume, Dream Job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-selection">
        <div className="page-heading">
          <h1>Analyze, Rank, and Perfect Your Resume with AI</h1>
          <h2>AI-powered analysis to refine and improve your resumes.</h2>
        </div>
      </section>
    </main>
  );
}
