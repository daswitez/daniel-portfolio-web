import styles from "./StatusDot.module.css";

/** Green "available" indicator. */
export function StatusDot() {
  return <span className={styles.dot} aria-hidden="true" />;
}
