import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { AgentShowcase } from '@/components/AgentShowcase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AgentShowcase />
      <HowItWorks />

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-lg opacity-90">
              Upload your documents and let our specialized AI agents help you
              prepare professional Employment Tribunal documents in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/process">Start Now - It's Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/support">Support This Project</Link>
              </Button>
            </div>
            <p className="text-sm opacity-75">
              No account required • Files deleted immediately after processing • 100% free
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
