// global.d.ts
export {};

declare global {
  interface Window {
    Cookiebot?: {
      consents: Record<string, unknown>;
      onconsent?: () => void;
      renew: () => void;
      withdrawConsent?: () => void;
    };
  }
}
