/**
 * The About copy, lifted out of Home.tsx so the page and the portfolio
 * assistant read from the same place. The wording is unchanged.
 *
 * Anything the assistant is allowed to say about Anbar has to be traceable to a
 * file like this one, `experiences.ts`, `projects.ts`, `skills.ts` or
 * `certifications.ts` — see `knowledge.ts`.
 */

export const NAME = "Anbar Althaf";
export const EMAIL = "anbaralthaf26@gmail.com";

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/anbaralthaf/",
  github: "https://github.com/Anbar26",
};

/** The paragraph shown in the About overlay. */
export const ABOUT_INTRO =
  "I'm a Computer Science student focused on AI & Machine Learning. I spend most of my time on feature pipelines, data infrastructure, and how systems hold up once they're running. That's where I've found the interesting problems tend to live.";

/** The interest tags shown under the About paragraph. */
export const ABOUT_TAGS = [
  "Machine Learning",
  "Deep Learning",
  "AI Systems",
  "Data",
  "Research",
];
