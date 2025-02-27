import { useSession } from "@clerk/clerk-react";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { useEffect, useState } from "react";

export default function App() {
  const { session, isLoaded, isSignedIn } = useSession();
  const [loginStatus, setLoginStatus] = useState<'loading' | 'approved' | 'waitlist'>('loading');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (session) {
      fetch('http://localhost:5000/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(session),
      })
      .then(res => res.json())
      .then(data => {
        setLoginStatus(data.Login ? 'approved' : 'waitlist');
        setIsAdmin(data.isAdmin);
      });
    }
  }, [session]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <main className="min-h-screen relative">
      <Navbar session={session} isSignedIn={isSignedIn} isAdmin={isAdmin} />
      {isSignedIn && loginStatus === 'waitlist' ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-3xl font-bold text-white">You're on the waitlist!</h1>
          <p className="text-black text-center max-w-md">
            Thank you for your interest. We'll review your application and get back to you soon.
          </p>
          <div className="text-sm text-slate-400">
            Registered email: {session.user.emailAddresses[0].emailAddress}
          </div>
        </div>
      ) : (
        <Hero />
      )}
    </main>
  );
}
