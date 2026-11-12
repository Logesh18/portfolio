"use client";

import React from "react";
import {
  Bot,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { getPortfolioSnapshot } from "@/features/portfolio/application/queries";
import { SectionHeader } from "@/components/ui/section-header";

export default function ContactPage() {
  const { profile } = getPortfolioSnapshot();

  const openAssistantWithPrompt = (prompt?: string) => {
    window.dispatchEvent(
      new CustomEvent("open-portfolio-assistant", {
        detail: { prompt },
      })
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SectionHeader
        eyebrow="Contact // Direct & Public Channels"
        title="Connect with Logesh T"
        description="Reach out directly via phone or email, connect on LinkedIn and GitHub, download the full resume summary, or query the AI portfolio assistant."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Direct Contact Information & Approved Public Profiles */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Direct Contact Information
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Available for full-stack software engineering, architecture, and enterprise web/mobile discussions.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`mailto:${profile.contactInfo.email}`}
              className="flex items-center gap-3.5 rounded-xl border border-border bg-background p-4 hover:border-blue-500/40 transition-colors"
            >
              <Mail
                className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {profile.contactInfo.email}
                </p>
              </div>
            </a>

            <a
              href={`tel:${profile.contactInfo.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-3.5 rounded-xl border border-border bg-background p-4 hover:border-blue-500/40 transition-colors"
            >
              <Phone
                className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {profile.contactInfo.phone}
                </p>
              </div>
            </a>

            <div className="flex items-start gap-3.5 rounded-xl border border-border bg-background p-4">
              <MapPin
                className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">
                  Residential Address
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {profile.contactInfo.address}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Verified Profiles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 hover:border-blue-500/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {social.label}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {social.handle}
                    </p>
                  </div>
                  <ExternalLink
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-border/70 pt-4 flex items-center justify-end text-xs text-muted-foreground">
            <a
              href="/documents/Logesh_T_Public_Profile_Summary.md"
              download="Logesh_T_Public_Profile_Summary.md"
              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download Resume Summary</span>
            </a>
          </div>
        </div>

        {/* Interactive AI Assistant Card */}
        <div className="rounded-2xl border border-blue-500/30 bg-card p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-600 dark:text-blue-400">
              <Bot className="h-4 w-4" aria-hidden="true" />
              <span>Interactive RAG Assistant</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Ask My AI Assistant Anything About My Work
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Want a quick breakdown of Logesh&apos;s experience with React, Next.js, Angular, Node.js, React Native, PostgreSQL, or his IEEE publications? Click a prompt below to launch the grounded assistant.
            </p>

            <div className="space-y-2 pt-2">
              {[
                "Tell me about Logesh",
                "What did he build on TracAssets and Ursamin?",
                "What certifications and publications are public?",
                "What freelance projects did he deliver?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => openAssistantWithPrompt(q)}
                  className="w-full text-left rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:border-blue-500/40 transition-colors"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck
              className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{profile.privacyNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
