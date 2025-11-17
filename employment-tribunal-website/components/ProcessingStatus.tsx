'use client';

import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { ProcessingStatus as ProcessingStatusType } from '@/types/agent';

interface ProcessingStatusProps {
  status: ProcessingStatusType;
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  const getIcon = () => {
    switch (status.stage) {
      case 'complete':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-destructive" />;
      default:
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status.stage) {
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`rounded-lg border p-8 ${getStatusColor()}`}>
      <div className="flex flex-col items-center text-center space-y-4">
        {getIcon()}

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {status.stage === 'uploading' && 'Uploading File...'}
            {status.stage === 'validating' && 'Validating Document...'}
            {status.stage === 'processing' && 'Processing with AI Agent...'}
            {status.stage === 'complete' && 'Processing Complete!'}
            {status.stage === 'error' && 'Processing Error'}
          </h3>

          <p className="text-sm text-muted-foreground max-w-md">
            {status.message}
          </p>
        </div>

        {status.stage !== 'idle' && status.stage !== 'complete' && status.stage !== 'error' && (
          <div className="w-full max-w-md">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {status.progress}% complete
            </p>
          </div>
        )}

        {status.error && (
          <div className="bg-white border border-destructive/30 rounded-lg p-4 max-w-md">
            <p className="text-sm text-destructive">{status.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
