// Transition types for route changes (React <ViewTransition>, see src/components/fx/PageTurn.tsx).
// A link deeper into the journal turns the page forward; a link back to it turns it back.
// Untyped navigations (browser back and forward) do not turn the page.
export const TURN_FORWARD = ["page-forward"];
export const TURN_BACK = ["page-back"];
