export {};

declare global {
  interface Window {
    Cookiebot?: {
      renew: () => void;
      withdrawConsent: () => void;
      consents: Record<string, unknown>; 
    };
  }
}
