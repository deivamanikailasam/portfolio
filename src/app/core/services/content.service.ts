import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Experience, Project, Achievement } from '../models/content-schema';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  profileData = signal<any>(null);
  experienceData = signal<Experience[]>([]);
  educationData = signal<Experience[]>([]);
  skillsData = signal<any[]>([]);
  skillDetails = signal<any>(null);
  projectsData = signal<Project[]>([]);
  experienceDetails = signal<any>(null);
  certificates = signal<any>(null);
  achievementsData = signal<Achievement[]>([]);

  constructor(private http: HttpClient) {}

  loadProfileData(): void {
    this.http.get<any>('assets/data/profile.json').subscribe({
      next: (data) => {
        this.profileData.set(data);
      },
      error: (err) => {
        console.error('Profile data loading error:', err);
      }
    });
  }

  loadSkillsData(): void {
    this.http.get<any[]>('assets/data/skills.json').subscribe({
      next: (data) => {
        this.skillsData.set(data);
      },
      error: (err) => {
        console.error('Skills data loading error:', err);
      }
    });
  }

  loadSkillDetails(): void {
    this.http.get<any>('assets/data/skill-details.json').subscribe({
      next: (data) => {
        this.skillDetails.set(data);
      },
      error: (err) => {
        console.error('Skill details loading error:', err);
      }
    });
  }

  loadProjectsData(): void {
    this.http.get<Project[]>('assets/data/projects.json').subscribe({
      next: (data) => {
        this.projectsData.set(data);
      },
      error: (err) => {
        console.error('Projects data loading error:', err);
      }
    });
  }

  loadExperienceDetails(): void {
    this.http.get<any>('assets/data/experience-details.json').subscribe({
      next: (data) => {
        this.experienceDetails.set(data);
      },
      error: (err) => {
        console.error('Experience details loading error:', err);
      }
    });
  }

  loadExperienceData(): void {
    this.http.get<Experience[]>('assets/data/experience.json').subscribe({
      next: (data) => {
        this.experienceData.set(data);
      },
      error: (err) => {
        console.error('Experience data loading error:', err);
      }
    });
  }

  loadEducationData(): void {
    this.http.get<Experience[]>('assets/data/education.json').subscribe({
      next: (data) => {
        this.educationData.set(data);
      },
      error: (err) => {
        console.error('Education data loading error:', err);
      }
    });
  }

  loadAchievementsData(): void {
    this.http.get<Achievement[]>('assets/data/achievements.json').subscribe({
      next: (data) => {
        this.achievementsData.set(data);
      },
      error: (err) => {
        console.error('Achievements data loading error:', err);
      }
    });
  }

  loadCertificates(): void {
    this.http.get<any>('assets/data/certificates.json').subscribe({
      next: (data) => {
        this.certificates.set(data);
      },
      error: (err) => {
        console.error('Certificates loading error:', err);
      }
    });
  }
}
