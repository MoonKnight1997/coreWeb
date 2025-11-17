'use client';

import { Download, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentProcessingResult } from '@/types/agent';
import { AGENTS } from '@/lib/constants';

interface DocumentResultsProps {
  result: DocumentProcessingResult;
  onDownload: () => void;
  onProcessAnother: () => void;
}

export function DocumentResults({
  result,
  onDownload,
  onProcessAnother,
}: DocumentResultsProps) {
  const agent = AGENTS[result.documentType.toUpperCase() as keyof typeof AGENTS];

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-1">
              Document Generated Successfully
            </h3>
            <p className="text-sm text-green-700">
              Your {agent.name} document has been processed and is ready for download.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      {result.validationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.validationResults.isValid ? (
              <div className="flex items-start gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Document passed validation</p>
                  <p className="text-sm text-muted-foreground">
                    The document meets Employment Tribunal best practices
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-amber-700">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Some issues were found</p>
                  <p className="text-sm text-muted-foreground">
                    Please review the issues below before submitting
                  </p>
                </div>
              </div>
            )}

            {result.validationResults.issues.length > 0 && (
              <div className="space-y-2">
                {result.validationResults.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 p-3 rounded-lg ${
                      issue.severity === 'error'
                        ? 'bg-red-50 text-red-900'
                        : issue.severity === 'warning'
                        ? 'bg-amber-50 text-amber-900'
                        : 'bg-blue-50 text-blue-900'
                    }`}
                  >
                    {issue.severity === 'error' ? (
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                    ) : (
                      <Info className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {issue.severity.toUpperCase()}
                      </p>
                      <p className="text-sm">{issue.message}</p>
                      {issue.location && (
                        <p className="text-xs opacity-75 mt-1">
                          Location: {issue.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggestions for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Document Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {result.content}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Important:</strong> This document was generated by AI and should be reviewed by a qualified solicitor before submission to an Employment Tribunal. We are not responsible for any errors or omissions.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onDownload} size="lg" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download Document
        </Button>
        <Button onClick={onProcessAnother} variant="outline" size="lg" className="flex-1">
          Process Another Document
        </Button>
      </div>
    </div>
  );
}
