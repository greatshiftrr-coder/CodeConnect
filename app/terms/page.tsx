export default function TermsPage() {
  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-display font-bold text-on-surface">Terms of Service</h1>
        <p className="text-on-surface-variant leading-relaxed">
          By accessing or using CodeConnect, you agree to be bound by these Terms.
        </p>
        <h2 className="text-xl font-semibold text-on-surface mt-8">User Responsibilities</h2>
        <p className="text-on-surface-variant leading-relaxed">
          You are responsible for your use of the services and for any content you provide, including compliance with applicable laws, rules, and regulations.
        </p>
        <h2 className="text-xl font-semibold text-on-surface mt-8">Prohibited Conduct</h2>
        <p className="text-on-surface-variant leading-relaxed">
          You agree not to engage in any prohibited conduct, including but not limited to interfering with the services, bypassing security measures, or scraping data.
        </p>
      </div>
    </main>
  );
}
