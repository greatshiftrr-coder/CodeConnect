import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-stack-lg bg-tertiary mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="col-span-1 lg:col-span-1 space-y-4">
          <Link href="/" className="font-display text-[24px] font-semibold text-on-tertiary tracking-tight block">
            CodeConnect
          </Link>
          <p className="text-[14px] text-tertiary-fixed-dim">
            © 2026 CodeConnect. Precision Engineering for Custom Web.
          </p>
        </div>
        <div className="col-span-1 lg:col-span-3 flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-4 lg:justify-end items-start sm:items-center">
          <Link href="/privacy" className="text-[14px] text-tertiary-fixed-dim hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-[14px] text-tertiary-fixed-dim hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/help" className="text-[14px] text-tertiary-fixed-dim hover:text-white transition-colors">Help Center</Link>
          <Link href="/api-docs" className="text-[14px] text-tertiary-fixed-dim hover:text-white transition-colors">API Documentation</Link>
          <Link href="/guidelines" className="text-[14px] text-tertiary-fixed-dim hover:text-white transition-colors">Community Guidelines</Link>
        </div>
      </div>
    </footer>
  );
}
