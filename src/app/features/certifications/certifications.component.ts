import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../core/services/content.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';

interface Certification {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: string;
  certificateUrl?: string;
  certificateImage?: string;
  issuer?: string;
  credentialId?: string;
}

@Component({
  selector: 'app-certifications',
  imports: [CommonModule, CardModule, TagModule, ButtonModule, RippleModule, DialogModule, ImageModule],
  template: `
    <div class="certifications-container">
      <div class="section-header">
        <div class="header-badge">
          <i class="pi pi-verified"></i>
          <span>Professional Credentials</span>
        </div>
        <h2 class="section-title">
          <span class="title-text">Certifications & Achievements</span>
          <div class="title-underline"></div>
        </h2>
        <p class="section-subtitle">Validated expertise and continuous learning journey</p>
      </div>
      
      @if (certifications().length > 0) {
        <div class="certifications-grid">
          @for (cert of certifications(); track cert.id; let i = $index) {
            <div class="certification-card-wrapper">
              <div class="card-glow" [style.background]="getCertGradient(i)"></div>
              <p-card class="certification-card" [style.--cert-color]="getCertColor(i)">
                <ng-template pTemplate="header">
                  <div class="card-header-gradient" [style.background]="getCertGradient(i)">
                    <div class="header-pattern"></div>
                    <div class="header-content">
                      <div class="cert-icon-wrapper">
                        <i [class]="cert.icon || 'pi pi-certificate'"></i>
                        <div class="icon-glow"></div>
                      </div>
                      <div class="cert-header-text">
                        <h3 class="cert-title">{{ cert.title }}</h3>
                        @if (cert.issuer) {
                          <p class="cert-issuer">
                            <i class="pi pi-building"></i>
                            {{ cert.issuer }}
                          </p>
                        }
                      </div>
                    </div>
                    <div class="verified-badge">
                      <i class="pi pi-check-circle"></i>
                    </div>
                  </div>
                </ng-template>
                <div class="card-body">
                  @if (cert.description) {
                    <p class="cert-description">{{ cert.description }}</p>
                  }
                  
                  <div class="cert-meta">
                    <div class="meta-row">
                      @if (cert.date) {
                        <div class="cert-date">
                          <i class="pi pi-calendar"></i>
                          <span>{{ formatDate(cert.date) }}</span>
                        </div>
                      }
                      @if (cert.credentialId) {
                        <div class="cert-id">
                          <i class="pi pi-id-card"></i>
                          <span>{{ cert.credentialId }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <div class="cert-actions">
                    @if (cert.certificateImage || cert.certificateUrl) {
                      <button 
                        pButton 
                        pRipple
                        class="view-certificate-btn"
                        [style.--btn-gradient]="getCertGradient(i)"
                        (click)="viewCertificate(cert)">
                        <i class="pi pi-eye"></i>
                        <span>View Certificate</span>
                        <div class="btn-shine"></div>
                      </button>
                    } @else {
                      <button 
                        pButton 
                        pRipple
                        class="view-certificate-btn disabled"
                        disabled>
                        <i class="pi pi-lock"></i>
                        <span>Certificate Pending</span>
                      </button>
                    }
                  </div>
                </div>
              </p-card>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <div class="empty-icon">
            <i class="pi pi-certificate"></i>
          </div>
          <h3>No Certifications Yet</h3>
          <p>Your professional certifications will appear here</p>
        </div>
      }
    </div>

    <!-- Certificate Viewer Dialog -->
    <p-dialog 
      [(visible)]="showCertificateDialog"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="certificate-dialog"
      [header]="selectedCertificate()?.title || 'Certificate'"
      [style]="{ width: '90vw', maxWidth: '1200px' }"
      (onShow)="onDialogShow()">
      
      <div class="certificate-viewer">
        @if (selectedCertificate()?.certificateImage) {
          <div class="certificate-image-wrapper">
            <img 
              [src]="selectedCertificate()!.certificateImage" 
              [alt]="selectedCertificate()!.title"
              class="certificate-image"
            />
          </div>
          <div class="certificate-actions-dialog">
            @if (selectedCertificate()?.certificateUrl) {
              <button 
                pButton 
                pRipple
                class="verify-btn"
                (click)="openExternalCertificate(selectedCertificate()!.certificateUrl!)">
                <i class="pi pi-external-link"></i>
                <span>Verify Online</span>
              </button>
            }
          </div>
        } @else if (selectedCertificate()?.certificateUrl) {
          <div class="certificate-url-message">
            <i class="pi pi-external-link"></i>
            <p>This certificate is available online</p>
            <button 
              pButton 
              pRipple
              class="open-url-btn"
              (click)="openExternalCertificate(selectedCertificate()!.certificateUrl!)">
              <i class="pi pi-arrow-right"></i>
              <span>Open Certificate</span>
            </button>
          </div>
        }
      </div>
    </p-dialog>
  `,
  styles: [`
    .certifications-container {
      position: relative;
      width: 100%;
      padding: 4rem 2rem;
      min-height: 100vh;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 5rem;
      animation: fadeInDown 0.8s ease-out;
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.5rem;
      background: linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(79, 172, 254, 0.1));
      border: 1px solid rgba(0, 242, 254, 0.3);
      border-radius: 2rem;
      color: #00f2fe;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
      
      i {
        font-size: 1rem;
        animation: pulse 2s ease-in-out infinite;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.1);
      }
    }
    
    .section-title {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .title-text {
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #00f2fe 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    
    @keyframes shimmer {
      to {
        background-position: 200% center;
      }
    }
    
    .title-underline {
      width: 120px;
      height: 4px;
      background: linear-gradient(90deg, transparent, #00f2fe, transparent);
      border-radius: 2px;
    }
    
    .section-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
      font-weight: 400;
    }
    
    .certifications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .certification-card-wrapper {
      position: relative;
      animation: fadeInUp 0.6s ease-out backwards;
      
      &:nth-child(1) { animation-delay: 0.1s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.3s; }
      &:nth-child(4) { animation-delay: 0.4s; }
      &:nth-child(5) { animation-delay: 0.5s; }
      &:nth-child(6) { animation-delay: 0.6s; }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .card-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 1.5rem;
      opacity: 0;
      filter: blur(20px);
      transition: opacity 0.4s ease;
      z-index: 0;
      pointer-events: none;
    }
    
    .certification-card-wrapper:hover .card-glow {
      opacity: 0.25;
    }
    
    .certification-card {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.03) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 1.5rem !important;
      overflow: hidden !important;
      backdrop-filter: blur(20px) !important;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      
      &:hover {
        transform: translateY(-12px) !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
      }
    }
    
    .card-header-gradient {
      padding: 2rem;
      position: relative;
      overflow: hidden;
      min-height: 140px;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: inherit;
        opacity: 0.9;
        filter: blur(30px);
      }
    }
    
    .header-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
      opacity: 0.4;
    }
    
    .header-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .cert-icon-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2.25rem;
      flex-shrink: 0;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      
      i {
        position: relative;
        z-index: 1;
        animation: iconFloat 3s ease-in-out infinite;
      }
    }
    
    @keyframes iconFloat {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-5px) rotate(5deg);
      }
    }
    
    .icon-glow {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent 70%);
      animation: glowPulse 2s ease-in-out infinite;
    }
    
    @keyframes glowPulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.1);
      }
    }
    
    .cert-header-text {
      flex: 1;
      min-width: 0;
    }
    
    .cert-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
      line-height: 1.3;
    }
    
    .cert-issuer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.85);
      margin: 0;
      font-weight: 500;
      
      i {
        font-size: 0.875rem;
      }
    }
    
    .verified-badge {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(67, 233, 123, 0.2);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      border: 2px solid rgba(67, 233, 123, 0.5);
      
      i {
        color: #43e97b;
        font-size: 1.25rem;
        animation: verifiedPulse 2s ease-in-out infinite;
      }
    }
    
    @keyframes verifiedPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.15);
      }
    }
    
    .card-body {
      padding: 2rem;
    }
    
    .cert-description {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.8;
      margin-bottom: 1.5rem;
      font-size: 1rem;
      font-weight: 400;
    }
    
    .cert-meta {
      margin-bottom: 1.5rem;
    }
    
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .cert-date,
    .cert-id {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      font-weight: 500;
      
      i {
        color: var(--cert-color, #00f2fe);
        font-size: 1.1rem;
      }
    }
    
    .cert-actions {
      margin-top: 1.5rem;
    }
    
    .view-certificate-btn {
      width: 100%;
      padding: 1rem 1.5rem !important;
      background: var(--btn-gradient) !important;
      border: none !important;
      border-radius: 0.75rem !important;
      color: white !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      cursor: pointer !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
      
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.75rem !important;
      
      i {
        font-size: 1.125rem;
        transition: transform 0.3s ease;
      }
      
      &:hover:not(.disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
        filter: brightness(1.1);
        
        i {
          transform: translateX(3px);
        }
      }
      
      &:active:not(.disabled) {
        transform: translateY(0) !important;
      }
      
      &.disabled {
        background: rgba(255, 255, 255, 0.05) !important;
        color: rgba(255, 255, 255, 0.4) !important;
        cursor: not-allowed !important;
      }
    }
    
    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    .view-certificate-btn:hover:not(.disabled) .btn-shine {
      left: 100%;
    }
    
    .empty-state {
      text-align: center;
      padding: 6rem 2rem;
      color: rgba(255, 255, 255, 0.6);
      
      .empty-icon {
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(79, 172, 254, 0.1));
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(0, 242, 254, 0.2);
        
        i {
          font-size: 3.5rem;
          color: rgba(0, 242, 254, 0.5);
        }
      }
      
      h3 {
        font-size: 1.75rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      p {
        font-size: 1.125rem;
        margin: 0;
        color: rgba(255, 255, 255, 0.5);
      }
    }

    // Certificate Dialog Styles
    :host ::ng-deep .certificate-dialog {
      .p-dialog {
        background: rgba(20, 20, 30, 0.98) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        border-radius: 1rem !important;
        backdrop-filter: blur(20px) !important;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7) !important;
        position: relative !important;
        top: 0 !important;
        margin-top: 2rem !important;
      }
      
      .p-dialog-mask {
        align-items: flex-start !important;
      }

      .p-dialog-header {
        background: linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(79, 172, 254, 0.1)) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        padding: 1.5rem 2rem !important;
        border-radius: 1rem 1rem 0 0 !important;

        .p-dialog-title {
          color: white !important;
          font-size: 1.5rem !important;
          font-weight: 700 !important;
        }

        .p-dialog-header-icon {
          color: rgba(255, 255, 255, 0.8) !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;

          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: white !important;
          }
        }
      }

      .p-dialog-content {
        background: transparent !important;
        padding: 2rem !important;
        color: white !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        max-height: 75vh !important;
        scroll-behavior: smooth !important;
      }
    }

    .certificate-viewer {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-height: 400px;
      position: relative;
      
      // Ensure no auto-scroll behavior
      & > * {
        scroll-margin-top: 0;
      }
    }

    .certificate-image-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 0.75rem;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      
      img.certificate-image {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
        cursor: zoom-in;
        display: block;
        
        &:hover {
          transform: scale(1.02);
        }
      }
    }

    .certificate-actions-dialog {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .verify-btn,
    .open-url-btn {
      padding: 0.875rem 2rem !important;
      background: linear-gradient(135deg, #00f2fe, #4facfe) !important;
      border: none !important;
      border-radius: 0.5rem !important;
      color: white !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      
      i {
        font-size: 1.125rem;
      }
      
      &:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 20px rgba(0, 242, 254, 0.3) !important;
        filter: brightness(1.1);
      }
      
      &:active {
        transform: translateY(0) !important;
      }
    }

    .certificate-url-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 3rem;
      text-align: center;
      
      i {
        font-size: 4rem;
        color: #00f2fe;
        opacity: 0.7;
      }
      
      p {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
      }
    }
    
    // Responsive Design
    @media (max-width: 1199.98px) {
      .certifications-container {
        padding: 3rem 1.5rem;
      }
      
      .certifications-grid {
        gap: 2.5rem;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      }
    }
    
    @media (max-width: 991.98px) {
      .section-header {
        margin-bottom: 4rem;
      }
      
      .section-title {
        font-size: clamp(2.25rem, 5vw, 3.5rem);
      }
      
      .title-text {
        text-align: center;
      }
      
      .section-subtitle {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
      }
      
      .certifications-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
      }
      
      .card-header-gradient {
        padding: 1.75rem;
        min-height: 120px;
      }
      
      .cert-icon-wrapper {
        width: clamp(65px, 10vw, 75px);
        height: clamp(65px, 10vw, 75px);
        font-size: clamp(1.85rem, 4vw, 2.1rem);
      }
      
      .cert-title {
        font-size: clamp(1.35rem, 3vw, 1.6rem);
      }
    }
    
    @media (max-width: 767.98px) {
      .certifications-container {
        padding: 2.5rem 1rem;
      }
      
      .section-header {
        margin-bottom: 3rem;
      }
      
      .header-badge {
        font-size: 0.75rem;
        padding: 0.4rem 1.25rem;
      }
      
      .section-title {
        font-size: clamp(1.85rem, 6vw, 2.5rem);
      }
      
      .title-underline {
        width: 80px;
        height: 3px;
      }
      
      .certifications-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .card-header-gradient {
        padding: 1.5rem;
        min-height: 110px;
      }
      
      .card-body {
        padding: 1.75rem;
      }
      
      .cert-icon-wrapper {
        width: clamp(55px, 12vw, 65px);
        height: clamp(55px, 12vw, 65px);
        font-size: clamp(1.6rem, 4.5vw, 1.85rem);
      }
      
      .cert-title {
        font-size: clamp(1.2rem, 3.5vw, 1.45rem);
      }
      
      .cert-issuer {
        font-size: 0.875rem;
      }
      
      .cert-description {
        font-size: clamp(0.925rem, 2.8vw, 1rem);
        line-height: 1.7;
      }
      
      .cert-date,
      .cert-id {
        font-size: clamp(0.8rem, 2.5vw, 0.875rem);
      }
      
      .verified-badge {
        width: 35px;
        height: 35px;
        
        i {
          font-size: 1.1rem;
        }
      }
      
      .view-certificate-btn {
        padding: 0.9rem 1.25rem !important;
        font-size: 0.925rem !important;
      }
    }
    
    @media (max-width: 575.98px) {
      .certifications-container {
        padding: 2rem 0.875rem;
      }
      
      .section-header {
        margin-bottom: 2.5rem;
      }
      
      .header-badge {
        font-size: 0.7rem;
        padding: 0.35rem 1rem;
      }
      
      .section-title {
        font-size: clamp(1.6rem, 7vw, 2rem);
      }
      
      .title-underline {
        width: 60px;
      }
      
      .certifications-grid {
        gap: 1.75rem;
      }
      
      .card-header-gradient {
        padding: 1.25rem;
        min-height: 100px;
      }
      
      .card-body {
        padding: 1.5rem;
      }
      
      .header-content {
        gap: 1rem;
      }
      
      .cert-icon-wrapper {
        width: clamp(50px, 14vw, 60px);
        height: clamp(50px, 14vw, 60px);
        font-size: clamp(1.4rem, 5vw, 1.65rem);
      }
      
      .cert-title {
        font-size: clamp(1.05rem, 4vw, 1.3rem);
      }
      
      .cert-issuer {
        font-size: 0.8rem;
      }
      
      .cert-description {
        font-size: clamp(0.875rem, 3vw, 0.925rem);
      }
      
      .meta-row {
        padding: 0.875rem;
        gap: 1rem;
        flex-direction: column;
        align-items: flex-start;
      }
      
      .verified-badge {
        width: 32px;
        height: 32px;
        top: 1rem;
        right: 1rem;
        
        i {
          font-size: 1rem;
        }
      }
      
      .view-certificate-btn {
        padding: 0.85rem 1rem !important;
        font-size: 0.875rem !important;
      }
    }
    
    // Landscape orientation
    @media (max-width: 991.98px) and (orientation: landscape) {
      .certifications-container {
        padding: 2rem 1rem;
      }
      
      .section-header {
        margin-bottom: 2.5rem;
      }
      
      .card-header-gradient {
        min-height: 100px;
      }
    }

    // Certificate Dialog Responsive
    @media (max-width: 767.98px) {
      :host ::ng-deep .certificate-dialog {
        .p-dialog {
          width: 95vw !important;
          max-width: 95vw !important;
        }

        .p-dialog-header {
          padding: 1.25rem 1.5rem !important;

          .p-dialog-title {
            font-size: 1.25rem !important;
          }
        }

        .p-dialog-content {
          padding: 1.5rem !important;
        }
      }

      .certificate-image-wrapper {
        padding: 0.5rem;
        
        img.certificate-image {
          cursor: default;
          
          &:hover {
            transform: none;
          }
        }
      }

      .certificate-actions-dialog {
        flex-direction: column;
      }

      .verify-btn,
      .open-url-btn {
        width: 100%;
        justify-content: center !important;
      }

      .certificate-url-message {
        padding: 2rem 1rem;
        
        i {
          font-size: 3rem;
        }
        
        p {
          font-size: 1.1rem;
        }
      }
    }

    @media (max-width: 575.98px) {
      :host ::ng-deep .certificate-dialog {
        .p-dialog-header {
          padding: 1rem 1.25rem !important;

          .p-dialog-title {
            font-size: 1.1rem !important;
            line-height: 1.3;
          }
        }

        .p-dialog-content {
          padding: 1rem !important;
        }
      }

      .certificate-viewer {
        gap: 1rem;
        min-height: 300px;
      }

      .verify-btn,
      .open-url-btn {
        padding: 0.75rem 1.5rem !important;
        font-size: 0.925rem !important;
      }
    }
  `]
})
export class CertificationsComponent implements OnInit {
  certifications = computed(() => {
    const certificatesData = this.contentService.certificates();
    return (certificatesData?.certificates || []) as Certification[];
  });

  showCertificateDialog = false;
  selectedCertificate = signal<Certification | null>(null);

  constructor(public contentService: ContentService) {}

  ngOnInit(): void {
    // Load certificates from the separate JSON file
    if (!this.contentService.certificates()) {
      this.contentService.loadCertificates();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric' 
    });
  }

  viewCertificate(cert: Certification): void {
    this.selectedCertificate.set(cert);
    this.showCertificateDialog = true;
  }

  onDialogShow(): void {
    // Scroll dialog content to top when opened
    setTimeout(() => {
      const dialogContent = document.querySelector('.certificate-dialog .p-dialog-content');
      if (dialogContent) {
        dialogContent.scrollTop = 0;
      }
    }, 0);
  }

  openExternalCertificate(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  getCertColor(index: number): string {
    const colors = [
      '#00f2fe', // Cyan
      '#4facfe', // Blue
      '#667eea', // Purple
      '#f093fb', // Pink
      '#43e97b', // Green
      '#fa709a', // Rose
      '#feca57', // Yellow
      '#48dbfb'  // Sky
    ];
    return colors[index % colors.length];
  }

  getCertGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
      'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)'
    ];
    return gradients[index % gradients.length];
  }
}
