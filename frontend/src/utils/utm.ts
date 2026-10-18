export function captureUtmParameters(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');

    if (utmSource) sessionStorage.setItem('scamtrace_utm_source', utmSource);
    if (utmMedium) sessionStorage.setItem('scamtrace_utm_medium', utmMedium);
    if (utmCampaign) sessionStorage.setItem('scamtrace_utm_campaign', utmCampaign);

    // If cookie consent was already granted, sync to localStorage
    const consent = localStorage.getItem('scamtrace_cookie_consent');
    if (consent === 'accepted') {
      if (utmSource) localStorage.setItem('scamtrace_utm_source', utmSource);
      if (utmMedium) localStorage.setItem('scamtrace_utm_medium', utmMedium);
      if (utmCampaign) localStorage.setItem('scamtrace_utm_campaign', utmCampaign);
    }
  } catch {
    // Graceful fallback for restricted storage environments
  }
}
