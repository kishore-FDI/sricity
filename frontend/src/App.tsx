import { useSession } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { useEffect, useState } from "react";
import Admin from "./components/Admin";
import Room from "./components/Room";

const ProtectedAdminRoute = ({ isAdmin, isLoading }: { isAdmin: boolean; isLoading: boolean }) => {
  const location = useLocation();
  
  if (isLoading) {
    return <div>Checking permissions...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Admin />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoomRoute = ({ loginStatus, isLoading,session }: { loginStatus: string; isLoading: boolean,session:any }) => {
  const location = useLocation();
  
  if (isLoading) {
    return <div>Checking permissions...</div>;
  }
  
  if (loginStatus !== 'approved') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Room session={session} />;
};

export default function App() {
  const { session, isLoaded, isSignedIn } = useSession();
  const [loginStatus, setLoginStatus] = useState<'loading' | 'approved' | 'waitlist'>('loading');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true); // New loading state

  useEffect(() => {
    if (session) {
      setIsCheckingAdmin(true); 
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
        setIsAdmin(Boolean(data.isAdmin));
      })
      .catch(error => {
        console.error('Error fetching session:', error);
      })
      .finally(() => {
        setIsCheckingAdmin(false); 
      });
    }
  }, [session]);
  useEffect(() => {
    console.log('Current auth state:', {
      isLoaded,
      isSignedIn,
      loginStatus,
      isAdmin,
      isCheckingAdmin
    });
  }, [isLoaded, isSignedIn, loginStatus, isAdmin, isCheckingAdmin]);

  if (!isLoaded) return <div>Loading...</div>;

  const WaitlistMessage = () => (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold text-white">You're on the waitlist!</h1>
      <p className="text-black text-center max-w-md">
        Thank you for your interest. We'll review your application and get back to you soon.
      </p>
      <div className="text-sm text-slate-400">
        Registered email: {session?.user.emailAddresses[0].emailAddress}
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <main className="min-h-screen relative">
        <Navbar session={session} isSignedIn={isSignedIn} isAdmin={isAdmin} />
        
        {isSignedIn && loginStatus === 'waitlist' ? (
          <WaitlistMessage />
        ) : (
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route 
              path="/admin" 
              element={<ProtectedAdminRoute isAdmin={isAdmin} isLoading={isCheckingAdmin} />}
            />
            <Route 
              path="/room" 
              element={<ProtectedRoomRoute loginStatus={loginStatus} isLoading={isCheckingAdmin} session={session}/>}
            />
          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
}
