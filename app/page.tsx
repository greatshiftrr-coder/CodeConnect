import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <section className="relative pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary-fixed via-transparent to-transparent"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-12 max-w-3xl mx-auto text-center space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/50">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="font-mono text-[12px] font-medium text-on-surface-variant uppercase tracking-wider">The Premier Technical Marketplace</span>
            </div>
            
            <h1 className="font-display text-[32px] md:text-[48px] font-bold text-on-surface tracking-tight leading-tight">
              Your Website, <br className="hidden md:block" />
              <span className="text-primary relative inline-block">
                Built Your Way.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4"></path>
                </svg>
              </span>
            </h1>
            
            <p className="text-[18px] text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Connect with specialized developers to turn your technical vision into reality. From simple portfolio sites to complex web applications, find the right engineering talent or post your project and let them come to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center w-full">
              <Link href="/post-request" className="inline-flex justify-center items-center h-12 px-8 font-semibold text-[15px] bg-secondary text-on-secondary rounded shadow-[0_4px_14px_rgba(0,103,130,0.3)] hover:shadow-[0_6px_20px_rgba(0,103,130,0.4)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
                Post a Request
              </Link>
              <Link href="/projects" className="inline-flex justify-center items-center h-12 px-8 font-semibold text-[15px] bg-surface border border-outline-variant text-primary hover:border-secondary hover:bg-surface-container-low transition-all duration-200 active:scale-95">
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
