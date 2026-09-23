"use client";

import { Eye } from "@phosphor-icons/react/ssr";
import { Icon } from "@/components/ui/Icon";
import { DEAD_EYE_EVENT } from "./DeadEye";

// The footer's quiet way into Dead Eye (the other is the E key). Easy to miss, never hidden
// from assistive tech: a real button with a name.

export function DeadEyeButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(DEAD_EYE_EVENT))}
      className="dead-eye-button text-paper-light/45 hover:text-ember-glow ease-journal inline-flex size-9 items-center justify-center transition-colors duration-(--dur-hover)"
    >
      <Icon icon={Eye} size={18} />
      <span className="sr-only">Dead Eye</span>
    </button>
  );
}
