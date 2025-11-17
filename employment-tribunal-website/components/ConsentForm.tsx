'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CONSENT_ITEMS } from '@/lib/constants';

interface ConsentFormProps {
  onComplete: () => void;
}

export function ConsentForm({ onComplete }: ConsentFormProps) {
  const [consents, setConsents] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [id]: checked }));
  };

  const allConsented = CONSENT_ITEMS.every(item => consents[item.id] === true);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Terms and Consent</h3>
        <p className="text-sm text-muted-foreground">
          Please read and accept all of the following before proceeding:
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 rounded-lg p-6">
        {CONSENT_ITEMS.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <Checkbox
              id={item.id}
              checked={consents[item.id] || false}
              onCheckedChange={(checked) =>
                handleCheckboxChange(item.id, checked as boolean)
              }
              className="mt-1"
            />
            <label
              htmlFor={item.id}
              className="text-sm leading-relaxed cursor-pointer select-none flex-1"
            >
              {item.label}
              {item.id === 'terms' && (
                <Link
                  href="/terms"
                  target="_blank"
                  className="ml-1 text-primary hover:underline"
                >
                  (View Terms)
                </Link>
              )}
              {item.id === 'privacy' && (
                <Link
                  href="/privacy"
                  target="_blank"
                  className="ml-1 text-primary hover:underline"
                >
                  (View Privacy Policy)
                </Link>
              )}
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          disabled={!allConsented}
          size="lg"
        >
          Continue to Upload
        </Button>
      </div>

      {!allConsented && (
        <p className="text-sm text-muted-foreground text-center">
          You must accept all terms and consent items to proceed
        </p>
      )}
    </div>
  );
}
