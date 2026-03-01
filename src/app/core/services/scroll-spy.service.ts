import { Injectable, signal, effect, inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollSpyService {
  activeSection = signal<string>('profile');
  private sections: string[] = ['profile', 'education', 'experience', 'skills', 'projects', 'achievements', 'certifications', 'contact'];
  private scrollSubscription?: any;
  private isOnHomePage = signal<boolean>(false);
  private router = inject(Router);
  private routerSubscription?: any;
  private canUpdateHash = signal<boolean>(false); // Flag to control hash updates

  constructor() {
    // Check route FIRST before setting up anything else
    this.checkRoute();
    
    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRoute();
        // Reinitialize scroll listener based on route
        this.teardownScrollListener();
        if (this.isOnHomePage()) {
          this.canUpdateHash.set(true);
          this.setupScrollListener();
        } else {
          this.canUpdateHash.set(false);
        }
      });
    
    // Initial setup if on home page
    if (this.isOnHomePage()) {
      this.canUpdateHash.set(true);
      this.setupScrollListener();
    }
    
    effect(() => {
      const active = this.activeSection();
      const isHome = this.isOnHomePage();
      const canUpdate = this.canUpdateHash();
      
      // Only update URL with hash if ALL conditions are met
      if (!canUpdate || !isHome || typeof window === 'undefined' || !window.history) {
        return;
      }
      
      const currentUrl = this.router.url;
      const currentPath = window.location.pathname;
      
      // Triple check: router URL, isHome signal, and pathname must all indicate home
      const isRouterHome = currentUrl === '/' || currentUrl === '/home' || currentUrl.startsWith('/home#') || currentUrl.startsWith('/#');
      const isPathnameHome = currentPath === '/' || currentPath === '/home';
      
      if (isRouterHome && isPathnameHome) {
        window.history.replaceState(null, '', `${currentPath}#${active}`);
      }
    });
  }

  private checkRoute(): void {
    const url = this.router.url;
    // Consider home page if URL is '/', '/home', or '/home#...'
    const isHome = url === '/' || url === '/home' || url.startsWith('/home#') || url.startsWith('/#');
    this.isOnHomePage.set(isHome);
  }

  private teardownScrollListener(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
      this.scrollSubscription = undefined;
    }
  }

  private setupScrollListener(): void {
    if (typeof window === 'undefined') return;

    // Try to find the infinite scroll container first
    const scrollContainer = document.querySelector('.infinite-scroll-container') as HTMLElement;
    
    if (scrollContainer) {
      this.scrollSubscription = fromEvent(scrollContainer, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => {
          this.updateActiveSection(scrollContainer);
        });
    } else {
      // Fallback to window scroll
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => {
          this.updateActiveSection();
        });
    }

    // Initial check after a delay to ensure DOM is ready
    setTimeout(() => {
      const container = document.querySelector('.infinite-scroll-container') as HTMLElement;
      if (container) {
        this.updateActiveSection(container);
      } else {
        this.updateActiveSection();
      }
    }, 500);
  }

  private updateActiveSection(scrollContainer?: HTMLElement): void {
    // Only update active section if we're on the home page
    if (!this.isOnHomePage()) {
      return;
    }

    const scrollPosition = scrollContainer 
      ? scrollContainer.scrollTop + 200
      : window.scrollY + 200; // Offset for better detection
    let currentSection = 'profile';

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (element) {
        const container = scrollContainer || document.documentElement;
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Calculate relative position within the scroll container
        const relativeTop = scrollContainer 
          ? element.offsetTop
          : elementRect.top + (window.pageYOffset || document.documentElement.scrollTop);
        
        const relativeBottom = relativeTop + element.offsetHeight;
        
        if (scrollPosition >= relativeTop && scrollPosition < relativeBottom) {
          currentSection = section;
          break;
        }
      }
    }

    // Check if we're at the top
    const currentScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
    if (currentScroll < 100) {
      currentSection = 'profile';
    }

    // Check if we're at the bottom
    const lastSection = this.sections[this.sections.length - 1];
    const lastElement = document.getElementById(lastSection);
    if (lastElement) {
      const container = scrollContainer || document.documentElement;
      const containerHeight = scrollContainer ? scrollContainer.scrollHeight : document.documentElement.scrollHeight;
      const viewportHeight = scrollContainer ? scrollContainer.clientHeight : window.innerHeight;
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      
      if (scrollTop + viewportHeight >= containerHeight - 100) {
        currentSection = lastSection;
      }
    }

    if (this.activeSection() !== currentSection) {
      this.activeSection.set(currentSection);
    }
  }

  scrollToSection(section: string): void {
    // First, navigate to home if not already there
    if (!this.isOnHomePage()) {
      this.router.navigate(['/home'], { fragment: section }).then(() => {
        // After navigation, scroll to the section
        setTimeout(() => this.scrollToElement(section), 500);
      });
      return;
    }
    
    // If already on home page, just scroll
    this.scrollToElement(section);
  }

  private scrollToElement(section: string): void {
    const element = document.getElementById(section);
    const scrollContainer = document.querySelector('.infinite-scroll-container') as HTMLElement;
    
    if (element) {
      if (scrollContainer) {
        // Scroll within the container - use offsetTop for more accurate positioning
        const offset = 20; // Reduced offset for better positioning from top
        const elementTop = element.offsetTop;
        
        scrollContainer.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        });
      } else {
        // Fallback to window scroll
        const offset = 20; // Reduced offset for better positioning from top
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.teardownScrollListener();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

