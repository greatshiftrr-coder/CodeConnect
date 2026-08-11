export default function GuidelinesPage() {
  return (
    <main className="flex-grow bg-surface py-12 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-display font-bold text-on-surface">Community Guidelines</h1>
        <p className="text-on-surface-variant leading-relaxed">
          To maintain a high-quality marketplace, we expect all developers and clients to follow these guidelines.
        </p>
        <ul className="list-disc pl-6 text-on-surface-variant space-y-2 mt-4">
          <li><strong>Professionalism:</strong> Always communicate respectfully and clearly.</li>
          <li><strong>Transparency:</strong> Provide accurate information about your skills, budget, and project requirements.</li>
          <li><strong>Quality:</strong> Deliver work that meets or exceeds the agreed-upon standards.</li>
          <li><strong>Security:</strong> Protect sensitive information and never share credentials openly.</li>
        </ul>
      </div>
    </main>
  );
}
