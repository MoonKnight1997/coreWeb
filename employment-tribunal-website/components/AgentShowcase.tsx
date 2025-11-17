import { AGENTS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AgentShowcase() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-section mb-4">Six Specialized Agents</h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Each agent is an expert in their specific document type, trained to follow
            Employment Tribunal best practices and legal requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(AGENTS).map((agent) => (
            <Card key={agent.id} className="card-agent">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{agent.icon}</span>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Key Capabilities:
                  </p>
                  <ul className="space-y-1.5">
                    {agent.capabilities.map((capability, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1 flex-shrink-0">✓</span>
                        <span className="text-muted-foreground">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white border border-border rounded-lg p-6 max-w-2xl">
            <h3 className="font-semibold mb-2">The Five Key Principles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All our agents follow these Employment Tribunal best practices:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="text-left">
                <span className="text-primary">✓</span> Clear chronology and facts
              </div>
              <div className="text-left">
                <span className="text-primary">✓</span> Direct legal test engagement
              </div>
              <div className="text-left">
                <span className="text-primary">✓</span> Documentary evidence references
              </div>
              <div className="text-left">
                <span className="text-primary">✓</span> Proportionate detail
              </div>
              <div className="text-left sm:col-span-2">
                <span className="text-primary">✓</span> Professional tone and structure
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
