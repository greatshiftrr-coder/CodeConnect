'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  const router = useRouter();

  const { user, token, loading: authLoading, signIn } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyMessage, setReplyMessage] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to fetch project');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId]);

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/projects');
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyMessage }),
      });
      if (!res.ok) throw new Error('Failed to post reply');
      
      // Refresh project to get new replies
      const freshRes = await fetch(`/api/projects/${projectId}`);
      const freshData = await freshRes.json();
      setProject(freshData);
      setReplyMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to post reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleStartConversation = async (developerId: number) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: project.id,
          clientId: project.client.id,
          developerId: developerId
        })
      });
      if (!res.ok) throw new Error('Failed to start conversation');
      const convo = await res.json();
      router.push(`/messages/${convo.id}`);
    } catch (err) {
      alert('Failed to start conversation.');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-on-surface-variant text-lg">{error || 'Project not found.'}</p>
          <Link href="/projects" className="text-secondary font-medium mt-4 inline-block hover:underline">
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <Link href="/projects" className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
            {user && project.client?.uid === user.uid && (
              <button 
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="inline-flex items-center text-sm font-medium text-error hover:text-error/80 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Request'}
              </button>
            )}
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-on-surface">{project.title}</h1>
                <div className="flex items-center gap-2 mt-3 text-on-surface-variant text-sm">
                  <span>Posted by <span className="font-medium text-on-surface">{project.client?.name || 'Anonymous'}</span></span>
                  <span>•</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span className="font-mono text-sm font-medium bg-surface-container-high px-3 py-1.5 rounded text-primary border border-outline-variant/30">
                {project.budgetMin || project.budgetMax ? 
                  `$${project.budgetMin || 0}${project.budgetMax ? ' - $' + project.budgetMax : '+'}` 
                  : 'Budget Negotiable'
                }
              </span>
            </div>

            <div className="prose prose-on-surface max-w-none mb-8">
              <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{project.description}</p>
            </div>
            
            {project.skills && project.skills.length > 0 && (
              <div className="border-t border-outline-variant pt-6">
                <h4 className="text-sm font-semibold text-on-surface mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((s: any) => (
                    <span key={s.id} className="text-xs font-mono px-2.5 py-1.5 rounded border border-outline-variant text-on-surface-variant bg-surface">
                      {s.skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-display font-bold text-on-surface">Proposals & Replies ({project.replies?.length || 0})</h2>
            
            {/* Developer's quick message to requester (if they didn't reply yet or just want to chat) */}
            {user && project.client?.uid !== user.uid && (
              <button 
                onClick={() => handleStartConversation(user.uid ? -1 : -1)} // Actually, for the developer, they pass their own ID. But wait, handleStartConversation takes the db developerId. Let's just create a separate specific one for developer if needed. We'll stick to client->dev for now, or just handle it if they replied.
                className="hidden" // Hiding this half-baked idea to focus on client messaging devs from replies.
              />
            )}
          </div>
          
          <div className="space-y-4">
            {project.replies?.map((reply: any) => (
              <div key={reply.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                      {reply.developer?.name ? reply.developer.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">{reply.developer?.name || 'Developer'}</h4>
                      <p className="text-xs text-on-surface-variant">{new Date(reply.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {user && project.client?.uid === user.uid && (
                    <button 
                      onClick={() => handleStartConversation(reply.developer.id)}
                      className="text-xs font-medium text-secondary hover:text-secondary-fixed bg-secondary/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Message Developer
                    </button>
                  )}
                  {user && reply.developer?.uid === user.uid && (
                    <button 
                      onClick={() => handleStartConversation(reply.developer.id)}
                      className="text-xs font-medium text-secondary hover:text-secondary-fixed bg-secondary/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      Message Requester
                    </button>
                  )}
                </div>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{reply.message}</p>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Submit a Proposal</h3>
            {user ? (
              <form onSubmit={handleReplySubmit}>
                <textarea
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Describe why you are a good fit for this project..."
                  className="w-full h-32 bg-surface border border-outline-variant rounded px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y mb-4 text-sm"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyMessage.trim()}
                    className="px-6 py-2.5 bg-secondary text-on-secondary rounded font-semibold hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submittingReply ? 'Submitting...' : 'Post Reply'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-on-surface-variant mb-4">You must be logged in to reply to this project.</p>
                <button onClick={signIn} className="px-6 py-2 bg-secondary text-on-secondary rounded font-medium hover:bg-secondary-fixed transition-colors">
                  Sign In to Reply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
