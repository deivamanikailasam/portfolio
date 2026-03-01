import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="scroll-progress-bar" 
      [style.width.px]="progressWidth()"
      [style.left.px]="sidebarOffset()"
    ></div>
  `,
  styles: [`
    .scroll-progress-bar {
      position: fixed;
      top: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
      z-index: 9999;
      transition: width 0.1s ease, left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.5);
    }
  `]
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  scrollProgress = signal(0);
  sidebarOffset = signal(300);
  private scrollSubscription?: any;
  
  progressWidth = computed(() => {
    if (typeof window === 'undefined') return 0;
    const availableWidth = window.innerWidth - this.sidebarOffset();
    return (availableWidth * this.scrollProgress()) / 100;
  });

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.updateSidebarOffset();
      
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(throttleTime(10))
        .subscribe(() => {
          this.updateScrollProgress();
        });
      
      // Listen for sidebar state changes
      const observer = new MutationObserver(() => {
        this.updateSidebarOffset();
      });
      
      const appContainer = document.querySelector('.app-container');
      if (appContainer) {
        observer.observe(appContainer, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
      
      this.updateScrollProgress();
    }
  }
  
  private updateSidebarOffset(): void {
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      const isFolded = appContainer.classList.contains('sidebar-folded');
      this.sidebarOffset.set(isFolded ? 80 : 300);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  private updateScrollProgress(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
    
    this.scrollProgress.set(Math.min(100, Math.max(0, progress)));
  }
}

