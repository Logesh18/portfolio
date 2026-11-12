import profileRaw from "@/content/public/profile.json";
import experienceRaw from "@/content/public/experience.json";
import projectsRaw from "@/content/public/projects.json";
import skillsRaw from "@/content/public/skills.json";
import educationRaw from "@/content/public/education.json";
import certificationsRaw from "@/content/public/certifications.json";
import publicationsRaw from "@/content/public/publications.json";
import faqRaw from "@/content/public/faq.json";

import {
  CertificationItemSchema,
  EducationItemSchema,
  ExperienceItemSchema,
  FaqItemSchema,
  ProfileDataSchema,
  ProjectItemSchema,
  PublicationItemSchema,
  SkillGroupSchema,
} from "@/lib/validation/schemas";
import { filterApprovedLinks } from "@/lib/security/allowlist";
import type {
  PortfolioRepository,
  ProjectFilterCriteria,
} from "../domain/repository";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  FaqItem,
  ProfileData,
  ProjectItem,
  PublicationItem,
  SkillGroup,
} from "@/types/portfolio";
import { z } from "zod";

const validatedProfile: ProfileData = ProfileDataSchema.parse(profileRaw);
const validatedExperiences: ExperienceItem[] = z
  .array(ExperienceItemSchema)
  .parse(experienceRaw);
const validatedProjects: ProjectItem[] = z
  .array(ProjectItemSchema)
  .parse(projectsRaw);
const validatedSkills: SkillGroup[] = z
  .array(SkillGroupSchema)
  .parse(skillsRaw);
const validatedEducation: EducationItem[] = z
  .array(EducationItemSchema)
  .parse(educationRaw);
const validatedCertifications: CertificationItem[] = filterApprovedLinks(
  z.array(CertificationItemSchema).parse(certificationsRaw)
);
const validatedPublications: PublicationItem[] = filterApprovedLinks(
  z.array(PublicationItemSchema).parse(publicationsRaw)
);
const validatedFaqs: FaqItem[] = z.array(FaqItemSchema).parse(faqRaw);

export class JsonPortfolioRepository implements PortfolioRepository {
  getProfile(): ProfileData {
    return {
      ...validatedProfile,
      socialLinks: filterApprovedLinks(validatedProfile.socialLinks),
    };
  }

  getExperiences(): ExperienceItem[] {
    return validatedExperiences;
  }

  getAllProjects(): ProjectItem[] {
    return validatedProjects;
  }

  getFeaturedProjects(): ProjectItem[] {
    return validatedProjects.filter((p) => p.featured);
  }

  getProjectBySlug(slug: string): ProjectItem | undefined {
    return validatedProjects.find((p) => p.slug === slug);
  }

  filterProjects(criteria: ProjectFilterCriteria): ProjectItem[] {
    return validatedProjects.filter((project) => {
      if (
        criteria.domain &&
        criteria.domain !== "All" &&
        project.domain !== criteria.domain
      ) {
        return false;
      }

      if (
        criteria.originType &&
        criteria.originType !== "All" &&
        project.originType !== criteria.originType
      ) {
        return false;
      }

      if (criteria.technology && criteria.technology !== "All") {
        const techLower = criteria.technology.toLowerCase();
        const hasTech = project.stack.some((t) =>
          t.toLowerCase().includes(techLower)
        );
        if (!hasTech) return false;
      }

      if (criteria.search && criteria.search.trim().length > 0) {
        const q = criteria.search.trim().toLowerCase();
        const haystack = [
          project.title,
          project.subtitle,
          project.employer,
          project.domain,
          project.summary,
          ...project.stack,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }

  getSkills(): SkillGroup[] {
    return validatedSkills;
  }

  getEducation(): EducationItem[] {
    return validatedEducation;
  }

  getCertifications(): CertificationItem[] {
    return validatedCertifications;
  }

  getPublications(): PublicationItem[] {
    return validatedPublications;
  }

  getFaqs(): FaqItem[] {
    return validatedFaqs;
  }
}

export const portfolioRepository = new JsonPortfolioRepository();
