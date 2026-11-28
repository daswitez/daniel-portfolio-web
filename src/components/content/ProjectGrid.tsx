"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { TagList } from "@/components/ui/TagList";
import { useWindowActions } from "@/components/windows/WindowManager";
import { SAFARI_PAGES } from "@/config/safari";
import { useI18n } from "@/i18n/I18nProvider";
import type { Project } from "@/types/profile";
import { SitePreviewCard } from "./SitePreviewCard";
import styles from "./content.module.css";

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <div className={styles.projects}>
      {featured.map((project) => (
        <ProjectCase key={project.title} project={project} />
      ))}
      {rest.length > 0 && (
        <div className={styles.projectGrid}>
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

/** A featured project: live preview on top, then the story, the numbers and the links. */
function ProjectCase({ project }: { project: Project }) {
  const { t } = useI18n();
  const { open } = useWindowActions();
  const page = project.previewPage
    ? SAFARI_PAGES[project.previewPage]
    : undefined;
  const liveUrl = page?.type === "preview" ? page.href : project.url;

  return (
    <article className={styles.case}>
      {project.previewPage && (
        <SitePreviewCard page={project.previewPage} wide />
      )}

      <header className={styles.caseHeader}>
        <h3>{project.title}</h3>
        {project.tagline && (
          <p className={styles.caseTagline}>{project.tagline}</p>
        )}
      </header>

      <p className={styles.jobDescription}>{project.description}</p>

      {project.role && (
        <p className={styles.caseRole}>
          <span>{t.content.myRole}</span>
          {project.role}
        </p>
      )}

      {project.stats && project.stats.length > 0 && (
        <dl className={styles.caseStats}>
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <section className={styles.caseHighlights}>
          <h4>{t.content.standsOut}</h4>
          <ul>
            {project.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {project.tags.length > 0 && <TagList tags={project.tags} />}

      <div className={styles.caseActions}>
        {project.previewPage && (
          <button
            type="button"
            className={styles.casePrimary}
            onClick={() =>
              project.previewPage &&
              open({ kind: "safari", page: project.previewPage })
            }
          >
            {t.content.openInSafari}
          </button>
        )}
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener">
            {t.content.liveSite} ↗
          </a>
        )}
        {project.figmaUrl && (
          <a href={project.figmaUrl} target="_blank" rel="noopener">
            {t.content.designFile} ↗
          </a>
        )}
      </div>

      {project.note && <p className={styles.caseNote}>{project.note}</p>}
    </article>
  );
}

/** A project with a Safari page opens it there; otherwise it links out. */
function ProjectCard({ project }: { project: Project }) {
  const { open } = useWindowActions();
  const page = project.previewPage
    ? SAFARI_PAGES[project.previewPage]
    : undefined;
  const image = page?.type === "preview" ? page.image : undefined;

  const body: ReactNode = (
    <>
      <div
        className={styles.cover}
        style={{ background: project.color }}
        aria-hidden="true"
      >
        {image ? (
          <Image
            src={image.src}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 360px"
            className={styles.coverImage}
          />
        ) : (
          <b>{project.title[0]}</b>
        )}
      </div>
      <div className={styles.projectInfo}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.tags.length > 0 && <TagList tags={project.tags} />}
      </div>
    </>
  );

  if (project.previewPage) {
    const pageId = project.previewPage;
    return (
      <button
        type="button"
        className={styles.projectCard}
        onClick={() => open({ kind: "safari", page: pageId })}
      >
        {body}
      </button>
    );
  }

  return (
    <a
      className={styles.projectCard}
      href={project.url}
      target="_blank"
      rel="noopener"
    >
      {body}
    </a>
  );
}
