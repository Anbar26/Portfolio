/**
 * Certification content. Moved verbatim out of Home.tsx when the section was
 * rebuilt as a scroll-driven conveyor — the data itself is unchanged.
 */
export const certifications = [
  {
    name: "Microsoft AI & ML Engineering Professional Certificate",
    issuer: "Microsoft",
    logo: "/logos/microsoft-mark.png",
    date: "3 of 5 courses · 2025–2026",
    status: "In Progress",
    description:
      "Professional certificate covering the foundations and practice of AI/ML engineering — from core algorithms to building intelligent agents and deploying ML on Azure.",
    skills: ["Machine Learning", "AI Engineering", "Microsoft Azure"],
    courses: [
      { name: "Foundations of AI and Machine Learning", href: "/certificates/ms-foundations-ai-ml.pdf" },
      { name: "AI and Machine Learning Algorithms and Techniques", href: "/certificates/ms-ai-ml-algorithms.pdf" },
      { name: "Building Intelligent Troubleshooting Agents", href: "/certificates/ms-troubleshooting-agents.pdf" },
      { name: "Microsoft Azure for AI and Machine Learning (ongoing)" },
    ] as { name: string; href?: string }[],
    credential: "",
    /** Flat wash for the reverse of the card. */
    tint: "#e6eaff",
    accent: "from-indigo-200 to-indigo-100",
    dot: "bg-indigo-500",
  },
  {
    name: "Generative AI for Data Scientists Specialization",
    issuer: "IBM",
    logo: "/logos/ibm.svg",
    date: "June 15, 2026",
    status: "Completed",
    description:
      "Specialization on applying generative AI to data science — from core concepts and applications to prompt engineering and career-focused techniques.",
    skills: [
      "Generative AI",
      "Prompt Engineering",
      "GANs",
      "Exploratory Data Analysis",
      "Responsible AI",
      "Data Science",
    ],
    courses: [
      { name: "Generative AI: Introduction and Applications" },
      { name: "Generative AI: Prompt Engineering Basics" },
      { name: "Generative AI: Elevate Your Data Science Career" },
    ] as { name: string; href?: string }[],
    credential: "/certificates/generative-ai-for-data-scientists.pdf",
    /** Flat wash for the reverse of the card. */
    tint: "#e2f2fd",
    accent: "from-sky-200 to-sky-100",
    dot: "bg-sky-500",
  },
  {
    name: "Google Data Analytics Professional Certificate",
    issuer: "Google",
    logo: "/logos/google.png",
    date: "4 of 8 courses · 2026",
    status: "In Progress",
    description:
      "Google's professional certificate in data analytics — covering the analysis process, asking effective questions, and preparing, cleaning, and processing data for exploration.",
    skills: [
      "Data Analysis",
      "Data Cleaning",
      "Spreadsheets",
      "SQL",
      "Data-Driven Decisions",
    ],
    courses: [
      { name: "Foundations: Data, Data, Everywhere", href: "/certificates/gda-foundations.pdf" },
      { name: "Ask Questions to Make Data-Driven Decisions", href: "/certificates/gda-ask-questions.pdf" },
      { name: "Prepare Data for Exploration", href: "/certificates/gda-prepare-data.pdf" },
      { name: "Process Data from Dirty to Clean", href: "/certificates/gda-process-data.pdf" },
    ] as { name: string; href?: string }[],
    credential: "",
    /** Flat wash for the reverse of the card. */
    tint: "#e1ebfd",
    accent: "from-blue-200 to-blue-100",
    dot: "bg-blue-500",
  },
  {
    name: "Kafka Fundamentals",
    issuer: "LearnKartS",
    logo: "/logos/learnkarts.webp",
    date: "June 20, 2026",
    status: "Completed",
    description:
      "Fundamentals of Apache Kafka — building real-time, event-driven data pipelines for distributed streaming and processing.",
    skills: [
      "Apache Kafka",
      "Event-Driven Programming",
      "Real-Time Data",
      "Distributed Computing",
      "Data Pipelines",
    ],
    courses: [] as { name: string; href?: string }[],
    credential: "/certificates/kafka-fundamentals.pdf",
    /** Flat wash for the reverse of the card. */
    tint: "#dcf5ea",
    accent: "from-emerald-200 to-emerald-100",
    dot: "bg-emerald-500",
  },
  {
    name: "Ethics in Engineering",
    issuer: "University of Michigan",
    logo: "/logos/michigan.png",
    date: "August 29, 2025",
    status: "Completed",
    description:
      "Course on ethical reasoning and decision-making in engineering — examining professional responsibility and real-world ethical dilemmas.",
    skills: ["Engineering Ethics", "Professional Responsibility", "Decision-Making"],
    courses: [] as { name: string; href?: string }[],
    credential: "/certificates/ethics-in-engineering.pdf",
    /** Flat wash for the reverse of the card. */
    tint: "#fdf1d8",
    accent: "from-amber-200 to-amber-100",
    dot: "bg-amber-500",
  },
  {
    name: "Introduction to Front-End Development",
    issuer: "Meta",
    logo: "/logos/meta.webp",
    date: "May 13, 2024",
    status: "Completed",
    description:
      "Meta's introduction to front-end web development — covering HTML, CSS, responsive design, and the core technologies behind modern web interfaces.",
    skills: ["HTML", "CSS", "Responsive Design", "Web Development"],
    courses: [] as { name: string; href?: string }[],
    credential: "/certificates/intro-to-front-end-development.pdf",
    /** Flat wash for the reverse of the card. */
    tint: "#eee9fe",
    accent: "from-violet-200 to-violet-100",
    dot: "bg-violet-500",
  },
  {
    name: "Digital Marketing Specialization",
    issuer: "University of Illinois Urbana-Champaign",
    logo: "/logos/illinois.svg",
    date: "October 31, 2025",
    status: "Completed",
    description:
      "Six-course specialization on modern digital marketing — from foundational strategy and emerging media to data, platforms, customer engagement, and data-driven implementation (completed with honors).",
    skills: ["Digital Marketing", "Marketing Strategy", "Data-Driven Strategy", "Customer Engagement"],
    courses: [
      { name: "The Digital Marketing Revolution", href: "/certificates/dm-revolution.pdf" },
      { name: "Marketing in a Digital World", href: "/certificates/dm-marketing-digital-world.pdf" },
      { name: "Digital Marketing: Platforms, Data, and Technologies", href: "/certificates/dm-platforms-data-tech.pdf" },
      { name: "Digital Marketing: Customer Engagement Strategy", href: "/certificates/dm-customer-engagement.pdf" },
      { name: "Digital Marketing Strategy: Navigating Emerging Media and AI", href: "/certificates/dm-strategy-emerging-media-ai.pdf" },
      { name: "Digital Marketing Implementation: Executing Strategies in a Connected, Data-Driven World", href: "/certificates/dm-implementation.pdf" },
    ] as { name: string; href?: string }[],
    credential: "",
    /** Flat wash for the reverse of the card. */
    tint: "#ffe7ea",
    accent: "from-rose-200 to-rose-100",
    dot: "bg-rose-500",
  },
];

export type CertItem = (typeof certifications)[number];

export function monogram(issuer: string) {
  return issuer.trim().charAt(0).toUpperCase();
}

/**
 * Display-length issuer for the conveyor caption, where a 40-character name
 * would run off the edge at 3rem. Derived from the issuer itself — no separate
 * label to keep in sync.
 */
export function shortIssuer(issuer: string) {
  return issuer
    .replace(/^University of\s+/i, "")
    .replace(/\s+Urbana-Champaign$/i, "")
    .trim();
}
