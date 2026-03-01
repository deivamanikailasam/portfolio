import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollSpyService } from '../../core/services/scroll-spy.service';
import { ProfileComponent } from '../profile/profile.component';
import { EducationComponent } from '../education/education.component';
import { ExperienceComponent } from '../experience/experience.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { AchievementsComponent } from '../achievements/achievements.component';
import { CertificationsComponent } from '../certifications/certifications.component';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    EducationComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    AchievementsComponent,
    CertificationsComponent,
    ParallaxDirective
  ],
  template: `
    <!-- Invisible Scroll Container -->
    <div class="infinite-scroll-wrapper" #scrollWrapper>
      <div class="infinite-scroll-container" #scrollContainer>
        <!-- Profile/Hero Section -->
        <section id="profile" class="parallax-section hero-section">
          <div class="parallax-bg layer-1" appParallax [parallaxSpeed]="0.3"></div>
          <div class="parallax-bg layer-2" appParallax [parallaxSpeed]="0.5"></div>
          <div class="parallax-bg layer-3" appParallax [parallaxSpeed]="0.7"></div>
          <div class="section-content">
            <app-profile></app-profile>
          </div>
        </section>
        
        <!-- Education Section -->
        <section id="education" class="parallax-section education-bg">
          <div class="parallax-bg layer-4" appParallax [parallaxSpeed]="0.4"></div>
          <div class="parallax-bg layer-5" appParallax [parallaxSpeed]="0.6"></div>
          <div class="section-content">
            <app-education></app-education>
          </div>
        </section>
        
        <!-- Experience Section -->
        <section id="experience" class="parallax-section experience-bg">
          <div class="parallax-bg layer-6" appParallax [parallaxSpeed]="0.35"></div>
          <div class="parallax-bg layer-7" appParallax [parallaxSpeed]="0.55"></div>
          <div class="section-content">
            <app-experience></app-experience>
          </div>
        </section>
        
        <!-- Skills Section -->
        <section id="skills" class="parallax-section skills-bg">
          <div class="parallax-bg layer-8" appParallax [parallaxSpeed]="0.45"></div>
          <div class="parallax-bg layer-9" appParallax [parallaxSpeed]="0.65"></div>
          <div class="section-content">
            <app-skills></app-skills>
          </div>
        </section>
        
        <!-- Projects Section -->
        <section id="projects" class="parallax-section projects-bg">
          <div class="parallax-bg layer-10" appParallax [parallaxSpeed]="0.4"></div>
          <div class="parallax-bg layer-11" appParallax [parallaxSpeed]="0.6"></div>
          <div class="section-content">
            <app-projects></app-projects>
          </div>
        </section>
        
        <!-- Achievements Section -->
        <section id="achievements" class="parallax-section achievements-bg">
          <div class="parallax-bg layer-12" appParallax [parallaxSpeed]="0.5"></div>
          <div class="parallax-bg layer-13" appParallax [parallaxSpeed]="0.7"></div>
          <div class="section-content">
            <app-achievements></app-achievements>
          </div>
        </section>
        
        <!-- Certifications Section -->
        <section id="certifications" class="parallax-section certifications-bg">
          <div class="parallax-bg layer-14" appParallax [parallaxSpeed]="0.4"></div>
          <div class="parallax-bg layer-15" appParallax [parallaxSpeed]="0.6"></div>
          <div class="section-content">
            <app-certifications></app-certifications>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .infinite-scroll-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      z-index: 0;
    }
    
    .infinite-scroll-container {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      
      /* Hide scrollbar but keep functionality */
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
    }
    
    .parallax-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      scroll-margin-top: 0;
      width: 100%;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(102, 126, 234, 0.6) 20%,
          rgba(240, 147, 251, 0.6) 50%,
          rgba(67, 233, 123, 0.6) 80%,
          transparent 100%
        );
        z-index: 2;
        animation: shimmer 3s ease-in-out infinite;
      }
    }
    
    @keyframes shimmer {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
    }
    
    .parallax-bg {
      position: absolute;
      top: -20%;
      left: -20%;
      width: 140%;
      height: 140%;
      background-size: cover;
      background-position: center;
      z-index: 0;
      pointer-events: none;
      will-change: transform;
      
      &.layer-1 {
        background: radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 60%);
        animation: float-1 25s ease-in-out infinite;
      }
      
      &.layer-2 {
        background: radial-gradient(circle at 80% 30%, rgba(240, 147, 251, 0.3) 0%, transparent 60%);
        animation: float-2 30s ease-in-out infinite reverse;
      }
      
      &.layer-3 {
        background: radial-gradient(circle at 50% 70%, rgba(118, 75, 162, 0.25) 0%, transparent 60%);
        animation: float-3 28s ease-in-out infinite;
      }
      
      &.layer-4 {
        background: radial-gradient(circle at 40% 40%, rgba(67, 233, 123, 0.35) 0%, transparent 60%);
        animation: float-1 27s ease-in-out infinite reverse;
      }
      
      &.layer-5 {
        background: radial-gradient(circle at 70% 60%, rgba(56, 249, 215, 0.3) 0%, transparent 60%);
        animation: float-2 32s ease-in-out infinite;
      }
      
      &.layer-6 {
        background: radial-gradient(circle at 30% 50%, rgba(79, 172, 254, 0.35) 0%, transparent 60%);
        animation: float-3 26s ease-in-out infinite reverse;
      }
      
      &.layer-7 {
        background: radial-gradient(circle at 60% 30%, rgba(0, 242, 254, 0.3) 0%, transparent 60%);
        animation: float-1 29s ease-in-out infinite;
      }
      
      &.layer-8 {
        background: radial-gradient(circle at 50% 50%, rgba(250, 112, 154, 0.35) 0%, transparent 60%);
        animation: float-2 31s ease-in-out infinite reverse;
      }
      
      &.layer-9 {
        background: radial-gradient(circle at 80% 70%, rgba(254, 225, 64, 0.3) 0%, transparent 60%);
        animation: float-3 28s ease-in-out infinite;
      }
      
      &.layer-10 {
        background: radial-gradient(circle at 40% 60%, rgba(118, 75, 162, 0.35) 0%, transparent 60%);
        animation: float-1 30s ease-in-out infinite reverse;
      }
      
      &.layer-11 {
        background: radial-gradient(circle at 70% 40%, rgba(102, 126, 234, 0.3) 0%, transparent 60%);
        animation: float-2 27s ease-in-out infinite;
      }
      
      &.layer-12 {
        background: radial-gradient(circle at 50% 30%, rgba(255, 193, 7, 0.35) 0%, transparent 60%);
        animation: float-3 29s ease-in-out infinite reverse;
      }
      
      &.layer-13 {
        background: radial-gradient(circle at 30% 70%, rgba(255, 152, 0, 0.3) 0%, transparent 60%);
        animation: float-1 31s ease-in-out infinite;
      }
      
      &.layer-14 {
        background: radial-gradient(circle at 60% 50%, rgba(0, 242, 254, 0.35) 0%, transparent 60%);
        animation: float-2 28s ease-in-out infinite reverse;
      }
      
      &.layer-15 {
        background: radial-gradient(circle at 80% 30%, rgba(79, 172, 254, 0.3) 0%, transparent 60%);
        animation: float-3 30s ease-in-out infinite;
      }
      
      &.layer-16 {
        background: radial-gradient(circle at 50% 50%, rgba(245, 87, 108, 0.35) 0%, transparent 60%);
        animation: float-1 29s ease-in-out infinite reverse;
      }
      
      &.layer-17 {
        background: radial-gradient(circle at 70% 60%, rgba(240, 147, 251, 0.3) 0%, transparent 60%);
        animation: float-2 32s ease-in-out infinite;
      }
    }
    
    @keyframes float-1 {
      0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      33% {
        transform: translate(40px, -40px) scale(1.15) rotate(5deg);
      }
      66% {
        transform: translate(-30px, 30px) scale(0.9) rotate(-5deg);
      }
    }
    
    @keyframes float-2 {
      0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      33% {
        transform: translate(-35px, 35px) scale(1.1) rotate(-3deg);
      }
      66% {
        transform: translate(45px, -45px) scale(0.95) rotate(3deg);
      }
    }
    
    @keyframes float-3 {
      0%, 100% {
        transform: translate(0, 0) scale(1) rotate(0deg);
      }
      33% {
        transform: translate(30px, 30px) scale(1.2) rotate(4deg);
      }
      66% {
        transform: translate(-40px, -40px) scale(0.85) rotate(-4deg);
      }
    }
    
    .section-content {
      position: relative;
      z-index: 1;
      width: 100%;
      margin: 0 auto;
    }
    
    .hero-section {
      min-height: 100vh;
      background: linear-gradient(180deg, 
        #0a0a0a 0%, 
        #0f0f15 25%,
        #1a1a2e 50%,
        #0f0f15 75%,
        #0a0a0a 100%
      );
    }
    
    .education-bg {
      background: linear-gradient(180deg, #0a0a0a 0%, #0d1b1a 50%, #0a0a0a 100%);
    }
    
    .experience-bg {
      background: linear-gradient(180deg, #0a0a0a 0%, #0f1520 50%, #0a0a0a 100%);
    }
    
    .skills-bg {
      background: linear-gradient(180deg, #0a0a0a 0%, #1a0f1a 50%, #0a0a0a 100%);
    }
    
    .projects-bg {
      background: linear-gradient(180deg, #0a0a0a 0%, #0f0f1a 50%, #0a0a0a 100%);
    }
    
    .achievements-bg {
      background: linear-gradient(180deg, #0a0a0a 0%, #1a1a0a 50%, #0a0a0a 100%);
    }
    
    .certifications-bg {
      background: linear-gradient(180deg, #0a0a0a 0%, #0a1a1a 50%, #0a0a0a 100%);
    }
    
    // Responsive Design
    @media (max-width: 1199.98px) {
      .parallax-section {
        min-height: auto;
        padding: 3rem 1.5rem;
      }
    }
    
    @media (max-width: 991.98px) {
      .parallax-section {
        min-height: auto;
        padding: 2.5rem 1rem;
      }
      
      .section-content {
        width: 100%;
        padding: 0 0.5rem;
      }
      
      .parallax-bg {
        top: -15%;
        left: -15%;
        width: 130%;
        height: 130%;
      }
    }
    
    @media (max-width: 767.98px) {
      .parallax-section {
        min-height: auto;
        padding: 2rem 1rem;
      }
      
      .hero-section {
        min-height: auto;
        padding: 2rem 0;
      }
      
      .section-content {
        padding: 0;
      }
      
      .parallax-bg {
        top: -10%;
        left: -10%;
        width: 120%;
        height: 120%;
        filter: blur(40px);
      }
    }
    
    @media (max-width: 575.98px) {
      .parallax-section {
        padding: 1.5rem 0.75rem;
      }
      
      .hero-section {
        padding: 1.5rem 0;
      }
      
      .parallax-bg {
        filter: blur(30px);
      }
    }
    
    // Landscape orientation
    @media (max-width: 991.98px) and (orientation: landscape) {
      .parallax-section {
        min-height: auto;
        padding: 2rem 1rem;
      }
      
      .hero-section {
        min-height: auto;
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollWrapper', { static: false }) scrollWrapper!: ElementRef<HTMLDivElement>;

  constructor(
    private scrollSpyService: ScrollSpyService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Setup smooth infinite scroll
    this.setupInfiniteScroll();
    
    // Handle hash navigation on load
    if (window.location.hash) {
      const section = window.location.hash.substring(1);
      setTimeout(() => {
        this.scrollSpyService.scrollToSection(section);
      }, 500);
    }
  }

  private setupInfiniteScroll(): void {
    if (!this.scrollContainer?.nativeElement) return;
    
    const container = this.scrollContainer.nativeElement;
    
    // Enable smooth scrolling
    container.style.scrollBehavior = 'smooth';
    
    // Handle scroll events for parallax
    container.addEventListener('scroll', () => {
      this.updateParallax();
    }, { passive: true });
  }

  private updateParallax(): void {
    // Parallax effects are handled by the directive
    // This method can be used for additional scroll-based animations
  }

  @HostListener('window:resize')
  onResize(): void {
    // Handle responsive adjustments
  }
}
