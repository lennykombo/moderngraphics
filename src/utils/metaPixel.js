export const trackEvent = (eventName, data = {}) => {
  if (window.fbq) {
    window.fbq("track", eventName, data);
  }
};