import { Injectable } from '@angular/core';
import { PortfolioContent } from '../models/content-schema';

@Injectable({
  providedIn: 'root'
})
export class SchemaValidatorService {
  private requiredFields = {
    profile: ['name', 'title', 'bio', 'email'],
    contact: ['email']
  };

  validateContent(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required sections
    if (!data.version) errors.push('Missing version field');
    if (!data.profile) errors.push('Missing profile section');
    if (!data.contact) errors.push('Missing contact section');

    // Validate profile
    if (data.profile) {
      const missing = this.requiredFields.profile.filter(
        field => !data.profile[field]
      );
      if (missing.length > 0) {
        errors.push(`Profile missing fields: ${missing.join(', ')}`);
      }
    }

    // Validate semantic version
    if (data.version && !this.isValidSemVer(data.version)) {
      errors.push(`Invalid version format. Expected MAJOR.MINOR.PATCH`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private isValidSemVer(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
  }
}
