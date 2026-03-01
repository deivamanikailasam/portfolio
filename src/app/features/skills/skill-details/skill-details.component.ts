import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ContentService } from "../../../core/services/content.service";
import { Skill, SkillSubdivision, SkillItem } from "../../../core/models/portfolio.interface";
import { FormsModule } from "@angular/forms";
import { SelectButtonModule } from "primeng/selectbutton";
import { SafeHtmlPipe } from "../../../core/pipes/safe-html.pipe";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from 'primeng/tooltip';

export interface SkillDetail {
    text: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export type LevelFilter = 'Beginner' | 'Intermediate' | 'Advanced' | null;

@Component({
    selector: 'app-skill-details',
    standalone: true,
    templateUrl: './skill-details.component.html',
    styleUrls: ['./skill-details.component.scss'],
    imports: [CommonModule, FormsModule, SelectButtonModule, SafeHtmlPipe, InputTextModule, TooltipModule]
})
export class SkillDetailsComponent implements OnInit {
    skillKey = signal<string>('');
    categoryKey = signal<string>('');
    divisionKey = signal<string>('');
    options = signal<{label: string, value: string}[]>([
        {label: 'Skills', value: 'skills'},
        {label: 'Experience', value: 'experience'}
    ]);

    selectedOption = signal<string>('skills');
    searchValue = signal<string>('');
    selectedLevelFilters = signal<Set<LevelFilter>>(new Set());

    protected readonly contentService = inject(ContentService);
    protected readonly route = inject(ActivatedRoute);
    protected readonly router = inject(Router);

    category = computed(() => {
        const skills = this.contentService.skillsData();
        const catKey = this.categoryKey();
        
        if (!skills?.length || !catKey) {
            return null;
        }
        
        return skills.find((skill: Skill) => skill.key === catKey) ?? null;
    });

    // Make division a computed signal
    division = computed(() => {
        const category = this.category();
        const divKey = this.divisionKey();
        
        if (!category || !divKey) {
            return null;
        }
        
        return category.subdivisions?.find((subdivision: SkillSubdivision) => subdivision.key === divKey) ?? null;
    });

    // Now skill computed can use the other computed signals
    skill = computed(() => {
        const division = this.division();
        const skKey = this.skillKey();
        
        if (!division || !skKey) {
            return null;
        }

        return division.items?.find((item: SkillItem) => item.key === skKey) ?? null;
    });

    skillDetails = computed(() => {
        if (this.contentService.skillDetails()) {
            const data = this.contentService.skillDetails()[this.skillKey()];
            // Convert old format (string[]) to new format (SkillDetail[])
            if (data && data.length > 0) {
                if (typeof data[0] === 'string') {
                    return (data as string[]).map(text => ({ text, level: 'Intermediate' as const }));
                }
            }
            return data as SkillDetail[] || [];
        }
        return [];
    });

    experienceDetails = computed(() => {
        if (this.contentService.experienceDetails()) {
            const data = this.contentService.experienceDetails()[this.skillKey()];
            // Convert old format (string[]) to new format (SkillDetail[])
            if (data && data.length > 0) {
                if (typeof data[0] === 'string') {
                    return (data as string[]).map(text => ({ text, level: 'Intermediate' as const }));
                }
            }
            return data as SkillDetail[] || [];
        }
        return [];
    });

    // Filtered skill details based on search value and level filters
    filteredSkillDetails = computed(() => {
        const details = this.skillDetails();
        const search = this.searchValue().toLowerCase().trim();
        const levelFilters = this.selectedLevelFilters();
        
        let filtered = details;
        
        // Apply level filters
        if (levelFilters.size > 0) {
            filtered = filtered.filter((detail: SkillDetail) => 
                levelFilters.has(detail.level)
            );
        }
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter((detail: SkillDetail) => 
                detail.text.toLowerCase().includes(search)
            );
        }
        
        return filtered;
    });

    // Filtered experience details based on search value and level filters
    filteredExperienceDetails = computed(() => {
        const details = this.experienceDetails();
        const search = this.searchValue().toLowerCase().trim();
        const levelFilters = this.selectedLevelFilters();
        
        let filtered = details;
        
        // Apply level filters
        if (levelFilters.size > 0) {
            filtered = filtered.filter((detail: SkillDetail) => 
                levelFilters.has(detail.level)
            );
        }
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter((detail: SkillDetail) => 
                detail.text.toLowerCase().includes(search)
            );
        }
        
        return filtered;
    });

    constructor() {
        effect(() => {
            const key = this.skillKey();
            if (!this.contentService.skillDetails() && key) {
                this.getDetails();
            }
        });
    }
    
    ngOnInit(): void {
        if (this.contentService.skillsData().length === 0) {
            this.contentService.loadSkillsData();
        }
        this.route.params.subscribe(params => {
            this.categoryKey.set(params['category'] || '');
            this.divisionKey.set(params['division'] || '');
            this.skillKey.set(params['key'] || '');
        });
    }

    getDetails(): void {
        if (this.skillKey()) {
            this.contentService.loadSkillDetails();
            this.contentService.loadExperienceDetails();
        }
    }

    onToggleChange(): void {
        this.searchValue.set('');
        this.selectedLevelFilters.set(new Set());
    }

    toggleLevelFilter(level: LevelFilter): void {
        const currentFilters = new Set(this.selectedLevelFilters());
        if (currentFilters.has(level)) {
            currentFilters.delete(level);
        } else {
            currentFilters.add(level);
        }
        this.selectedLevelFilters.set(currentFilters);
    }

    isLevelFilterActive(level: LevelFilter): boolean {
        return this.selectedLevelFilters().has(level);
    }

    getLevelBadge(level: string): { short: string; full: string; class: string } {
        switch (level) {
            case 'Beginner':
                return { short: 'B', full: 'Beginner', class: 'level-beginner' };
            case 'Intermediate':
                return { short: 'I', full: 'Intermediate', class: 'level-intermediate' };
            case 'Advanced':
                return { short: 'A', full: 'Advanced', class: 'level-advanced' };
            default:
                return { short: 'I', full: 'Intermediate', class: 'level-intermediate' };
        }
    }

    goBack(): void {
        this.router.navigate(['/home']);
    }

}