export const metadata = {
  title: "Privacy Policy | LocalWork",
  description: "Learn how LocalWork collects, uses, and safeguards your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="page-container max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-card space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Legal Documentation
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-navy mt-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-text-muted mt-2">
              Last Updated: October 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-text-secondary space-y-6">
            <section>
              <h2 className="text-lg font-bold text-text mb-2">1. Information We Collect</h2>
              <p>
                When you create an account on LocalWork as a customer or service professional, we collect information including your name, email address, phone number, and location (city/neighborhood). For professionals, we also collect business details, work history, skills, credentials, and uploaded portfolio imagery.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">2. How We Use Your Information</h2>
              <p>
                We use collected information to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Facilitate discovery and service requests between customers and local professionals.</li>
                <li>Verify the credentials and identity of service professionals.</li>
                <li>Send platform notifications regarding service request updates and new messages.</li>
                <li>Prevent fraudulent activity, spam, and platform misuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">3. Information Sharing and Disclosure</h2>
              <p>
                We strictly do <strong>not</strong> sell your personal data or phone number to third-party marketing brokers. Your service request details (name, job description, general area) are only shared with the specific professional you choose to contact.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">4. Data Security</h2>
              <p>
                All network transmissions are encrypted using Transport Layer Security (TLS/HTTPS). User credentials and passwords are encrypted using industry-standard cryptographic algorithms. Database access is guarded with strict Row Level Security (RLS) policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">5. Your Privacy Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal account data at any time by visiting your Account Settings or emailing privacy@localwork.app.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
