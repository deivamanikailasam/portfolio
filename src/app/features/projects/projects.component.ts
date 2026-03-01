import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Project } from '../../core/models/portfolio.interface';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, ButtonModule, DialogModule, TagModule],
  template: `
    <div class="projects-container">
      <div class="section-header">
        <div class="header-badge">
          <i class="pi pi-code"></i>
          <span>Portfolio</span>
        </div>
        <h2 class="section-title">Featured Projects</h2>
        <p class="section-subtitle">
          Real-world applications built with modern technologies
        </p>
        <div class="title-decoration">
          <span class="deco-line"></span>
          <span class="deco-diamond"></span>
          <span class="deco-line"></span>
        </div>
      </div>

      @if (categories().length > 1) {
        <div class="category-filters">
          <button
            class="filter-btn"
            [class.active]="activeCategory() === 'All'"
            (click)="setCategory('All')"
          >
            <i class="pi pi-th-large"></i>
            All
            <span class="filter-count">{{ projects().length }}</span>
          </button>
          @for (cat of categories(); track cat) {
            <button
              class="filter-btn"
              [class.active]="activeCategory() === cat"
              (click)="setCategory(cat)"
            >
              <i [class]="getCategoryIcon(cat)"></i>
              {{ cat }}
              <span class="filter-count">{{ getCategoryCount(cat) }}</span>
            </button>
          }
        </div>
      }

      @if (filteredProjects().length > 0) {
        <div class="projects-grid">
          @for (project of paginatedProjects(); track project.id; let i = $index) {
            <div
              class="project-card"
              [style.--accent]="getProjectColor(i)"
              [style.--accent-rgb]="getProjectColorRGB(i)"
              (click)="openProjectModal(project)"
            >
              <div class="card-visual">
                @if (project.image) {
                  <img
                    [src]="project.image"
                    [alt]="project.title"
                    class="project-image"
                  />
                } @else {
                  <div
                    class="project-image-placeholder"
                    [style.background]="getProjectGradient(i)"
                  >
                    <i
                      [class]="project.icon || 'pi pi-code'"
                      class="placeholder-icon"
                    ></i>
                  </div>
                }
                <div class="card-badges">
                  @if (project.featured) {
                    <span class="badge badge-featured">
                      <i class="pi pi-star-fill"></i> Featured
                    </span>
                  }
                  @if (project.status) {
                    <span
                      class="badge"
                      [class.badge-active]="project.status === 'Active'"
                      [class.badge-completed]="project.status === 'Completed'"
                      [class.badge-dev]="project.status === 'In Development'"
                    >
                      <span class="status-dot"></span>
                      {{ project.status }}
                    </span>
                  }
                </div>
              </div>

              <div class="card-body">
                <div class="card-meta">
                  @if (project.category) {
                    <span class="category-tag">
                      {{ project.subcategory || project.category }}
                    </span>
                  }
                  @if (project.version) {
                    <span class="version-tag">v{{ project.version }}</span>
                  }
                </div>

                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-description">{{ project.description }}</p>

                @if (project.technologies && project.technologies.length > 0) {
                  <div class="tech-stack">
                    @for (
                      tech of project.technologies.slice(0, 3);
                      track tech
                    ) {
                      <span class="tech-pill">{{ tech }}</span>
                    }
                    @if (project.technologies.length > 3) {
                      <span class="tech-pill tech-more">
                        +{{ project.technologies.length - 3 }}
                      </span>
                    }
                  </div>
                }

                <div class="card-footer">
                  <div class="card-links" (click)="$event.stopPropagation()">
                    @if (project.github) {
                      <a
                        class="card-link"
                        [href]="project.github"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Source Code"
                      >
                        <i class="pi pi-github"></i>
                      </a>
                    }
                    @if (project.link) {
                      <a
                        class="card-link"
                        [href]="project.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Live Demo"
                      >
                        <i class="pi pi-external-link"></i>
                      </a>
                    }
                  </div>
                  <span class="view-details">
                    Details <i class="pi pi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="pagination">
            <button
              class="page-btn"
              [disabled]="currentPage() === 0"
              (click)="prevPage()"
            >
              <i class="pi pi-chevron-left"></i>
            </button>
            <div class="page-dots">
              @for (page of pageArray(); track page) {
                <button
                  class="page-dot"
                  [class.active]="currentPage() === page"
                  (click)="goToPage(page)"
                ></button>
              }
            </div>
            <span class="page-info">
              {{ currentPage() + 1 }} / {{ totalPages() }}
            </span>
            <button
              class="page-btn"
              [disabled]="currentPage() >= totalPages() - 1"
              (click)="nextPage()"
            >
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        }
      } @else {
        <div class="empty-state">
          <div class="empty-icon-wrapper">
            <i class="pi pi-folder-open"></i>
          </div>
          <h3>No Projects Yet</h3>
          <p>Projects will appear here as they are added.</p>
        </div>
      }

      <!-- Project Detail Modal -->
      <p-dialog
        [visible]="isModalVisible()"
        (visibleChange)="isModalVisible.set($event)"
        [modal]="true"
        [style]="{ width: '92vw', maxWidth: '900px' }"
        [styleClass]="'project-detail-modal'"
        [draggable]="false"
        [resizable]="false"
        [dismissableMask]="true"
        [closeOnEscape]="true"
      >
        <ng-template pTemplate="header">
          <div class="modal-header-content">
            <div class="modal-title-row">
              <i
                [class]="selectedProject()?.icon || 'pi pi-code'"
                class="modal-project-icon"
              ></i>
              <div>
                <h3 class="modal-title">{{ selectedProject()?.title }}</h3>
                <div class="modal-meta">
                  @if (selectedProject()?.category) {
                    <span class="modal-category">
                      {{ selectedProject()?.category }}
                      @if (selectedProject()?.subcategory) {
                        <span class="modal-subcategory-sep">/</span>
                        {{ selectedProject()?.subcategory }}
                      }
                    </span>
                  }
                  @if (selectedProject()?.version) {
                    <span class="modal-version">
                      v{{ selectedProject()?.version }}
                    </span>
                  }
                  @if (selectedProject()?.status) {
                    <span
                      class="modal-status"
                      [class.status-active]="
                        selectedProject()?.status === 'Active'
                      "
                      [class.status-completed]="
                        selectedProject()?.status === 'Completed'
                      "
                    >
                      <span class="status-dot"></span>
                      {{ selectedProject()?.status }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>
        </ng-template>

        @if (selectedProject(); as project) {
          <div class="modal-body-content">
            @if (project.image) {
              <div class="modal-hero-image">
                <img [src]="project.image" [alt]="project.title" />
              </div>
            }

            <div class="modal-section">
              <h4 class="modal-section-title">
                <i class="pi pi-info-circle"></i> About
              </h4>
              <p class="modal-description">{{ project.description }}</p>
            </div>

            @if (project.highlights && project.highlights.length > 0) {
              <div class="modal-section">
                <h4 class="modal-section-title">
                  <i class="pi pi-star"></i> Key Features
                </h4>
                <div class="modal-highlights">
                  @for (highlight of project.highlights; track highlight) {
                    <div class="modal-highlight-item">
                      <div class="highlight-icon-wrapper">
                        <i class="pi pi-check"></i>
                      </div>
                      <span>{{ highlight }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            @if (project.technologies && project.technologies.length > 0) {
              <div class="modal-section">
                <h4 class="modal-section-title">
                  <i class="pi pi-wrench"></i> Tech Stack
                </h4>
                <div class="modal-tech-grid">
                  @for (tech of project.technologies; track tech) {
                    <div class="modal-tech-item">
                      <i class="pi pi-chevron-right"></i>
                      {{ tech }}
                    </div>
                  }
                </div>
              </div>
            }

            <div class="modal-actions-bar">
              @if (project.link) {
                <a
                  class="modal-action-btn primary"
                  [href]="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="pi pi-external-link"></i>
                  View Live Demo
                </a>
              }
              @if (project.github) {
                <a
                  class="modal-action-btn secondary"
                  [href]="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="pi pi-github"></i>
                  View on GitHub
                </a>
              }
            </div>
          </div>
        }
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .projects-container {
        position: relative;
        width: 100%;
        padding: 4rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* ── Header ── */
      .section-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .header-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(118, 75, 162, 0.15);
        border: 1px solid rgba(118, 75, 162, 0.3);
        padding: 0.4rem 1rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #a78bfa;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 1rem;

        i {
          font-size: 0.7rem;
        }
      }

      .section-title {
        font-size: clamp(2rem, 4.5vw, 3rem);
        font-weight: 900;
        margin: 0 0 0.5rem;
        background: linear-gradient(135deg, #e0e0ff, #ffffff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.15;
      }

      .section-subtitle {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0 0 1.25rem;
        max-width: 460px;
        margin-inline: auto;
        line-height: 1.5;
      }

      .title-decoration {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .deco-line {
        width: 2.5rem;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(118, 75, 162, 0.6)
        );
        border-radius: 1px;

        &:last-child {
          background: linear-gradient(
            90deg,
            rgba(118, 75, 162, 0.6),
            transparent
          );
        }
      }

      .deco-diamond {
        width: 6px;
        height: 6px;
        background: #764ba2;
        transform: rotate(45deg);
        border-radius: 1px;
      }

      /* ── Category Filters ── */
      .category-filters {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 2.5rem;
      }

      .filter-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 1rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 2rem;
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        i {
          font-size: 0.7rem;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);
          border-color: rgba(255, 255, 255, 0.15);
        }

        &.active {
          background: linear-gradient(
            135deg,
            rgba(118, 75, 162, 0.25),
            rgba(102, 126, 234, 0.25)
          );
          border-color: rgba(118, 75, 162, 0.45);
          color: #e0d4ff;
        }
      }

      .filter-count {
        background: rgba(255, 255, 255, 0.08);
        padding: 0.1rem 0.4rem;
        border-radius: 1rem;
        font-size: 0.65rem;
        font-weight: 700;
        min-width: 1.1rem;
        text-align: center;
      }

      .active .filter-count {
        background: rgba(118, 75, 162, 0.35);
      }

      /* ── Grid ── */
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
      }

      /* ── Card ── */
      .project-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 1rem;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        height: 100%;

        &:hover {
          transform: translateY(-6px);
          border-color: rgba(var(--accent-rgb, 118, 75, 162), 0.35);
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(var(--accent-rgb, 118, 75, 162), 0.06);

          .view-details {
            color: #a78bfa;

            i {
              transform: translateX(3px);
            }
          }

          .project-image {
            transform: scale(1.06);
          }

          .placeholder-icon {
            color: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
          }
        }
      }

      .card-visual {
        position: relative;
        width: 100%;
        height: 130px;
        overflow: hidden;
      }

      .project-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .project-image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .placeholder-icon {
        font-size: 2.5rem;
        color: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      .card-badges {
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        z-index: 2;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.2rem 0.6rem;
        border-radius: 2rem;
        font-size: 0.6rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        backdrop-filter: blur(12px);
      }

      .badge-featured {
        background: rgba(250, 204, 21, 0.2);
        border: 1px solid rgba(250, 204, 21, 0.4);
        color: #fcd34d;

        i {
          font-size: 0.5rem;
        }
      }

      .badge-active {
        background: rgba(52, 211, 153, 0.15);
        border: 1px solid rgba(52, 211, 153, 0.3);
        color: #6ee7b7;
      }

      .badge-completed {
        background: rgba(96, 165, 250, 0.15);
        border: 1px solid rgba(96, 165, 250, 0.3);
        color: #93c5fd;
      }

      .badge-dev {
        background: rgba(251, 146, 60, 0.15);
        border: 1px solid rgba(251, 146, 60, 0.3);
        color: #fdba74;
      }

      .status-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: currentColor;
        animation: pulse-dot 2s ease-in-out infinite;
      }

      @keyframes pulse-dot {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
      }

      /* ── Card Body ── */
      .card-body {
        padding: 1rem 1.15rem 1.15rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .category-tag {
        font-size: 0.65rem;
        font-weight: 600;
        color: #a78bfa;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .version-tag {
        font-size: 0.6rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.05);
        padding: 0.1rem 0.45rem;
        border-radius: 0.25rem;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
      }

      .project-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #f1f5f9;
        margin: 0 0 0.4rem;
        line-height: 1.3;
      }

      .project-description {
        color: rgba(255, 255, 255, 0.45);
        line-height: 1.55;
        font-size: 0.78rem;
        margin: 0 0 0.75rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 0.85rem;
        margin-top: auto;
      }

      .tech-pill {
        font-size: 0.65rem;
        font-weight: 500;
        padding: 0.2rem 0.55rem;
        border-radius: 0.25rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.55);
      }

      .tech-more {
        color: rgba(255, 255, 255, 0.35);
        font-weight: 700;
      }

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .card-links {
        display: flex;
        gap: 0.5rem;
      }

      .card-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 0.375rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.45);
        text-decoration: none;
        transition: all 0.2s ease;
        font-size: 0.8rem;

        &:hover {
          background: rgba(118, 75, 162, 0.15);
          border-color: rgba(118, 75, 162, 0.3);
          color: #a78bfa;
        }
      }

      .view-details {
        font-size: 0.72rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.35);
        display: flex;
        align-items: center;
        gap: 0.3rem;
        transition: color 0.2s ease;

        i {
          font-size: 0.6rem;
          transition: transform 0.2s ease;
        }
      }

      /* ── Pagination ── */
      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-top: 2.5rem;
      }

      .page-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.8rem;

        &:hover:not(:disabled) {
          background: rgba(118, 75, 162, 0.15);
          border-color: rgba(118, 75, 162, 0.3);
          color: #a78bfa;
        }

        &:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
      }

      .page-dots {
        display: flex;
        gap: 0.4rem;
      }

      .page-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.15);
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        &.active {
          background: #a78bfa;
          box-shadow: 0 0 8px rgba(167, 139, 250, 0.4);
          width: 20px;
          border-radius: 4px;
        }
      }

      .page-info {
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.35);
        font-weight: 500;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
      }

      /* ── Empty State ── */
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .empty-icon-wrapper {
        width: 4rem;
        height: 4rem;
        margin: 0 auto 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);

        i {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.2);
        }
      }

      .empty-state h3 {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0 0 0.35rem;
      }

      .empty-state p {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.3);
        margin: 0;
      }

      /* ── Modal ── */
      ::ng-deep .project-detail-modal {
        .p-dialog {
          border-radius: 1rem !important;
          overflow: hidden !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5) !important;
        }

        .p-dialog-header {
          background: rgba(15, 15, 30, 0.95) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          padding: 1.25rem 1.75rem !important;
        }

        .p-dialog-content {
          background: rgba(15, 15, 30, 0.95) !important;
          padding: 0 !important;
        }

        .p-dialog-header-close {
          color: rgba(255, 255, 255, 0.5) !important;

          &:hover {
            color: white !important;
            background: rgba(255, 255, 255, 0.1) !important;
          }
        }
      }

      .modal-header-content {
        width: 100%;
      }

      .modal-title-row {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
      }

      .modal-project-icon {
        font-size: 1.25rem;
        color: #a78bfa;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(118, 75, 162, 0.15);
        border-radius: 0.6rem;
        flex-shrink: 0;
        margin-top: 0.1rem;
      }

      .modal-title {
        font-size: 1.35rem;
        font-weight: 700;
        color: #f1f5f9;
        margin: 0 0 0.4rem;
        line-height: 1.3;
      }

      .modal-meta {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        flex-wrap: wrap;
      }

      .modal-category {
        font-size: 0.7rem;
        font-weight: 600;
        color: #a78bfa;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .modal-subcategory-sep {
        color: rgba(255, 255, 255, 0.2);
        margin: 0 0.1rem;
      }

      .modal-version {
        font-size: 0.65rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.05);
        padding: 0.15rem 0.5rem;
        border-radius: 0.25rem;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
      }

      .modal-status {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.65rem;
        font-weight: 600;
        padding: 0.15rem 0.5rem;
        border-radius: 2rem;
      }

      .modal-status.status-active {
        color: #6ee7b7;
        background: rgba(52, 211, 153, 0.1);
      }

      .modal-status.status-completed {
        color: #93c5fd;
        background: rgba(96, 165, 250, 0.1);
      }

      .modal-body-content {
        padding: 1.75rem;
      }

      .modal-hero-image {
        width: 100%;
        height: 240px;
        overflow: hidden;
        border-radius: 0.75rem;
        margin-bottom: 1.75rem;
        border: 1px solid rgba(255, 255, 255, 0.06);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .modal-section {
        margin-bottom: 1.75rem;
      }

      .modal-section-title {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.9rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.8);
        margin: 0 0 0.85rem;
        padding-bottom: 0.6rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);

        i {
          font-size: 0.8rem;
          color: #a78bfa;
        }
      }

      .modal-description {
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.75;
        font-size: 0.88rem;
        margin: 0;
      }

      .modal-highlights {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
      }

      .modal-highlight-item {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        line-height: 1.55;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.65);
      }

      .highlight-icon-wrapper {
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(52, 211, 153, 0.12);
        flex-shrink: 0;
        margin-top: 0.15rem;

        i {
          font-size: 0.5rem;
          color: #34d399;
        }
      }

      .modal-tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.5rem;
      }

      .modal-tech-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.65);
        padding: 0.5rem 0.75rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 0.4rem;
        transition: all 0.2s ease;

        i {
          font-size: 0.55rem;
          color: #a78bfa;
        }

        &:hover {
          background: rgba(118, 75, 162, 0.08);
          border-color: rgba(118, 75, 162, 0.2);
        }
      }

      .modal-actions-bar {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        padding-top: 1.25rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }

      .modal-action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.6rem 1.25rem;
        border-radius: 0.6rem;
        font-size: 0.85rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;

        i {
          font-size: 0.8rem;
        }
      }

      .modal-action-btn.primary {
        background: linear-gradient(135deg, #764ba2, #667eea);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(118, 75, 162, 0.3);
        }
      }

      .modal-action-btn.secondary {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.75);

        &:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
        }
      }

      /* ── Responsive ── */
      @media (max-width: 1199.98px) {
        .projects-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
      }

      @media (max-width: 991.98px) {
        .projects-container {
          padding: 3rem 1.25rem;
        }

        .projects-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .card-visual {
          height: 120px;
        }
      }

      @media (max-width: 767.98px) {
        .projects-container {
          padding: 2.5rem 1rem;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .projects-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }

        .card-visual {
          height: 100px;
        }

        .card-body {
          padding: 0.85rem;
        }

        .project-title {
          font-size: 0.92rem;
        }

        .project-description {
          font-size: 0.72rem;
          -webkit-line-clamp: 2;
        }

        .tech-stack {
          gap: 0.25rem;
        }

        .tech-pill {
          font-size: 0.58rem;
          padding: 0.15rem 0.4rem;
        }

        .modal-body-content {
          padding: 1.25rem;
        }

        .modal-tech-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }

        .modal-actions-bar {
          flex-direction: column;
        }

        .modal-action-btn {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 575.98px) {
        .projects-container {
          padding: 2rem 0.75rem;
        }

        .projects-grid {
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .card-visual {
          height: 90px;
        }

        .card-body {
          padding: 0.75rem;
        }

        .project-title {
          font-size: 0.85rem;
        }

        .project-description {
          display: none;
        }

        .card-footer {
          padding-top: 0.5rem;
        }

        .card-link {
          width: 1.5rem;
          height: 1.5rem;
          font-size: 0.7rem;
        }

        .modal-title {
          font-size: 1.15rem;
        }

        .modal-hero-image {
          height: 180px;
        }
      }

      @media (max-width: 991.98px) and (orientation: landscape) {
        .projects-container {
          padding: 2rem 1rem;
        }

        .card-visual {
          height: clamp(80px, 20vh, 120px);
        }
      }
    `,
  ],
})
export class ProjectsComponent implements OnInit {
  readonly PAGE_SIZE = 6;

