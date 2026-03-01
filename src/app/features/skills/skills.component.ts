import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-skills',
  imports: [CommonModule, CardModule],
  template: `
    <div class="skills-container">
      <div class="section-header">
        <h2 class="section-title">
          <i class="pi pi-star section-icon"></i>
          Skills & Expertise
        </h2>
        <p class="section-subtitle">Technologies I work with</p>
      </div>
      
      @if (skills().length > 0) {
        <div class="skills-grid">
          @for (skillGroup of skills(); track skillGroup.id) {
            <p-card 
              class="skill-category-card" 
              [class.collapsed-card]="isCardCollapsed(skillGroup.id)"
              [style.--category-color]="getCategoryColor(skillGroup.color)"
              [attr.data-card-id]="skillGroup.id">
              <ng-template pTemplate="header">
                <div class="card-header" [style.background]="getCategoryGradient(skillGroup.color)">
                  <div class="header-content">
                    <div class="header-text">
                      <i [class]="skillGroup.icon || 'pi pi-tag'" class="category-icon"></i>
                      <h3 class="category-title">{{ skillGroup.category }}</h3>
                    </div>
                    <button 
                      type="button"
                      class="collapse-toggle"
                      (click)="toggleCard(skillGroup.id)"
                      [attr.aria-expanded]="!isCardCollapsed(skillGroup.id)"
                      [attr.title]="isCardCollapsed(skillGroup.id) ? 'Show skills' : 'Hide skills'"
                      [attr.aria-label]="isCardCollapsed(skillGroup.id) ? 'Show skills' : 'Hide skills'">
                      <div class="double-arrow" [class.collapsed]="isCardCollapsed(skillGroup.id)">
                        @if (isCardCollapsed(skillGroup.id)) {
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
              @if (skillGroup.subdivisions && skillGroup.subdivisions.length > 0) {
                @for (subdivision of skillGroup.subdivisions; track subdivision.title; let j = $index) {
                  <div class="subdivision-section">
                    <h4 class="subdivision-title">{{ subdivision.title }}</h4>
                    <div class="skills-list">
                      @for (skill of subdivision.items; track skill.key; let i = $index) {
                        <div class="skill-item" [style.animation-delay]="(i * 0.05) + 's'">
                          <div class="skill-content" (click)="openSkillDetail(skillGroup.key , subdivision.key, skill.key)">
                            @if (skill.image) {
                              <img [src]="skill.image" [alt]="skill.name" class="skill-image" />
                            } @else if (skill.icon) {
                              <i [class]="skill.icon" class="skill-icon-class"></i>
                            } @else {
                              <span class="skill-icon">{{ getSkillIcon(skill.name) }}</span>
                            }
                            <span class="skill-name">{{ skill.name }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              } @else if (skillGroup.items && skillGroup.items.length > 0) {
                <div class="skills-list">
                  @for (skill of skillGroup.items; track skill.key; let i = $index) {
                    <div class="skill-item" [style.animation-delay]="(i * 0.05) + 's'">
                      <div class="skill-content">
                        @if (skill.image) {
                          <img [src]="skill.image" [alt]="skill.name" class="skill-image" />
                        } @else if (skill.icon) {
                          <i [class]="skill.icon" class="skill-icon-class"></i>
                        } @else {
                          <span class="skill-icon">{{ getSkillIcon(skill.name) }}</span>
                        }
                        <span class="skill-name">{{ skill.name }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
              <ng-template pTemplate="footer">
                <div 
                  class="card-footer" 
                  [style.background]="getCategoryGradient(skillGroup.color)"
                  [class.hidden]="!isCardCollapsed(skillGroup.id)"></div>
              </ng-template>
            </p-card>
          }
        </div>
      } @else {
        <div class="empty-state">
          <i class="pi pi-info-circle"></i>
          <p>No skills data available.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .skills-container {
      position: relative;
      width: 100%;
      padding: 4rem 2rem;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    
    .section-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #fa709a, #fee140);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    
    .section-icon {
      font-size: 3rem;
      color: #fa709a;
      filter: drop-shadow(0 0 10px rgba(250, 112, 154, 0.5));
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2.5rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
      align-items: start;
    }
    
    .skill-category-card {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 1.5rem !important;
      overflow: hidden !important;
      backdrop-filter: blur(10px) !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      animation: card-float 6s ease-in-out infinite;
      position: relative;
      margin-bottom: 1rem;
      
      &:hover {
        animation-play-state: paused !important;
        transform: translateY(-15px) scale(1.02) !important;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5) !important;
        border-color: var(--category-color, #fa709a) !important;
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
    
    .card-header {
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
      justify-content: space-between;
      gap: 1rem;
    }

    .header-text {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 0;
    }
    
    .category-icon {
      font-size: 2.5rem;
      color: white;
      filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));
    }
    
    .category-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
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

    ::ng-deep .skill-category-card {
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
    
    .subdivision-section {
      margin-bottom: 2rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .subdivision-title {
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .skill-item {
      animation: slideInUp 0.6s ease-out both;
      position: relative;
      z-index: 1;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .skill-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      z-index: 2;
      
      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--category-color, #fa709a);
        transform: translateX(5px);
        z-index: 10;
      }
      
      &:active {
        transform: translateX(3px) scale(0.98);
      }
    }
    
    .skill-icon {
      font-size: 1.5rem;
      line-height: 1;
      flex-shrink: 0;
    }
    
    .skill-icon-class {
      font-size: 1.5rem;
      line-height: 1;
      flex-shrink: 0;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .skill-image {
      width: 1.5rem;
      height: 1.5rem;
      object-fit: contain;
      flex-shrink: 0;
    }
    
    .skill-name {
      font-size: 1rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      flex: 1;
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
      .skills-container {
        padding: 3rem 1.5rem;
      }
      
      .skills-grid {
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
        font-size: clamp(2rem, 5vw, 3rem);
      }
      
      .section-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
      }
      
      .skills-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      
      .card-header {
        padding: 1.5rem;
      }

      .header-content {
        gap: 0.75rem;
      }

      .collapse-toggle {
        width: 42px;
        height: 42px;
      }

      .double-arrow {
        width: 20px;
        height: 20px;
      }

      .arrow-icon {
        font-size: 0.9rem;
      }
      
      .category-icon {
        font-size: clamp(2rem, 4vw, 2.5rem);
      }
      
      .category-title {
        font-size: clamp(1.5rem, 3vw, 1.75rem);
      }

      ::ng-deep .skill-category-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.5rem !important;
        }
      }
    }
    
    @media (max-width: 767.98px) {
      .skills-container {
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
      
      .skills-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      
      .skill-category-card {
        margin: 0 0 1.5rem 0;
        
        &:hover,
        &:active,
        &:focus {
          transform: translateY(-10px) scale(1.01) !important;
          z-index: 10;
        }
      }
      
      .card-header {
        padding: 1.25rem;
      }

      .header-content {
        gap: 0.75rem;
      }

      .collapse-toggle {
        width: 40px;
        height: 40px;
      }

      .double-arrow {
        width: 18px;
        height: 18px;
      }

      .arrow-icon {
        font-size: 0.85rem;
      }
      
      ::ng-deep .skill-category-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.5rem !important;
        }
      }
      
      .category-icon {
        font-size: clamp(1.75rem, 4.5vw, 2.25rem);
      }
      
      .category-title {
        font-size: clamp(1.25rem, 3.5vw, 1.5rem);
      }
      
      .subdivision-title {
        font-size: clamp(0.875rem, 2.5vw, 1rem);
      }
      
      .skill-content {
        padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
        gap: 0.75rem;
      }
      
      .skill-icon,
      .skill-icon-class {
        font-size: clamp(1.25rem, 3vw, 1.5rem);
      }
      
      .skill-image {
        width: clamp(1.25rem, 3vw, 1.5rem);
        height: clamp(1.25rem, 3vw, 1.5rem);
      }
      
      .skill-name {
        font-size: clamp(0.9rem, 2.5vw, 1rem);
      }
    }
    
    @media (max-width: 575.98px) {
      .skills-container {
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
      
      .section-subtitle {
        font-size: clamp(0.9rem, 3vw, 1.1rem);
      }
      
      .skills-grid {
        grid-template-columns: 1fr !important;
        gap: 2rem;
        width: 100%;
        max-width: 100%;
      }
      
      .skill-category-card {
        margin: 0 0 1.25rem 0;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        
        &:hover,
        &:active,
        &:focus {
          transform: translateY(-8px) scale(1.01) !important;
          z-index: 10;
        }
      }
      
      .card-header {
        padding: 1rem;
      }
      
      ::ng-deep .skill-category-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.25rem !important;
        }
      }
      
      .header-content {
        gap: 0.75rem;
      }
      
      .category-icon {
        font-size: clamp(1.5rem, 5vw, 2rem);
      }
      
      .category-title {
        font-size: clamp(1.1rem, 4vw, 1.35rem);
      }
      
      .subdivision-section {
        margin-bottom: 1.5rem;
      }
      
      .skills-list {
        gap: 0.75rem;
      }
      
      .skill-content {
        padding: 0.625rem 0.875rem;
        gap: 0.625rem;
        flex-wrap: wrap;
      }
      
      .skill-name {
        font-size: clamp(0.875rem, 3vw, 0.95rem);
      }
    }
    
    // Very small devices - Ensure visibility
    @media (max-width: 375px) {
      .skills-container {
        padding: 1.5rem 0.5rem;
        width: 100%;
        overflow-x: hidden;
      }
      
      .section-header {
        margin-bottom: 1.5rem;
      }
      
      .section-title {
        font-size: clamp(1.25rem, 8vw, 1.75rem);
      }
      
      .section-icon {
        font-size: clamp(1.25rem, 7vw, 1.75rem);
      }
      
      .section-subtitle {
        font-size: clamp(0.85rem, 3.5vw, 1rem);
      }
      
      .skills-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem;
        width: 100%;
        max-width: 100%;
        padding: 0;
        margin: 0;
        display: grid !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .skill-category-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 0 1rem 0;
        box-sizing: border-box;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .card-header {
        padding: 0.875rem;
      }
      
      ::ng-deep .skill-category-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1rem !important;
        }
      }
      
      .header-content {
        gap: 0.625rem;
        flex-wrap: wrap;
      }
      
      .category-icon {
        font-size: clamp(1.25rem, 6vw, 1.75rem);
      }
      
      .category-title {
        font-size: clamp(1rem, 5vw, 1.25rem);
      }
      
      .subdivision-title {
        font-size: clamp(0.8rem, 3vw, 0.95rem);
      }
      
      .skills-list {
        gap: 0.625rem;
      }
      
      .skill-content {
        padding: 0.5rem 0.75rem;
        gap: 0.5rem;
        flex-wrap: wrap;
        min-width: 0;
      }
      
      .skill-icon,
      .skill-icon-class {
        font-size: clamp(1.1rem, 4vw, 1.3rem);
      }
      
      .skill-image {
        width: clamp(1.1rem, 4vw, 1.3rem);
        height: clamp(1.1rem, 4vw, 1.3rem);
      }
      
      .skill-name {
        font-size: clamp(0.8rem, 3.5vw, 0.9rem);
        word-break: break-word;
        overflow-wrap: break-word;
      }
    }
    
    // Landscape orientation for mobile
    @media (max-width: 991.98px) and (orientation: landscape) {
      .skills-container {
        padding: 2rem 1rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
    }
  `]
})
export class SkillsComponent implements OnInit {
  collapsedCards = signal<Set<string>>(new Set());

