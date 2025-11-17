import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Scale } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-blue-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium">
            <Scale className="h-4 w-4" />
            <span>Employment Tribunal Document Assistance</span>
          </div>

          <h1 className="heading-hero">
            AI-Powered Employment Tribunal Document Preparation
          </h1>

          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Get professional assistance with your Employment Tribunal documents.
            Our specialized AI agents help you prepare ET1 claims, witness statements,
            chronologies, and more - following legal best practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="/process">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <Link href="/support">Learn More</Link>
            </Button>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6 text-left max-w-2xl mx-auto">
            <p className="text-sm font-medium text-amber-900 mb-2">
              Important Notice
            </p>
            <p className="text-sm text-amber-800">
              This is NOT legal advice. We are not solicitors and are not regulated by the SRA or BSB.
              Always consult a qualified solicitor for your specific case.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Free to Use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>6 Specialized Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon />
              <span>Instant Processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 text-green-600"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M5 13l4 4L19 7"></path>
    </svg>
  );
}
