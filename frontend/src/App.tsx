import { useSession } from "@clerk/clerk-react";
import Navbar from './components/Navbar';
import Hero from './components/Hero';

export default function App() {
  const { session, isLoaded, isSignedIn } = useSession();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <main className="min-h-screen relative">
      <Navbar session={session} isSignedIn={isSignedIn} />
      <Hero />
    </main>
  );
}
