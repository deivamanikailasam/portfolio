import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { ScrollSpyService } from '../../../core/services/scroll-spy.service';
import { ThemeService } from '../../../core/services/theme.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-floating-dock',
  imports: [CommonModule, DockModule, TooltipModule],
  template: `
    @if (isHome()) {
    <div class="dock-window">
      <p-dock [model]="items()" [position]="'bottom'">
        <ng-template pTemplate="item" let-item>
          <i 
            [class]="item.icon || ''" 
            [attr.data-label]="item.label"
            [pTooltip]="item.label" 
            tooltipPosition="top"
            (click)="handleItemClick(item)"
          ></i>
        </ng-template>
      </p-dock>
    </div>
    }
  `,
  styles: [`
    :host {
      overflow: visible !important;
      position: relative;
      z-index: 1000;
    }
    
    :host ::ng-deep {
      .dock-window {
        position: fixed;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        overflow: visible !important;
        clip-path: none !important;
        pointer-events: none;
      }
      
      .p-dock {
        z-index: 1000;
        overflow: visible !important;
        clip-path: none !important;
        pointer-events: auto;

        a {
          text-decoration: none;
        }
      }
      
      .p-dock-list {
        overflow: visible !important;
        clip-path: none !important;
        position: relative;
        gap: 0.5rem;
      }
      
      .p-dock-item {
        position: relative !important;
        overflow: visible !important;
        clip-path: none !important;
        z-index: 1;
        pointer-events: auto;
        contain: none !important;
        isolation: auto !important;
        cursor: pointer;
      }
      
      .p-dock-item i {
        cursor: pointer;
        transition: transform 0.2s ease;
        display: block;
        position: relative;
        z-index: 1;
        pointer-events: auto;
        font-size: 2rem;
        color: white !important;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
      }

      /* Home - Blue to Cyan gradient background */
      .p-dock-item:has(i[data-label="Home"]) {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      }

      /* Education - Green to Teal gradient background */
      .p-dock-item:has(i[data-label="Education"]) {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
      }

      /* Experience - Orange to Red gradient background */
      .p-dock-item:has(i[data-label="Experience"]) {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
      }

      /* Skills - Yellow to Orange gradient background */
      .p-dock-item:has(i[data-label="Skills"]) {
        background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%) !important;
      }

      /* Projects - Purple to Blue gradient background (matching featured project section) */
      .p-dock-item:has(i[data-label="Projects"]) {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
      }

      /* Achievements - Gold to Yellow gradient background */
      .p-dock-item:has(i[data-label="Achievements"]) {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%) !important;
      }

      /* Certifications - Cyan to Blue gradient background */
      .p-dock-item:has(i[data-label="Certifications"]) {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
      }

      /* Theme toggle icons - Dynamic gradient */
      .p-dock-item:has(i.pi-sun) {
        background: linear-gradient(135deg, #f6d365 0%, #fda085 100%) !important;
      }

      .p-dock-item:has(i.pi-moon) {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      }
      
      .p-dock-item:hover {
        z-index: 10000 !important;
        overflow: visible !important;
        clip-path: none !important;
        position: relative !important;
        contain: none !important;
        isolation: auto !important;
        transform: translateY(-20px) !important;
      }
      
      .p-dock-item:hover i {
        position: relative !important;
        color: white !important;
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) !important;
      }
      
      /* Ensure all parent containers don't clip */
      .p-dock-list-container,
      .p-dock-list-wrapper,
      .p-dock-container {
        overflow: visible !important;
        clip-path: none !important;
        contain: none !important;
      }
      
      /* Prevent any clipping from PrimeNG internal containers */
      .p-dock-list-container *,
      .p-dock-list-wrapper *,
      .p-dock-container * {
        overflow: visible !important;
      }
      
      /* Make sure the image container allows overflow */
      .p-dock-item > * {
        overflow: visible !important;
      }
    }
    
    // Responsive Design - Tablet and below
    @media (max-width: 1199.98px) {
      :host ::ng-deep {
        .dock-window {
          bottom: 0.75rem;
        }
        
        .p-dock-item i {
          font-size: clamp(1.75rem, 3.5vw, 2rem);
        }
      }
    }
    
    @media (max-width: 991.98px) {
      :host ::ng-deep {
        .dock-window {
          bottom: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 2rem);
          max-width: 600px;
          padding: 0.5rem;
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .p-dock {
          width: 100%;
        }
        
        .p-dock-list {
          justify-content: center;
          gap: 0.5rem;
        }
        
        .p-dock-item {
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .p-dock-item i {
          font-size: clamp(1.5rem, 4vw, 2rem);
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .p-dock-item:active {
          transform: scale(0.9);
        }
        
        .p-dock-item:active i {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
    
    // Mobile devices - Hide dock on smaller screens
    @media (max-width: 767.98px) {
      :host {
        display: none !important;
      }
      
      :host ::ng-deep {
        .dock-window {
          display: none !important;
        }
      }
    }
    
    // Hide dock for vertical iPad devices (portrait orientation)
    @media (min-width: 768px) and (max-width: 991.98px) and (orientation: portrait) {
      :host {
        display: none !important;
      }
      
      :host ::ng-deep {
        .dock-window {
          display: none !important;
        }
      }
    }
    
    // Keep responsive styles for tablets in landscape (768px - 991px)
    @media (min-width: 768px) and (max-width: 991.98px) and (orientation: landscape) {
      :host ::ng-deep {
        .dock-window {
          bottom: 0.5rem;
          width: calc(100% - 1rem);
          max-width: 100%;
          padding: 0.75rem 0.5rem;
          border-radius: 1.5rem;
        }
        
        .p-dock-list {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0.25rem;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          
          &::-webkit-scrollbar {
            display: none;
          }
        }
        
        .p-dock-item {
          flex: 0 0 auto;
          min-width: 48px;
          min-height: 48px;
          touch-action: manipulation;
        }
        
        .p-dock-item i {
          font-size: clamp(1.25rem, 4.5vw, 1.75rem);
          padding: 0.625rem;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .p-dock-item:hover {
          transform: scale(1.2) !important;
        }
        
        .p-dock-item:hover i,
        .p-dock-item:focus i {
          color: white !important;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
        }
        
        .p-dock-item:active {
          transform: scale(0.95) !important;
        }
        
        .p-dock-item:active i {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    // Small mobile devices - Keep hidden (already covered by main mobile media query)
    @media (max-width: 575.98px) {
      :host {
        display: none !important;
      }
      
      :host ::ng-deep {
        .dock-window {
          display: none !important;
        }
      }
    }
    
    // Extra small devices - Keep hidden (already covered by main mobile media query)
    @media (max-width: 375px) {
      :host {
        display: none !important;
      }
      
      :host ::ng-deep {
        .dock-window {
          display: none !important;
        }
      }
    }
    
    // Landscape orientation - Hide on mobile landscape
    @media (max-width: 767.98px) and (orientation: landscape) {
      :host {
        display: none !important;
      }
      
      :host ::ng-deep {
        .dock-window {
          display: none !important;
        }
      }
    }
    
    // Touch device optimizations
    @media (hover: none) and (pointer: coarse) {
      :host ::ng-deep {
        .p-dock-item:hover {
          transform: none !important;
        }
        
        .p-dock-item:active {
          transform: scale(0.9) !important;
        }
        
        .p-dock-item:active i {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    // High DPI displays
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      :host ::ng-deep {
        .p-dock-item i {
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
        }
      }
    }
  `]
})
export class FloatingDockComponent implements OnInit, OnDestroy {
  private scrollSpyService = inject(ScrollSpyService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  protected isHome = signal<boolean>(true);
  private destroy$ = new Subject<void>();
  items = signal<MenuItem[]>([]);
  
  constructor() {
    // Update items when theme changes
    effect(() => {
      this.themeService.themeMode();
      this.updateItems();
    });
  }
  
  ngOnInit(): void {
    this.updateItems();
    this.checkIsHome();

    this.router
    .events
    .pipe(filter((event: any) => event instanceof NavigationEnd), takeUntil(this.destroy$))
    .subscribe(() => {
      this.checkIsHome();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkIsHome(): void {
    const url = this.router.url;
    const isHome = url === '/' || url === '/home' || url.startsWith('/home#') || url.startsWith('/#');
    this.isHome.set(isHome);
  }
  
  private updateItems(): void {
    const newItems: MenuItem[] = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.scrollToSection('profile')
      },
      {
        label: 'Education',
        icon: 'pi pi-book',
        command: () => this.scrollToSection('education')
      },
      {
        label: 'Experience',
        icon: 'pi pi-briefcase',
        command: () => this.scrollToSection('experience')
      },
      {
        label: 'Skills',
        icon: 'pi pi-star',
        command: () => this.scrollToSection('skills')
      },
      {
        label: 'Projects',
        icon: 'pi pi-folder',
        command: () => this.scrollToSection('projects')
      },
      {
        label: 'Achievements',
        icon: 'pi pi-trophy',
        command: () => this.scrollToSection('achievements')
      },
      {
        label: 'Certifications',
        icon: 'pi pi-id-card',
        command: () => this.scrollToSection('certifications')
      }
    ];
    
    this.items.set([...newItems]);
  }

  handleItemClick(item: MenuItem): void {
    if (item.command) {
      if (typeof item.command === 'function') {
        try {
          item.command({ item, originalEvent: new Event('click') } as any);
        } catch {
          (item.command as () => void)();
        }
      }
    }
  }

  scrollToSection(section: string): void {
    this.scrollSpyService.scrollToSection(section);
  }

  toggleTheme(): void {
    const currentTheme = this.themeService.themeMode();
    this.themeService.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    setTimeout(() => this.updateItems(), 100);
  }
}

