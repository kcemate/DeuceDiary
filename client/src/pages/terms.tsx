import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-muted-foreground hover:underline mb-6 inline-block">&larr; Back</Link>

        <h1 className="text-3xl font-extrabold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Effective February 21, 2026</p>

        <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Acceptance</h2>
            <p>
              By using Deuce Diary ("the App"), you agree to these Terms of Service. If you don&apos;t agree, please close the app and find a less legendary way to track your bathroom habits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use Deuce Diary. By creating an account, you confirm you meet this age requirement. Potty training status is not a factor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Your Account</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are responsible for maintaining the security of your account.</li>
              <li>One account per person. No bot accounts, no sockpuppets, no phantom poopers.</li>
              <li>Your username must not impersonate another person or contain slurs, hate speech, or personally identifiable information of others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Acceptable Use</h2>
            <p>When using Deuce Diary, you agree <strong>not</strong> to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Post content that is illegal, harassing, threatening, or hateful.</li>
              <li>Share explicit or graphic content (bathroom humor is fine; bathroom photos are not).</li>
              <li>Spam groups with fake logs or automated submissions.</li>
              <li>Attempt to access other users' accounts or private data.</li>
              <li>Reverse-engineer, scrape, or attack the App&apos;s infrastructure.</li>
            </ul>
            <p className="mt-2">
              We reserve the right to suspend or terminate accounts that violate these rules. Keep it fun, keep it clean (well, as clean as a bathroom app can be).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Content Ownership</h2>
            <p>
              You retain ownership of the content you post. By posting throne thoughts, you grant Deuce Diary a non-exclusive, royalty-free license to display that content to your group members within the App. We will not use your content for marketing or external purposes without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Availability &amp; Warranty</h2>
            <p>
              Deuce Diary is provided "as is." We do our best to keep the throne room open 24/7, but we can&apos;t guarantee uninterrupted service. We are not liable for lost streaks due to server downtime, and we make no warranty — express or implied — regarding the reliability, accuracy, or completeness of the App.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Deuce Diary and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App. This includes, but is not limited to, lost data, lost streaks, bruised egos from leaderboard rankings, or any decisions made while sitting on the throne.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. Termination</h2>
            <p>
              You may delete your account at any time. We may suspend or terminate your account for violations of these Terms. Upon termination, your data will be deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">9. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time. Material changes will be communicated within the App. Continued use after changes means you accept the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the United States. Any disputes shall be resolved in the courts of the state where the App&apos;s operators are based.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">11. Contact</h2>
            <p>
              Questions about these terms? Email us at <strong>support@deucediary.app</strong>. We read every message — sometimes from the throne itself.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span className="mx-2">&middot;</span>
          <Link href="/" className="hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
}
