'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProjectList() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    if (!query) return true;
    const lowerQ = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(lowerQ) ||
      p.description.toLowerCase().includes(lowerQ) ||
      p.skills?.some((s: any) => s.skill.toLowerCase().includes(lowerQ))
    );
  });

  return (
    <>
      {query && (
        <div className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-lg">
          <p className="font-medium">Showing results for: &quot;{query}&quot;</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded text-center">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 border border-outline-variant border-dashed rounded-xl">
          <p className="text-on-surface-variant mb-4">No projects found.</p>
          <Link href="/post-request" className="text-secondary font-semibold hover:underline">Be the first to post a request</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Link href={`/projects/${project.id}`} key={project.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:border-secondary hover:shadow-[0_12px_24px_rgba(46,49,146,0.08)] transition-all flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="font-display text-[18px] font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <span className="font-mono text-[12px] font-medium bg-surface-container-high px-2 py-1 rounded text-primary whitespace-nowrap">
                  {project.budgetMin || project.budgetMax ? 
                    `$${project.budgetMin || 0}${project.budgetMax ? ' - $' + project.budgetMax : '+'}` 
                    : 'Negotiable'
                  }
                </span>
              </div>
              
              <p className="text-[14px] text-on-surface-variant line-clamp-3 mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills && project.skills.map((s: any) => (
                    <span key={s.id} className="text-[11px] font-mono px-2 py-1 rounded border border-outline-variant text-on-surface-variant bg-surface">
                      {s.skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">
                      {project.client?.name ? project.client.name.charAt(0) : 'A'}
                    </div>
                    <span className="text-[13px] text-on-surface-variant font-medium">{project.client?.name || 'Anonymous'}</span>
                  </div>
                  <span className="text-[12px] text-outline">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function ProjectsPage() {
  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Browse Projects</h1>
            <p className="text-on-surface-variant">Find the perfect project for your skills.</p>
          </div>
          <Link href="/post-request" className="px-6 py-2.5 bg-secondary text-on-secondary rounded font-semibold hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors active:scale-95 shadow-sm inline-flex items-center justify-center">
            Post a Request
          </Link>
        </div>
        
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div></div>}>
          <ProjectList />
        </Suspense>
      </div>
    </main>
  );
}
