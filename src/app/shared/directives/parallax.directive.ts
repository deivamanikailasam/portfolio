import { Directive, ElementRef, HostListener, OnInit, OnDestroy, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  @Input() parallaxSpeed: number = 0.5;
  
  private observer?: IntersectionObserver;
  private scrollListener?: () => void;
  private scrollContainer?: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Find the scroll container (infinite-scroll-container)
    this.scrollContainer = document.querySelector('.infinite-scroll-container') as HTMLElement || window;
    
    this.setupIntersectionObserver();
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'parallax-active');
          } else {
            this.renderer.removeClass(this.el.nativeElement, 'parallax-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private setupScrollListener(): void {
    if (this.scrollContainer && this.scrollContainer instanceof HTMLElement) {
      this.scrollListener = this.renderer.listen(this.scrollContainer, 'scroll', () => {
        this.onScroll();
      });
    } else {
      this.scrollListener = this.renderer.listen('window', 'scroll', () => {
        this.onScroll();
      });
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    let scrollTop: number;

    if (this.scrollContainer && this.scrollContainer instanceof HTMLElement) {
      scrollTop = this.scrollContainer.scrollTop;
    } else {
      scrollTop = window.pageYOffset !== undefined
        ? window.pageYOffset
        : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    const rate = scrollTop * -this.parallaxSpeed;
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `translateY(${rate}px)`
      );
    }
  }
}

