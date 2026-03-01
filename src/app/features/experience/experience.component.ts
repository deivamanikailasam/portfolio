import { Component, OnInit, OnDestroy, computed, signal, effect, PLATFORM_ID, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { ContentService } from '../../core/services/content.service';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-experience',
  imports: [CommonModule, CardModule, TimelineModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate('200ms ease-in', style({ opacity: 0, height: 0 }))
      ])
    ])
  ],
  template: `
    <div class="experience-container">
      <div class="section-header">
        <h2 class="section-title">
          <i class="pi pi-briefcase section-icon"></i>
          Professional Experience
        </h2>
        <p class="section-subtitle">My journey through the tech industry</p>
      </div>
      
      @if (experience().length > 0) {
        <!-- Desktop Timeline View -->
        <div class="timeline-wrapper desktop-view">
          <p-timeline [value]="timelineEvents()" [align]="timelineAlign()" layout="vertical" styleClass="custom-timeline">
            <ng-template pTemplate="content" let-event>
              <p-card 
                class="timeline-card"
                [class.collapsed-card]="isCardCollapsed(event.id)">
                <ng-template pTemplate="header">
                  <div class="card-header-gradient" [style.background]="getGradientForIndex(event.index)">
                    <div class="card-header-content">
                      <div class="card-header-main">
                        <div class="card-header-text">
                          <h3 class="position-title">{{ event.position }}</h3>
                          <span class="company-name">{{ event.company }}</span>
                        </div>
                        <button 
                          type="button"
                          class="collapse-toggle"
                          (click)="toggleCard(event.id)"
                          [attr.aria-expanded]="!isCardCollapsed(event.id)"
                          [attr.title]="isCardCollapsed(event.id) ? 'Show Details' : 'Hide Details'"
                          [attr.aria-label]="isCardCollapsed(event.id) ? 'Show Details' : 'Hide Details'">
                          <div class="double-arrow" [class.collapsed]="isCardCollapsed(event.id)">
                            @if (isCardCollapsed(event.id)) {
                              <i class="pi pi-chevron-down arrow-icon arrow-1"></i>
                              <i class="pi pi-chevron-down arrow-icon arrow-2"></i>
                            } @else {
                              <i class="pi pi-chevron-up arrow-icon arrow-1"></i>
                              <i class="pi pi-chevron-up arrow-icon arrow-2"></i>
                            }
                          </div>
                        </button>
                      </div>
                      <div class="date-range-header">
                        <i class="pi pi-calendar date-icon"></i>
                        <span>
                          {{ formatDate(event.startDate) }} - 
                          @if (event.current) {
                            <span class="badge-current">Present</span>
                          } @else if (event.endDate) {
                            {{ formatDate(event.endDate) }}
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </ng-template>
                @if (event.sections && event.sections.length > 0) {
                  <div class="sections-container">
                    @for (section of event.sections; track $index) {
                      <div class="section-block">
                        <button 
                          type="button"
                          class="section-header-btn"
                          (click)="toggleSection(event.id, $index)"
                          [attr.aria-expanded]="!isSectionCollapsed(event.id, $index)">
                          <h4 class="section-header-title" [style.color]="getGradientColorForIcon(event.index)">
                            <i class="pi pi-folder-open section-folder-icon"></i>
                            {{ section.header }}
                          </h4>
                          <i class="pi section-chevron" 
                             [class.pi-chevron-down]="isSectionCollapsed(event.id, $index)"
                             [class.pi-chevron-up]="!isSectionCollapsed(event.id, $index)"></i>
                        </button>
                        @if (!isSectionCollapsed(event.id, $index)) {
                          <div class="section-points" [@slideInOut]>
                            @for (point of section.points; track $index) {
                              <div class="description-item">
                                <i class="pi pi-check-circle description-icon" [style.color]="getGradientColorForIcon(event.index)"></i>
                                <span class="description-text">{{ point }}</span>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else if (isArray(event.description)) {
                  <div class="description-list">
                    @for (desc of event.description; track $index) {
                      <div class="description-item">
                        <i class="pi pi-check-circle description-icon" [style.color]="getGradientColorForIcon(event.index)"></i>
                        <span class="description-text">{{ desc }}</span>
                      </div>
                    }
                  </div>
                } @else if (event.description) {
                  <p class="description">{{ event.description }}</p>
                }
                <ng-template pTemplate="footer">
                  <div 
                    class="card-footer" 
                    [style.background]="getGradientForIndex(event.index)"
                    [class.hidden]="!isCardCollapsed(event.id)"></div>
                </ng-template>
              </p-card>
            </ng-template>
            <ng-template pTemplate="marker" let-event>
              <div class="timeline-marker" [style.background]="getGradientForIndex(event.index)">
                <i class="pi pi-briefcase"></i>
              </div>
            </ng-template>
          </p-timeline>
        </div>
        
        <!-- Mobile Card View -->
        <div class="mobile-cards-wrapper mobile-view">
          @for (event of timelineEvents(); track event.id) {
            <p-card 
              class="mobile-timeline-card"
              [class.collapsed-card]="isCardCollapsed(event.id)">
              <ng-template pTemplate="header">
                <div class="card-header-gradient" [style.background]="getGradientForIndex(event.index)">
                  <div class="card-header-content">
                    <div class="card-header-main">
                      <div class="card-header-text">
                        <h3 class="position-title">{{ event.position }}</h3>
                        <span class="company-name">{{ event.company }}</span>
                      </div>
                      <button 
                        type="button"
                        class="collapse-toggle"
                        (click)="toggleCard(event.id)"
                        [attr.aria-expanded]="!isCardCollapsed(event.id)"
                        [attr.title]="isCardCollapsed(event.id) ? 'Show Details' : 'Hide Details'"
                        [attr.aria-label]="isCardCollapsed(event.id) ? 'Show Details' : 'Hide Details'">
                        <div class="double-arrow" [class.collapsed]="isCardCollapsed(event.id)">
                          @if (isCardCollapsed(event.id)) {
                            <i class="pi pi-chevron-down arrow-icon arrow-1"></i>
                            <i class="pi pi-chevron-down arrow-icon arrow-2"></i>
                          } @else {
                            <i class="pi pi-chevron-up arrow-icon arrow-1"></i>
                            <i class="pi pi-chevron-up arrow-icon arrow-2"></i>
                          }
                        </div>
                      </button>
                    </div>
                    <div class="date-range-header">
                      <i class="pi pi-calendar date-icon"></i>
                      <span>
                        {{ formatDate(event.startDate) }} - 
                        @if (event.current) {
                          <span class="badge-current">Present</span>
                        } @else if (event.endDate) {
                          {{ formatDate(event.endDate) }}
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </ng-template>
              @if (event.sections && event.sections.length > 0) {
                <div class="sections-container">
                  @for (section of event.sections; track $index) {
                    <div class="section-block">
                      <button 
                        type="button"
                        class="section-header-btn"
                        (click)="toggleSection(event.id, $index)"
                        [attr.aria-expanded]="!isSectionCollapsed(event.id, $index)">
                        <h4 class="section-header-title" [style.color]="getGradientColorForIcon(event.index)">
                          <i class="pi pi-folder-open section-folder-icon"></i>
                          {{ section.header }}
                        </h4>
                        <i class="pi section-chevron" 
                           [class.pi-chevron-down]="isSectionCollapsed(event.id, $index)"
                           [class.pi-chevron-up]="!isSectionCollapsed(event.id, $index)"></i>
                      </button>
                      @if (!isSectionCollapsed(event.id, $index)) {
                        <div class="section-points" [@slideInOut]>
                          @for (point of section.points; track $index) {
                            <div class="description-item">
                              <i class="pi pi-check-circle description-icon" [style.color]="getGradientColorForIcon(event.index)"></i>
                              <span class="description-text">{{ point }}</span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              } @else if (isArray(event.description)) {
                <div class="description-list">
                  @for (desc of event.description; track $index) {
                    <div class="description-item">
                      <i class="pi pi-check-circle description-icon" [style.color]="getGradientColorForIcon(event.index)"></i>
                      <span class="description-text">{{ desc }}</span>
                    </div>
                  }
                </div>
              } @else if (event.description) {
                <p class="description">{{ event.description }}</p>
              }
              <ng-template pTemplate="footer">
                <div 
                  class="card-footer" 
                  [style.background]="getGradientForIndex(event.index)"
                  [class.hidden]="!isCardCollapsed(event.id)"></div>
              </ng-template>
            </p-card>
          }
        </div>
      } @else {
        <div class="empty-state">
          <i class="pi pi-info-circle"></i>
          <p>No experience data available.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .experience-container {
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
      background: linear-gradient(135deg, #4facfe, #00f2fe);
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
      color: #4facfe;
      filter: drop-shadow(0 0 10px rgba(79, 172, 254, 0.5));
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }
    
    .timeline-wrapper {
      position: relative;
      margin: 0 auto;
      width: 100%;
      padding: 0;
    }
    
    .desktop-view {
      display: block;
    }
    
    .mobile-view {
      display: none;
    }
    
    // PrimeNG Timeline Customization
    ::ng-deep .custom-timeline {
      .p-timeline {
        position: relative;
      }
      
      .p-timeline-event {
        padding: 2rem 0;
        min-height: 200px;
      }
      
      // Ensure connector line is visible and full height
      .p-timeline-event-connector {
        width: 2px;
        background-color: rgba(79, 172, 254, 0.4);
        flex-grow: 1;
        min-height: 100px;
      }
      
      // Marker styling
      .p-timeline-event-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }
      
      // Content area styling
      .p-timeline-event-content {
        padding: 0 0 0 2rem;
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }
      
      // Opposite side styling for alternate layout - must be visible
      .p-timeline-event-opposite {
        padding: 0 2rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      
      // Ensure separator (marker + connector) is properly positioned
      .p-timeline-event-separator {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 0 0 auto;
        padding: 0 1rem;
      }
    }
    
    .timeline-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      overflow: hidden;
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      width: 100%;
      
      &:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        border-color: rgba(79, 172, 254, 0.5);
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
    
    .card-header-content {
      position: relative;
      z-index: 1;
      text-align: left;
    }

    .card-header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .card-header-text {
      flex: 1;
      min-width: 0;
    }
    
    .position-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    .company-name {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
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

    .date-range-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      
      .date-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
        color: white;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
    }
    
    ::ng-deep .timeline-card,
    ::ng-deep .mobile-timeline-card {
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
    
    .badge-current {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.35rem 1rem;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 0.9rem;
      margin-left: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .description {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.8;
      margin-bottom: 1.5rem;
      font-size: 1.05rem;
    }
    
    .description-list {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .sections-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .section-block {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 1rem;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
      }
    }
    
    .section-header-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
    
    .section-header-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      text-align: left;
    }
    
    .section-folder-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    .section-chevron {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1rem;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    
    .section-points {
      padding: 0 1.25rem 1.25rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .description-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 0.75rem;
      border-left: 3px solid transparent;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(135deg, #4facfe, #00f2fe);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateX(5px);
        
        &::before {
          opacity: 1;
        }
        
        .description-icon {
          transform: scale(1.2);
        }
      }
    }
    
    .description-icon {
      font-size: 1.25rem;
      margin-top: 0.35rem;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }
    
    .description-text {
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      font-size: 1rem;
      flex: 1;
      text-align: left;
    }
    
    .timeline-marker {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      border: 4px solid rgba(255, 255, 255, 0.1);
      animation: marker-pulse 2s ease-in-out infinite;
    }
    
    @keyframes marker-pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      }
      50% {
        transform: scale(1.1);
        box-shadow: 0 15px 40px rgba(79, 172, 254, 0.6);
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
    
    // Mobile Cards Layout
    .mobile-cards-wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      max-width: 100%;
    }
    
    .experience-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      overflow: hidden;
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      width: 100%;
      
      &:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        border-color: rgba(79, 172, 254, 0.5);
      }
    }
    
    .mobile-marker {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      border: 3px solid rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
      margin-right: 1rem;
    }
    
    .header-text {
      flex: 1;
    }
    
    // Responsive Design
    @media (max-width: 1199.98px) {
      .experience-container {
        padding: 3rem 1.5rem;
      }
    }
    
    // Tablet styles - single-sided timeline
    @media (min-width: 768px) and (max-width: 991.98px) {
      .experience-container {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
      }
      
      .section-header {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .section-header * {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .section-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        flex-direction: column;
        gap: 0.75rem;
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .section-icon {
        font-size: clamp(2rem, 5vw, 3rem);
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .section-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .desktop-view {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .mobile-view {
        display: none !important;
      }
      
      .timeline-wrapper {
        max-width: 100%;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      ::ng-deep .custom-timeline {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        
        .p-timeline {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .p-timeline-event {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .p-timeline-event-opposite {
          display: none;
        }
        
        .p-timeline-event-content {
          padding: 0 0 0 1.5rem;
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .p-timeline-event-marker {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .p-timeline-event-separator {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
      }
      
      .timeline-card {
        width: 100%;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .card-header-gradient {
        padding: 1.5rem;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .card-header-main {
        gap: 0.75rem;
        margin-bottom: 0.75rem;
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
      
      ::ng-deep .timeline-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.5rem !important;
        }
      }
      
      .position-title {
        font-size: clamp(1.5rem, 3vw, 1.75rem);
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .company-name {
        font-size: clamp(1.1rem, 2.5vw, 1.25rem);
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    }
    
    // Mobile Card Styles
    .mobile-cards-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
      max-width: 100%;
      padding: 0.5rem 0;
    }

    .mobile-timeline-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      overflow: hidden;
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      width: 100%;
      
      &:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        border-color: rgba(79, 172, 254, 0.5);
      }
    }
    
    // Show mobile cards on mobile devices
    @media (max-width: 767.98px) {
      .experience-container {
        display: block;
        padding: 2rem 1rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
      
      .section-title {
        font-size: clamp(2rem, 8vw, 3rem);
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .section-icon {
        font-size: clamp(1.5rem, 6vw, 2.5rem);
      }
      
      .section-subtitle {
        font-size: clamp(0.9rem, 3vw, 1.1rem);
      }
      
      .desktop-view {
        display: none !important;
      }
      
      .mobile-view {
        display: block !important;
      }
      
      .mobile-cards-wrapper {
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .mobile-timeline-card {
        border-radius: 1.25rem;
        margin-bottom: 1.5rem;
        
        &:last-child {
          margin-bottom: 0;
        }
      }

      .card-header-gradient {
        padding: 1.5rem !important;
      }

      .card-header-main {
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }

      .position-title {
        font-size: clamp(1.25rem, 4vw, 1.5rem) !important;
      }

      .company-name {
        font-size: clamp(1rem, 3vw, 1.15rem) !important;
      }

      .collapse-toggle {
        width: 40px;
        height: 40px;
      }

      .double-arrow {
        width: 20px;
        height: 20px;
      }

      .arrow-icon {
        font-size: 0.9rem;
      }

      .date-range-header {
        font-size: 0.9rem;
        padding-top: 0.75rem;
      }

      ::ng-deep .mobile-timeline-card {
        &:not(.collapsed-card) .p-card-body {
          padding: 1.5rem !important;
        }
      }

      .description-text {
        font-size: 0.9rem;
        line-height: 1.7;
      }
      
      .description-item {
        padding: 0.875rem;
        gap: 0.875rem;
        margin-bottom: 0.75rem;
        border-radius: 0.5rem;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .description-list {
        gap: 0.75rem;
      }
    }
    
    // Desktop styles - ensure alternate alignment works
    @media (min-width: 992px) {
      .desktop-view {
        display: block;
      }
      
      .mobile-view {
        display: none;
      }
      
      ::ng-deep .custom-timeline {
        // Ensure opposite side is visible for alternate layout
        .p-timeline-event-opposite {
          display: flex;
          flex: 1;
          padding: 0 2rem;
          align-items: center;
          justify-content: flex-end;
        }
        
        // Ensure content area doesn't expand card
        .p-timeline-event-content {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding-right: 0;
        }
        
        // Ensure connector line is full height and visible
        .p-timeline-event-connector {
          width: 2px;
          background-color: rgba(79, 172, 254, 0.4);
          flex-grow: 1;
          min-height: 150px;
        }
      }
    }
    
    // Landscape orientation
    @media (max-width: 991.98px) and (orientation: landscape) {
      .experience-container {
        padding: 2rem 1rem;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
      }
      
      .section-header {
        margin-bottom: 2rem;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .desktop-view {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      .mobile-view {
        display: none !important;
      }
      
      .timeline-wrapper {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    }
  `]
})
export class ExperienceComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isMobile = signal(false);
  private isTablet = signal(false);
  private resizeListener?: () => void;
  collapsedCards = signal<Set<string>>(new Set());
  collapsedSections = signal<Set<string>>(new Set());
  
  experience = computed(() => {
    return this.contentService.experienceData();
  });

  timelineEvents = computed(() => {
    return this.experience().map((exp, index) => ({
      ...exp,
      index,
      description: exp.description
    }));
  });

  timelineAlign = computed(() => {
    // Use default (left) alignment for tablets, alternate for desktop
    if (this.isTablet()) {
      return 'left'; // Default alignment for tablets
    }
    return 'alternate'; // Alternate alignment for desktop
  });

  constructor(public contentService: ContentService) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkDeviceSize();
      this.resizeListener = () => this.checkDeviceSize();
      window.addEventListener('resize', this.resizeListener);
    }
    
    // Initialize all cards as collapsed by default when experience data is available
    effect(() => {
      const experience = this.experience();
      if (experience.length > 0 && this.collapsedCards().size === 0) {
        this.collapsedCards.set(new Set(experience.map(exp => exp.id)));
      }
    });
  }
  
  private checkDeviceSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const width = window.innerWidth;
      this.isMobile.set(width < 768);
      this.isTablet.set(width >= 768 && width < 992);
    }
  }
  
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  ngOnInit(): void {
    // Load experience data from experience.json
    if (this.contentService.experienceData().length === 0) {
      this.contentService.loadExperienceData();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  getGradientForIndex(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #ffc107, #ff9800)'
    ];
    return gradients[index % gradients.length];
  }

  getGradientColorForIcon(index: number): string {
    const colors = [
      '#4facfe',
      '#667eea',
      '#f093fb',
      '#43e97b',
      '#fa709a',
      '#ffc107'
    ];
    return colors[index % colors.length];
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  toggleCard(cardId: string): void {
    const collapsed = this.collapsedCards();
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(cardId)) {
      newCollapsed.delete(cardId);
    } else {
      newCollapsed.add(cardId);
    }
    this.collapsedCards.set(newCollapsed);
  }

  isCardCollapsed(cardId: string): boolean {
    return this.collapsedCards().has(cardId);
  }

  toggleSection(cardId: string, sectionIndex: number): void {
    const sectionKey = `${cardId}-${sectionIndex}`;
    const collapsed = this.collapsedSections();
    const newCollapsed = new Set(collapsed);
    if (newCollapsed.has(sectionKey)) {
      newCollapsed.delete(sectionKey);
    } else {
      newCollapsed.add(sectionKey);
    }
    this.collapsedSections.set(newCollapsed);
  }

  isSectionCollapsed(cardId: string, sectionIndex: number): boolean {
    const sectionKey = `${cardId}-${sectionIndex}`;
    return this.collapsedSections().has(sectionKey);
  }
}
