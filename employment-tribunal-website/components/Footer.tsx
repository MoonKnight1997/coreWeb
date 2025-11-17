import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-bold text-white text-lg">ET Docs</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered Employment Tribunal document assistance for England & Wales
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  Support & Donate
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Full Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Notice */}
          <div>
            <h3 className="font-semibold text-white mb-4">Important Notice</h3>
            <div className="text-xs text-gray-400 space-y-2">
              <p>This is NOT legal advice or a legal service.</p>
              <p>Not regulated by SRA or BSB.</p>
              <p>England & Wales only.</p>
              <p>Consult a qualified solicitor for your case.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} Employment Tribunal Documents. All rights reserved.
            </p>
            <p className="text-xs">
              Powered by AI • No account required • Free to use
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer Bar */}
      <div className="bg-amber-900/20 border-t border-amber-800/30">
        <div className="container-custom py-3">
          <p className="text-xs text-amber-200 text-center">
            <strong>NOTICE:</strong> This service provides AI-assisted document preparation only.
            It is NOT legal advice, legal representation, or a legal service. We are NOT solicitors or regulated professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
