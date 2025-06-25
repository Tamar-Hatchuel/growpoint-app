
// Google Analytics utility functions for GrowPoint
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('Google Analytics initialized');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-G08PRT4T87', {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      // Add anonymized tracking
      anonymize_ip: true,
    });
  }
};

// Survey-specific tracking functions
export const trackSurveyStart = (department?: string) => {
  trackEvent('survey_start', {
    event_category: 'Survey',
    event_label: department || 'unknown',
  });
};

export const trackSurveyStep = (step: string, department?: string) => {
  trackEvent('survey_step', {
    event_category: 'Survey',
    event_label: step,
    custom_parameter_1: department || 'unknown',
  });
};

export const trackSurveyComplete = (department?: string) => {
  trackEvent('survey_complete', {
    event_category: 'Survey',
    event_label: department || 'unknown',
  });
};

export const trackSurveyAbandon = (step: string, department?: string) => {
  trackEvent('survey_abandon', {
    event_category: 'Survey',
    event_label: step,
    custom_parameter_1: department || 'unknown',
  });
};

// Dashboard tracking functions
export const trackDashboardAccess = (dashboardType: string, department?: string) => {
  trackEvent('dashboard_access', {
    event_category: 'Dashboard',
    event_label: dashboardType,
    custom_parameter_1: department || 'unknown',
  });
};

export const trackAIInsightsGeneration = (department?: string) => {
  trackEvent('ai_insights_generated', {
    event_category: 'AI Features',
    event_label: 'insights_generated',
    custom_parameter_1: department || 'unknown',
  });
};

export const trackDepartmentFilter = (department: string) => {
  trackEvent('department_filter_used', {
    event_category: 'Dashboard',
    event_label: department,
  });
};

// Button and interaction tracking
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    event_category: 'Interaction',
    event_label: buttonName,
    custom_parameter_1: location || 'unknown',
  });
};

export const trackModalOpen = (modalName: string) => {
  trackEvent('modal_open', {
    event_category: 'Interaction',
    event_label: modalName,
  });
};

export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('form_submission', {
    event_category: 'Form',
    event_label: formName,
    custom_parameter_1: success ? 'success' : 'failure',
  });
};
