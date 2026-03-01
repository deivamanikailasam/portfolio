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

export interface SkillDetail {
    text: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

@Component({
    selector: 'app-skill-details-edit',
    standalone: true,
    templateUrl: './skill-details-edit.component.html',
    styleUrls: ['./skill-details-edit.component.scss'],
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
export class SkillDetailsEditComponent implements OnInit {
    protected readonly contentService = inject(ContentService);
    protected readonly skillDataService = inject(SkillDataService);
    protected readonly router = inject(Router);
    protected readonly confirmationService = inject(ConfirmationService);
    protected readonly messageService = inject(MessageService);

    technologies = signal<Technology[]>([]);
    selectedTechnology = signal<string>('');
    skills = signal<SkillDetail[]>([]);
    editingIndex = signal<number>(-1);
    editingSkill = signal<string>('');
    editingLevel = signal<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
    newSkill = signal<string>('');
    newLevel = signal<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
    isLoading = signal<boolean>(false);
    isSaving = signal<boolean>(false);

    levelOptions = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    // Computed signal for filtered skills
    displaySkills = computed(() => {
        return this.skills();
    });

    ngOnInit(): void {
        if (this.contentService.skillsData().length === 0) {
            this.contentService.loadSkillsData();
        }
        this.contentService.loadSkillDetails();
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
            const skillDetails = this.contentService.skillDetails();
            if (skillDetails && skillDetails[tech]) {
                const data = skillDetails[tech];
                // Convert old format (string[]) to new format (SkillDetail[])
                if (data.length > 0 && typeof data[0] === 'string') {
                    this.skills.set((data as string[]).map(text => ({ 
                        text, 
                        level: 'Intermediate' as const 
                    })));
                } else {
                    this.skills.set([...(data as SkillDetail[])]);
                }
            } else {
                // Technology doesn't exist in skill-details.json yet
                // Initialize with empty array so user can add skills
                this.skills.set([]);
                this.messageService.add({
                    severity: 'info',
                    summary: 'New Technology',
                    detail: `No skills found for ${this.getTechnologyName(tech)}. You can add new skills below.`
                });
            }
        }
        this.cancelEdit();
        this.newSkill.set('');
        this.newLevel.set('Intermediate');
    }

    startEdit(index: number): void {
        this.editingIndex.set(index);
        const skill = this.skills()[index];
        this.editingSkill.set(skill.text);
        this.editingLevel.set(skill.level);
    }

    cancelEdit(): void {
        this.editingIndex.set(-1);
        this.editingSkill.set('');
        this.editingLevel.set('Intermediate');
    }

    saveEdit(): void {
        const index = this.editingIndex();
        const skill = this.editingSkill().trim();
        const level = this.editingLevel();
        
        if (skill && index >= 0) {
            const updatedSkills = [...this.skills()];
            updatedSkills[index] = { text: skill, level };
            this.skills.set(updatedSkills);
            this.cancelEdit();
        }
    }

    addSkill(): void {
        const skill = this.newSkill().trim();
        const level = this.newLevel();
        if (skill) {
            const updatedSkills = [...this.skills(), { text: skill, level }];
            this.skills.set(updatedSkills);
            this.newSkill.set('');
            this.newLevel.set('Intermediate');
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Skill added. Remember to save changes!'
            });
        }
    }

    deleteSkill(index: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this skill?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                const updatedSkills = this.skills().filter((_, i) => i !== index);
                this.skills.set(updatedSkills);
                this.cancelEdit();
                
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Skill deleted. Remember to save changes!'
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
            // Get current skill details
            const currentDetails = this.contentService.skillDetails() || {};
            
            // Update with new skills
            const updatedDetails = {
                ...currentDetails,
                [tech]: this.skills()
            };

            // Save to the service
            await this.skillDataService.saveSkillDetails(updatedDetails);
            
            // Update the content service
            this.contentService.skillDetails.set(updatedDetails);
            
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
            const updatedSkills = [...this.skills()];
            [updatedSkills[index - 1], updatedSkills[index]] = [updatedSkills[index], updatedSkills[index - 1]];
            this.skills.set(updatedSkills);
        }
    }

    moveDown(index: number): void {
        if (index < this.skills().length - 1) {
            const updatedSkills = [...this.skills()];
            [updatedSkills[index], updatedSkills[index + 1]] = [updatedSkills[index + 1], updatedSkills[index]];
            this.skills.set(updatedSkills);
        }
    }

    goBack(): void {
        this.router.navigate(['/home']);
    }
}

