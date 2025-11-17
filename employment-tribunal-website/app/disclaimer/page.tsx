import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '@/lib/constants';

export default function DisclaimerPage() {
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
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <h1 className="text-4xl font-bold">Legal Disclaimer</h1>
          </div>

          <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-8 mb-8">
            <div className="whitespace-pre-line text-base leading-relaxed text-gray-800">
              {LEGAL_DISCLAIMER}
            </div>
          </div>

          <div className="prose prose-blue max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">What This Service Is</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>An AI-assisted document preparation tool</li>
                <li>A way to generate draft Employment Tribunal documents</li>
                <li>A free service to help organize your case information</li>
                <li>A tool that follows Employment Tribunal best practices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">What This Service Is NOT</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                <ul className="list-disc list-inside space-y-2 text-red-900">
                  <li><strong>NOT legal advice</strong> - We cannot advise you on your specific situation</li>
                  <li><strong>NOT legal representation</strong> - We will not represent you at tribunal</li>
                  <li><strong>NOT a substitute for a solicitor</strong> - You should still seek professional legal advice</li>
                  <li><strong>NOT regulated</strong> - We are not regulated by the SRA or BSB</li>
                  <li><strong>NOT creating a professional relationship</strong> - No solicitor-client privilege applies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Who We Are (and Who We Are Not)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">We Are:</h3>
                  <ul className="text-sm space-y-1 text-green-900">
                    <li>• Developers of AI tools</li>
                    <li>• Technology service providers</li>
                    <li>• Document automation specialists</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">We Are NOT:</h3>
                  <ul className="text-sm space-y-1 text-red-900">
                    <li>• Solicitors</li>
                    <li>• Barristers</li>
                    <li>• Legal advisors</li>
                    <li>• Regulated by SRA or BSB</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Why You Should Consult a Solicitor</h2>
              <p className="mb-4">
                Employment Tribunal cases involve complex legal issues. A qualified solicitor can:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide advice specific to your situation</li>
                <li>Assess the strength of your case</li>
                <li>Represent you at hearings</li>
                <li>Negotiate on your behalf</li>
                <li>Ensure you meet all legal requirements and deadlines</li>
                <li>Protect your legal rights</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium text-blue-900">
                  💡 Tip: Many solicitors offer free initial consultations for employment cases.
                  Some may work on a "no win, no fee" basis.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Limitations and Risks</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold mb-1">AI Limitations</h4>
                  <p className="text-sm text-muted-foreground">
                    AI can make mistakes, misunderstand context, or produce inaccurate content.
                    Always review and verify all generated documents.
                  </p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold mb-1">No Guarantee of Success</h4>
                  <p className="text-sm text-muted-foreground">
                    Using our documents does not guarantee success in your tribunal case.
                    Outcomes depend on many factors beyond document quality.
                  </p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <h4 className="font-semibold mb-1">Your Responsibility</h4>
                  <p className="text-sm text-muted-foreground">
                    You are responsible for reviewing all generated content, ensuring accuracy,
                    and making your own decisions about your case.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Jurisdiction</h2>
              <p>
                This service is designed for Employment Tribunal matters in <strong>England and Wales only</strong>.
                It may not be suitable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Scotland (different legal system)</li>
                <li>Northern Ireland (different legal system)</li>
                <li>Other countries</li>
                <li>Other types of tribunals or courts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Use at Your Own Risk</h2>
              <p>
                By using this service, you acknowledge and accept that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are using the service entirely at your own risk</li>
                <li>We provide no warranties or guarantees</li>
                <li>We are not liable for any errors, omissions, or outcomes</li>
                <li>You should seek professional legal advice</li>
                <li>You are responsible for checking all generated content</li>
              </ul>
            </section>

            <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                ⚠️ IMPORTANT REMINDER
              </h3>
              <p className="text-amber-900 font-medium">
                This disclaimer is not just a formality. Employment Tribunal cases have serious legal and financial
                implications. AI-generated documents should be reviewed by a qualified solicitor before use.
                We strongly recommend seeking professional legal advice for your specific situation.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                By using this service, you confirm that you have read, understood, and accept this disclaimer.
              </p>
              <Button size="lg" asChild>
                <Link href="/process">I Understand - Continue to Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
