import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-6xl font-bold text-primary font-display">404</h1>
        <h2 className="text-2xl font-semibold text-on-surface">Page Not Found</h2>
        <p className="text-on-surface-variant">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-on-secondary rounded-lg font-medium hover:bg-secondary-fixed transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
