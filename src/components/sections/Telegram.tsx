import {
  Envelope,
  FilePdf,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { microcopy, profile } from "@/content";
import { ChapterTitle } from "./ChapterTitle";

// 9. Telegram Office. Phase 1 ships the no-JS path first: a plain mailto that always works, and
// the direct links. The telegram form (compose in Gmail or the visitor's mail app, D19) is step
// 1.9. No phone number, ever (D4).

export function Telegram() {
  const { email, github, linkedin, resume } = profile.links;
  const direct = [
    { ...email, text: profile.email, icon: Envelope },
    { ...github, text: "github.com/BodruddozaAraf", icon: GithubLogo },
    {
      ...linkedin,
      text: "linkedin.com/in/bodruddoza-araf",
      icon: LinkedinLogo,
    },
    { ...resume, text: "Resume (PDF)", icon: FilePdf },
  ];
  const subject = microcopy.telegram.subject.replace("{name}", "a visitor");
  return (
    <section
      id="send-word"
      aria-labelledby="send-word-title"
      className="chapter shell"
    >
      <ChapterTitle id="send-word-title">Telegram Office</ChapterTitle>
      <div className="paper-light shadow-pinned max-w-3xl rotate-[0.3deg] px-6 py-10 md:px-12 md:py-14">
        <p className="font-type text-h4 leading-snug uppercase">
          {microcopy.telegram.heading}
        </p>
        <div className="border-ink/40 mt-8 border-t border-dashed pt-8">
          <Button
            href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`}
            icon={<Icon icon={Envelope} />}
          >
            {microcopy.telegram.cta}
          </Button>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {direct.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="group hover:text-blood inline-flex items-center gap-3 break-all"
                  >
                    <Icon icon={link.icon} size={22} className="shrink-0" />
                    <span className="decoration-ink/40 group-hover:decoration-blood underline underline-offset-[0.22em]">
                      {link.text}
                    </span>
                    {external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
