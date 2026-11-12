import React from "react";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { portfolioRepository } from "@/features/portfolio/infrastructure/json-portfolio-repository";

export function Footer() {
  const profile = portfolioRepository.getProfile();

  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-base font-semibold tracking-tight text-foreground">
              {profile.name}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {profile.role} • {profile.currentEmployer}
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <a
                  href={`mailto:${profile.contactInfo.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {profile.contactInfo.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <a
                  href={`tel:${profile.contactInfo.phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground transition-colors"
                >
                  {profile.contactInfo.phone}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{profile.contactInfo.address}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            <ul className="grid grid-cols-2 gap-1.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Projects (13)
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="/documents/Logesh_T_Public_Profile_Summary.md"
                  download
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Public Resume
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Approved Public Profiles
            </p>
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-blue-500/40 transition-colors"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ))}
            </div>
            <div className="flex items-start gap-2 pt-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
              <span>
                AI Assistant Privacy Gate: personal contact details are restricted inside AI chat responses.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js App Router, TypeScript & Local RAG AI.
          </p>
          <p className="font-mono text-[11px]">
            Model: Ollama Qwen3-class + Deterministic BM25 Grounding
          </p>
        </div>
      </div>
    </footer>
  );
}
