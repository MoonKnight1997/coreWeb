'use client';

import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LEGAL_DISCLAIMER } from '@/lib/constants';

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function DisclaimerModal({ open, onAccept, onDecline }: DisclaimerModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <DialogTitle className="text-2xl">Important Legal Notice</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Legal disclaimer and important information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-6">
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {LEGAL_DISCLAIMER}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Before You Continue:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
              <li>This tool uses AI to assist with document preparation</li>
              <li>All documents should be reviewed by a qualified solicitor</li>
              <li>Your uploaded files will be processed temporarily and immediately deleted</li>
              <li>We do not store any personal information or case details</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={onDecline}>
            I Do Not Accept
          </Button>
          <Button onClick={onAccept}>
            I Understand and Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
