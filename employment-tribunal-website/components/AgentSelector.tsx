'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AGENTS, DOCUMENT_TYPES } from '@/lib/constants';
import { DocumentType } from '@/types/agent';
import { Check } from 'lucide-react';

interface AgentSelectorProps {
  detectedType?: DocumentType;
  onSelect: (type: DocumentType) => void;
  selectedType?: DocumentType;
}

export function AgentSelector({ detectedType, onSelect, selectedType }: AgentSelectorProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Select Document Type</h3>
        {detectedType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Auto-detected:</strong> {AGENTS[detectedType.toUpperCase() as keyof typeof AGENTS].name}
              {' '}(You can change this below if needed)
            </p>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Choose the specialized agent for your document type, or use our auto-detected suggestion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(AGENTS).map((agent) => {
          const isSelected = selectedType === agent.id;
          const isDetected = detectedType === agent.id;
          const isHovered = hoveredAgent === agent.id;

          return (
            <Card
              key={agent.id}
              className={`
                cursor-pointer transition-all
                ${isSelected ? 'ring-2 ring-primary shadow-md' : ''}
                ${isHovered ? 'shadow-lg scale-105' : ''}
                ${isDetected && !isSelected ? 'border-blue-300' : ''}
              `}
              onClick={() => onSelect(agent.id as DocumentType)}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{agent.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      {isDetected && !isSelected && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                          Suggested
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!selectedType && (
        <p className="text-sm text-center text-muted-foreground">
          Please select a document type to continue
        </p>
      )}
    </div>
  );
}
