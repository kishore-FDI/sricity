'use client'
import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const Hero = () => {
  useEffect(() => {
    // Move DNA elements creation to client-side only
    const createDNAElements = () => {
      const dnaContainer = document.querySelector('.dna-container');
      if (!dnaContainer) return;
      
      // Clear existing DNA elements
      dnaContainer.innerHTML = '';
      
      // Create DNA elements client-side
      for (let i = 0; i < 6; i++) {
        const dna = document.createElement('div');
        dna.className = 'floating-dna absolute w-64 h-64 opacity-20';
        dna.style.left = `${Math.random() * 100}%`;
        dna.style.top = `${Math.random() * 100}%`;
        dna.style.background = `radial-gradient(circle, ${
          i % 2 === 0 ? 'rgba(45, 212, 191, 0.1)' : 'rgba(56, 189, 248, 0.1)'
        } 0%, transparent 70%)`;
        dnaContainer.appendChild(dna);
      }
    };

    gsap.registerPlugin(ScrollTrigger);
    
    // Create DNA elements before starting animations
    createDNAElements();
    
    // Set initial states to prevent flash of unstyled content
    gsap.set(".feature-card", {
      opacity: 0,
      y: 20
    });

    gsap.set(".title-part", {
      opacity: 0,
      y: 100
    });

    gsap.set(".hero-content", {
      opacity: 0,
      y: 30
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    // Main content animation
    tl.to(".title-part", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2
    })
    .to(".hero-content", {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, "-=0.4")
    .to(".feature-card", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: {
        each: 0.1,
        from: "start"
      }
    }, "-=0.2");

    // Clean up
    return () => {
      tl.kill();
      gsap.killTweensOf(".floating-dna");
      gsap.killTweensOf(".feature-card");
      gsap.killTweensOf(".title-part");
      gsap.killTweensOf(".hero-content");
    };
  }, []);

  return (
    <section className="relative  bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden pt-10">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden dna-container">
        {/* DNA elements will be created by JavaScript */}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8">
            <span className="animate-pulse w-2 h-2 rounded-full bg-teal-400 mr-2" />
            <span className="text-teal-400 text-sm font-medium">AI-Powered Medical Transcription</span>
          </div>
          <h1 className="space-y-3 mb-6">
            <div className="title-part text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              Transform Medical Dialogues
            </div>
            <div className="title-part text-4xl md:text-6xl lg:text-7xl font-bold">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Into Structured Insights
              </span>
            </div>
          </h1>
          <p className="hero-content max-w-3xl mx-auto text-lg text-slate-400 mb-8">
            Revolutionize your medical documentation process with our advanced NLP engine. 
            Convert complex medical conversations into precise, structured notes instantly.
          </p>
          <div className="hero-content flex flex-wrap justify-center gap-4">
            <button className="group relative inline-flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur opacity-50 
                            group-hover:opacity-75 transition duration-500" />
              <div className="relative px-8 py-4 bg-slate-900 rounded-xl flex items-center gap-3 border border-slate-800">
                <span className="text-white font-medium">Get Started</span>
                <svg className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" 
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            {
              icon: "🎙️",
              title: "Voice Recognition",
              description: "Real-time medical speech processing with 99% accuracy",
              gradient: "from-teal-500/20 to-transparent"
            },
            {
              icon: "🧠",
              title: "NLP Processing",
              description: "Advanced medical terminology extraction and classification",
              gradient: "from-teal-500/20 to-transparent"
            },
            {
              icon: "📝",
              title: "Auto Documentation",
              description: "Structured medical notes generation in real-time",
              gradient: "from-teal-500/20 to-transparent"
            },
            {
              icon: "🔍",
              title: "Research Ready",
              description: "Standardized format for medical research and analysis",
              gradient: "from-teal-500/20 to-transparent"
            }
          ].map((card, index) => (
            <div
              key={index}
              className="feature-card group relative p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm
                         border border-slate-700 hover:border-teal-500/50 transition-all duration-500
                         opacity-0" // Add initial opacity
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 
                            group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              <div className="relative space-y-4">
                <span className="text-3xl">{card.icon}</span>
                <h3 className="text-xl font-semibold text-white group-hover:text-teal-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-400">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
