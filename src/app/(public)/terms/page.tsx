export const metadata = {
  title: "Terms of Service | LocalWork",
  description: "Terms and conditions governing the use of the LocalWork platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="page-container max-w-4xl">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-card space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Legal Documentation
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-navy mt-2">
              Terms of Service
            </h1>
            <p className="text-xs text-text-muted mt-2">
              Last Updated: October 2026
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-text-secondary space-y-6">
            <section>
              <h2 className="text-lg font-bold text-text mb-2">1. Agreement to Terms</h2>
              <p>
                By accessing or using the LocalWork marketplace website and services, you agree to be bound by these Terms of Service. If you do not agree, you must not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">2. Independent Contractor Relationship</h2>
              <p>
                LocalWork provides an introductory marketplace. Service professionals are independent contractors, not employees, agents, or partners of LocalWork. LocalWork does not supervise, direct, or control the manner in which professionals perform their trade services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">3. Professional Obligations</h2>
              <p>
                Service professionals agree to maintain valid business licenses, certifications, and necessary liability insurance as required by applicable federal, state, and municipal regulations. Professionals must accurately describe their skills and experience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">4. Authentic Reviews Standard</h2>
              <p>
                Reviews must reflect legitimate, firsthand service experiences. Astroturfing, fake positive reviews, competitor defamation, or incentivized reviews are strictly prohibited and result in permanent platform suspension.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text mb-2">5. Limitation of Liability</h2>
              <p>
                LocalWork disclaims liability for property damage, injuries, disputes, or losses resulting from contractual agreements entered into between users and independent service professionals. Users are encouraged to verify insurance coverage prior to commencing high-value projects.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
