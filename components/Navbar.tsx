'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, User, Bell, BellOff } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useNotifications } from './NotificationProvider';

export function Navbar() {
  const { user, signIn, logout, loading } = useAuth();
  const { enabled, toggle } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/projects?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-surface border-b border-outline-variant shadow-sm transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-[24px] font-bold text-primary tracking-tight transition-all active:text-cyan-400 active:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] duration-150">
            CodeConnect
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/projects" className="text-[16px] text-on-surface-variant pb-1 hover:text-secondary transition-colors active:scale-95">Browse Projects</Link>
            <Link href="/post-request" className="text-[16px] text-on-surface-variant pb-1 hover:text-secondary transition-colors active:scale-95">Post a Request</Link>
            {user && (
              <Link href="/messages" className="text-[16px] text-on-surface-variant pb-1 hover:text-secondary transition-colors active:scale-95">Messages</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
            <Search className="text-outline mr-2 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-[14px] w-48 placeholder-outline-variant text-on-surface"
            />
          </form>
          <div className="hidden sm:flex items-center gap-3">
            {loading ? (
               <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggle}
                  className="text-on-surface-variant hover:text-primary transition-colors p-1"
                  title={enabled ? "Disable Notifications" : "Enable Notifications"}
                >
                  {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
                <span className="text-[14px] font-medium text-on-surface-variant">{user.displayName}</span>
                <button onClick={logout} className="font-semibold text-[15px] text-primary hover:bg-surface-container px-4 py-2 rounded transition-colors active:scale-95">Log Out</button>
              </div>
            ) : (
              <>
                <button onClick={signIn} className="font-semibold text-[15px] text-primary hover:bg-surface-container px-4 py-2 rounded transition-colors active:scale-95">Sign In</button>
                <button onClick={signIn} className="font-semibold text-[15px] bg-secondary text-on-secondary px-5 py-2 rounded shadow-sm hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors active:scale-95">Join Now</button>
              </>
            )}
          </div>
          <button className="md:hidden text-primary p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
