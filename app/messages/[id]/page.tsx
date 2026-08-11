'use client';

import { useEffect, useState, useRef, use, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const convoId = unwrappedParams.id;
  const { user, token, loading: authLoading } = useAuth();
  
  const [convo, setConvo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversation = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/conversations/${convoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load conversation');
      const data = await res.json();
      setConvo(data);
    } catch (err) {
      setError('Conversation not found or unauthorized.');
    } finally {
      setLoading(false);
    }
  }, [convoId, token]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (mounted) {
        await fetchConversation();
      }
    };
    load();
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(() => {
      fetchConversation();
    }, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convo?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageUrl.trim()) return;
    
    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${convoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: message, imageUrl })
      });
      if (!res.ok) throw new Error('Failed to send message');
      
      setMessage('');
      setImageUrl('');
      setShowImageInput(false);
      await fetchConversation();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !convo || !user) {
    return (
      <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-on-surface-variant text-lg">{error || 'Please sign in.'}</p>
          <Link href="/messages" className="text-secondary font-medium mt-4 inline-block hover:underline">
            Back to Messages
          </Link>
        </div>
      </main>
    );
  }

  const otherUser = convo.client.uid === user.uid ? convo.developer : convo.client;
  const isClient = convo.client.uid === user.uid;

  // Auto-link URLs
  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">{part}</a>;
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  const filteredMessages = convo.messages?.filter((msg: any) => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <main className="flex-grow flex flex-col bg-surface h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full bg-surface-container-lowest border-x border-outline-variant shadow-sm">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-container-low">
          <div className="flex items-center gap-4">
            <Link href="/messages" className="p-2 hover:bg-surface rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </Link>
            <div>
              <h2 className="font-semibold text-lg text-on-surface">{otherUser.name}</h2>
              <Link href={`/projects/${convo.project.id}`} className="text-sm text-secondary hover:underline">
                Project: {convo.project.title}
              </Link>
            </div>
          </div>
          <div className="hidden sm:block relative">
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface border border-outline-variant rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-64"
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
          {searchQuery && filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <p>No messages match your search.</p>
            </div>
          ) : !convo.messages || convo.messages.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            filteredMessages.map((msg: any) => {
              const isMine = msg.sender.uid === user.uid;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 ${
                    isMine 
                      ? 'bg-secondary text-on-secondary rounded-tr-sm' 
                      : 'bg-surface-container border border-outline-variant text-on-surface rounded-tl-sm'
                  }`}>
                    {msg.imageUrl && (
                      <div className="mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={msg.imageUrl} alt="Attached image" className="max-w-full rounded-lg max-h-64 object-contain bg-black/10" />
                      </div>
                    )}
                    <div className="text-[15px] leading-relaxed break-words">
                      {renderMessageContent(msg.content)}
                    </div>
                    <div className={`text-[11px] mt-2 ${isMine ? 'text-on-secondary/70' : 'text-on-surface-variant'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant">
          <form onSubmit={handleSend} className="space-y-3">
            {showImageInput && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste an image URL here..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-grow bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                />
                <button type="button" onClick={() => setShowImageInput(false)} className="px-3 py-2 text-sm text-on-surface-variant hover:bg-surface rounded-lg">Cancel</button>
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`p-3 rounded-full hover:bg-surface-container-high transition-colors flex-shrink-0 ${showImageInput ? 'text-secondary' : 'text-on-surface-variant'}`}
                title="Attach Image URL"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow min-h-[52px] max-h-32 bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <button
                type="submit"
                disabled={sending || (!message.trim() && !imageUrl.trim())}
                className="p-3 bg-secondary text-on-secondary rounded-full hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors flex-shrink-0 disabled:opacity-50 active:scale-95 mb-1"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
