'use client';

import { useState, useEffect } from 'react';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { ConsentForm } from '@/components/ConsentForm';
import { FileUpload } from '@/components/FileUpload';
import { AgentSelector } from '@/components/AgentSelector';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { DocumentResults } from '@/components/DocumentResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DocumentType, ProcessingStatus as ProcessingStatusType, DocumentProcessingResult } from '@/types/agent';
import { detectDocumentType } from '@/lib/validators/content-validator';

type ProcessStep = 'disclaimer' | 'consent' | 'upload' | 'select-agent' | 'processing' | 'results';

export default function ProcessPage() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>('disclaimer');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedDocType, setDetectedDocType] = useState<DocumentType | undefined>();
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | undefined>();
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatusType>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [result, setResult] = useState<DocumentProcessingResult | null>(null);

  const handleDisclaimerAccept = () => {
    setCurrentStep('consent');
  };

  const handleDisclaimerDecline = () => {
    window.location.href = '/';
  };

  const handleConsentComplete = () => {
    setCurrentStep('upload');
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);

    // Read file content to detect document type
    const content = await readFileContent(file);
    const detection = detectDocumentType(content);

    if (detection.isValid && detection.documentType) {
      setDetectedDocType(detection.documentType);
      setSelectedDocType(detection.documentType);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setDetectedDocType(undefined);
    setSelectedDocType(undefined);
  };

  const handleAgentSelect = (type: DocumentType) => {
    setSelectedDocType(type);
  };

  const handleStartProcessing = async () => {
    if (!selectedFile || !selectedDocType) return;

    setCurrentStep('processing');

    try {
      // Upload file
      setProcessingStatus({
        stage: 'uploading',
        progress: 10,
        message: 'Uploading your document...'
      });

      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadData = await uploadResponse.json();

      // Process document
      setProcessingStatus({
        stage: 'processing',
        progress: 50,
        message: `Processing with ${selectedDocType.replace('_', ' ').toUpperCase()} agent...`
      });

      const processResponse = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: uploadData.fileId,
          documentType: selectedDocType,
        }),
      });

      if (!processResponse.ok) {
        throw new Error('Failed to process document');
      }

      const processData = await processResponse.json();

      setProcessingStatus({
        stage: 'complete',
        progress: 100,
        message: 'Processing complete!'
      });

      setResult(processData);
      setCurrentStep('results');

    } catch (error) {
      console.error('Processing error:', error);
      setProcessingStatus({
        stage: 'error',
        progress: 0,
        message: 'An error occurred during processing',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.documentType}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProcessAnother = () => {
    setSelectedFile(null);
    setDetectedDocType(undefined);
    setSelectedDocType(undefined);
    setResult(null);
    setProcessingStatus({
      stage: 'idle',
      progress: 0,
      message: ''
    });
    setCurrentStep('upload');
  };

  const handleBack = () => {
    if (currentStep === 'consent') setCurrentStep('disclaimer');
    if (currentStep === 'upload') setCurrentStep('consent');
    if (currentStep === 'select-agent') setCurrentStep('upload');
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-5xl">
        {/* Progress Indicator */}
        {currentStep !== 'disclaimer' && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">
                Step {
                  currentStep === 'consent' ? '1' :
                  currentStep === 'upload' ? '2' :
                  currentStep === 'select-agent' ? '3' :
                  currentStep === 'processing' ? '4' :
                  currentStep === 'results' ? '5' : ''
                } of 5
              </span>
              <span className="text-muted-foreground">
                {
                  currentStep === 'consent' ? 'Terms & Consent' :
                  currentStep === 'upload' ? 'Upload Document' :
                  currentStep === 'select-agent' ? 'Select Agent' :
                  currentStep === 'processing' ? 'Processing' :
                  currentStep === 'results' ? 'Complete' : ''
                }
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${
                    currentStep === 'consent' ? 20 :
                    currentStep === 'upload' ? 40 :
                    currentStep === 'select-agent' ? 60 :
                    currentStep === 'processing' ? 80 :
                    currentStep === 'results' ? 100 : 0
                  }%`
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-6 md:p-8">
          {currentStep === 'disclaimer' && (
            <DisclaimerModal
              open={true}
              onAccept={handleDisclaimerAccept}
              onDecline={handleDisclaimerDecline}
            />
          )}

          {currentStep === 'consent' && (
            <ConsentForm onComplete={handleConsentComplete} />
          )}

          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Upload Your Document</h2>
                <p className="text-muted-foreground">
                  Upload your employment-related documents or case information
                </p>
              </div>

              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              {selectedFile && (
                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep('select-agent')} size="lg">
                    Continue to Agent Selection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'select-agent' && (
            <div className="space-y-6">
              <AgentSelector
                detectedType={detectedDocType}
                selectedType={selectedDocType}
                onSelect={handleAgentSelect}
              />

              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleStartProcessing}
                  disabled={!selectedDocType}
                  size="lg"
                >
                  Start Processing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'processing' && (
            <ProcessingStatus status={processingStatus} />
          )}

          {currentStep === 'results' && result && (
            <DocumentResults
              result={result}
              onDownload={handleDownload}
              onProcessAnother={handleProcessAnother}
            />
          )}
        </div>

        {/* Back Button (except on disclaimer and results) */}
        {currentStep !== 'disclaimer' && currentStep !== 'results' && currentStep !== 'processing' && currentStep !== 'select-agent' && (
          <div className="mt-4">
            <Button onClick={handleBack} variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
