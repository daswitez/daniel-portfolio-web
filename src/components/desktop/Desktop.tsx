import { DeskZoom } from "@/components/story/DeskZoom";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { AppLauncher } from "./AppLauncher";
import { DesktopIcons } from "./DesktopIcons";
import { DesktopSurface } from "./DesktopSurface";
import { Hero } from "./Hero";
import styles from "./Desktop.module.css";

/** Hero section: a Mac-style desktop with widgets, folders, apps and windows. */
export function Desktop() {
  return (
    <section id="home" className={styles.heroSection}>
      <DesktopSurface>
        <WidgetGrid />
        <Hero />
        <DesktopIcons />
        <AppLauncher />
      </DesktopSurface>
      {/* The laptop's base, revealed by DeskZoom as the desk shrinks into a screen. */}
      <div className={styles.laptopBase} data-laptop-base aria-hidden="true" />
      <DeskZoom />
    </section>
  );
}
