import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>

          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p>
                This Privacy Policy explains how we collect, use, and protect your information when you use
                the Employment Tribunal Documents website ("the Service"). We are committed to protecting your
                privacy and complying with UK data protection laws, including the UK GDPR and Data Protection Act 2018.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
              <p>
                We collect minimal information necessary to provide the Service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Uploaded Documents:</strong> Files you upload for processing (temporarily stored during processing only)
                </li>
                <li>
                  <strong>Technical Information:</strong> IP address, browser type, device information (for security and error logging)
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, features used (anonymized analytics)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p>
                We use your information solely to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your uploaded documents through our AI agents</li>
                <li>Provide you with the processed document output</li>
                <li>Maintain and improve the Service</li>
                <li>Detect and prevent technical issues or abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Retention and Deletion</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                <p className="font-semibold text-green-900">
                  Important: Your uploaded files are deleted immediately after processing is complete.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Uploaded Files:</strong> Deleted within minutes of processing completion</li>
                <li><strong>Generated Documents:</strong> Delivered to you immediately, not stored on our servers</li>
                <li><strong>Technical Logs:</strong> Retained for 30 days for security purposes (no document content included)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Sharing and Third Parties</h2>
              <p>
                We do not sell or share your personal data. We may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Anthropic:</strong> Your document content is processed using Claude API (subject to Anthropic's privacy policy)</li>
                <li><strong>Hosting Provider:</strong> Technical data necessary for service operation</li>
                <li><strong>Legal Authorities:</strong> If required by law or to protect rights and safety</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Your Rights (UK GDPR)</h2>
              <p>
                Under UK data protection law, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure of your data</li>
                <li>Object to processing</li>
                <li>Data portability</li>
                <li>Lodge a complaint with the ICO (Information Commissioner's Office)</li>
              </ul>
              <p className="mt-4">
                Note: Due to our immediate deletion policy, most data will already be erased before you could exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure file upload and processing</li>
                <li>Immediate file deletion after processing</li>
                <li>Regular security updates and monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Cookies</h2>
              <p>
                We use minimal cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the Service to function (session management)</li>
                <li><strong>Analytics Cookies:</strong> Anonymized usage statistics (optional, you can opt-out)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Children's Privacy</h2>
              <p>
                The Service is not intended for users under 18. We do not knowingly collect data from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
              <p>
                For questions about this Privacy Policy or to exercise your rights, please contact us through our
                <Link href="/support" className="text-primary hover:underline ml-1">Support page</Link>.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold mb-2">Key Takeaways</h3>
              <ul className="text-sm space-y-1">
                <li>✓ Files deleted immediately after processing</li>
                <li>✓ No persistent storage of your documents</li>
                <li>✓ Minimal data collection</li>
                <li>✓ Full UK GDPR compliance</li>
                <li>✓ No selling or sharing of your data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
