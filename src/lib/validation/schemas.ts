import { z } from "zod";

export const ArchitectureNoteSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  classification: z.enum(["verified", "proposed"]),
});

export const ProjectItemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  employer: z.string().min(1),
  originType: z.enum(["employment", "freelance"]),
  period: z.string().min(1),
  domain: z.enum([
    "Enterprise & Asset Management",
    "Healthcare",
    "Low-Code & Enterprise Pricing",
    "Mobile & Warehouse IoT",
    "Digital Identity & Security",
    "EdTech & Cloud",
    "Freelance",
  ]),
  featured: z.boolean(),
  role: z.string().min(1),
  scopeNote: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  businessProblem: z.string().min(1),
  contributions: z.array(z.string().min(1)).min(1),
  keyFeatures: z.array(z.string().min(1)).min(1),
  challenges: z.array(z.string().min(1)).min(1),
  verifiedImpact: z.array(z.string().min(1)).min(1),
  architectureNotes: z.array(ArchitectureNoteSchema).min(1),
});

export const ExperienceItemSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(["full-time", "freelance"]),
  summary: z.string().min(1),
  projects: z.array(
    z.object({
      name: z.string().min(1),
      projectSlug: z.string().min(1),
      stack: z.array(z.string()),
      highlights: z.array(z.string()),
    })
  ),
});

export const SkillGroupSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  isAiAssisted: z.boolean().optional(),
  positioningDisclaimer: z.string().optional(),
});

export const EducationItemSchema = z.object({
  id: z.string().min(1),
  degree: z.string().min(1),
  institution: z.string().min(1),
  period: z.string().min(1),
  score: z.string().min(1),
  location: z.string().min(1),
  highlights: z.array(z.string()),
});

export const CertificationItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  credentialLabel: z.string().min(1),
  url: z.string().url(),
  verified: z.boolean(),
});

export const PublicationItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  conference: z.string().min(1),
  publisher: z.string().min(1),
  documentId: z.string().min(1),
  url: z.string().url(),
  teamSummary: z.string().min(1),
  coAuthors: z.array(z.string().min(1)).min(1),
  note: z.string().min(1),
});

export const FaqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  relatedLinks: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    })
  ),
  keywords: z.array(z.string().min(1)),
});

export const ProfileDataSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  currentEmployer: z.string().min(1),
  joinedDate: z.string().min(1),
  experienceYears: z.string().min(1),
  location: z.string().min(1),
  contactInfo: z.object({
    phone: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
  }),
  languages: z.array(z.string()),
  summary: z.string().min(1),
  aboutParagraphs: z.array(z.string()).min(1),
  aiPositioningNote: z.string().min(1),
  privacyNotice: z.string().min(1),
  socialLinks: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      url: z.string().url(),
      handle: z.string().min(1),
    })
  ),
  heroActions: z.object({
    exploreProjects: z.string(),
    viewExperience: z.string(),
    askAssistant: z.string(),
    downloadResume: z.string(),
  }),
});

export const AssistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(600),
});

export const AssistantRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(2, "Question must be at least 2 characters.")
    .max(500, "Question cannot exceed 500 characters."),
  history: z.array(AssistantMessageSchema).max(6).optional().default([]),
});

export type AssistantRequestInput = z.infer<typeof AssistantRequestSchema>;
