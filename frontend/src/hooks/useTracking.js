// portfolio-frontend/src/hooks/useTracking.js
import { useEffect, useRef } from 'react';
import { trackPageView, trackScroll, trackTimeSpent, trackClick } from '../api/trackingApi';

export const usePageTracking = () => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Track page view on mount
    trackPageView();

    // Track time spent
    const timeSpentInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.current) / 1000);
      trackTimeSpent(seconds);
    }, 30000); // Every 30 seconds

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      // Track at 25%, 50%, 75%, 100%
      if (scrollPercent > 100) {
        trackScroll(100);
      } else if (scrollPercent > 75) {
        trackScroll(75);
      } else if (scrollPercent > 50) {
        trackScroll(50);
      } else if (scrollPercent > 25) {
        trackScroll(25);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      clearInterval(timeSpentInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Only run once on mount
};

// Hook for tracking clicks on specific elements
export const useClickTracking = (elementName) => {
  const trackClickEvent = () => {
    trackClick(elementName);
  };

  return trackClickEvent;
};