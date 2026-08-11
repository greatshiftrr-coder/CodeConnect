export default function HelpPage() {
  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-display font-bold text-on-surface">Help Center</h1>
        <p className="text-on-surface-variant leading-relaxed">
          Welcome to the CodeConnect Help Center. Here you can find answers to frequently asked questions and learn how to get the most out of our platform.
        </p>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-on-surface text-lg">How do I post a request?</h3>
          <p className="text-on-surface-variant mt-2">
            You must first sign in. Once authenticated, click &quot;Post a Request&quot; in the navigation bar to submit your project requirements.
          </p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 mt-4">
          <h3 className="font-semibold text-on-surface text-lg">How do I browse projects?</h3>
          <p className="text-on-surface-variant mt-2">
            Click &quot;Browse Projects&quot; in the navigation bar to view all publicly posted requests from clients.
          </p>
        </div>
      </div>
    </main>
  );
}
