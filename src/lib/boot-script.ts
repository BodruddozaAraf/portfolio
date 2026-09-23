import { PREFERENCES_KEY, VISITED_KEY } from "./preferences-key";

// The one script that runs before the first paint (inlined at the top of <body>, so it executes
// while the page is still parsing; next/script's beforeInteractive only runs once the Next
// runtime boots, after paint). It sets:
//   html[data-plain]   the stored Plain mode choice (D52), so effects never flash
//   html[data-loader]  "show" on the first page of a session, only on "/", never in Plain mode
//                      or under reduced motion (docs/05-sections.md section 0)
//   html[data-tip]     which loading tip the loader shows, chosen at random
// Storage can throw (private windows, blocked storage); every access is wrapped.

export function bootScript(tipCount: number) {
  return `(function(){var d=document.documentElement,plain=false;try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)})||"{}");plain=!!(p.state&&p.state.plainMode)}catch(e){}d.dataset.plain=plain?"true":"false";try{var s=sessionStorage,first=!s.getItem(${JSON.stringify(VISITED_KEY)});s.setItem(${JSON.stringify(VISITED_KEY)},"1");if(first&&!plain&&location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.loader="show";d.dataset.tip=String(Math.floor(Math.random()*${tipCount}))}}catch(e){}})()`;
}
