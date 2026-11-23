import type { StackGroup } from "@/types/profile";
import styles from "./content.module.css";

export function StackGrid({ groups }: { groups: readonly StackGroup[] }) {
  return (
    <div className={styles.stackGrid}>
      {groups.map((group) => (
        <div key={group.name} className={styles.stackGroup}>
          <h4>{group.name}</h4>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
