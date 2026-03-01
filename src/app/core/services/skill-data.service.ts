import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillDataService {
  private readonly skillDetailsPath = 'src/assets/data/skill-details.json';
  private readonly experienceDetailsPath = 'src/assets/data/experience-details.json';

  /**
   * Save skill details to file system
   * @param skillDetails The skill details object to save
   */
  async saveSkillDetails(skillDetails: any): Promise<void> {
    // Save to file system
    await this.saveToFileSystem(skillDetails, this.skillDetailsPath);
  }

  /**
   * Save experience details to file system
   * @param experienceDetails The experience details object to save
   */
  async saveExperienceDetails(experienceDetails: any): Promise<void> {
    // Save to file system
    await this.saveToFileSystem(experienceDetails, this.experienceDetailsPath);
  }

  /**
   * Save to file system using the File System Access API
   */
  private async saveToFileSystem(data: any, filePath: string): Promise<void> {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      
      // Call the file server running on port 3001
      const fileServerUrl = 'http://localhost:3001/api/save-file';
      
      console.log(`📤 Sending save request to: ${fileServerUrl}`);
      
      const response = await fetch(fileServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: filePath,
          content: jsonString
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save file: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ File saved successfully: ${filePath}`);
      console.log(`📁 Saved to: ${result.path}`);
    } catch (error) {
      console.error('❌ Error saving to file system:', error);
      console.log('💡 Make sure the file server is running on port 3001');
      console.log('💡 Start it with: npm run file-server');
      throw error;
    }
  }

}

