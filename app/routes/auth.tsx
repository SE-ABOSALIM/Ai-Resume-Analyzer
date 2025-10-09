import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "../lib/puter";
import { useEffect } from "react";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log in into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col text-center gap-2">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse cursor-auto">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Logout</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Login</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
