'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthProvider';

interface NotificationContextType {
  enabled: boolean;
  toggle: () => void;
}

const NotificationContext = createContext<NotificationContextType>({ enabled: false, toggle: () => {} });

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const pref = localStorage.getItem('notificationsEnabled');
    return pref === 'true' && ('Notification' in window) && Notification.permission === 'granted';
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const lastCheckRef = useRef<string>('');

  useEffect(() => {
    // Initialize lastCheckRef
    lastCheckRef.current = new Date().toISOString();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const toggle = async () => {
    if (!('Notification' in window)) {
      showToast('This browser does not support desktop notifications.');
      return;
    }

    if (!enabled) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          lastCheckRef.current = new Date().toISOString(); // Reset check time when enabling
          new Notification('Notifications Enabled', { 
            body: 'You will receive updates for new messages and proposals.',
            icon: '/favicon.ico'
          });
          showToast('Desktop notifications enabled.');
        } else {
          showToast('Please allow notifications in your browser settings to use this feature.');
        }
      } catch (err) {
        showToast('Unable to request notification permission in this environment (e.g. within an iframe without proper permissions). Please open the app in a new tab.');
      }
    } else {
      setEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      showToast('Desktop notifications disabled.');
    }
  };

  useEffect(() => {
    if (!enabled || !token || !user) return;

    const intervalId = setInterval(async () => {
      try {
        const since = lastCheckRef.current;
        const currentCheck = new Date().toISOString();
        
        const res = await fetch(`/api/notifications?since=${encodeURIComponent(since)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          let notify = false;
          
          if (data.messages && data.messages.length > 0) {
            new Notification('New Message', { 
              body: `You have ${data.messages.length} new message(s).`,
              icon: '/favicon.ico'
            });
            notify = true;
          }
          
          if (data.replies && data.replies.length > 0) {
            new Notification('New Proposal', { 
              body: `You received ${data.replies.length} new proposal(s) on your project(s).`,
              icon: '/favicon.ico'
            });
            notify = true;
          }
          
          // Only update the time if the fetch was successful, to avoid dropping notifications during temporary network issues.
          lastCheckRef.current = currentCheck;
        }
      } catch (e) {
        console.error('Notification poll error', e);
      }
    }, 15000); // 15 seconds polling

    return () => clearInterval(intervalId);
  }, [enabled, token, user]);

  return (
    <NotificationContext.Provider value={{ enabled, toggle }}>
      {children}
      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-high text-on-surface px-6 py-3 rounded-full shadow-lg border border-outline-variant z-50 text-sm font-medium">
          {toastMsg}
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
