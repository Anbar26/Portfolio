/**
 * Experience content. Lifted verbatim out of Home.tsx when the section was
 * rebuilt as the journal spread — the facts, wording, dates and logos are
 * unchanged.
 */
export const experiences = [
  {
    title: "ML Intern",
    company: "TENDERD",
    period: "May 2026 – Jul 2026",
    location: "Dubai | UAE",
    logo: "/tenderd-logo.webp",
    side: "left" as const,
    tags: ["Python", "MongoDB", "Data Engineering", "Computer Vision"],
    achievements: [
      "Built an automated weekly operations reporting pipeline aggregating 58M+ MongoDB records across productivity, emissions, safety, and ignition domains, outputting structured JSON and Markdown summaries",
      "Engineered aggregation pipelines and a violation classification system mapping 55 raw event types into 6 severity-weighted categories, processing 1.5M+ weekly safety events across a fleet telematics platform",
      "Assisted in QA validation for camera-based safety violation detection, verifying accuracy of collision warnings and driver attention alerts across fleet devices",
    ],
  },
  {
    title: "AI and Backend Intern",
    company: "PointMatrix IT Solutions",
    period: "May 2025 – Jul 2025",
    location: "Abu Dhabi | UAE",
    logo: "/pointmatrix-logo.jpeg",
    side: "right" as const,
    tags: ["Flask", "MySQL", "Pandas", "REST APIs", "Java"],
    achievements: [
      "Developed an AI-powered chatbot using Flask, MySQL, Pandas, and REST APIs to enable natural language queries on fleet telemetry data, integrating live vehicle and database info for accurate, real-time responses",
      "Automated client reporting and data retrieval, cutting support tickets by over 60% and providing 24/7 self-service access to fleet insights via an intuitive web interface",
      "Converted and optimized a GV300 GPS tracker decoder from PHP to Java, improving performance and maintainability; parsed TCP/IP packets into structured telemetry for real-time fleet monitoring",
    ],
  },
  {
    title: "Web Developer",
    company: "SEEF Foundation",
    period: "August 2024 – December 2024",
    location: "Freelance",
    logo: "/seef-logo.png",
    side: "left" as const,
    tags: ["React.js", "Javacript", "Next.js", "Bootstrap"],
    achievements: [
      "Conducted research on novel neural network architectures",
      "Published 3 papers in top-tier AI conferences",
      "Collaborated with cross-functional teams on AI product features",
    ],
  },
];

export type ExperienceItem = (typeof experiences)[number];

/**
 * A journal page.
 *
 * `lede` and `notes` are condensed retellings of the `achievements` above —
 * a spread is read at a glance, and the full paragraphs would swamp the page.
 * Nothing here states anything the entry above does not; the numbers, tools and
 * dates are carried across unchanged.
 *
 * `photo` is the decorative frame the company logo is pinned inside, and its
 * placement lives with the layout rather than here.
 */
export type JournalPage = {
  company: string;
  role: string;
  period: string;
  location: string;
  logo: string;
  logoAlt: string;
  lede: string;
  notes: string[];
  tools: string[];
};

/**
 * The spread currently on show: one experience per page, matching the two
 * frames in the design. SEEF Foundation is still in `experiences` above and is
 * waiting on a second spread — it needs the page turn to be reachable.
 */
export const journalSpread: JournalPage[] = [
  {
    company: "Tenderd",
    role: "ML Intern",
    period: "May – Jul 2026",
    location: "Dubai, UAE",
    logo: "/tenderd-logo.webp",
    logoAlt: "Tenderd",
    lede:
      "Weekly operations reporting for a fleet telematics platform — 58M+ MongoDB records aggregated into structured JSON and Markdown summaries.",
    notes: [
      "Aggregation pipelines across productivity, emissions, safety and ignition",
      "Violation classifier mapping 55 raw event types into 6 severity-weighted categories — 1.5M+ safety events a week",
      "QA validation for camera-based detection: collision warnings, driver attention",
    ],
    tools: ["Python", "MongoDB", "Data Engineering", "Computer Vision"],
  },
  {
    company: "PointMatrix",
    role: "AI & Backend Intern",
    period: "May – Jul 2025",
    location: "Abu Dhabi, UAE",
    logo: "/pointmatrix-logo.jpeg",
    logoAlt: "PointMatrix IT Solutions",
    lede:
      "An AI chatbot that answers plain-language questions about live fleet telemetry, wired straight into the vehicle and database layer.",
    notes: [
      "Automated client reporting — support tickets down 60%+, self-service around the clock",
      "Rewrote a GV300 GPS decoder from PHP to Java, parsing TCP/IP packets into structured telemetry",
    ],
    tools: ["Flask", "MySQL", "Pandas", "REST APIs", "Java"],
  },
];
