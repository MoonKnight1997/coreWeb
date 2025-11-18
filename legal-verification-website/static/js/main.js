/**
 * Legal Verification Protocol - Main JavaScript
 *
 * Core functionality for the application including:
 * - Toast notifications
 * - Mobile navigation
 * - File upload handling
 * - Form validation
 * - Loading states
 * - Accordion functionality
 * - Verification flow
 *
 * @version 2.0.0
 */

(function() {
  'use strict';

  // ===========================
  // TOAST NOTIFICATION SYSTEM
  // ===========================

  const Toast = {
    container: null,

    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.container);
      }
    },

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms (0 for no auto-dismiss)
     */
    show(message, type = 'info', duration = 5000) {
      this.init();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'alert');

      const iconMap = {
        success: `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        error: `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`,
        warning: `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>`,
        info: `<svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`
      };

      toast.innerHTML = `
        ${iconMap[type]}
        <div class="toast-content">
          <div class="toast-message">${this.escapeHtml(message)}</div>
        </div>
        <button class="toast-close" aria-label="Close notification">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.remove(toast));

      this.container.appendChild(toast);

      // Auto-dismiss if duration is set
      if (duration > 0) {
        setTimeout(() => this.remove(toast), duration);
      }

      return toast;
    },

    remove(toast) {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 200);
    },

    success(message, duration) {
      return this.show(message, 'success', duration);
    },

    error(message, duration) {
      return this.show(message, 'error', duration);
    },

    warning(message, duration) {
      return this.show(message, 'warning', duration);
    },

    info(message, duration) {
      return this.show(message, 'info', duration);
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // Make Toast globally available
  window.Toast = Toast;

  // ===========================
  // MOBILE NAVIGATION
  // ===========================

  function initMobileNav() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);

      // Prevent body scroll when menu is open
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===========================
  // ACCORDION FUNCTIONALITY
  // ===========================

  function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const isOpen = header.classList.contains('is-open');
        const content = header.nextElementSibling;

        // Close all other accordions in the same group
        const accordion = header.closest('.accordion');
        accordion.querySelectorAll('.accordion-header').forEach(h => {
          if (h !== header) {
            h.classList.remove('is-open');
            h.nextElementSibling.classList.remove('is-open');
            h.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current accordion
        header.classList.toggle('is-open');
        content.classList.toggle('is-open');
        header.setAttribute('aria-expanded', !isOpen);

        // Scroll into view if opening
        if (!isOpen) {
          setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        }
      });

      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  // ===========================
  // FILE UPLOAD ENHANCEMENT
  // ===========================

  function initFileUpload() {
    const dropzone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const filePreviewContainer = document.getElementById('filePreview');

    if (!dropzone || !fileInput) return;

    // Make dropzone keyboard accessible
    dropzone.setAttribute('tabindex', '0');
    dropzone.setAttribute('role', 'button');
    dropzone.setAttribute('aria-label', 'Upload document file. Supported formats: TXT, PDF, DOCX. Maximum size: 16MB');

    // Click to upload
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    // Keyboard support for dropzone
    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    // Drag and drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('is-dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });

    function handleFileSelect(file) {
      // Validate file type
      const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      const validExtensions = ['.txt', '.pdf', '.docx', '.doc'];

      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        Toast.error('Invalid file type. Please upload a TXT, PDF, or DOCX file.');
        return;
      }

      // Validate file size (16MB)
      const maxSize = 16 * 1024 * 1024;
      if (file.size > maxSize) {
        Toast.error('File too large. Maximum size is 16MB.');
        return;
      }

      // Show file preview
      showFilePreview(file);

      // Update file input for form submission
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      Toast.success('File selected successfully!');
    }

    function showFilePreview(file) {
      if (!filePreviewContainer) return;

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      filePreviewContainer.innerHTML = `
        <svg class="file-preview-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <div class="file-preview-info">
          <div class="file-preview-name">${file.name}</div>
          <div class="file-preview-meta">${sizeInMB} MB</div>
        </div>
        <button type="button" class="file-preview-remove" aria-label="Remove file">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      `;

      filePreviewContainer.style.display = 'flex';

      // Remove file handler
      const removeBtn = filePreviewContainer.querySelector('.file-preview-remove');
      removeBtn.addEventListener('click', () => {
        fileInput.value = '';
        filePreviewContainer.style.display = 'none';
        Toast.info('File removed');
      });
    }
  }

  // ===========================
  // TEXT PASTE CHARACTER COUNTER
  // ===========================

  function initCharacterCounter() {
    const textarea = document.getElementById('documentText');
    const counter = document.getElementById('charCount');

    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
      const count = textarea.value.length;
      counter.textContent = count.toLocaleString();

      // Update counter color based on minimum requirement
      if (count === 0) {
        counter.style.color = 'var(--color-text-secondary)';
      } else if (count < 100) {
        counter.style.color = 'var(--color-warning-600)';
      } else {
        counter.style.color = 'var(--color-success-600)';
      }
    });
  }

  // ===========================
  // FORM VALIDATION
  // ===========================

  function initFormValidation() {
    const form = document.getElementById('verificationForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate terms acceptance
      const termsCheckbox = document.getElementById('termsAccept');
      const confidentialCheckbox = document.getElementById('confidentialConfirm');

      if (!termsCheckbox || !termsCheckbox.checked) {
        Toast.error('Please accept the terms and legal disclaimer.');
        termsCheckbox?.focus();
        return;
      }

      if (!confidentialCheckbox || !confidentialCheckbox.checked) {
        Toast.error('Please confirm you are not uploading confidential third-party data without consent.');
        confidentialCheckbox?.focus();
        return;
      }

      // Check if file or text is provided
      const fileInput = document.getElementById('fileInput');
      const textArea = document.getElementById('documentText');
      const activeTab = document.querySelector('#uploadTabs .nav-link.active');

      let hasInput = false;

      if (activeTab && activeTab.id === 'file-tab') {
        if (fileInput && fileInput.files.length > 0) {
          hasInput = true;
        }
      } else if (activeTab && activeTab.id === 'text-tab') {
        if (textArea && textArea.value.trim().length >= 100) {
          hasInput = true;
        } else if (textArea && textArea.value.trim().length > 0) {
          Toast.error('Document text must be at least 100 characters.');
          textArea.focus();
          return;
        }
      }

      if (!hasInput) {
        Toast.error('Please upload a file or paste document text (minimum 100 characters).');
        return;
      }

      // Submit form
      await handleVerificationSubmit(form);
    });
  }

  // ===========================
  // VERIFICATION SUBMISSION
  // ===========================

  async function handleVerificationSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const formCard = document.getElementById('verificationFormCard');
    const loadingCard = document.getElementById('verificationLoading');
    const resultsCard = document.getElementById('verificationResults');
    const errorCard = document.getElementById('verificationError');

    // Hide all states
    formCard?.classList.add('hidden');
    loadingCard?.classList.add('hidden');
    resultsCard?.classList.add('hidden');
    errorCard?.classList.add('hidden');

    // Show loading state
    loadingCard?.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Simulate verification steps
    simulateVerificationSteps();

    try {
      const formData = new FormData(form);

      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show results
        displayResults(data.report);
        loadingCard?.classList.add('hidden');
        resultsCard?.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Toast.success('Verification completed successfully!');
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      displayError(error.message);
      loadingCard?.classList.add('hidden');
      errorCard?.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function simulateVerificationSteps() {
    const steps = [
      { id: 'step-extract', delay: 500 },
      { id: 'step-analyze', delay: 2000 },
      { id: 'step-verify', delay: 4000 },
      { id: 'step-generate', delay: 6000 }
    ];

    steps.forEach(({ id, delay }) => {
      setTimeout(() => {
        const stepElement = document.getElementById(id);
        if (stepElement) {
          // Mark previous steps as complete
          document.querySelectorAll('.loading-step').forEach(step => {
            if (step.id !== id && !step.classList.contains('is-complete')) {
              step.classList.add('is-complete');
              step.classList.remove('is-active');
            }
          });

          // Mark current step as active
          stepElement.classList.add('is-active');
        }
      }, delay);
    });
  }

  function displayResults(report) {
    const reportContainer = document.getElementById('verificationReport');
    if (!reportContainer) return;

    // Format the report (assuming it's markdown-ish or plain text)
    reportContainer.innerHTML = formatReport(report);
  }

  function formatReport(report) {
    // Basic formatting - convert markdown-style headings and lists
    let formatted = report
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    return '<p>' + formatted + '</p>';
  }

  function displayError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }

  // ===========================
  // ACTION BUTTONS
  // ===========================

  function initActionButtons() {
    // Print report button
    const printBtn = document.getElementById('printReport');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
        Toast.info('Opening print dialog...');
      });
    }

    // Verify another document button
    const verifyAnotherBtn = document.getElementById('verifyAnother');
    if (verifyAnotherBtn) {
      verifyAnotherBtn.addEventListener('click', () => {
        location.reload();
      });
    }

    // Try again button
    const tryAgainBtn = document.getElementById('tryAgain');
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
        location.reload();
      });
    }
  }

  // ===========================
  // TAB SWITCHING
  // ===========================

  function initTabs() {
    const tabs = document.querySelectorAll('[data-bs-toggle="pill"]');

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = tab.getAttribute('data-bs-target');
        const targetPane = document.querySelector(targetId);

        if (!targetPane) return;

        // Remove active class from all tabs and panes
        document.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => {
          p.classList.remove('show', 'active');
        });

        // Add active class to clicked tab and target pane
        tab.classList.add('active');
        targetPane.classList.add('show', 'active');
      });
    });
  }

  // ===========================
  // SMOOTH SCROLLING
  // ===========================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===========================
  // ACTIVE NAV HIGHLIGHTING
  // ===========================

  function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll('.navbar-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add('is-active');
      }
    });
  }

  // ===========================
  // KEYBOARD SHORTCUTS
  // ===========================

  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Focus search/upload
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('dropZone');
        if (dropzone) {
          dropzone.click();
        } else if (fileInput) {
          fileInput.click();
        }
      }
    });
  }

  // ===========================
  // INITIALIZATION
  // ===========================

  function init() {
    // Initialize all components when DOM is ready
    initMobileNav();
    initAccordions();
    initFileUpload();
    initCharacterCounter();
    initFormValidation();
    initActionButtons();
    initTabs();
    initSmoothScroll();
    initActiveNavHighlight();
    initKeyboardShortcuts();

    // Show ready toast in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Legal Verification Protocol v2.0 - Ready');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
