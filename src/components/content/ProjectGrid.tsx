"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { TagList } from "@/components/ui/TagList";
import { useWindowActions } from "@/components/windows/WindowManager";
import { SAFARI_PAGES } from "@/config/safari";
import type { Project } from "@/types/profile";
import styles from "./content.module.css";

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <div className={styles.projectGrid}>
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
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
