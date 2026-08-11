'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const { user, token, loading: authLoading, signIn } = useAuth();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    async function fetchConversations() {
      try {
        const res = await fetch('/api/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchConversations();
  }, [token]);

  if (authLoading || (user && loading)) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-display font-bold text-on-surface">Sign In Required</h1>
          <p className="text-on-surface-variant">Please sign in to view your messages.</p>
          <button onClick={signIn} className="px-6 py-2.5 bg-secondary text-on-secondary rounded font-semibold hover:bg-secondary-fixed transition-colors">
            Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Messages</h1>
          <p className="text-on-surface-variant">Communicate directly about your projects and proposals.</p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16 border border-outline-variant border-dashed rounded-xl bg-surface-container-lowest">
            <MessageSquare className="w-12 h-12 text-outline mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg">No conversations yet.</p>
            <p className="text-on-surface-variant text-sm mt-2">When you reply to a project or someone messages you, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map(convo => {
              const otherUser = convo.client.uid === user.uid ? convo.developer : convo.client;
              return (
                <Link href={`/messages/${convo.id}`} key={convo.id} className="block bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:border-secondary hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg text-on-surface group-hover:text-primary transition-colors">{otherUser.name}</h3>
                      <p className="text-sm text-on-surface-variant mt-1">Project: <span className="font-medium text-on-surface">{convo.project.title}</span></p>
                    </div>
                    <div className="text-xs text-outline font-medium">
                      {new Date(convo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
