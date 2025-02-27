'use client'
import { SignInButton } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Navbar = ({ session, isSignedIn, isAdmin }: { session: any, isSignedIn: boolean, isAdmin: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // useEffect(() => {
  //   console.log(session);
  // }, [session]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500`}>
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-24">
          <a href="/" className="relative group">
            <div className="font-bold text-2xl tracking-tight flex items-center gap-2">
              <span className="text-white opacity-90 group-hover:opacity-100 transition-opacity">Med</span>
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Script
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {isAdmin && (
              <a
                href="/admin"
                className="relative group py-2"
              >
                <span className="text-slate-300 text-sm font-medium tracking-wide group-hover:text-white transition-colors">
                  Admin
                </span>
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/70 to-teal-500/0 
                              scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </a>
            )}
            <a
              href="/room"
              className="relative group py-2"
            >
              <span className="text-slate-300 text-sm font-medium tracking-wide group-hover:text-white transition-colors">
                Create Room
              </span>
              <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/70 to-teal-500/0 
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            </a>
            
            <div className="flex items-center gap-6 pl-6 border-l border-slate-700/50">
              <div className="text-sm font-medium text-slate-300 relative group pt-2">
                <span className="relative z-10 group-hover:text-transparent group-hover:bg-gradient-to-r 
                               group-hover:from-teal-400 group-hover:to-cyan-400 group-hover:bg-clip-text 
                               transition-all duration-300">
                  {isSignedIn ? <UserButton /> : <SignInButton />}
                </span>
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/70 to-teal-500/0 
                              scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </div>
              <button className="px-4 py-2 text-sm font-medium relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg opacity-80 
                              group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white">Start Conversation</span>
              </button>
            </div>
          </div>

          <button
            className="md:hidden text-white/90 hover:text-white p-2 rounded-lg 
                     transition-colors border border-white/[0.08] hover:border-white/[0.12]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-6 space-y-4 border-t border-white/[0.08] flex flex-col items-center">
            {isAdmin && (
              <a
                href="/admin"
                className="block px-4 py-2.5 text-slate-200 hover:text-white 
                         hover:bg-white/[0.03] rounded-lg transition-colors tracking-wide"
              >
                Admin
              </a>
            )}
            <a
              href="/create-room"
              className="block px-4 py-2.5 text-slate-200 hover:text-white 
                       hover:bg-white/[0.03] rounded-lg transition-colors tracking-wide"
            >
              Create Room
            </a>
            <div className="flex flex-col gap-3 pt-4">
              <div className="w-full px-4 py-2.5 text-white hover:bg-white/[0.03] rounded-lg transition-colors">
                {isSignedIn ? <div className='flex items-center gap-2 justify-center'><UserButton /> {session.user.emailAddresses[0].emailAddress} </div> : <SignInButton />}
              </div>
              <button className="w-full px-4 py-2.5 text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
