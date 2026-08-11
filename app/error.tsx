'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <main className="flex-grow flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-primary font-display">Something went wrong!</h1>
        <p className="text-on-surface-variant">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-secondary text-on-secondary rounded-lg font-medium hover:bg-secondary-fixed transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-medium hover:bg-surface-container-highest transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
