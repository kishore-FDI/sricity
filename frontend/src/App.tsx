import { useSession } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { useEffect, useState } from "react";
import Admin from "./components/Admin";

const Room = () => <div className="p-4">Room Page</div>;

const ProtectedAdminRoute = ({ isAdmin, isLoading }: { isAdmin: boolean; isLoading: boolean }) => {
  const location = useLocation();
  
  if (isLoading) {
    return <div>Checking permissions...</div>;
  }

  console.log('Admin check:', { isAdmin, isLoading });
  
  if (!isAdmin) {
    console.log('Access denied: User is not admin');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  console.log('Access granted: User is admin');
  return <Admin />;
};

export default function App() {
  const { session, isLoaded, isSignedIn } = useSession();
  const [loginStatus, setLoginStatus] = useState<'loading' | 'approved' | 'waitlist'>('loading');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true); // New loading state

  useEffect(() => {
    if (session) {
      setIsCheckingAdmin(true); // Start loading
      console.log('Fetching session data...');
      fetch('http://localhost:5000/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(session),
      })
      .then(res => res.json())
      .then(data => {
        console.log('Server response:', data);
        setLoginStatus(data.Login ? 'approved' : 'waitlist');
        setIsAdmin(Boolean(data.isAdmin));
        console.log('Setting isAdmin to:', Boolean(data.isAdmin));
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
              element={
                loginStatus === 'approved' ? <Room /> : <Navigate to="/" replace />
              } 
            />
          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
}
