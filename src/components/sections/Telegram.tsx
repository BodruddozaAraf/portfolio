import {
  Envelope,
  FilePdf,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/ssr";
import { TelegramForm } from "@/components/contact/TelegramForm";
import { Icon } from "@/components/ui/Icon";
import { microcopy, profile } from "@/content";
import { resumeAvailable } from "@/lib/public-files";
import { ChapterTitle } from "./ChapterTitle";

// 9. Telegram Office. The telegram form composes the message in Gmail or the visitor's own mail
// app (D19); the direct links below it, email included, work without JavaScript. No phone
// number, ever (D4).

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
    ...(resumeAvailable
      ? [{ ...resume, text: "Resume (PDF)", icon: FilePdf }]
      : []),
  ];
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
          <TelegramForm subjectTemplate={microcopy.telegram.subject} />
          <noscript>
            <p className="mt-6">
              Without JavaScript the form cannot compose your telegram; write
              straight to{" "}
              <a
                href={`mailto:${profile.email}`}
                className="underline underline-offset-[0.22em]"
              >
                {profile.email}
              </a>
              .
            </p>
          </noscript>
          <h3 className="font-note text-h4 text-ink-soft mt-12">
            Or find him direct
          </h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
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
