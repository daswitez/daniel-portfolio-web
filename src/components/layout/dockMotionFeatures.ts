// Motion's animation + layout engine, split into its own chunk so it loads after the
// page is interactive (see LazyMotion in Dock.tsx). domMax: the dock needs layout animations.
import { domMax } from "motion/react";

export default domMax;
