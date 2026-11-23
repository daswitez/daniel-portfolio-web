"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { TagList } from "@/components/ui/TagList";
import { cn } from "@/lib/text";
import type { Experience } from "@/types/profile";
import { SitePreviewCard } from "./SitePreviewCard";
import styles from "./content.module.css";

/** Featured roles first (highest hierarchy), then the rest in chronological order. */
export function ExperienceList({ items }: { items: readonly Experience[] }) {
  const ordered = [
    ...items.filter((job) => job.featured),
    ...items.filter((job) => !job.featured),
  ];

  return (
    <div>
      {ordered.map((job) => (
        <ExperienceItem key={`${job.company}-${job.period}`} job={job} />
      ))}
    </div>
  );
}

function ExperienceItem({ job }: { job: Experience }) {
  const { t } = useI18n();

  return (
    <article className={cn(styles.job, job.featured && styles.featuredJob)}>
      <div className={styles.period}>
        {job.featured && (
          <span className={styles.featuredBadge}>{t.content.featured}</span>
        )}
        {job.period}
      </div>
      <div>
        <h3>{job.role}</h3>
        <p className={styles.company}>
          {job.companyUrl ? (
            <a href={job.companyUrl} target="_blank" rel="noopener">
              {job.company}
            </a>
          ) : (
            job.company
          )}
        </p>
        <p className={styles.jobDescription}>{job.description}</p>
        <ul>
          {job.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <TagList tags={job.tags} />
        {job.previewPage && <SitePreviewCard page={job.previewPage} />}
      </div>
    </article>
  );
}
