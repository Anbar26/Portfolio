import { certifications } from "./certifications";
import { experiences, journalSpread } from "./experiences";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { ABOUT_INTRO, ABOUT_TAGS, EMAIL, LINKS, NAME } from "./about";

/**
 * The assistant's entire world.
 *
 * Built from the same modules the portfolio renders, so there is one source of
 * truth: change a project description and the assistant's answer changes with
 * it. Nothing is restated here — this file only reformats.
 *
 * The corpus is small enough (a few KB) to hand to the model whole, which is
 * why there is no retrieval step. Every fact the model can state is in front of
 * it, and the system prompt forbids going beyond it.
 */

/*
 * SEEF Foundation is deliberately included WITHOUT its `achievements` bullets.
 *
 * Those three lines — research on neural network architectures, "Published 3
 * papers in top-tier AI conferences", cross-functional AI product work — sit on
 * a Web Developer role tagged React/JavaScript/Next.js/Bootstrap, and read as
 * template placeholder text rather than anything about this job. They are not
 * rendered anywhere on the site today, so feeding them to the assistant would
 * publish those claims for the first time, through a bot whose whole promise is
 * that it does not invent things. The role, employer, dates and tools are
 * factual and are kept.
 *
 * If the bullets are real, drop this exception and they flow through.
 */
const UNVERIFIED_ACHIEVEMENTS = new Set(["SEEF Foundation"]);

const bullet = (s: string) => `  - ${s}`;

function experienceSection() {
  const lines: string[] = ["## Experience and internships"];
  for (const e of experiences) {
    lines.push(
      "",
      `### ${e.title} — ${e.company}`,
      `Period: ${e.period}`,
      `Location: ${e.location}`,
      `Technologies: ${e.tags.join(", ")}`
    );
    if (!UNVERIFIED_ACHIEVEMENTS.has(e.company)) {
      lines.push("What she did:", ...e.achievements.map(bullet));
    }
  }

  // The journal spread words two of these differently on the page; include its
  // phrasing so the assistant can echo what a visitor actually sees.
  lines.push("", "### How the Experience section describes these roles");
  for (const p of journalSpread) {
    lines.push(
      "",
      `${p.company} (${p.role}, ${p.period}, ${p.location}): ${p.lede}`,
      ...p.notes.map(bullet)
    );
  }
  return lines.join("\n");
}

function projectSection() {
  const lines: string[] = ["## Projects"];
  for (const p of projects) {
    lines.push(
      "",
      `### ${p.title} (${p.tag})`,
      p.description,
      `Technologies: ${p.tags.join(", ")}`,
      p.href && p.href !== "#"
        ? `Link: ${p.href}`
        : "Link: none published in the portfolio — do not invent one."
    );
  }
  return lines.join("\n");
}

function skillSection() {
  const lines: string[] = ["## Skills and technologies"];
  for (const g of skillGroups) {
    lines.push("", `### ${g.title}`, g.items.map((i) => i.label).join(", "));
  }
  return lines.join("\n");
}

function certificationSection() {
  const lines: string[] = ["## Certifications"];
  for (const c of certifications) {
    lines.push(
      "",
      `### ${c.name}`,
      `Issuer: ${c.issuer}`,
      `Date: ${c.date}`,
      `Status: ${c.status}`,
      c.description,
      `Skills covered: ${c.skills.join(", ")}`,
      `Courses: ${c.courses.map((x) => x.name).join("; ")}`
    );
    if (c.credential) lines.push(`Credential: ${c.credential}`);
  }
  return lines.join("\n");
}

/** The full grounding document handed to the model on every request. */
export function buildKnowledgeBase(): string {
  return [
    `# Portfolio and CV of ${NAME}`,
    "",
    "## About",
    ABOUT_INTRO,
    `Interests and focus areas: ${ABOUT_TAGS.join(", ")}`,
    "",
    "## Contact",
    `Email: ${EMAIL}`,
    `LinkedIn: ${LINKS.linkedin}`,
    `GitHub: ${LINKS.github}`,
    "",
    experienceSection(),
    "",
    projectSection(),
    "",
    skillSection(),
    "",
    certificationSection(),
    "",
    "## Not covered by this portfolio",
    "The portfolio does not state which university she attends, her degree",
    "title, graduation year, grades, school history, age, location of residence,",
    "nationality, salary expectations, availability, or personal preferences and",
    "hobbies. The only education-related statement anywhere is that she is a",
    "Computer Science student focused on AI & Machine Learning. Treat everything",
    "else in that list as unavailable.",
  ].join("\n");
}
