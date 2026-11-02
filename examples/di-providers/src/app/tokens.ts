import { InjectionToken } from '@angular/core';

export interface AppSettings {
  appName: string;
  maxItems: number;
}

/**
 * A token for a plain object – there is no class to inject, so the token is the key.
 * The factory provides a default; app.config.ts can override it with useValue.
 */
export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS', {
  providedIn: 'root',
  factory: () => ({ appName: 'Default app', maxItems: 3 }),
});
