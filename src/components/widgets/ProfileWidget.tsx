import Image from "next/image";
import type { Profile } from "@/types/profile";
import { Widget } from "./Widget";
import styles from "./widgets.module.css";

/** Square tile with your portrait; falls back to your initials when there's no photo. */
export function ProfileWidget({
  name,
  initials,
  photo,
}: Pick<Profile, "name" | "initials" | "photo">) {
  if (!photo) {
    return (
      <Widget className={styles.initials} aria-hidden="true">
        {initials}
      </Widget>
    );
  }

  return (
    <Widget className={styles.photo}>
      <Image
        src={photo.src}
        alt={name}
        fill
        sizes="160px"
        preload
        draggable={false}
        className={styles.photoImage}
      />
    </Widget>
  );
}
