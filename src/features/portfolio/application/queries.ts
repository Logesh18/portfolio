import { portfolioRepository } from "../infrastructure/json-portfolio-repository";
import type { ProjectFilterCriteria } from "../domain/repository";

export function getPortfolioSnapshot() {
  return {
    profile: portfolioRepository.getProfile(),
    experiences: portfolioRepository.getExperiences(),
    allProjects: portfolioRepository.getAllProjects(),
    featuredProjects: portfolioRepository.getFeaturedProjects(),
    employmentProjects: portfolioRepository.filterProjects({
      originType: "employment",
    }),
    freelanceProjects: portfolioRepository.filterProjects({
      originType: "freelance",
    }),
    skills: portfolioRepository.getSkills(),
    education: portfolioRepository.getEducation(),
    certifications: portfolioRepository.getCertifications(),
    publications: portfolioRepository.getPublications(),
    faqs: portfolioRepository.getFaqs(),
  };
}

export function listProjects(criteria: ProjectFilterCriteria = {}) {
  return portfolioRepository.filterProjects(criteria);
}

export function getProjectCaseStudy(slug: string) {
  return portfolioRepository.getProjectBySlug(slug);
}
