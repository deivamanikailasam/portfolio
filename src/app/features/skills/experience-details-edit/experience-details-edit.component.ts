import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ContentService } from "../../../core/services/content.service";
import { FormsModule } from "@angular/forms";
import { Select } from "primeng/select";
import { Editor } from "primeng/editor";
import { ConfirmDialog } from "primeng/confirmdialog";
import { Toast } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";
import { SkillDataService } from "../../../core/services/skill-data.service";

interface Technology {
    label: string;
    value: string;
}

export interface ExperienceDetail {
    text: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

@Component({
    selector: 'app-experience-details-edit',
    standalone: true,
    templateUrl: './experience-details-edit.component.html',
    styleUrls: ['./experience-details-edit.component.scss'],
    imports: [
        CommonModule, 
        FormsModule, 
        Select, 
        Editor,
        ConfirmDialog,
        Toast
    ],
    providers: [ConfirmationService, MessageService]
})
export class ExperienceDetailsEditComponent implements OnInit {
    protected readonly contentService = inject(ContentService);
    protected readonly skillDataService = inject(SkillDataService);
    protected readonly router = inject(Router);
    protected readonly confirmationService = inject(ConfirmationService);
    protected readonly messageService = inject(MessageService);

    technologies = signal<Technology[]>([]);
    selectedTechnology = signal<string>('');
    experiences = signal<ExperienceDetail[]>([]);
    editingIndex = signal<number>(-1);
    editingExperience = signal<string>('');
    editingLevel = signal<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
    newExperience = signal<string>('');
    newLevel = signal<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
    isLoading = signal<boolean>(false);
    isSaving = signal<boolean>(false);

    levelOptions = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    // Computed signal for filtered experiences
    displayExperiences = computed(() => {
        return this.experiences();
    });

    ngOnInit(): void {
        if (this.contentService.skillsData().length === 0) {
            this.contentService.loadSkillsData();
        }
        this.contentService.loadExperienceDetails();
        this.buildTechnologyList();
    }

    private buildTechnologyList(): void {
        this.isLoading.set(true);
        const skillsData = this.contentService.skillsData();

        if (!skillsData || skillsData.length === 0) {
            setTimeout(() => this.buildTechnologyList(), 100);
            return;
        }

        const techMap = new Map<string, string>();

        skillsData.forEach((skill: any) => {
            if (skill.subdivisions) {
                skill.subdivisions.forEach((subdivision: any) => {
                    if (subdivision.items) {
                        subdivision.items.forEach((item: any) => {
                            if (item.key && item.name) {
                                techMap.set(item.key, item.name);
                            }
                        });
                    }
                });
            }
            if (skill.items) {
                skill.items.forEach((item: any) => {
                    if (item.key && item.name) {
                        techMap.set(item.key, item.name);
                    }
                });
            }
        });

        const techs: Technology[] = Array.from(techMap.entries())
            .map(([key, name]) => ({
                label: name,
                value: key
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        this.technologies.set(techs);
        this.isLoading.set(false);
    }

    /**
     * Get technology name from portfolio or fallback to formatted key
     */
    getTechnologyName(key: string): string {
        const tech = this.technologies().find(t => t.value === key);
        if (tech) {
            return tech.label;
        }
        // Fallback: format key as title case
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    onTechnologyChange(): void {
        const tech = this.selectedTechnology();
        if (tech) {
            const experienceDetails = this.contentService.experienceDetails();
            if (experienceDetails && experienceDetails[tech]) {
                const data = experienceDetails[tech];
                // Convert old format (string[]) to new format (ExperienceDetail[])
                if (data.length > 0 && typeof data[0] === 'string') {
                    this.experiences.set((data as string[]).map(text => ({ 
                        text, 
                        level: 'Intermediate' as const 
                    })));
                } else {
                    this.experiences.set([...(data as ExperienceDetail[])]);
                }
            } else {
                // Technology doesn't exist in experience-details.json yet
                // Initialize with empty array so user can add experiences
                this.experiences.set([]);
                this.messageService.add({
                    severity: 'info',
                    summary: 'New Technology',
                    detail: `No experiences found for ${this.getTechnologyName(tech)}. You can add new experiences below.`
                });
            }
        }
        this.cancelEdit();
        this.newExperience.set('');
        this.newLevel.set('Intermediate');
    }

    startEdit(index: number): void {
        this.editingIndex.set(index);
        const experience = this.experiences()[index];
        this.editingExperience.set(experience.text);
        this.editingLevel.set(experience.level);
    }

    cancelEdit(): void {
        this.editingIndex.set(-1);
        this.editingExperience.set('');
        this.editingLevel.set('Intermediate');
    }

    saveEdit(): void {
        const index = this.editingIndex();
        const experience = this.editingExperience().trim();
        const level = this.editingLevel();
        
        if (experience && index >= 0) {
            const updatedExperiences = [...this.experiences()];
            updatedExperiences[index] = { text: experience, level };
            this.experiences.set(updatedExperiences);
            this.cancelEdit();
        }
    }

    addExperience(): void {
        const experience = this.newExperience().trim();
        const level = this.newLevel();
        if (experience) {
            const updatedExperiences = [...this.experiences(), { text: experience, level }];
            this.experiences.set(updatedExperiences);
            this.newExperience.set('');
            this.newLevel.set('Intermediate');
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Experience added. Remember to save changes!'
            });
        }
    }

    deleteExperience(index: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this experience?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                const updatedExperiences = this.experiences().filter((_, i) => i !== index);
                this.experiences.set(updatedExperiences);
                this.cancelEdit();
                
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Experience deleted. Remember to save changes!'
                });
            }
        });
    }

    async saveChanges(): Promise<void> {
        const tech = this.selectedTechnology();
        if (!tech) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a technology first'
            });
            return;
        }

        this.isSaving.set(true);
        
        try {
            // Get current experience details
            const currentDetails = this.contentService.experienceDetails() || {};
            
            // Update with new experiences
            const updatedDetails = {
                ...currentDetails,
                [tech]: this.experiences()
            };

            // Save to the service (will save to localStorage and download JSON)
            await this.skillDataService.saveExperienceDetails(updatedDetails);
            
            // Update the content service
            this.contentService.experienceDetails.set(updatedDetails);
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Changes saved successfully!'
            });
        } catch (error) {
            console.error('Error saving changes:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save changes. Check console for details.'
            });
        } finally {
            this.isSaving.set(false);
        }
    }

    moveUp(index: number): void {
        if (index > 0) {
            const updatedExperiences = [...this.experiences()];
            [updatedExperiences[index - 1], updatedExperiences[index]] = [updatedExperiences[index], updatedExperiences[index - 1]];
            this.experiences.set(updatedExperiences);
        }
    }

    moveDown(index: number): void {
        if (index < this.experiences().length - 1) {
            const updatedExperiences = [...this.experiences()];
            [updatedExperiences[index], updatedExperiences[index + 1]] = [updatedExperiences[index + 1], updatedExperiences[index]];
            this.experiences.set(updatedExperiences);
        }
    }

    goBack(): void {
        this.router.navigate(['/home']);
    }
}