  projects = computed(() => this.contentService.projectsData());

  categories = computed(() => {
    const cats = new Set(
      this.projects()
        .map((p) => p.category)
        .filter(Boolean),
    );
    return [...cats] as string[];
  });

  activeCategory = signal('All');
  currentPage = signal(0);

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'All') return this.projects();
    return this.projects().filter((p) => p.category === cat);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredProjects().length / this.PAGE_SIZE),
  );

  pageArray = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

  paginatedProjects = computed(() => {
    const start = this.currentPage() * this.PAGE_SIZE;
    return this.filteredProjects().slice(start, start + this.PAGE_SIZE);
  });

  isModalVisible = signal(false);
  selectedProject = signal<Project | null>(null);

  constructor(public contentService: ContentService) {}

  ngOnInit(): void {
    if (this.contentService.projectsData().length === 0) {
      this.contentService.loadProjectsData();
    }
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
    this.currentPage.set(0);
  }

  getCategoryCount(cat: string): number {
    return this.projects().filter((p) => p.category === cat).length;
  }

  getCategoryIcon(category: string): string {
    const map: Record<string, string> = {
      'AI & Machine Learning': 'pi pi-sparkles',
      'Web Development': 'pi pi-globe',
      'Mobile Development': 'pi pi-mobile',
      DevOps: 'pi pi-server',
      'Data Engineering': 'pi pi-database',
      Automation: 'pi pi-cog',
    };
    return map[category] || 'pi pi-code';
  }

  openProjectModal(project: Project): void {
    this.selectedProject.set(project);
    this.isModalVisible.set(true);
  }

  prevPage(): void {
    this.currentPage.update((p) => Math.max(0, p - 1));
  }

  nextPage(): void {
    this.currentPage.update((p) => Math.min(this.totalPages() - 1, p + 1));
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
  }

  private accentColors = [
    { hex: '#a78bfa', rgb: '167,139,250' },
    { hex: '#60a5fa', rgb: '96,165,250' },
    { hex: '#f472b6', rgb: '244,114,182' },
    { hex: '#34d399', rgb: '52,211,153' },
    { hex: '#fbbf24', rgb: '251,191,36' },
    { hex: '#fb923c', rgb: '251,146,60' },
  ];

  getProjectColor(index: number): string {
    return this.accentColors[index % this.accentColors.length].hex;
  }

  getProjectColorRGB(index: number): string {
    return this.accentColors[index % this.accentColors.length].rgb;
  }

  getProjectGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #1e1b4b, #312e81)',
      'linear-gradient(135deg, #172554, #1e3a5f)',
      'linear-gradient(135deg, #4a1942, #831843)',
      'linear-gradient(135deg, #064e3b, #065f46)',
      'linear-gradient(135deg, #451a03, #78350f)',
      'linear-gradient(135deg, #7c2d12, #9a3412)',
    ];
    return gradients[index % gradients.length];
  }
}
