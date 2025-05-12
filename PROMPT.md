Voici les choix fait pour la page configuration

```ts
interface ProjectConfig {
  // === General ===
  name: string;
  domain: string;
  landingPageUrl: string;

  // === Collection Rules ===
  emailLimit?: number;
  endDate?: string; // ISO 8601
  duplicatePolicy: 'allow' | 'block' | 'warn';

  // === Messages ===
  messages: {
    success: string;
    duplicate: string;
    error: string;
  };

  // === Post-Submit Behavior ===
  onSubmit: {
    action: 'none' | 'show_modal' | 'show_toast' | 'redirect';
    redirectUrl?: string;
    showSonar?: boolean;
    socialCtaUrl?: string; // e.g. https://twitter.com/yourhandle
  };

  // === Integration ===
  integration: {
    inputSelector: string; // e.g. '#email'
    autoFocus?: boolean;
  };
}
```