'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function PostRequestPage() {
  const { user, token, loading, signIn } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState('FIXED PRICE');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [skills, setSkills] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-4">Sign In Required</h1>
        <p className="text-on-surface-variant mb-8 text-lg">You must be logged in to post a new request.</p>
        <button onClick={signIn} className="px-8 py-3 bg-secondary text-on-secondary rounded font-semibold hover:bg-secondary-fixed transition-colors active:scale-95 shadow-md">
          Sign In with Google
        </button>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          budgetType,
          budgetMin: budgetMin || undefined,
          budgetMax: budgetMax || undefined,
          skills: skillsArray
        })
      });
      
      if (!res.ok) throw new Error('Failed to create project');
      
      router.push('/projects');
    } catch (err) {
      console.error(err);
      alert('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Post a Request</h1>
          <p className="text-on-surface-variant">Describe what you need built and let talented developers come to you.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface">Project Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              placeholder="e.g. E-commerce Platform Migration"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface">Description</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y"
              placeholder="Provide a detailed description of your requirements, current tech stack, and goals..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="block text-sm font-semibold text-on-surface">Budget Type</label>
               <select 
                 value={budgetType}
                 onChange={(e) => setBudgetType(e.target.value)}
                 className="w-full bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
               >
                 <option value="FIXED PRICE">Fixed Price</option>
                 <option value="HOURLY">Hourly Rate</option>
               </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface">Min Budget ($)</label>
                  <input 
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface">Max Budget ($)</label>
                  <input 
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                    placeholder="e.g. 1500"
                  />
                </div>
             </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface">Required Skills (Comma separated)</label>
            <input 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              placeholder="e.g. React, Node.js, Stripe"
            />
          </div>
          
          <div className="pt-4 border-t border-outline-variant">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full md:w-auto px-8 py-3 bg-secondary text-on-secondary rounded font-semibold hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors active:scale-95 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
