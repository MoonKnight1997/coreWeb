import { PROCESS_STEPS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-section mb-4">How It Works</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Our simple 4-step process helps you create professional Employment Tribunal
            documents in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <Card key={step.number} className="relative">
              <CardHeader>
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-3">
                    {step.number}
                  </div>
                  <div className="text-4xl mb-2">{step.icon}</div>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>

              {step.number < 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-primary/30"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">
              What Makes Our Agents Special?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-primary">
                  Specialized Expertise
                </div>
                <p className="text-muted-foreground">
                  Each agent is trained specifically for one document type, ensuring expert-level output
                </p>
              </div>
              <div>
                <div className="font-semibold mb-2 text-primary">
                  Legal Best Practices
                </div>
                <p className="text-muted-foreground">
                  All documents follow Employment Tribunal guidelines and legal requirements
                </p>
              </div>
              <div>
                <div className="font-semibold mb-2 text-primary">
                  Quality Validation
                </div>
                <p className="text-muted-foreground">
                  Every document is validated against best practices before delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