  skills = computed(() => {
    return this.contentService.skillsData() || [];
  });

  constructor(public contentService: ContentService, private router: Router) {
    // Initialize all cards as collapsed by default when skills data is available
    effect(() => {
      const skills = this.skills();
      if (skills.length > 0 && this.collapsedCards().size === 0) {
        this.collapsedCards.set(new Set(skills.map(skill => String(skill.id))));
      }
    });
  }

  ngOnInit(): void {
    if (this.contentService.skillsData().length === 0) {
      this.contentService.loadSkillsData();
    }
  }

  toggleCard(cardId: string | number): void {
    const id = String(cardId);
    const collapsed = this.collapsedCards();
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    this.collapsedCards.set(newCollapsed);
  }

  isCardCollapsed(cardId: string | number): boolean {
    return this.collapsedCards().has(String(cardId));
  }

  getSkillIcon(skill: string): string {
    const skillIcons: Record<string, string> = {
      'HTML': '🌐', 'html': '🌐', 'HTML5': '🌐',
      'CSS': '🎨', 'css': '🎨', 'CSS3': '🎨',
      'JavaScript': '⚡', 'javascript': '⚡', 'JS': '⚡',
      'TypeScript': '📘', 'typescript': '📘', 'TS': '📘',
      'Angular': '🅰️', 'angular': '🅰️',
      'React': '⚛️', 'react': '⚛️',
      'Vue': '💚', 'vue': '💚',
      'Node.js': '🟢', 'node': '🟢', 'Node': '🟢',
      'Python': '🐍', 'python': '🐍',
      'Java': '☕', 'java': '☕',
      'C++': '⚙️', 'C#': '🔷',
      'Git': '📦', 'git': '📦',
      'Docker': '🐳', 'docker': '🐳',
      'AWS': '☁️', 'aws': '☁️',
      'RxJS': '⚡', 'rxjs': '⚡',
      'SCSS': '🎨', 'scss': '🎨', 'SASS': '🎨',
      'PostgreSQL': '🐘', 'postgresql': '🐘',
      'MongoDB': '🍃', 'mongodb': '🍃',
      'Express': '🚂', 'express': '🚂',
      'Firebase': '🔥', 'firebase': '🔥',
      'Jest': '🧪', 'jest': '🧪',
      'Karma': '⚡', 'karma': '⚡',
      'Webpack': '📦', 'webpack': '📦'
    };
    
    return skillIcons[skill] || '💼';
  }

  getCategoryColor(color?: string): string {
    const colors: Record<string, string> = {
      '#e74c3c': '#e74c3c',
      '#3498db': '#3498db',
      '#2ecc71': '#2ecc71',
      '#f39c12': '#f39c12',
      '#9b59b6': '#9b59b6',
      '#1abc9c': '#1abc9c'
    };
    
    return colors[color || '#fa709a'] || '#fa709a';
  }

  getCategoryGradient(color?: string): string {
    const gradients: Record<string, string> = {
      '#e74c3c': 'linear-gradient(135deg, #e74c3c, #c0392b)',
      '#3498db': 'linear-gradient(135deg, #3498db, #2980b9)',
      '#2ecc71': 'linear-gradient(135deg, #2ecc71, #27ae60)',
      '#f39c12': 'linear-gradient(135deg, #f39c12, #e67e22)',
      '#9b59b6': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      '#1abc9c': 'linear-gradient(135deg, #1abc9c, #16a085)'
    };
    
    return gradients[color || '#fa709a'] || 'linear-gradient(135deg, #fa709a, #fee140)';
  }

  openSkillDetail(category: string, division: string, key: string): void {
    this.router.navigate(['/skills', category, division, key]);
  }
}
