import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  FaqItem,
  ProfileData,
  ProjectCategory,
  ProjectItem,
  PublicationItem,
  SkillGroup,
} from "@/types/portfolio";

export interface ProjectFilterCriteria {
  domain?: ProjectCategory | "All";
  technology?: string | "All";
  originType?: "employment" | "freelance" | "All";
  search?: string;
}

export interface PortfolioRepository {
  getProfile(): ProfileData;
  getExperiences(): ExperienceItem[];
  getAllProjects(): ProjectItem[];
  getFeaturedProjects(): ProjectItem[];
  getProjectBySlug(slug: string): ProjectItem | undefined;
  filterProjects(criteria: ProjectFilterCriteria): ProjectItem[];
  getSkills(): SkillGroup[];
  getEducation(): EducationItem[];
  getCertifications(): CertificationItem[];
  getPublications(): PublicationItem[];
  getFaqs(): FaqItem[];
}
