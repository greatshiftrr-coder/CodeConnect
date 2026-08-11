export default function ApiDocsPage() {
  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-display font-bold text-on-surface">API Documentation</h1>
        <p className="text-on-surface-variant leading-relaxed">
          Integrate CodeConnect seamlessly into your own applications using our public API endpoints.
        </p>
        <h2 className="text-xl font-semibold text-on-surface mt-8">Authentication</h2>
        <p className="text-on-surface-variant leading-relaxed">
          All API requests must include a valid Firebase ID token in the <code>Authorization</code> header using the Bearer schema.
        </p>
        <h2 className="text-xl font-semibold text-on-surface mt-8">Endpoints</h2>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 font-mono text-sm">
          <p><span className="text-primary font-bold">GET</span> /api/projects</p>
          <p className="text-on-surface-variant mt-2">Retrieves a list of all active projects.</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 font-mono text-sm mt-4">
          <p><span className="text-primary font-bold">POST</span> /api/projects</p>
          <p className="text-on-surface-variant mt-2">Creates a new project request. Requires authentication.</p>
        </div>
      </div>
    </main>
  );
}
