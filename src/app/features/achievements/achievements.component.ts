import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { Achievement } from '../../core/models/portfolio.interface';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-achievements',
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    ButtonModule,
    SelectButtonModule,
    FormsModule,
  ],
  animations: [
    trigger('staggerIn', [
      transition(':enter', [
        query(
          '.achievement-card-wrapper',
          [
            style({ opacity: 0, transform: 'translateY(40px) scale(0.95)' }),
            stagger(100, [
              animate(
                '600ms cubic-bezier(0.35, 0, 0.25, 1)',
                style({ opacity: 1, transform: 'translateY(0) scale(1)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '500ms 200ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('counterIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate(
          '700ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
    trigger('cardHover', [
      state(
        'default',
        style({ transform: 'translateY(0) scale(1)' })
      ),
      state(
        'hovered',
        style({ transform: 'translateY(-12px) scale(1.02)' })
      ),
      transition('default <=> hovered', [
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)'),
      ]),
    ]),
  ],
  template: `
    <div class="achievements-container">
      <!-- Section Header -->
      <div class="section-header" @fadeSlideIn>
        <div class="header-badge">
          <i class="pi pi-trophy"></i>
        </div>
        <h2 class="section-title">Achievements & Awards</h2>
        <p class="section-subtitle">
          Recognition, milestones, and measurable impact across my career
        </p>
        <div class="header-divider">
          <span class="divider-dot"></span>
          <span class="divider-line"></span>
          <span class="divider-dot"></span>
        </div>
      </div>

      @if (allAchievements().length > 0) {
        <!-- Stats Counter Row -->
        <div class="stats-row" @fadeSlideIn>
          @for (stat of stats(); track stat.label) {
            <div class="stat-card" @counterIn>
              <div
                class="stat-icon-ring"
                [style.--ring-color]="stat.color"
                [style.--ring-glow]="stat.glow"
              >
                <i [class]="stat.icon"></i>
              </div>
              <div class="stat-value" [style.color]="stat.color">
                {{ stat.value }}
              </div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          }
        </div>

        <!-- Filter Tabs -->
        <div class="filter-section" @fadeSlideIn>
          <div class="filter-tabs">
            @for (filter of filterOptions; track filter.value) {
              <button
                class="filter-btn"
                [class.active]="activeFilter() === filter.value"
                (click)="activeFilter.set(filter.value)"
              >
                <i [class]="filter.icon"></i>
                <span>{{ filter.label }}</span>
                <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Awards Section -->
        @if (activeFilter() === 'all' || activeFilter() === 'award') {
          @if (awards().length > 0) {
            <div class="category-section">
              <div class="category-header">
                <div class="category-icon-wrapper award-gradient">
                  <i class="pi pi-trophy"></i>
                </div>
                <div>
                  <h3 class="category-title">Awards & Recognition</h3>
                  <p class="category-subtitle">Formal recognition received throughout my career</p>
                </div>
              </div>
              <div class="awards-timeline" @staggerIn>
                @for (achievement of awards(); track achievement.id; let i = $index; let last = $last) {
                  <div
                    class="achievement-card-wrapper timeline-item"
                    [class.highlight]="achievement.highlight"
                  >
                    <div class="timeline-connector">
                      <div
                        class="timeline-dot"
                        [style.--dot-color]="getAwardColor(i)"
                      ></div>
                      @if (!last) {
                        <div class="timeline-line"></div>
                      }
                    </div>
                    <div
                      class="achievement-card award-card"
                      [style.--accent]="getAwardColor(i)"
                      [style.--accent-rgb]="getAwardColorRgb(i)"
                      [@cardHover]="hoveredCard() === achievement.id ? 'hovered' : 'default'"
                      (mouseenter)="hoveredCard.set(achievement.id)"
                      (mouseleave)="hoveredCard.set(null)"
                    >
                      <div class="card-glow"></div>
                      <div class="card-inner">
                        <div class="card-top-row">
                          <div
                            class="card-icon-badge"
                            [style.background]="'linear-gradient(135deg, ' + getAwardColor(i) + ', ' + getAwardColorSecondary(i) + ')'"
                          >
                            <i [class]="achievement.icon || 'pi pi-trophy'"></i>
                          </div>
                          <div class="card-meta">
                            <span class="card-org">
                              <i class="pi pi-building"></i>
                              {{ achievement.organization }}
                            </span>
                            <span class="card-date">
                              <i class="pi pi-calendar"></i>
                              {{ formatDate(achievement.date) }}
                            </span>
                          </div>
                        </div>
                        <h4 class="card-title">{{ achievement.title }}</h4>
                        <p class="card-description">{{ achievement.description }}</p>
                        @if (achievement.highlight) {
                          <div class="highlight-badge">
                            <i class="pi pi-star-fill"></i> Featured
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        <!-- Milestones Section -->
        @if (activeFilter() === 'all' || activeFilter() === 'milestone') {
          @if (milestones().length > 0) {
            <div class="category-section">
              <div class="category-header">
                <div class="category-icon-wrapper milestone-gradient">
                  <i class="pi pi-flag-fill"></i>
                </div>
                <div>
                  <h3 class="category-title">Career Milestones</h3>
                  <p class="category-subtitle">Key technical achievements and scale milestones</p>
                </div>
              </div>
              <div class="metrics-grid" @staggerIn>
                @for (achievement of milestones(); track achievement.id; let i = $index) {
                  <div class="achievement-card-wrapper">
                    <div
                      class="achievement-card metric-card"
                      [style.--accent]="getMilestoneColor(i)"
                      [style.--accent-rgb]="getMilestoneColorRgb(i)"
                      [@cardHover]="hoveredCard() === achievement.id ? 'hovered' : 'default'"
                      (mouseenter)="hoveredCard.set(achievement.id)"
                      (mouseleave)="hoveredCard.set(null)"
                    >
                      <div class="card-glow"></div>
                      <div class="card-inner">
                        <div class="metric-hero">
                          <div
                            class="metric-icon-ring"
                            [style.background]="'linear-gradient(135deg, ' + getMilestoneColor(i) + '30, ' + getMilestoneColor(i) + '10)'"
                            [style.border-color]="getMilestoneColor(i) + '40'"
                          >
                            <i [class]="achievement.icon || 'pi pi-chart-bar'" [style.color]="getMilestoneColor(i)"></i>
                          </div>
                          @if (achievement.metric) {
                            <div class="metric-value" [style.color]="getMilestoneColor(i)">
                              {{ achievement.metric }}
                            </div>
                          }
                        </div>
                        <h4 class="card-title">{{ achievement.title }}</h4>
                        <p class="card-description">{{ achievement.description }}</p>
                        <div class="card-footer">
                          <span class="card-org">
                            <i class="pi pi-building"></i>
                            {{ achievement.organization }}
                          </span>
                          <span class="card-date">
                            <i class="pi pi-calendar"></i>
                            {{ formatYear(achievement.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        <!-- Impact Section -->
        @if (activeFilter() === 'all' || activeFilter() === 'impact') {
          @if (impacts().length > 0) {
            <div class="category-section">
              <div class="category-header">
                <div class="category-icon-wrapper impact-gradient">
                  <i class="pi pi-chart-line"></i>
                </div>
                <div>
                  <h3 class="category-title">Business Impact</h3>
                  <p class="category-subtitle">Measurable outcomes and quantified results</p>
                </div>
              </div>
              <div class="metrics-grid" @staggerIn>
                @for (achievement of impacts(); track achievement.id; let i = $index) {
                  <div class="achievement-card-wrapper">
                    <div
                      class="achievement-card impact-card"
                      [style.--accent]="getImpactColor(i)"
                      [style.--accent-rgb]="getImpactColorRgb(i)"
                      [@cardHover]="hoveredCard() === achievement.id ? 'hovered' : 'default'"
                      (mouseenter)="hoveredCard.set(achievement.id)"
                      (mouseleave)="hoveredCard.set(null)"
                    >
                      <div class="card-glow"></div>
                      <div class="card-inner">
                        <div class="impact-top">
                          @if (achievement.metric) {
                            <div class="impact-metric" [style.color]="getImpactColor(i)">
                              {{ achievement.metric }}
                            </div>
                          }
                          <div
                            class="impact-icon"
                            [style.color]="getImpactColor(i)"
                          >
                            <i [class]="achievement.icon || 'pi pi-chart-line'"></i>
                          </div>
                        </div>
                        <h4 class="card-title">{{ achievement.title }}</h4>
                        <p class="card-description">{{ achievement.description }}</p>
                        <div class="card-footer">
                          <span class="card-org">
                            <i class="pi pi-building"></i>
                            {{ achievement.organization }}
                          </span>
                          <span class="card-date">
                            <i class="pi pi-calendar"></i>
                            {{ formatYear(achievement.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }
      } @else {
        <div class="empty-state" @fadeSlideIn>
          <div class="empty-icon">
            <i class="pi pi-trophy"></i>
          </div>
          <h3>No achievements yet</h3>
          <p>Check back soon for updates.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
      width: 100%;
    }

    .achievements-container {
      position: relative;
      width: 100%;
      padding: 4rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ======== Header ======== */
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .header-badge {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffc107, #ff9800);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(255, 193, 7, 0.35);
      animation: badge-glow 3s ease-in-out infinite;

      i {
        font-size: 2.25rem;
        color: #0a0a0a;
      }
    }

    @keyframes badge-glow {
      0%, 100% { box-shadow: 0 8px 32px rgba(255, 193, 7, 0.35); }
      50% { box-shadow: 0 8px 48px rgba(255, 193, 7, 0.55), 0 0 80px rgba(255, 152, 0, 0.2); }
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 900;
      margin-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffc107, #ff9800, #ffc107);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: text-shimmer 4s linear infinite;
    }

    @keyframes text-shimmer {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    .section-subtitle {
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 1.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .header-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .divider-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ffc107;
    }

    .divider-line {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #ffc107, #ff9800);
      border-radius: 1px;
    }

    /* ======== Stats Row ======== */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }

    .stat-card {
      text-align: center;
      padding: 1.75rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 1.25rem;
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateY(-4px);
      }
    }

    .stat-icon-ring {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--ring-color, #ffc107), transparent);
      opacity: 0.9;
      box-shadow: 0 0 20px var(--ring-glow, rgba(255, 193, 7, 0.2));

      i {
        font-size: 1.35rem;
        color: white;
      }
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin-bottom: 0.35rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    /* ======== Filter Tabs ======== */
    .filter-section {
      display: flex;
      justify-content: center;
      margin-bottom: 3rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      padding: 0.35rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1rem;
      backdrop-filter: blur(8px);
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border: none;
      border-radius: 0.75rem;
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      i {
        font-size: 0.9rem;
      }

      .filter-count {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.1rem 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        font-weight: 700;
      }

      &:hover {
        color: rgba(255, 255, 255, 0.9);
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.15));
        color: #ffc107;
        box-shadow: 0 2px 12px rgba(255, 193, 7, 0.15);

        .filter-count {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
      }
    }

    /* ======== Category Sections ======== */
    .category-section {
      margin-bottom: 4rem;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
      padding-left: 0.5rem;
    }

    .category-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      i {
        font-size: 1.35rem;
        color: white;
      }
    }

    .award-gradient {
      background: linear-gradient(135deg, #ffc107, #ff9800);
      box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
    }

    .milestone-gradient {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      box-shadow: 0 4px 16px rgba(79, 172, 254, 0.3);
    }

    .impact-gradient {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
      box-shadow: 0 4px 16px rgba(67, 233, 123, 0.3);
    }

    .category-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      margin: 0 0 0.25rem;
    }

    .category-subtitle {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    /* ======== Awards Timeline ======== */
    .awards-timeline {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .timeline-item {
      display: flex;
      gap: 1.5rem;
      padding-bottom: 2rem;
    }

    .timeline-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 20px;
      padding-top: 1.75rem;
    }

    .timeline-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--dot-color, #ffc107);
      box-shadow: 0 0 12px var(--dot-color, #ffc107);
      flex-shrink: 0;
      z-index: 1;
    }

    .timeline-line {
      width: 2px;
      flex: 1;
      background: linear-gradient(180deg, rgba(255, 193, 7, 0.3), rgba(255, 193, 7, 0.05));
      margin-top: 0.5rem;
    }

    /* ======== Shared Card Styles ======== */
    .achievement-card {
      position: relative;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1.25rem;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.35, 0, 0.25, 1);
      flex: 1;

      &:hover {
        border-color: rgba(var(--accent-rgb, 255, 193, 7), 0.3);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
          0 0 40px rgba(var(--accent-rgb, 255, 193, 7), 0.08);
      }
    }

    .card-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--accent, #ffc107), transparent);
      opacity: 0;
      transition: opacity 0.35s ease;
    }

    .achievement-card:hover .card-glow {
      opacity: 1;
    }

    .card-inner {
      padding: 1.75rem;
      position: relative;
    }

    .card-top-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      gap: 1rem;
    }

    .card-icon-badge {
      width: 52px;
      height: 52px;
      border-radius: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      i {
        font-size: 1.35rem;
        color: white;
      }
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.35rem;

      span {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.45);

        i {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
        }
      }
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.75rem;
      line-height: 1.3;
    }

    .card-description {
      font-size: 0.925rem;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.7;
      margin: 0;
    }

    .highlight-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 1rem;
      padding: 0.3rem 0.85rem;
      background: rgba(255, 193, 7, 0.12);
      border: 1px solid rgba(255, 193, 7, 0.25);
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ffc107;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      i {
        font-size: 0.7rem;
      }
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);

      span {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.4);

        i {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }

    /* ======== Metric Card Specific ======== */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .metric-hero {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .metric-icon-ring {
      width: 56px;
      height: 56px;
      border-radius: 1rem;
      border: 1px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      i {
        font-size: 1.5rem;
      }
    }

    .metric-value {
      font-size: 2.25rem;
      font-weight: 900;
      letter-spacing: -1px;
      line-height: 1;
    }

    /* ======== Impact Card Specific ======== */
    .impact-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .impact-metric {
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: -1px;
      line-height: 1;
    }

    .impact-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);

      i {
        font-size: 1.25rem;
      }
    }

    /* ======== Empty State ======== */
    .empty-state {
      text-align: center;
      padding: 6rem 2rem;

      .empty-icon {
        width: 100px;
        height: 100px;
        margin: 0 auto 1.5rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 2.5rem;
          color: rgba(255, 255, 255, 0.2);
        }
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.4);
        margin: 0 0 0.5rem;
      }

      p {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.3);
        margin: 0;
      }
    }

    /* ======== Responsive ======== */
    @media (max-width: 1199.98px) {
      .achievements-container {
        padding: 3rem 1.5rem;
      }

      .stats-row {
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }
    }

    @media (max-width: 991.98px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .metrics-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .filter-tabs {
        flex-wrap: wrap;
        justify-content: center;
      }

      .category-header {
        gap: 1rem;
      }

      .category-title {
        font-size: 1.3rem;
      }
    }

    @media (max-width: 767.98px) {
      .achievements-container {
        padding: 2rem 1rem;
      }

      .section-header {
        margin-bottom: 3rem;
      }

      .header-badge {
        width: 64px;
        height: 64px;

        i {
          font-size: 1.75rem;
        }
      }

      .stats-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        margin-bottom: 2.5rem;
      }

      .stat-card {
        padding: 1.25rem 0.75rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .stat-label {
        font-size: 0.7rem;
      }

      .filter-tabs {
        gap: 0.25rem;
        padding: 0.25rem;
      }

      .filter-btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;

        span:not(.filter-count) {
          display: none;
        }

        i {
          font-size: 1rem;
        }
      }

      .timeline-item {
        gap: 1rem;
      }

      .timeline-connector {
        width: 16px;
      }

      .timeline-dot {
        width: 10px;
        height: 10px;
      }

      .card-inner {
        padding: 1.25rem;
      }

      .card-top-row {
        flex-direction: column;
        gap: 0.75rem;
      }

      .card-meta {
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .impact-metric, .metric-value {
        font-size: 1.75rem;
      }

      .category-section {
        margin-bottom: 3rem;
      }
    }

    @media (max-width: 575.98px) {
      .achievements-container {
        padding: 1.5rem 0.75rem;
      }

      .header-badge {
        width: 56px;
        height: 56px;
        margin-bottom: 1rem;

        i {
          font-size: 1.5rem;
        }
      }

      .card-title {
        font-size: 1.05rem;
      }

      .card-description {
        font-size: 0.85rem;
      }

      .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.35rem;
      }
    }

    @media (max-width: 991.98px) and (orientation: landscape) {
      .achievements-container {
        padding: 2rem 1rem;
      }

      .section-header {
        margin-bottom: 2rem;
      }

      .stats-row {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `,
  ],
})
export class AchievementsComponent implements OnInit {
  hoveredCard = signal<string | null>(null);
  activeFilter = signal<string>('all');

  filterOptions = [
    { label: 'All', value: 'all', icon: 'pi pi-th-large' },
    { label: 'Awards', value: 'award', icon: 'pi pi-trophy' },
    { label: 'Milestones', value: 'milestone', icon: 'pi pi-flag-fill' },
    { label: 'Impact', value: 'impact', icon: 'pi pi-chart-line' },
  ];

  allAchievements = computed(() => {
    return this.contentService.achievementsData();
  });

  awards = computed(() =>
    this.allAchievements().filter(
      (a) => a.category === 'award'
    )
  );

  milestones = computed(() =>
    this.allAchievements().filter(
      (a) => a.category === 'milestone'
    )
  );

  impacts = computed(() =>
    this.allAchievements().filter(
      (a) => a.category === 'impact'
    )
  );

  stats = computed(() => {
    const all = this.allAchievements();
    return [
      {
        value: all.filter((a) => a.category === 'award').length.toString(),
        label: 'Awards',
        icon: 'pi pi-trophy',
        color: '#ffc107',
        glow: 'rgba(255, 193, 7, 0.25)',
      },
      {
        value: '8+',
        label: 'Years Exp',
        icon: 'pi pi-clock',
        color: '#4facfe',
        glow: 'rgba(79, 172, 254, 0.25)',
      },
      {
        value: all.filter((a) => a.category === 'milestone').length.toString(),
        label: 'Milestones',
        icon: 'pi pi-flag-fill',
        color: '#43e97b',
        glow: 'rgba(67, 233, 123, 0.25)',
      },
      {
        value: all.filter((a) => a.category === 'impact').length.toString(),
        label: 'Impact',
        icon: 'pi pi-chart-line',
        color: '#f5576c',
        glow: 'rgba(245, 87, 108, 0.25)',
      },
    ];
  });

  constructor(public contentService: ContentService) {}

  ngOnInit(): void {
    if (this.contentService.achievementsData().length === 0) {
      this.contentService.loadAchievementsData();
    }
  }

  getFilterCount(filter: string): number {
    if (filter === 'all') return this.allAchievements().length;
    return this.allAchievements().filter((a) => a.category === filter).length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  formatYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  private awardColors = ['#ffc107', '#ff9800', '#f5576c', '#f093fb', '#43e97b'];
  private awardColorsSecondary = ['#ff9800', '#ffc107', '#f093fb', '#667eea', '#38f9d7'];
  private awardColorsRgb = [
    '255, 193, 7',
    '255, 152, 0',
    '245, 87, 108',
    '240, 147, 251',
    '67, 233, 123',
  ];

  private milestoneColors = ['#4facfe', '#667eea', '#00f2fe'];
  private milestoneColorsRgb = ['79, 172, 254', '102, 126, 234', '0, 242, 254'];

  private impactColors = ['#43e97b', '#f5576c', '#ffc107', '#4facfe'];
  private impactColorsRgb = [
    '67, 233, 123',
    '245, 87, 108',
    '255, 193, 7',
    '79, 172, 254',
  ];

  getAwardColor(i: number): string {
    return this.awardColors[i % this.awardColors.length];
  }

  getAwardColorSecondary(i: number): string {
    return this.awardColorsSecondary[i % this.awardColorsSecondary.length];
  }

  getAwardColorRgb(i: number): string {
    return this.awardColorsRgb[i % this.awardColorsRgb.length];
  }

  getMilestoneColor(i: number): string {
    return this.milestoneColors[i % this.milestoneColors.length];
  }

  getMilestoneColorRgb(i: number): string {
    return this.milestoneColorsRgb[i % this.milestoneColorsRgb.length];
  }

  getImpactColor(i: number): string {
    return this.impactColors[i % this.impactColors.length];
  }

  getImpactColorRgb(i: number): string {
    return this.impactColorsRgb[i % this.impactColorsRgb.length];
  }
}
