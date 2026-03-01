import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'red';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeMode = signal<ThemeMode>('light');
  accentColor = signal<AccentColor>('blue');

  private readonly THEME_STORAGE_KEY = 'portfolio-theme';
  private readonly ACCENT_STORAGE_KEY = 'portfolio-accent';

  constructor() {
    this.loadSavedTheme();
    
    // Effect to apply theme changes to DOM
    effect(() => {
      const mode = this.themeMode();
      const accent = this.accentColor();
      this.applyTheme(mode, accent);
      this.saveThemePreference();
    });
  }

  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
  }

  private applyTheme(mode: ThemeMode, accent: AccentColor): void {
    const root = document.documentElement;
    const appContainer = document.querySelector('.app-container');
    
    // Bootstrap 5.3+ data-bs-theme attribute
    root.setAttribute('data-bs-theme', mode);
    
    // Apply dark-mode class to app container for main content styling
    if (appContainer) {
      if (mode === 'dark') {
        appContainer.classList.add('dark-mode');
      } else {
        appContainer.classList.remove('dark-mode');
      }
    }
    
    // Apply custom accent color CSS variables
    // Using yellow/gold as default accent to match image
    const accentColors: Record<AccentColor, string> = {
      blue: '#0d6efd',
      purple: '#6610f2',
      green: '#198754',
      orange: '#ffc107', // Yellow/gold to match image
      red: '#dc3545'
    };

    root.style.setProperty('--accent-color', accentColors[accent]);
    root.style.setProperty('--accent-light', `${accentColors[accent]}20`);
  }

  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as ThemeMode | null;
    const savedAccent = localStorage.getItem(this.ACCENT_STORAGE_KEY) as AccentColor | null;

    if (savedTheme) {
      this.themeMode.set(savedTheme);
    } else {
      // Default to dark mode to match image design
      this.themeMode.set('dark');
    }
    
    if (savedAccent) {
      this.accentColor.set(savedAccent);
    } else {
      // Default to orange/yellow accent to match image
      this.accentColor.set('orange');
    }
  }

  private saveThemePreference(): void {
    localStorage.setItem(this.THEME_STORAGE_KEY, this.themeMode());
    localStorage.setItem(this.ACCENT_STORAGE_KEY, this.accentColor());
  }
}
