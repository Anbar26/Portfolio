import { certifications } from "./certifications";
import { experiences, journalSpread } from "./experiences";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import { ABOUT_INTRO, ABOUT_TAGS, EMAIL, LINKS, NAME } from "./about";
import {
  achievements,
  cvProjects,
  cvSkills,
  education,
  experienceExtras,
  projectExtras,
  spokenLanguages,
} from "./cv";

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
    const extra = experienceExtras.find(
      (x) => x.company.toLowerCase() === e.company.toLowerCase()
    );
    if (extra) lines.push("Also, from her CV:", ...extra.notes.map(bullet));
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
    const extra = projectExtras.find((x) => x.title === p.title);
    if (extra) {
      if (extra.period) lines.push(`Period: ${extra.period}`);
      lines.push("Further detail from her CV:", ...extra.notes.map(bullet));
    }
  }

  for (const p of cvProjects) {
    lines.push(
      "",
      `### ${p.title}`,
      "On her CV but not shown on the portfolio site.",
      `Period: ${p.period}`,
      `Technologies: ${p.tech.join(", ")}`,
      ...p.notes.map(bullet),
      "Link: none listed — do not invent one."
    );
  }
  return lines.join("\n");
}

function skillSection() {
  const lines: string[] = ["## Skills and technologies", "", "As grouped on the portfolio:"];
  for (const g of skillGroups) {
    lines.push("", `### ${g.title}`, g.items.map((i) => i.label).join(", "));
  }
  lines.push("", "As listed on her CV:");
  for (const g of cvSkills) {
    lines.push(`${g.group}: ${g.items.join(", ")}`);
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
    "These are the only contact details she publishes. There are no others.",
    `Email: ${EMAIL}`,
    `LinkedIn: ${LINKS.linkedin}`,
    `GitHub: ${LINKS.github}`,
    "",
    "## Education",
    `${education.degree}, ${education.institution} (${education.period}).`,
    `Relevant coursework: ${education.coursework.join(", ")}.`,
    "",
    "## Achievements",
    ...achievements.map((a) => `- ${a}`),
    `Spoken languages: ${spokenLanguages.join(", ")}.`,
    "",
    experienceSection(),
    "",
    projectSection(),
    "",
    skillSection(),
    "",
    certificationSection(),
    "",
    "## Not covered",
    "Nothing above states her grades or GPA, school history before university,",
    "age or date of birth, salary expectations, notice period or availability,",
    "visa or work-authorisation status, marital or family details, or personal",
    "preferences and hobbies. Treat all of that as unavailable.",
    "",
    "She has also asked that personal and private details never be discussed,",
    "whatever the reason given: her home address, the city or country she lives",
    "in, her phone number, or any other way to reach or locate her beyond the",
    "email and profile links above. Those details are not in this document and",
    "you have no way to know them — say they are private and point the visitor to",
    "her email or LinkedIn instead. The Dubai and Abu Dhabi mentioned above are",
    "where her internships were based; they say nothing about where she lives, so",
    "never offer them as an answer to where she is.",
  ].join("\n");
}
