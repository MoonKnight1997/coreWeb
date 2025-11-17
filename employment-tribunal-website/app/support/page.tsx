import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Mail, HelpCircle, Github, Coffee } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-5xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-border p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Support This Project</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This service is completely free to use. If you find it helpful, consider supporting
              the project to help cover development and hosting costs.
            </p>
          </div>

          {/* Donation Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Ways to Support</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Coffee className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">Buy Me a Coffee</CardTitle>
                  <CardDescription className="text-center">
                    One-time donation via PayPal
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-mono break-all">
                      paypal.me/example
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <a href="https://paypal.me/example" target="_blank" rel="noopener noreferrer">
                      Donate via PayPal
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Heart className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center">GitHub Sponsors</CardTitle>
                  <CardDescription className="text-center">
                    Recurring or one-time support
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm">
                      Support via GitHub Sponsors program
                    </p>
                  </div>
                  <Button asChild className="w-full" variant="outline">
                    <a href="https://github.com/sponsors/example" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Sponsor on GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
                        <path d="M12 6c-1.66 0-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1c-1.1 0-2 .9-2 2v1h2v-1c1.1 0 2-.9 2-2 0-1.66-1.34-3-3-3zm-1 10h2v2h-2v-2z"/>
                      </svg>
                    </div>
                  </div>
                  <CardTitle className="text-center">Cryptocurrency</CardTitle>
                  <CardDescription className="text-center">
                    Donate via Bitcoin or Ethereum
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1">Bitcoin (BTC):</p>
                      <p className="text-xs font-mono break-all">
                        bc1q...example
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1">Ethereum (ETH):</p>
                      <p className="text-xs font-mono break-all">
                        0x...example
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Other Ways to Help */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Other Ways to Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spread the Word</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help others find this free service by sharing it with anyone who might need
                    Employment Tribunal document assistance.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>• Share on social media</li>
                    <li>• Tell colleagues and friends</li>
                    <li>• Link from your website</li>
                    <li>• Recommend to support organizations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Provide Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your feedback helps improve the service for everyone. Let us know about:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li>• Bugs or technical issues</li>
                    <li>• Feature suggestions</li>
                    <li>• Document quality feedback</li>
                    <li>• User experience improvements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Is this service really free?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, absolutely! This service is 100% free to use with no hidden fees, subscriptions,
                  or requirements. Donations are entirely optional and appreciated.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Do I need to donate to use the service?</h3>
                <p className="text-sm text-muted-foreground">
                  No. The service is free for everyone regardless of whether you donate.
                  Donations help cover hosting and development costs.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Where do donations go?</h3>
                <p className="text-sm text-muted-foreground">
                  Donations help cover:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 ml-4">
                  <li>AI API costs (Anthropic Claude)</li>
                  <li>Server hosting fees</li>
                  <li>Domain registration</li>
                  <li>Development time</li>
                  <li>Service improvements</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Can I get legal advice here?</h3>
                <p className="text-sm text-muted-foreground">
                  No. This is NOT a legal advice service. We are NOT solicitors. For legal advice,
                  please consult a qualified solicitor. See our
                  <Link href="/disclaimer" className="text-primary hover:underline ml-1">Legal Disclaimer</Link>.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">How do I get help with the service?</h3>
                <p className="text-sm text-muted-foreground">
                  For technical support or questions about using the service, please contact us using
                  the information below.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">Contact Us</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Get in Touch</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For support, feedback, or general inquiries, please reach out:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Email:</strong>
                      <a href="mailto:support@example.com" className="text-primary hover:underline ml-2">
                        support@example.com
                      </a>
                    </p>
                    <p>
                      <strong>GitHub:</strong>
                      <a href="https://github.com/example/repo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                        github.com/example/repo
                      </a>
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Note: We cannot provide legal advice. For legal questions, consult a qualified solicitor.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Thank You Message */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Whether you donate or simply use the service, thank you for being part of this project.
                Your support helps keep this service free and accessible for everyone who needs it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
