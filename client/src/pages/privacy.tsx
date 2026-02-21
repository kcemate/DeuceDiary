import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-muted-foreground hover:underline mb-6 inline-block">&larr; Back</Link>

        <h1 className="text-3xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Effective February 21, 2026</p>

        <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. What We Collect</h2>
            <p>
              Deuce Diary collects only the data you voluntarily provide:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Username</strong> &mdash; the display name you choose when signing up.</li>
              <li><strong>Log timestamps</strong> &mdash; the date and time you record a deuce.</li>
              <li><strong>Thoughts</strong> &mdash; the text you type while on the throne (up to 500 characters of pure wisdom).</li>
              <li><strong>Location labels</strong> &mdash; the name you assign to a location (e.g. "Home Base", "Office").</li>
              <li><strong>Group membership</strong> &mdash; which groups you create or join.</li>
              <li><strong>Reactions</strong> &mdash; emoji reactions to other members' logs.</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> collect GPS coordinates, IP-based geolocation, contacts, photos, or any biometric data.
              We don't want to know <em>that</em> much about your bathroom habits.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Display your logs and stats to you and your group members.</li>
              <li>Calculate streaks, leaderboards, and analytics within your groups.</li>
              <li>Send in-app notifications when squad members log a deuce (if enabled).</li>
            </ul>
            <p className="mt-2">We will never sell your data, serve ads based on your bathroom schedule, or train AI models on your throne thoughts.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. Data Sharing</h2>
            <p>
              Your logs are visible <strong>only</strong> to members of the groups you post to. We do not share your data with third-party advertisers, analytics firms, or anyone outside the app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Data Storage &amp; Security</h2>
            <p>
              Your data is stored on secure servers. Session data is encrypted in transit. We retain your account data for as long as your account is active.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Your Rights</h2>
            <p>You can:</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Delete individual logs at any time.</li>
              <li>Leave any group to remove your visibility in that group.</li>
              <li>Request full account deletion by contacting us.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Children&apos;s Privacy</h2>
            <p>
              Deuce Diary is not intended for users under 13. We do not knowingly collect data from children. If you believe a child has created an account, please contact us so we can remove it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We&apos;ll notify users of material changes within the app. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. Contact</h2>
            <p>
              Questions or concerns? Reach out at <strong>support@deucediary.app</strong>. We promise to read your email — even if we're on the throne.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <span className="mx-2">&middot;</span>
          <Link href="/" className="hover:underline">Home</Link>
        </div>
      </div>
    </div>
  );
}
