// portfolio-frontend/src/api/trackingApi.js
const ANALYTICS_API_URL = process.env.REACT_APP_ANALYTICS_API_URL || 'http://localhost:8001/api/analytics';

const INTERNAL_API_KEY = process.env.REACT_APP_INTERNAL_API_KEY || '';

const headers = () => {
  return {
    'Content-Type': 'application/json',
    'X-Internal-Auth': INTERNAL_API_KEY
  };
};

// Generate a simple client fingerprint
const generateFingerprint = () => {
  const data = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    // screen.width,
    // screen.height,
    // screen.colorDepth,
    new Date().getTimezoneOffset(),
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    navigator.hardwareConcurrency || '',
    navigator.deviceMemory || ''
  ];
  
  return data.join('|');
};

// Create or get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track a page view
export const trackPageView = async () => {
  try {
    const fingerprint = generateFingerprint();
    const sessionId = getSessionId();
    
    await fetch(`${ANALYTICS_API_URL}/track`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        visitorId: fingerprint,
        sessionId: sessionId,
        eventType: 'page_view',
        eventData: {
          page: window.location.pathname,
          title: document.title,
          referrer: document.referrer
        },
        url: window.location.href,
        referrer: document.referrer
      })
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track a custom event
export const trackEvent = async (eventType, eventData = {}) => {
  try {
    const fingerprint = generateFingerprint();
    const sessionId = getSessionId();
    
    await fetch(`${ANALYTICS_API_URL}/track`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        visitorId: fingerprint,
        sessionId: sessionId,
        eventType: eventType,
        eventData: eventData,
        url: window.location.href,
        referrer: document.referrer
      })
    });
  } catch (error) {
    console.error(`Error tracking ${eventType}:`, error);
  }
};

// Track specific events
export const trackClick = async (elementName, extraData = {}) => {
  await trackEvent('click', {
    element: elementName,
    ...extraData
  });
};

export const trackScroll = async (depth) => {
  await trackEvent('scroll', {
    scrollDepth: depth
  });
};

export const trackTimeSpent = async (seconds) => {
  await trackEvent('time_spent', {
    duration: seconds
  });
};

export const trackFormSubmit = async (formName) => {
  await trackEvent('form_submit', {
    form: formName
  });
};