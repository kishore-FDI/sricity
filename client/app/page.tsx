
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div className="pt-20">
        <Hero />
      </div>
    </main>
  );
}
