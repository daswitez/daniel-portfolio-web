import type { Profile } from "@/types/profile";
import styles from "./content.module.css";

export function AboutContent({ bio, facts }: Pick<Profile, "bio" | "facts">) {
  return (
    <div className={styles.bio}>
      {bio.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
