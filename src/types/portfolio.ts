export type ProjectCategory =
  | "Enterprise & Asset Management"
  | "Healthcare"
  | "Low-Code & Enterprise Pricing"
  | "Mobile & Warehouse IoT"
  | "Digital Identity & Security"
  | "EdTech & Cloud"
  | "Freelance";

export type ProjectOriginType = "employment" | "freelance";

export interface ArchitectureNote {
  label: string;
  description: string;
  classification: "verified" | "proposed";
}

export interface ProjectItem {
  slug: string;
  title: string;
  subtitle: string;
  employer: string;
  originType: ProjectOriginType;
  period: string;
  domain: ProjectCategory;
  featured: boolean;
  role: string;
  scopeNote: string;
  stack: string[];
  summary: string;
  businessProblem: string;
  contributions: string[];
  keyFeatures: string[];
  challenges: string[];
  verifiedImpact: string[];
  architectureNotes: ArchitectureNote[];
}

export interface ExperienceProjectSummary {
  name: string;
  projectSlug: string;
  stack: string[];
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: "full-time" | "freelance";
  summary: string;
  projects: ExperienceProjectSummary[];
}

export interface SkillGroup {
  id: string;
  category: string;
  description: string;
  skills: string[];
  isAiAssisted?: boolean;
  positioningDisclaimer?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  score: string;
  location: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  credentialLabel: string;
  url: string;
  verified: boolean;
}

export interface PublicationItem {
  id: string;
  label: string;
  title: string;
  conference: string;
  publisher: string;
  documentId: string;
  url: string;
  teamSummary: string;
  coAuthors: string[];
  note: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedLinks: { label: string; href: string }[];
  keywords: string[];
}

export interface ProfileData {
  name: string;
  role: string;
  headline: string;
  subheadline: string;
  currentEmployer: string;
  joinedDate: string;
  experienceYears: string;
  location: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  languages: string[];
  summary: string;
  aboutParagraphs: string[];
  aiPositioningNote: string;
  privacyNotice: string;
  socialLinks: {
    id: string;
    label: string;
    url: string;
    handle: string;
  }[];
  heroActions: {
    exploreProjects: string;
    viewExperience: string;
    askAssistant: string;
    downloadResume: string;
  };
}
