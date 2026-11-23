import type { Locale } from "@/i18n/config";
import type { Profile } from "@/types/profile";
import { EXPERIENCE, identity, PROJECTS, type ProfileText } from "./base";
import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";

function buildProfile(text: ProfileText): Profile {
  const { experience, projects, ...rest } = text;
  return {
    ...identity,
    ...rest,
    experience: EXPERIENCE.map(({ key, ...job }) => {
      const { company, ...localized } = experience[key];
      return {
        id: key,
        ...job,
        ...localized,
        tags: localized.tags ?? job.tags,
        company: company ?? job.company ?? "",
      };
    }),
    projects: PROJECTS.map(({ key, ...project }) => ({
      ...project,
      ...projects[key],
    })),
  };
}

const PROFILES: Record<Locale, Profile> = {
  en: buildProfile(en),
  es: buildProfile(es),
  pt: buildProfile(pt),
};

export const getProfile = (locale: Locale): Profile => PROFILES[locale];
