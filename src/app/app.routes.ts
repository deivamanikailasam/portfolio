import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SkillDetailsComponent } from './features/skills/skill-details/skill-details.component';
import { SkillDetailsEditComponent } from './features/skills/skill-details-edit/skill-details-edit.component';
import { ExperienceDetailsEditComponent } from './features/skills/experience-details-edit/experience-details-edit.component';
import { environment } from '../environments/environment';

// Public routes (available in all environments)
const publicRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'skills/:category/:division/:key',
    component: SkillDetailsComponent
  }
];

// Admin/Edit routes (only for development)
const devOnlyRoutes: Routes = [
  {
    path: 'skill-details-edit',
    component: SkillDetailsEditComponent
  },
  {
    path: 'experience-details-edit',
    component: ExperienceDetailsEditComponent
  }
];

// Navigation routes (available in all environments)
const navigationRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home',
  }
];

// Combine routes based on environment
export const routes: Routes = [
  ...publicRoutes,
  ...(environment.production ? [] : devOnlyRoutes),
  ...navigationRoutes
];