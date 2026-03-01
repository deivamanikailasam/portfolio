import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-profile',
  imports: [CommonModule, ButtonModule, CardModule],
  template: `
    <div class="profile-hero-container">
      @if (profile(); as profileData) {
        <div class="hero-content-wrapper">
          <!-- Animated Background Elements -->
          <div class="hero-bg-elements">
            <div class="bg-circle circle-1"></div>
            <div class="bg-circle circle-2"></div>
            <div class="bg-circle circle-3"></div>
            <div class="bg-circle circle-4"></div>
          </div>
          
          <!-- Main Hero Content -->
          <div class="hero-main-content">
            <!-- Avatar Section -->
            <div class="avatar-section">
              <div class="avatar-wrapper">
                @if (profileData.avatar) {
                  <img 
                    [src]="profileData.avatar" 
                    [alt]="profileData.name"
                    class="profile-avatar"
                    (error)="onImageError($event)"
                  />
                } @else {
                  <div class="avatar-placeholder">
                    <i class="pi pi-user"></i>
                  </div>
                }
                <div class="avatar-ring ring-1"></div>
                <div class="avatar-ring ring-2"></div>
                <div class="avatar-ring ring-3"></div>
              </div>
            </div>
            
            <!-- Profile Info -->
            <div class="profile-info-section">
              <div class="greeting-text">Hello, I'm</div>
              <h1 class="profile-name">
                <span class="name-text gradient-text">{{ profileData.name }}</span>
              </h1>
              <h2 class="profile-title">
                <span class="title-text">{{ profileData.title }}</span>
              </h2>
              <p class="profile-bio">{{ profileData.bio }}</p>
              
              <!-- Location & Contact Info -->
              <div class="profile-meta">
                @if (profileData.location) {
                  <div class="meta-item">
                    <i class="pi pi-map-marker"></i>
                    <span>{{ profileData.location }}</span>
                  </div>
                }
                @if (profileData.email) {
                  <div class="meta-item">
                    <i class="pi pi-envelope"></i>
                    <a [href]="'mailto:' + profileData.email">{{ profileData.email }}</a>
                  </div>
                }
                @if (profileData.phone) {
                  <div class="meta-item">
                    <i class="pi pi-phone"></i>
                    <span>{{ profileData.phone }}</span>
                  </div>
                }
              </div>
              
              <!-- Social Links -->
              @if (profileData.socials && profileData.socials.length > 0) {
                <div class="social-links">
                  @for (social of profileData.socials; track social.platform) {
                    <a 
                      [href]="social.url" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="social-btn"
                      [attr.aria-label]="social.platform"
                    >
                      <i [class]="social.icon"></i>
                    </a>
                  }
                </div>
              }
              
              <!-- CTA Buttons -->
              <!-- <div class="cta-buttons">
                <p-button 
                  label="View My Work" 
                  icon="pi pi-arrow-down"
                  [styleClass]="'p-button-rounded p-button-lg cta-primary'"
                  (onClick)="scrollToProjects()"
                ></p-button>
                <p-button 
                  label="Get In Touch" 
                  icon="pi pi-envelope"
                  [styleClass]="'p-button-rounded p-button-lg p-button-outlined cta-secondary'"
                  (onClick)="scrollToContact()"
                ></p-button>
              </div> -->
            </div>
          </div>
          
          <!-- Scroll Indicator -->
          <!-- <div class="scroll-indicator" appFadeIn>
            <div class="scroll-mouse">
              <div class="scroll-wheel"></div>
            </div>
            <span class="scroll-text">Scroll to explore</span>
          </div> -->
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-hero-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .hero-content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      margin: 0 auto;
    }
    
    .hero-bg-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float-circle 20s ease-in-out infinite;
    }
    
    .circle-1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.6), transparent);
      top: -10%;
      left: -5%;
      animation-delay: 0s;
    }
    
    .circle-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.5), transparent);
      top: 20%;
      right: -10%;
      animation-delay: -5s;
    }
    
    .circle-3 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(67, 233, 123, 0.4), transparent);
      bottom: 10%;
      left: 10%;
      animation-delay: -10s;
    }
    
    .circle-4 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.5), transparent);
      bottom: -5%;
      right: 15%;
      animation-delay: -15s;
    }
    
    @keyframes float-circle {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(50px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-30px, 30px) scale(0.9);
      }
    }
    
    .hero-main-content {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 4rem;
      align-items: center;
    }
    
    .avatar-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .avatar-wrapper {
      position: relative;
      width: 280px;
      height: 280px;
    }
    
    .profile-avatar,
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      z-index: 2;
      border: 6px solid transparent;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c);
      background-clip: padding-box;
      box-shadow: 
        0 30px 80px rgba(102, 126, 234, 0.4),
        inset 0 0 0 6px rgba(255, 255, 255, 0.1);
      animation: avatar-float 6s ease-in-out infinite;
    }
    
    .avatar-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-size: 6rem;
    }
    
    @keyframes avatar-float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
    }
    
    .avatar-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: ring-pulse 3s ease-in-out infinite;
    }
    
    .ring-1 {
      width: 320px;
      height: 320px;
      border-color: rgba(102, 126, 234, 0.4);
      animation-delay: 0s;
    }
    
    .ring-2 {
      width: 360px;
      height: 360px;
      border-color: rgba(240, 147, 251, 0.3);
      animation-delay: -1s;
    }
    
    .ring-3 {
      width: 400px;
      height: 400px;
      border-color: rgba(67, 233, 123, 0.2);
      animation-delay: -2s;
    }
    
    @keyframes ring-pulse {
      0%, 100% {
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
    
    .profile-info-section {
      position: relative;
      z-index: 1;
    }
    
    .greeting-text {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1rem;
      font-weight: 400;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .profile-name {
      font-size: 4.5rem;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 1rem;
      margin-top: 0;
    }
    
    .name-text {
      display: inline-block;
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      background-size: 200% 200%;
      animation: gradient-shift 5s ease infinite;
    }
    
    @keyframes gradient-shift {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }
    
    .profile-title {
      font-size: 2rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      margin-top: 0;
    }
    
    .title-text {
      background: linear-gradient(135deg, #ffc107, #ff9800);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .profile-bio {
      font-size: 1.2rem;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.85);
      width: 98%;
      margin-bottom: 2rem;
    }
    
    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      
      i {
        color: #ffc107;
        font-size: 1.25rem;
      }
      
      a {
        color: inherit;
        text-decoration: none;
        transition: color 0.3s ease;
        
        &:hover {
          color: #ffc107;
        }
      }
    }
    
    .social-links {
      display: flex;
      justify-content: flex-end;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
      margin-right: 2.5rem;
      flex-shrink: 0;
    }
    
    .social-btn {
      width: 56px;
      height: 56px;
      min-width: 56px;
      min-height: 56px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 1.5rem;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      transform: translateZ(0);
      will-change: border-color, box-shadow;
      
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        transition: transform 0.3s ease;
        z-index: 0;
      }
      
      i {
        position: relative;
        z-index: 1;
        transition: transform 0.3s ease, color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      &:hover {
        border-color: rgba(102, 126, 234, 0.5);
        box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        
        &::before {
          transform: translate(-50%, -50%) scale(1);
        }
        
        i {
          color: white;
          transform: scale(1.2) rotate(360deg);
        }
      }
    }
    
    .cta-buttons {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    ::ng-deep .cta-primary {
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      border: none !important;
      padding: 1rem 2.5rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4) !important;
      transition: all 0.3s ease !important;
      
      &:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6) !important;
      }
    }
    
    ::ng-deep .cta-secondary {
      background: transparent !important;
      border: 2px solid rgba(255, 255, 255, 0.3) !important;
      color: white !important;
      padding: 1rem 2.5rem !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        transform: translateY(-5px) !important;
      }
    }
    
    // .scroll-indicator {
    //   position: absolute;
    //   bottom: 3rem;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   gap: 1rem;
    //   color: rgba(255, 255, 255, 0.6);
    //   animation: bounce 2s ease-in-out infinite;
    // }
    
    @keyframes bounce {
      0%, 100% {
        transform: translateX(-50%) translateY(0);
      }
      50% {
        transform: translateX(-50%) translateY(-10px);
      }
    }
    
    .scroll-mouse {
      width: 30px;
      height: 50px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-radius: 20px;
      position: relative;
    }
    
    .scroll-wheel {
      width: 4px;
      height: 10px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll-wheel 2s ease-in-out infinite;
    }
    
    @keyframes scroll-wheel {
      0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
    }
    
    .scroll-text {
      font-size: 0.9rem;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    // Responsive Design
    @media (max-width: 1199.98px) {
      .hero-main-content {
        gap: 3rem;
      }
      
      .profile-name {
        font-size: clamp(2.5rem, 5vw, 4.5rem);
      }
      
      .profile-title {
        font-size: clamp(1.5rem, 3vw, 2rem);
      }
    }
    
    @media (max-width: 991.98px) {
      .hero-main-content {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
      }
      
      .avatar-wrapper {
        width: clamp(200px, 30vw, 280px);
        height: clamp(200px, 30vw, 280px);
      }
      
      .ring-1 {
        width: clamp(240px, 35vw, 320px);
        height: clamp(240px, 35vw, 320px);
      }
      
      .ring-2 {
        width: clamp(280px, 40vw, 360px);
        height: clamp(280px, 40vw, 360px);
      }
      
      .ring-3 {
        width: clamp(320px, 45vw, 400px);
        height: clamp(320px, 45vw, 400px);
      }
      
      .profile-name {
        font-size: clamp(2rem, 6vw, 3.5rem);
      }
      
      .profile-title {
        font-size: clamp(1.25rem, 3.5vw, 1.75rem);
      }
      
      .profile-bio {
        font-size: clamp(1rem, 2.5vw, 1.2rem);
        width: 100%;
      }
      
      .social-links {
        justify-content: center;
        margin-right: 0;
      }
      
      .profile-meta {
        justify-content: center;
        gap: 1.5rem;
      }
    }
    
    @media (max-width: 767.98px) {
      .profile-hero-container {
        padding: 2rem 1rem;
        min-height: auto;
      }
      
      .hero-content-wrapper {
        padding: 1rem 0;
      }
      
      .hero-main-content {
        gap: 2rem;
      }
      
      .avatar-wrapper {
        width: clamp(180px, 40vw, 240px);
        height: clamp(180px, 40vw, 240px);
      }
      
      .profile-name {
        font-size: clamp(1.75rem, 7vw, 2.5rem);
        line-height: 1.2;
      }
      
      .profile-title {
        font-size: clamp(1.1rem, 4vw, 1.5rem);
      }
      
      .profile-bio {
        font-size: clamp(0.95rem, 3vw, 1.1rem);
        line-height: 1.6;
      }
      
      .greeting-text {
        font-size: clamp(0.9rem, 2.5vw, 1.25rem);
      }
      
      .profile-meta {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .meta-item {
        font-size: clamp(0.9rem, 2.5vw, 1rem);
      }
      
      .social-btn {
        width: clamp(48px, 12vw, 56px);
        height: clamp(48px, 12vw, 56px);
        font-size: clamp(1.25rem, 3vw, 1.5rem);
      }
      
      .bg-circle {
        filter: blur(60px);
      }
      
      .circle-1, .circle-2, .circle-3, .circle-4 {
        width: clamp(250px, 60vw, 400px);
        height: clamp(250px, 60vw, 400px);
      }
    }
    
    @media (max-width: 575.98px) {
      .profile-hero-container {
        padding: 1.5rem 0.75rem;
      }
      
      .hero-main-content {
        gap: 1.5rem;
      }
      
      .avatar-wrapper {
        width: clamp(150px, 45vw, 200px);
        height: clamp(150px, 45vw, 200px);
      }
      
      .profile-name {
        font-size: clamp(1.5rem, 8vw, 2rem);
      }
      
      .profile-title {
        font-size: clamp(1rem, 4.5vw, 1.25rem);
      }
      
      .profile-bio {
        font-size: clamp(0.875rem, 3.5vw, 1rem);
      }
      
      .social-links {
        gap: 0.75rem;
      }
      
      .social-btn {
        width: clamp(44px, 14vw, 52px);
        height: clamp(44px, 14vw, 52px);
      }
      
      .cta-buttons {
        flex-direction: column;
        width: 100%;
        gap: 1rem;
      }
      
      ::ng-deep .cta-primary,
      ::ng-deep .cta-secondary {
        width: 100% !important;
        padding: 0.875rem 1.5rem !important;
        font-size: 0.95rem !important;
      }
    }
    
    // Landscape orientation for mobile
    @media (max-width: 991.98px) and (orientation: landscape) {
      .profile-hero-container {
        min-height: auto;
        padding: 2rem 1rem;
      }
      
      .hero-main-content {
        gap: 2rem;
      }
      
      .avatar-wrapper {
        width: clamp(150px, 25vh, 200px);
        height: clamp(150px, 25vh, 200px);
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile = computed(() => {
    return this.contentService.profileData() || null;
  });

  constructor(
    public contentService: ContentService
  ) {}

  ngOnInit(): void {
    if (!this.contentService.profileData()) {
      this.contentService.loadProfileData();
    }
  }

  scrollToProjects(): void {
    const element = document.getElementById('projects');
    const scrollContainer = document.querySelector('.infinite-scroll-container') as HTMLElement;
    if (element && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const elementTop = elementRect.top - containerRect.top + scrollTop;
      scrollContainer.scrollTo({ top: elementTop - 100, behavior: 'smooth' });
    }
  }

  scrollToContact(): void {
    const element = document.getElementById('contact');
    const scrollContainer = document.querySelector('.infinite-scroll-container') as HTMLElement;
    if (element && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const elementTop = elementRect.top - containerRect.top + scrollTop;
      scrollContainer.scrollTo({ top: elementTop - 100, behavior: 'smooth' });
    }
  }

  getImagePath(path: string | undefined): string {
    if (!path) return '';
    
    // If it's already a full URL (http/https), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If it starts with /, remove it to make it relative
    // This ensures it works with base href
    if (path.startsWith('/')) {
      return path.substring(1);
    }
    
    // Return the path as is (should be relative like "assets/images/avatar.png")
    return path;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Fallback: hide the image and show placeholder
    img.style.display = 'none';
    console.error('Failed to load image:', img.src);
  }
}
