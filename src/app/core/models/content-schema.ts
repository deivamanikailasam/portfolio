// Base interfaces for schema-driven rendering
export interface ISection {
    id: string;
    type: SectionType;
    title?: string;
    description?: string;
    content: IContent[];
    metadata?: Record<string, any>;
  }
  
  export type SectionType = 
    | 'profile' 
    | 'experience' 
    | 'education' 
    | 'skills' 
    | 'projects' 
    | 'testimonials' 
    | 'achievements' 
    | 'contact';
  
  export interface IContent {
    id: string;
    componentType: ComponentType;
    props: Record<string, any>;
  }
  
  export type ComponentType =
    | 'table'
    | 'carousel'
    | 'stepper'
    | 'tabs'
    | 'drawer'
    | 'card'
    | 'list'
    | 'form';
  
  // Portfolio-specific models
  export interface Profile {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location?: string;
    avatar?: string;
    backgroundImage?: string;
    socials?: Social[];
  }
  
  export interface Social {
    platform: string;
    url: string;
    icon: string;
  }
  
  export interface ExperienceSection {
    header: string;
    points: string[];
  }

  export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string | string[];
    sections?: ExperienceSection[];
    technologies?: string[];
    companyLogo?: string;
    backgroundImage?: string;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    image?: string;
    link?: string;
    github?: string;
    featured: boolean;
    category?: string;
    subcategory?: string;
    highlights?: string[];
    status?: 'Active' | 'Completed' | 'In Development';
    version?: string;
    icon?: string;
  }
  
  export interface PortfolioContent {
    version: string; // Semantic versioning (e.g., "1.0.0")
    profile: Profile;
    experience: Experience[];
    education: Experience[];
    skills: Skill[];
    projects: Project[];
    achievements: Achievement[];
    testimonials: Testimonial[];
    contact: ContactInfo;
  }
  
  export interface SkillItem {
    key: string;
    name: string;
    image?: string;
    icon?: string;
  }

  export interface SkillSubdivision {
    title: string;
    key: string;
    items: SkillItem[];
  }

  export interface Skill {
    id: string;
    category: string;
    key: string;
    subdivisions?: SkillSubdivision[];
    items?: SkillItem[]; // Keep for backward compatibility
    icon?: string;
    color?: string;
  }
  
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    icon?: string;
    category?: 'award' | 'milestone' | 'impact';
    organization?: string;
    metric?: string;
    highlight?: boolean;
  }
  
  export interface Testimonial {
    id: string;
    author: string;
    role: string;
    content: string;
    image?: string;
  }
  
  export interface ContactInfo {
    email: string;
    phone?: string;
    location?: string;
    socials?: Social[];
  }
  