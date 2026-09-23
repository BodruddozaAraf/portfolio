"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { EASE, easeJournal } from "./motion";

// The one place GSAP is set up. Import gsap, ScrollTrigger and useGSAP from here so the plugins
// and the journal ease are always registered before use.

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText);
  CustomEase.create(EASE, easeJournal.join(","));
  gsap.defaults({ ease: EASE });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
