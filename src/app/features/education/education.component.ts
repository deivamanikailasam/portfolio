import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
@Component({
  selector: 'app-education',
  imports: [CommonModule, CardModule, ChipModule],
  template: `
    <div class="education-container">
      <div class="section-header">
        <h2 class="section-title">
          <i class="pi pi-book section-icon"></i>
          Education
        </h2>
        <p class="section-subtitle">My academic journey</p>
      </div>
      
      @if (education().length > 0) {
        <div class="education-grid">
          @for (edu of education(); track edu.id; let i = $index) {
            <p-card 
              class="education-card" 
              [style.--card-color]="getCardColor(i)"
              [class.collapsed-card]="isCardCollapsed(edu.id)">
              <ng-template pTemplate="header">
                <div class="card-header-gradient" [style.background]="getCardGradient(i)">
                  <div class="header-content">
                    <div class="education-icon-wrapper">
                      <i class="pi pi-graduation-cap"></i>
                    </div>
                    <div class="education-header-text">
                      <h3 class="degree-title">{{ edu.position }}</h3>
                      <p class="institution-name">{{ edu.company }}</p>
                    </div>
                    <button 
                      type="button"
                      class="collapse-toggle"
                      (click)="toggleCard(edu.id)"
                      [attr.aria-expanded]="!isCardCollapsed(edu.id)"
                      [attr.title]="isCardCollapsed(edu.id) ? 'Show Details' : 'Hide Details'"
                      [attr.aria-label]="isCardCollapsed(edu.id) ? 'Show Details' : 'Hide Details'">
                      <div class="double-arrow" [class.collapsed]="isCardCollapsed(edu.id)">
                        @if (isCardCollapsed(edu.id)) {
                          <i class="pi pi-chevron-down arrow-icon arrow-1"></i>
                          <i class="pi pi-chevron-down arrow-icon arrow-2"></i>
                        } @else {
                          <i class="pi pi-chevron-up arrow-icon arrow-1"></i>
                          <i class="pi pi-chevron-up arrow-icon arrow-2"></i>
                        }
                      </div>
                    </button>
                  </div>
                </div>
              </ng-template>
              <div class="education-period">
                <i class="pi pi-calendar"></i>
                <span>
                  {{ formatDate(edu.startDate) }} - 
                  @if (edu.endDate) {
                    {{ formatDate(edu.endDate) }}
                  } @else {
                    <span class="badge-ongoing">Ongoing</span>
                  }
                </span>
              </div>
              @if (edu.description) {
                <p class="education-description">{{ edu.description }}</p>
              }
              @if (edu.technologies && edu.technologies.length > 0) {
                <div class="education-tech">
                  <div class="tech-label">
                    <i class="pi pi-code"></i>
                    Related Technologies:
                  </div>
                  <div class="tech-chips">
                    @for (tech of edu.technologies; track tech) {
                      <p-chip [label]="tech" styleClass="tech-chip"></p-chip>
                    }
                  </div>
                </div>
              }
              <ng-template pTemplate="footer">
                <div 
                  class="card-footer" 
                  [style.background]="getCardGradient(i)"
                  [class.hidden]="!isCardCollapsed(edu.id)"></div>
              </ng-template>
            </p-card>
          }
        </div>
      } @else {
        <div class="empty-state">
          <i class="pi pi-info-circle"></i>
          <p>No education data available.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .education-container {
      position: relative;
      width: 100%;
      padding: 4rem 2rem;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    
    .section-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #43e97b, #38f9d7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    
    .section-icon {
      font-size: 4rem;
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      text-align: center;
    }
    
    .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2.5rem;
      max-width: 1400px;
      margin: 0 auto;
      align-items: start;
    }
    
    .education-card {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 1.5rem !important;
      overflow: hidden !important;
      backdrop-filter: blur(10px) !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      animation: card-float 7s ease-in-out infinite;
      
      &:hover {
        transform: translateY(-15px) scale(1.02) !important;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5) !important;
        border-color: var(--card-color, #43e97b) !important;
      }
    }
    
    @keyframes card-float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    .card-header-gradient {
      padding: 2rem;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: inherit;
        opacity: 0.8;
        filter: blur(20px);
      }
    }
    
    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      justify-content: space-between;
    }
    
    .education-icon-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

      .pi {
        font-size: 2.5rem;
      }
    }
    
    .education-header-text {
      flex: 1;
    }
    
    .degree-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .institution-name {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 500;
    }
    
    .collapse-toggle {
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .double-arrow {
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .arrow-icon {
      color: white;
      font-size: 1rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .double-arrow:not(.collapsed) .arrow-icon {
      animation: arrow-bounce 2s ease-in-out infinite;

      &.arrow-1 {
        animation-delay: 0s;
      }

      &.arrow-2 {
        animation-delay: 0.15s;
        opacity: 0.75;
      }
    }

    @keyframes arrow-bounce {
      0%, 100% {
        transform: translateY(0);
        opacity: 1;
      }
      50% {
        transform: translateY(4px);
        opacity: 0.85;
      }
    }

    ::ng-deep .education-card {
      &.collapsed-card .p-card-body {
        max-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        opacity: 0;
        overflow: hidden;
        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:not(.collapsed-card) .p-card-body {
        padding: 2rem !important;
        max-height: 5000px;
        opacity: 1;
        overflow: hidden;
        transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), padding 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease, margin 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }

    .card-footer {
      padding: 1rem;
      position: relative;
      overflow: hidden;
      transition: opacity 0.4s ease, max-height 0.4s ease, padding 0.4s ease, margin 0.4s ease;
      max-height: 100px;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: inherit;
        opacity: 0.8;
        filter: blur(20px);
      }

      &.hidden {
        max-height: 0;
        padding: 0;
        margin: 0;
        opacity: 0;
        overflow: hidden;
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    
    .education-period {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.5rem;
      font-size: 1rem;
      
      i {
        color: #43e97b;
        font-size: 1.25rem;
      }
    }
    
    .badge-ongoing {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
      color: #1a1a1a;
      padding: 0.35rem 1rem;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 0.9rem;
      margin-left: 0.5rem;
      box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
    }
    
    .education-description {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.8;
      margin-bottom: 1.5rem;
      font-size: 1.05rem;
    }
    
    .education-tech {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .tech-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      
      i {
        color: #43e97b;
      }
    }
    
    .tech-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    ::ng-deep .tech-chip {
      background: linear-gradient(135deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.2)) !important;
      color: inherit !important;
      border: 1px solid rgba(67, 233, 123, 0.3) !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
      
      &:hover {
        background: linear-gradient(135deg, #43e97b, #38f9d7) !important;
        color: #1a1a1a !important;
        transform: translateY(-3px) !important;
        box-shadow: 0 5px 15px rgba(67, 233, 123, 0.4) !important;
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255, 255, 255, 0.6);
      
      i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: rgba(255, 255, 255, 0.3);
      }
      
      p {
        font-size: 1.25rem;
        margin: 0;
      }
    }
    
    // Responsive Design
    @media (max-width: 1199.98px) {
      .education-container {
        padding: 3rem 1.5rem;
      }
      
      .education-grid {
        gap: 2rem;
      }
    }
    
    @media (max-width: 991.98px) {
      .section-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .section-icon {
        font-size: clamp(2rem, 5vw, 4rem);
      }
      
      .section-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
      }
      
      .education-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      
      .card-header-gradient {
        padding: 1.5rem;
      }
      
      .education-icon-wrapper {
        width: clamp(60px, 10vw, 70px);
        height: clamp(60px, 10vw, 70px);
        
        .pi {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
        }
      }
      
      .degree-title {
        font-size: clamp(1.5rem, 3vw, 1.75rem);
      }
      
      .institution-name {
        font-size: clamp(1.1rem, 2.5vw, 1.25rem);
      }
    }
    
    @media (max-width: 767.98px) {
      .education-container {
        padding: 2rem 1rem;
      }
      
      .section-header {
        margin-bottom: 3rem;
      }
      
      .section-title {
        font-size: clamp(1.75rem, 6vw, 2.5rem);
      }
      
      .section-icon {
        font-size: clamp(1.75rem, 5vw, 2.5rem);
      }
      
      .education-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .card-header-gradient {
        padding: 1.25rem;
      }
      
      ::ng-deep .education-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.5rem !important;
        }
      }
      
      .education-icon-wrapper {
        width: clamp(50px, 12vw, 60px);
        height: clamp(50px, 12vw, 60px);
        
        .pi {
          font-size: clamp(1.5rem, 4.5vw, 2rem);
        }
      }
      
      .degree-title {
        font-size: clamp(1.25rem, 3.5vw, 1.5rem);
      }
      
      .institution-name {
        font-size: clamp(1rem, 2.8vw, 1.15rem);
      }
      
      .education-period {
        font-size: clamp(0.9rem, 2.5vw, 1rem);
        flex-wrap: wrap;
      }
      
      .education-description {
        font-size: clamp(0.95rem, 2.8vw, 1.05rem);
        line-height: 1.7;
      }
      
      .tech-chips {
        gap: 0.625rem;
      }
    }
    
    @media (max-width: 575.98px) {
      .education-container {
        padding: 1.5rem 0.75rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
      
      .section-title {
        font-size: clamp(1.5rem, 7vw, 2rem);
      }
      
      .section-icon {
        font-size: clamp(1.5rem, 6vw, 2rem);
      }
      
      .education-grid {
        gap: 1.25rem;
      }
      
      .card-header-gradient {
        padding: 1rem;
      }
      
      ::ng-deep .education-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.25rem !important;
        }
      }
      
      .header-content {
        gap: 1rem;
      }
      
      .education-icon-wrapper {
        width: clamp(45px, 14vw, 55px);
        height: clamp(45px, 14vw, 55px);
        
        .pi {
          font-size: clamp(1.25rem, 5vw, 1.75rem);
        }
      }
      
      .degree-title {
        font-size: clamp(1.1rem, 4vw, 1.35rem);
      }
      
      .institution-name {
        font-size: clamp(0.95rem, 3vw, 1.1rem);
      }
      
      .education-description {
        font-size: clamp(0.875rem, 3vw, 0.95rem);
      }
    }
    
    // Landscape orientation
    @media (max-width: 991.98px) and (orientation: landscape) {
      .education-container {
        padding: 2rem 1rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
    }
  `]
})
export class EducationComponent implements OnInit {
  collapsedCards = signal<Record<string, boolean>>({});

  education = computed(() => {
    return this.contentService.educationData();
  });

  constructor(public contentService: ContentService) {
    effect(() => {
      const education = this.education();
      if (education.length > 0 && Object.keys(this.collapsedCards()).length === 0) {
        const initialState: Record<string, boolean> = {};
        education.forEach(edu => {
          initialState[edu.id] = true;
        });
        this.collapsedCards.set(initialState);
      }
    });
  }

  ngOnInit(): void {
    if (this.contentService.educationData().length === 0) {
      this.contentService.loadEducationData();
    }
  }

  toggleCard(cardId: string): void {
    this.collapsedCards.update(collapsed => ({
      ...collapsed,
      [cardId]: !collapsed[cardId]
    }));
  }

  isCardCollapsed(cardId: string): boolean {
    return this.collapsedCards()[cardId] ?? true; // Default to collapsed if not found
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  getCardColor(index: number): string {
    const colors = ['#43e97b', '#38f9d7', '#4facfe', '#00f2fe', '#667eea', '#764ba2'];
    return colors[index % colors.length];
  }

  getCardGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #38f9d7, #43e97b)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #00f2fe, #4facfe)',
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #764ba2, #667eea)'
    ];
    return gradients[index % gradients.length];
  }
}
