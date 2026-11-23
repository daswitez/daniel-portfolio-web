"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { FolderId } from "@/types/windows";
import { AboutContent } from "./AboutContent";
import { ContactContent } from "./ContactContent";
import { ExperienceList } from "./ExperienceList";
import { ProjectGrid } from "./ProjectGrid";
import { StackGrid } from "./StackGrid";

/** Maps a desktop folder to its content block (same blocks the page sections use). */
export function FolderContent({ folder }: { folder: FolderId }) {
  const { profile } = useI18n();

  switch (folder) {
    case "experience":
      return <ExperienceList items={profile.experience} />;
    case "projects":
      return <ProjectGrid projects={profile.projects} />;
    case "stack":
      return <StackGrid groups={profile.stack} />;
    case "about":
      return <AboutContent bio={profile.bio} facts={profile.facts} />;
    case "contact":
      return <ContactContent email={profile.email} links={profile.links} />;
  }
}
