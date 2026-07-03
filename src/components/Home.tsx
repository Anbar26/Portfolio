"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/all";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
import { Mail, Github, Linkedin, Check, ExternalLink } from "lucide-react";
import AnbarAlthafLogo from "./AnbarAlthafLogo";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center mb-14">
      <h2 className="font-[family-name:var(--font-dirtyline)] text-3xl md:text-4xl text-[#5c1a2e] tracking-wide">
        {title}
      </h2>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-400/70" />
        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-400/70" />
      </div>
    </div>
  );
}



const experiences = [
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
    accent: {
      pill: "bg-amber-50 border-amber-200 text-amber-800",
      pillDot: "bg-amber-500",
      number: "text-amber-300",
      icon: "bg-amber-50 border-amber-200 text-amber-600 group-hover:bg-amber-100",
      dot: "bg-amber-400 shadow-amber-300/50",
      ping: "bg-amber-300/30",
      glow: "group-hover:bg-amber-200/40",
      tag: "bg-amber-50/80 border-amber-200 text-amber-800",
      readMore: "text-amber-600 group-hover:text-amber-800",
    },
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
    accent: {
      pill: "bg-teal-50 border-teal-200 text-teal-800",
      pillDot: "bg-teal-500",
      number: "text-teal-300",
      icon: "bg-teal-50 border-teal-200 text-teal-600 group-hover:bg-teal-100",
      dot: "bg-teal-400 shadow-teal-300/50",
      ping: "bg-teal-300/30",
      glow: "group-hover:bg-teal-200/40",
      tag: "bg-teal-50/80 border-teal-200 text-teal-800",
      readMore: "text-teal-600 group-hover:text-teal-800",
    },
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
    accent: {
      pill: "bg-violet-50 border-violet-200 text-violet-800",
      pillDot: "bg-violet-500",
      number: "text-violet-300",
      icon: "bg-violet-50 border-violet-200 text-violet-600 group-hover:bg-violet-100",
      dot: "bg-violet-400 shadow-violet-300/50",
      ping: "bg-violet-300/30",
      glow: "group-hover:bg-violet-200/40",
      tag: "bg-violet-50/80 border-violet-200 text-violet-800",
      readMore: "text-violet-600 group-hover:text-violet-800",
    },
  },
];

type ExperienceItem = (typeof experiences)[number];

function ExperienceCard({
  job,
  index,
  isActive,
  onActivate,
}: {
  job: ExperienceItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const haloX = useSpring(rawX, { stiffness: 90, damping: 20, mass: 0.4 });
  const haloY = useSpring(rawY, { stiffness: 90, damping: 20, mass: 0.4 });
  const blobX = useSpring(rawX, { stiffness: 50, damping: 14, mass: 0.6 });
  const blobY = useSpring(rawY, { stiffness: 50, damping: 14, mass: 0.6 });

  const onMouseMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(e.clientX - r.left);
    rawY.set(e.clientY - r.top);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      onMouseEnter={onActivate}
      onMouseMove={onMouseMove}
      onClick={onActivate}
      transition={{ layout: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }}
      className={`relative overflow-hidden rounded-3xl border cursor-pointer transition-colors duration-500 ${
        isActive
          ? "border-rose-300 bg-white shadow-2xl shadow-rose-200/50"
          : "border-rose-100 bg-white/55 hover:bg-white hover:border-rose-200"
      }`}
    >
      {/* Cursor halo — visible when active */}
      <motion.div
        className={`absolute pointer-events-none rounded-full blur-3xl transition-opacity duration-500 ${
          isActive ? "opacity-60" : "opacity-0"
        }`}
        style={{
          width: 520,
          height: 520,
          left: haloX,
          top: haloY,
          x: -260,
          y: -260,
          background: "radial-gradient(circle, rgba(251,113,133,0.45), transparent 65%)",
        }}
      />

      {/* Drifting decorative blob — top right */}
      <motion.div
        className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isActive ? "opacity-90" : "opacity-40"
        } ${job.accent.glow.replace("group-hover:", "")}`}
        style={{ x: blobX, y: blobY }}
      />

      {/* Vertical accent stripe */}
      <div
        className={`absolute top-0 left-0 h-full w-1.5 ${job.accent.pillDot} transition-opacity duration-500 ${
          isActive ? "opacity-100" : "opacity-30"
        }`}
      />

      {/* Giant background number */}
      <span
        className={`absolute font-serif font-bold leading-none select-none pointer-events-none transition-all duration-500 ${
          isActive
            ? "right-8 bottom-4 text-[12rem] opacity-[0.07]"
            : "right-6 top-1/2 -translate-y-1/2 text-[5rem] opacity-[0.06]"
        } ${job.accent.number}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative p-7 md:p-9">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-5">
            <div
              className={`w-14 h-14 rounded-2xl border border-rose-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5 shadow-sm transition-transform duration-500 ${
                isActive ? "scale-110" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-[family-name:var(--font-dirtyline)] text-3xl text-[#5c1a2e] leading-tight">
                {job.title}
              </h3>
              <p className="text-[#5c1a2e]/85 text-base font-medium mt-1">{job.company}</p>
              <p className="text-rose-500/75 text-sm mt-0.5">{job.location}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-medium ${job.accent.pill}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${job.accent.pillDot}`} />
              {job.period}
            </span>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mt-10 grid md:grid-cols-[1.4fr_1fr] gap-10"
            >
              <div>
                <p className="text-rose-400/70 text-[10px] tracking-[0.35em] uppercase font-medium mb-5">
                  ✦ What I worked on
                </p>
                <ul className="space-y-3.5">
                  {job.achievements.map((a, ai) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + ai * 0.07, duration: 0.4 }}
                      className="flex items-start gap-3 text-[#5c1a2e]/80 text-[15px] leading-relaxed"
                    >
                      <span
                        className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${job.accent.pillDot}`}
                      />
                      <span>{a}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-rose-400/70 text-[10px] tracking-[0.35em] uppercase font-medium mb-5">
                  ✦ Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((t, ti) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.32 + ti * 0.06, type: "spring", stiffness: 280, damping: 20 }}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-medium ${job.accent.tag}`}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-rose-100">
                  <p className="text-rose-400/70 text-[10px] tracking-[0.35em] uppercase font-medium mb-3">
                    ✦ Period
                  </p>
                  <p className="text-[#5c1a2e]/85 text-sm font-medium">{job.period}</p>
                  <p className="text-rose-500/75 text-sm font-light mt-1">{job.location}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ExperienceTimeline() {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="relative space-y-4">
        <p className="text-rose-400/60 text-[10px] tracking-[0.35em] uppercase font-light text-center mb-6">
          hover or tap to reveal
        </p>

        <div className="space-y-4">
          {experiences.map((job, i) => (
            <ExperienceCard
              key={job.company}
              job={job}
              index={i}
              isActive={active === i}
              onActivate={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const projects = [
  {
    title: "RedTeam AI",
    tag: "AI Security",
    description:
      "A CLI-first platform for red-teaming ML models. Adversarial attacks — FGSM, boundary, model extraction, prompt injection — run locally so the model never leaves your machine, while a FastAPI backend scores results, tracks history, and generates PDF audit reports.",
    tags: ["Python", "FastAPI", "PyTorch", "Next.js"],
    href: "#",
    accent: {
      panel: "from-rose-100 via-pink-50 to-white",
      dot: "bg-rose-400",
      number: "text-rose-300",
      tag: "bg-rose-50/80 border-rose-200 text-rose-800",
      blob: "bg-rose-200/50",
    },
  },
  {
    title: "Distill",
    tag: "Machine Learning",
    description:
      "A from-scratch model distillation pipeline that compresses a large LLM into one 10× smaller while retaining 90–95% of its performance — implementing knowledge distillation, attention transfer, and INT8/INT4 quantization by hand, no libraries hiding the work.",
    tags: ["PyTorch", "Transformers", "Quantization"],
    href: "#",
    accent: {
      panel: "from-amber-100 via-amber-50 to-white",
      dot: "bg-amber-400",
      number: "text-amber-300",
      tag: "bg-amber-50/80 border-amber-200 text-amber-800",
      blob: "bg-amber-200/50",
    },
  },
  {
    title: "Codebase Onboarding Agent",
    tag: "AI Agent",
    description:
      "A Chrome extension that adds an “Explain Repo” button to any GitHub page. An AI agent explores the codebase locally via Ollama and generates a full onboarding guide in a sidebar — nothing is ever sent to an external API.",
    tags: ["Python", "Ollama", "Chrome Extension"],
    href: "#",
    accent: {
      panel: "from-teal-100 via-teal-50 to-white",
      dot: "bg-teal-400",
      number: "text-teal-300",
      tag: "bg-teal-50/80 border-teal-200 text-teal-800",
      blob: "bg-teal-200/50",
    },
  },
  {
    title: "StreamPulse",
    tag: "Data Engineering",
    description:
      "A high-throughput real-time analytics engine ingesting 10,000+ events per second, built on Kafka, ClickHouse, and Redis with a live React dashboard. A dual-storage design serves sub-millisecond counters and historical queries at scale.",
    tags: ["Kafka", "ClickHouse", "Redis", "TypeScript"],
    href: "#",
    accent: {
      panel: "from-violet-100 via-violet-50 to-white",
      dot: "bg-violet-400",
      number: "text-violet-300",
      tag: "bg-violet-50/80 border-violet-200 text-violet-800",
      blob: "bg-violet-200/50",
    },
  },
  {
    title: "ScrapeStorm",
    tag: "Distributed Systems",
    description:
      "A distributed web scraper with a real-time control room. Define a job, launch a Kubernetes-autoscaled fleet of Playwright workers, and watch progress stream live over WebSocket from a React dashboard.",
    tags: ["FastAPI", "Kubernetes", "Playwright", "React"],
    href: "#",
    accent: {
      panel: "from-sky-100 via-sky-50 to-white",
      dot: "bg-sky-400",
      number: "text-sky-300",
      tag: "bg-sky-50/80 border-sky-200 text-sky-800",
      blob: "bg-sky-200/50",
    },
  },
  {
    title: "Toastmasters Speech Analysis",
    tag: "Research",
    description:
      "A data study of the Toastmasters World Championship finals that “watches” each speech — measuring pace, pauses, laughter, word choice, and emotional arc via Whisper transcription — to surface the habits that set champion speakers apart.",
    tags: ["Python", "Whisper", "Pandas"],
    href: "#",
    accent: {
      panel: "from-emerald-100 via-emerald-50 to-white",
      dot: "bg-emerald-400",
      number: "text-emerald-300",
      tag: "bg-emerald-50/80 border-emerald-200 text-emerald-800",
      blob: "bg-emerald-200/50",
    },
  },
  {
    title: "Maze Solver",
    tag: "Reinforcement Learning",
    description:
      "A reinforcement learning system where an agent learns to navigate a maze by trial and error, comparing Monte Carlo, SARSA, and Q-Learning side by side. An interactive web UI trains the agents and visualizes learned policies, trajectories, and convergence metrics in real time.",
    tags: ["Python", "FastAPI", "React", "TypeScript"],
    href: "https://github.com/Anbar26/Maze_Solver",
    accent: {
      panel: "from-indigo-100 via-indigo-50 to-white",
      dot: "bg-indigo-400",
      number: "text-indigo-300",
      tag: "bg-indigo-50/80 border-indigo-200 text-indigo-800",
      blob: "bg-indigo-200/50",
    },
  },
];

type ProjectItem = (typeof projects)[number];

function ProjectsShowcase() {
  const [active, setActive] = useState(0);
  const project: ProjectItem = projects[active];

  return (
    <div className="grid md:grid-cols-[0.9fr_1.3fr] gap-6 md:gap-10 items-start">
      {/* Left — clickable project list */}
      <div className="flex flex-col gap-2">
        {projects.map((p, i) => {
          const isActive = active === i;
          return (
            <button
              key={p.title}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={`group relative text-left rounded-2xl border px-5 py-4 transition-all duration-300 cursor-pointer ${
                isActive
                  ? "border-rose-300 bg-white shadow-lg shadow-rose-200/40"
                  : "border-rose-100 bg-white/50 hover:bg-white hover:border-rose-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-serif text-2xl font-bold leading-none transition-colors duration-300 ${
                    isActive ? "text-[#5c1a2e]/70" : "text-rose-300/70"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.accent.dot}`} />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#5c1a2e]/55 font-medium">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-dirtyline)] text-xl text-[#5c1a2e] leading-tight mt-1">
                    {p.title}
                  </h3>
                </div>
                {/* active indicator */}
                <span
                  className={`ml-auto text-rose-400 transition-all duration-300 ${
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                >
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right — preview panel */}
      <div className="relative md:sticky md:top-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${project.accent.panel} shadow-xl shadow-rose-100/50 p-8 md:p-10 min-h-[24rem] flex flex-col`}
          >
            {/* decorative glow */}
            <div
              className={`absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none ${project.accent.blob}`}
            />
            {/* giant index */}
            <span
              className={`absolute right-8 bottom-4 font-serif font-bold leading-none select-none pointer-events-none text-[11rem] opacity-[0.08] ${project.accent.number}`}
            >
              {String(active + 1).padStart(2, "0")}
            </span>

            <div className="relative flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <span className={`w-1.5 h-1.5 rounded-full ${project.accent.dot}`} />
                <span className="text-[10px] tracking-[0.35em] uppercase text-[#5c1a2e]/60 font-medium">
                  {project.tag}
                </span>
              </div>

              <h3 className="font-[family-name:var(--font-dirtyline)] text-4xl md:text-5xl text-[#5c1a2e] leading-tight">
                {project.title}
              </h3>

              <p className="text-[#5c1a2e]/75 text-[15px] leading-relaxed mt-5 max-w-xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-7">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-medium ${project.accent.tag}`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={project.href}
                className="group mt-auto pt-8 inline-flex items-center gap-2 text-[#5c1a2e] text-sm font-medium hover:gap-3 transition-all duration-300"
              >
                View project
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const certifications = [
  {
    name: "Microsoft AI & ML Engineering Professional Certificate",
    issuer: "Microsoft",
    logo: "/logos/microsoft.png",
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
    accent: "from-blue-200 to-blue-100",
    dot: "bg-blue-500",
  },
  {
    name: "Kafka Fundamentals",
    issuer: "LearnKartS",
    logo: "/logos/learnkarts.png",
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
    accent: "from-amber-200 to-amber-100",
    dot: "bg-amber-500",
  },
  {
    name: "Introduction to Front-End Development",
    issuer: "Meta",
    logo: "/logos/meta.jpg",
    date: "May 13, 2024",
    status: "Completed",
    description:
      "Meta's introduction to front-end web development — covering HTML, CSS, responsive design, and the core technologies behind modern web interfaces.",
    skills: ["HTML", "CSS", "Responsive Design", "Web Development"],
    courses: [] as { name: string; href?: string }[],
    credential: "/certificates/intro-to-front-end-development.pdf",
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
    accent: "from-rose-200 to-rose-100",
    dot: "bg-rose-500",
  },
];

type CertItem = (typeof certifications)[number];

function monogram(issuer: string) {
  return issuer.trim().charAt(0).toUpperCase();
}

function CertificationsSection() {
  const [openCert, setOpenCert] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const cert: CertItem | null = openCert !== null ? certifications[openCert] : null;

  useEffect(() => setMounted(true), []);

  // Body scroll lock while the detail modal is open
  useEffect(() => {
    document.body.style.overflow = openCert !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openCert]);

  // Esc to close
  useEffect(() => {
    if (openCert === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCert(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openCert]);

  return (
    <section id="certifications" className="relative py-24 overflow-hidden">
      <div className="gs-up"><SectionHeading title="Certifications" /></div>
      <p className="gs-up text-center text-rose-400/70 text-[11px] tracking-[0.3em] uppercase font-light -mt-10 mb-10">
        ↤  scroll past · click to view  ↦
      </p>

      {/* Hover stage — wheel events only captured here */}
      <div className="cert-stage relative mx-auto h-[28rem] w-full max-w-6xl select-none" style={{ perspective: "1000px" }}>

      {/* Cards row */}
      <ul className="cert-cards absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-80 m-0 p-0 list-none">
        {certifications.map((c, i) => (
          <li
            key={c.name}
            onClick={() => setOpenCert(i)}
            className={`cert-card absolute top-0 left-0 w-56 aspect-[9/16] rounded-2xl border border-white/70 bg-gradient-to-br ${c.accent} shadow-2xl shadow-rose-200/40 p-5 flex flex-col justify-between overflow-hidden cursor-pointer`}
          >
            {/* glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#5c1a2e]/60 font-medium">
                  {c.status}
                </span>
              </div>
            </div>

            {/* Issuer logo */}
            <div className="relative flex items-center justify-center flex-1 py-2">
              {c.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={c.logo}
                  alt={`${c.issuer} logo`}
                  className="w-full max-h-32 object-contain"
                />
              ) : (
                <span className="font-serif text-6xl font-bold text-[#5c1a2e]/70">
                  {monogram(c.issuer)}
                </span>
              )}
            </div>

            <div className="relative">
              <h3 className="text-base font-semibold leading-tight text-[#5c1a2e]">
                {c.name}
              </h3>
              <p className="text-[#5c1a2e]/60 text-[11px] mt-2 font-light leading-relaxed">
                {c.issuer}
              </p>
              <p className="text-[#5c1a2e]/40 text-[10px] mt-0.5 font-light tracking-widest">
                {c.date}
              </p>
            </div>
          </li>
        ))}
      </ul>

      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          className="cert-prev w-11 h-11 rounded-full bg-white/80 backdrop-blur border border-rose-200 text-[#5c1a2e] hover:bg-white hover:border-rose-400 hover:shadow-lg hover:shadow-rose-200/40 transition-all duration-300 flex items-center justify-center"
          aria-label="Previous certification"
        >
          ←
        </button>
        <span className="text-rose-400/70 text-[10px] tracking-[0.3em] uppercase font-light">hover · scroll · click</span>
        <button
          className="cert-next w-11 h-11 rounded-full bg-white/80 backdrop-blur border border-rose-200 text-[#5c1a2e] hover:bg-white hover:border-rose-400 hover:shadow-lg hover:shadow-rose-200/40 transition-all duration-300 flex items-center justify-center"
          aria-label="Next certification"
        >
          →
        </button>
      </div>

      {/* Detail modal — portaled to body to escape the ScrollSmoother transform */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {cert && (
              <motion.div
                className="fixed inset-0 z-[9999] flex min-h-full items-center justify-center p-4 md:p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-[#5c1a2e]/40 backdrop-blur-sm"
              onClick={() => setOpenCert(null)}
            />

            <motion.div
              className="relative my-auto w-full max-w-2xl rounded-[28px] border border-white/80 bg-gradient-to-b from-white to-rose-50/40 shadow-[0_30px_80px_-20px_rgba(92,26,46,0.45)] ring-1 ring-rose-100/60 overflow-hidden"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* accent wash */}
              <div className={`absolute -top-28 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${cert.accent} opacity-50`} />
              {/* top hairline accent */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cert.accent}`} />

              <button
                type="button"
                onClick={() => setOpenCert(null)}
                aria-label="Close"
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full border border-rose-200/80 bg-white/70 backdrop-blur text-[#5c1a2e]/70 text-sm hover:bg-white hover:text-[#5c1a2e] hover:border-rose-400 hover:rotate-90 transition-all duration-300 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="relative p-8 md:p-10">
                {/* Header */}
                <div className="flex items-start gap-5">
                  {cert.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cert.logo}
                      alt={`${cert.issuer} logo`}
                      className="h-16 w-28 flex-shrink-0 object-contain object-left"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-2xl flex-shrink-0 bg-gradient-to-br ${cert.accent} border border-white/70 shadow-sm flex items-center justify-center`}>
                      <span className="font-serif text-3xl font-bold text-[#5c1a2e]/80">
                        {monogram(cert.issuer)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 pr-10">
                    <p className="text-[11px] tracking-[0.3em] uppercase text-[#5c1a2e]/50 font-medium">
                      {cert.issuer}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#5c1a2e] leading-tight mt-1">
                      {cert.name}
                    </h3>
                  </div>
                </div>

                {/* Date + status */}
                <div className="flex items-center gap-3 mt-5 text-sm">
                  <span className="text-[#5c1a2e]/55 font-light">{cert.date}</span>
                  <span className={`inline-flex items-center gap-1.5 text-[#5c1a2e]/55`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cert.dot}`} />
                    {cert.status}
                  </span>
                </div>

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

                {/* Description */}
                {cert.description && (
                  <p className="text-[#5c1a2e]/75 text-[15px] leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {/* Skills */}
                {cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3.5 py-1.5 rounded-full border border-rose-200/80 bg-white/60 text-[11px] tracking-[0.15em] uppercase text-[#5c1a2e]/70 font-medium hover:border-rose-300 hover:bg-white transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sub-courses */}
                {cert.courses.length > 0 && (
                  <ul className="mt-7 space-y-2.5">
                    {cert.courses.map((course) =>
                      course.href ? (
                        <li key={course.name}>
                          <a
                            href={course.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 text-[#5c1a2e]/70 hover:text-[#5c1a2e] transition-colors text-[15px]"
                          >
                            <ExternalLink className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
                            {course.name}
                          </a>
                        </li>
                      ) : (
                        <li key={course.name} className="flex items-center gap-2.5 text-[#5c1a2e]/70 text-[15px]">
                          <ExternalLink className="w-4 h-4 text-rose-300" />
                          {course.name}
                        </li>
                      )
                    )}
                  </ul>
                )}

                {/* Credential link */}
                {cert.credential && (
                  <a
                    href={cert.credential}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#5c1a2e] hover:gap-3 transition-all"
                  >
                    View credential
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

const EMAIL = "anbaralthaf26@gmail.com";

export default function Home() {
  // Mobile island nav
  const [navOpen, setNavOpen] = useState(false);
  const navTlRef = useRef<gsap.core.Timeline | null>(null);

  // Contact — copy email to clipboard
  const [emailCopied, setEmailCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // About reveal overlay
  const [aboutOpen, setAboutOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const aboutTlRef = useRef<gsap.core.Timeline | null>(null);

  // Flower mouse parallax — floatier, more movement
  const flowerMouseX = useMotionValue(0);
  const flowerMouseY = useMotionValue(0);
  const smoothFlowerX = useSpring(flowerMouseX, { stiffness: 8, damping: 8, mass: 3 });
  const smoothFlowerY = useSpring(flowerMouseY, { stiffness: 8, damping: 8, mass: 3 });



  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // GSAP — full page scroll animation system
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {

      // ── Hero — plays on load, no scroll pin ──────────────────
      gsap.set(".hero-flower",  { scale: 0.08, opacity: 0, x: 0, rotate: 0 });
      gsap.set(".hero-content", { opacity: 0, y: 24 });

      const preventScroll = (e: Event) => e.preventDefault();
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });

      const heroTl = gsap.timeline({
        delay: 0.3,
        onComplete: () => {
          window.removeEventListener("wheel", preventScroll);
          window.removeEventListener("touchmove", preventScroll);
        },
      });
      heroTl
        .to(".hero-flower",  { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" })
        .to(".hero-flower",  { x: "38vw", rotate: 35, scale: 1.15, duration: 1.4, ease: "power2.inOut" })
        .to(".hero-content", { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.6");

      // ── Generic helpers ───────────────────────────────────────
      const ease = "power3.out";
      const toggleActions = "play none none reverse";

      gsap.utils.toArray<Element>(".gs-up").forEach((el) => {
        gsap.from(el, { y: 55, opacity: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions } });
      });

      gsap.utils.toArray<Element>(".gs-left").forEach((el) => {
        gsap.from(el, { x: -65, opacity: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions } });
      });

      gsap.utils.toArray<Element>(".gs-right").forEach((el) => {
        gsap.from(el, { x: 65, opacity: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions } });
      });

      gsap.utils.toArray<Element>(".gs-stagger").forEach((container) => {
        const children = (container as Element).querySelectorAll(":scope > *");
        gsap.from(children, { y: 45, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: container as Element, start: "top 85%", toggleActions: "play none none reverse" } });
      });

      // ── Section headings draw line ────────────────────────────
      gsap.utils.toArray<Element>(".gs-heading-line").forEach((el) => {
        gsap.from(el, { scaleX: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });

      // ── Certifications — infinite hover-driven coverflow ─────
      const certCards = gsap.utils.toArray<HTMLElement>(".cert-card");
      if (certCards.length) {
        const SPACING = 240; // px between adjacent cards
        const n = certCards.length;
        const proxy = { p: 0 };
        let target = 0;

        const layout = () => {
          certCards.forEach((card, i) => {
            // shortest signed distance modulo n → infinite wrap
            let off = ((i - proxy.p) % n + n) % n;
            if (off > n / 2) off -= n;
            const abs = Math.abs(off);
            gsap.set(card, {
              x: off * SPACING,
              scale: Math.max(0.55, 1 - 0.16 * abs),
              opacity: Math.max(0, 1 - 0.32 * abs),
              zIndex: 100 - Math.round(abs * 10),
              rotateY: off * -8,
            });
          });
        };
        layout();

        const animateToTarget = () => {
          gsap.to(proxy, {
            p: target,
            duration: 0.6,
            ease: "power3.out",
            onUpdate: layout,
            overwrite: true,
          });
        };

        // Wheel handler — only fires when cursor is over the stage
        const stage = document.querySelector<HTMLElement>(".cert-stage");
        if (stage) {
          const onWheel = (e: WheelEvent) => {
            // Only swallow when scrolling intent is meaningful
            if (Math.abs(e.deltaY) < 1 && Math.abs(e.deltaX) < 1) return;
            e.preventDefault();
            const delta = e.deltaY || e.deltaX;
            target += delta * 0.004;
            animateToTarget();
          };
          stage.addEventListener("wheel", onWheel, { passive: false });
          cleanups.push(() => stage.removeEventListener("wheel", onWheel));
        }

        // Prev / Next — step by exactly one card
        const jump = (dir: number) => {
          target = Math.round(target) + dir;
          animateToTarget();
        };
        const nextBtn = document.querySelector(".cert-next");
        const prevBtn = document.querySelector(".cert-prev");
        const nextHandler = () => jump(1);
        const prevHandler = () => jump(-1);
        nextBtn?.addEventListener("click", nextHandler);
        prevBtn?.addEventListener("click", prevHandler);
        cleanups.push(() => {
          nextBtn?.removeEventListener("click", nextHandler);
          prevBtn?.removeEventListener("click", prevHandler);
        });
      }

      // ── Skills — pin while pills animate in ──────────────────
      const skillsTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#skills",
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      gsap.utils.toArray<Element>(".skills-row").forEach((row, ri) => {
        const pills = (row as Element).querySelectorAll(":scope > *");
        skillsTl.from(pills, {
          x: (i) => (i % 2 === 0 ? -50 : 50),
          opacity: 0,
          stagger: 0.06,
          ease: "none",
          duration: 0.3,
        }, ri * 0.3);
      });
      skillsTl.to({}, { duration: 0.3 });

      ScrollTrigger.refresh();
    });
    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      flowerMouseX.set((event.clientX / window.innerWidth - 0.5) * -80);
      flowerMouseY.set((event.clientY / window.innerHeight - 0.5) * -80);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [flowerMouseX, flowerMouseY]);

  // Mobile island nav — build timeline once
  useEffect(() => {
    const tl = gsap.timeline({ paused: true })
      .set(".menu-overlay", { pointerEvents: "auto" })
      .to(".island", { width: 240, duration: 0.6, ease: "back.out(2)" }, 0)
      .to(".bar-mid", { opacity: 0, duration: 0.15, ease: "power2.in" }, 0)
      .to(".bar-top", { attr: { x1: 3, y1: 3, x2: 13, y2: 13 }, duration: 0.28, ease: "power3.inOut" }, 0)
      .to(".bar-bot", { attr: { x1: 13, y1: 3, x2: 3, y2: 13 }, duration: 0.28, ease: "power3.inOut" }, 0)
      .to(".menu-backdrop", { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
      .from(".menu-panel", { autoAlpha: 0, yPercent: -10, scale: 0.6, duration: 0.7, transformOrigin: "top center", ease: "back.out(2)" }, 0.1)
      .from(".menu-link", { opacity: 0, y: 6, duration: 0.3, ease: "power2.out", stagger: 0.05 }, 0.22);
    navTlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  // Mobile island nav — play / reverse on toggle
  useEffect(() => {
    const tl = navTlRef.current;
    if (!tl) return;
    if (navOpen) {
      tl.timeScale(1).play();
    } else {
      tl.eventCallback("onReverseComplete", () => { gsap.set(".menu-overlay", { pointerEvents: "none" }); });
      tl.timeScale(1.4).reverse();
    }
  }, [navOpen]);

  // Esc to close
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setNavOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // About overlay — body scroll lock when open
  useEffect(() => {
    document.body.style.overflow = aboutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aboutOpen]);

  // About overlay — build path morph + char fly-in timeline once
  useEffect(() => {
    const path = document.querySelector<SVGPathElement>(".about-path");
    if (!path) return;

    const proxy = { v: 100, c: 100 };
    const updatePath = () => {
      path.setAttribute("d", `M 0 100 V ${proxy.v} Q 50 ${proxy.c} 100 ${proxy.v} V 100 z`);
    };
    updatePath();

    gsap.set(".about-char", { opacity: 0, y: 40, scale: 0.6 });
    gsap.set(".about-body", { opacity: 0, y: 20 });

    const tl = gsap.timeline({ paused: true })
      .to(proxy, { v: 50, c: 0, duration: 0.55, ease: "power2.in", onUpdate: updatePath })
      .to(proxy, { v: 0, duration: 0.5, ease: "power2.out", onUpdate: updatePath })
      .to(".about-char", {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.6)",
        duration: 0.7,
        stagger: 0.025,
      }, "-=0.1")
      .to(".about-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.3");

    aboutTlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  // About overlay — play / reverse on toggle
  useEffect(() => {
    const tl = aboutTlRef.current;
    if (!tl) return;
    if (aboutOpen) {
      setOverlayVisible(true);
      requestAnimationFrame(() => tl.timeScale(1).play(0));
    } else {
      tl.eventCallback("onReverseComplete", () => setOverlayVisible(false));
      tl.timeScale(1.3).reverse();
    }
  }, [aboutOpen]);

  // Esc to close about
  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAboutOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aboutOpen]);

  // Name 3D tilt — pointer-driven rotation only
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#hero");
    if (!hero) return;

    const outerRX = gsap.quickTo(".name-outer", "rotationX", { ease: "power3", duration: 0.6 });
    const outerRY = gsap.quickTo(".name-outer", "rotationY", { ease: "power3", duration: 0.6 });

    const onMove = (e: PointerEvent) => {
      outerRX(gsap.utils.interpolate(15, -15, e.clientY / window.innerHeight));
      outerRY(gsap.utils.interpolate(-15, 15, e.clientX / window.innerWidth));
    };
    const onLeave = () => {
      outerRX(0); outerRY(0);
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);


  return (
    <div className="min-h-screen text-[#5c1a2e] overflow-x-hidden" style={{ background: "radial-gradient(ellipse 80% 50% at 10% 10%, rgba(251,207,232,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 90% 40%, rgba(253,164,175,0.25) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 50% 80%, rgba(252,231,243,0.4) 0%, transparent 55%), #fff" }}>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed top-6 left-0 w-full z-50 flex items-center justify-center"
      >

        {/* LEFT LOGO */}
        <div className="absolute left-6 mt-6">
          <a href="#">
            <AnbarAlthafLogo variant="nav" className="h-11 w-auto" />
          </a>
        </div>

        {/* CENTER PILL NAV — desktop */}
        <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-rose-100 overflow-hidden px-2 py-1">

          {["About", "Experience", "Projects", "Certifications", "Skills", "Contact"].map((item) =>
            item === "About" ? (
              <button
                key={item}
                onClick={() => setAboutOpen(true)}
                className="px-5 py-2 text-sm text-rose-900/60 hover:text-rose-800 transition bg-transparent border-0 cursor-pointer"
              >
                {item}
              </button>
            ) : (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-5 py-2 text-sm text-rose-900/60 hover:text-rose-800 transition"
              >
                {item}
              </a>
            )
          )}

        </div>

        {/* MOBILE ISLAND NAV */}
        <button
          id="menuToggle"
          aria-expanded={navOpen}
          aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setNavOpen((v) => !v)}
          className="island md:hidden relative flex items-center justify-center bg-white/85 backdrop-blur-xl rounded-full shadow-lg border border-rose-100 h-11 px-3 will-change-transform"
          style={{ width: "3rem" }}
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 text-[#5c1a2e] flex-shrink-0">
            <line className="bar-top" x1="3" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line className="bar-mid" x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line className="bar-bot" x1="3" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="island-logo absolute right-4 text-[#5c1a2e] text-sm tracking-widest font-light opacity-0">
            ✦
          </span>
        </button>

      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <div className="menu-overlay md:hidden fixed inset-0 z-40 pointer-events-none">
        <div
          className="menu-backdrop absolute inset-0 bg-[#5c1a2e]/30 backdrop-blur-sm opacity-0"
          onClick={() => setNavOpen(false)}
        />
        <div className="menu-panel absolute top-24 left-1/2 -translate-x-1/2 w-[88vw] max-w-sm rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-100 shadow-2xl shadow-rose-200/40 p-3">
          {["About", "Experience", "Projects", "Certifications", "Skills", "Contact"].map((item) =>
            item === "About" ? (
              <button
                key={item}
                tabIndex={navOpen ? 0 : -1}
                onClick={() => { setNavOpen(false); setAboutOpen(true); }}
                className="menu-link block w-full text-left px-5 py-3 rounded-2xl text-[#5c1a2e]/80 hover:bg-rose-50 hover:text-[#5c1a2e] transition-colors text-base font-light bg-transparent border-0 cursor-pointer"
              >
                {item}
              </button>
            ) : (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                tabIndex={navOpen ? 0 : -1}
                onClick={() => setNavOpen(false)}
                className="menu-link block px-5 py-3 rounded-2xl text-[#5c1a2e]/80 hover:bg-rose-50 hover:text-[#5c1a2e] transition-colors text-base font-light"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>

      {/* ABOUT REVEAL OVERLAY — path morph + char fly-in */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          overflow: "auto",
          visibility: overlayVisible ? "visible" : "hidden",
          pointerEvents: aboutOpen ? "auto" : "none",
        }}
      >
        {/* SVG path — provides the maroon bottom-up bubble reveal */}
        <svg
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="about-path"
            d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
            fill="#5c1a2e"
          />
        </svg>

        <button
          type="button"
          onClick={() => setAboutOpen(false)}
          aria-label="Close"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            zIndex: 10001,
          }}
        >
          {"✕"}
        </button>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "48rem", margin: "0 auto", padding: "6rem 2rem", minHeight: "100vh", boxSizing: "border-box" }}>
          <p className="about-body" style={{ color: "#fbcfe8", fontSize: 12, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 24, fontWeight: 300 }}>
            {"✦ Hello there"}
          </p>
          <h2
            aria-label="I'm Anbar — a builder at heart."
            style={{ color: "#ffffff", fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 600, lineHeight: 1.05, marginBottom: 32, letterSpacing: "-0.02em" }}
          >
            {Array.from("I'm Anbar.").map((c, i) => (
              <span
                key={i}
                className="about-char"
                style={{ display: "inline-block", whiteSpace: c === " " ? "pre" : undefined }}
              >
                {c === " " ? " " : c}
              </span>
            ))}
          </h2>
          <div className="about-body" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.05rem", lineHeight: 1.7, fontWeight: 300 }}>
            <p style={{ marginBottom: 18 }}>
              {"I'm a Computer Science student focused on AI & Machine Learning. I spend most of my time on feature pipelines, data infrastructure, and how systems hold up once they're running. That's where I've found the interesting problems tend to live. "}
            </p>
          </div>
          <div className="about-body" style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 28 }}>
            {["Machine Learning", "Deep Learning", "AI Systems", "Data", "Research"].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "6px 16px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 text-center overflow-hidden">

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        {/* Floating blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,207,232,0.5) 0%, transparent 70%)", filter: "blur(40px)" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(253,164,175,0.4) 0%, transparent 70%)", filter: "blur(50px)" }}
          animate={{ x: [0, -25, 15, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Flower — GSAP scroll + mouse parallax */}
        <motion.div className="absolute pointer-events-none" style={{ x: smoothFlowerX, y: smoothFlowerY }}>
          <div
            className="hero-flower w-[70vw] h-[70vw] max-w-3xl max-h-3xl"
            style={{ backgroundImage: "url(/flower-background.png)", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
          />
        </motion.div>

        {/* Hero content — hidden until flower finishes */}
        <div className="hero-content relative z-10 max-w-4xl mx-auto">
          <p className="text-rose-500/70 text-xs tracking-[0.45em] uppercase mb-8 font-light">
            Software Developer
          </p>
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            aria-label="Open about"
            className="name-stage inline-block mt-36 mb-6 cursor-pointer bg-transparent border-0 p-0"
            style={{ perspective: "650px" }}
          >
            <div className="name-outer inline-block will-change-transform">
              <AnbarAlthafLogo variant="hero" className="name-inner h-40 md:h-56 lg:h-64 w-auto mx-auto will-change-transform" />
            </div>
          </button>
          <div className="w-28 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-8" />
        </div>
      </section>


      {/* Experience */}
      <section id="experience" className="py-28 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="gs-up"><SectionHeading title="Experience" /></div>

          <ExperienceTimeline />
        </div>

      </section>

      {/* Projects — Interactive showcase */}
      <section id="projects" className="py-28 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="gs-up"><SectionHeading title="Projects" /></div>
          <div className="gs-up">
            <ProjectsShowcase />
          </div>
        </div>
      </section>

      {/* Certifications — coverflow + click-to-view detail modal */}
      <CertificationsSection />

      {/* Skills */}
      <section id="skills" className="py-28 px-4 overflow-hidden relative">
        <div className="max-w-5xl mx-auto">
          <div className="gs-up"><SectionHeading title="Skills" /></div>
          <div className="space-y-16">
            {[
              { title: "Machine Learning", skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Neural Networks", "Computer Vision", "NLP"] },
              { title: "Programming",      skills: ["Python", "TypeScript", "JavaScript", "R", "SQL", "Git"] },
              { title: "Platforms & Tools",skills: ["AWS", "GCP", "Docker", "Kubernetes", "MLflow", "Jupyter"] },
            ].map((category) => (
              <div key={category.title}>
                <p className="gs-up text-xs tracking-[0.35em] uppercase text-rose-400/70 font-light mb-5 text-center">
                  {category.title}
                </p>
                <div className="skills-row flex flex-wrap justify-center gap-3">
                  {category.skills.map((skill) => (
                    <motion.div
                      key={skill}
                      whileHover={{ scale: 1.08, y: -3 }}
                      className="px-5 py-2.5 rounded-2xl border border-rose-200 bg-rose-50/60 text-rose-800 text-sm font-light shadow-sm hover:border-rose-400 hover:shadow-rose-200 hover:shadow-md transition-shadow duration-300 cursor-default"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 px-4 relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gs-up"><SectionHeading title="Get In Touch" /></div>
          <p className="gs-up text-rose-900/50 mb-10 font-light leading-relaxed">
            I&apos;m open to new opportunities and collaborations. Whether you&apos;d like to
            discuss AI projects or explore working together, I&apos;d love to hear from you.
          </p>

          <div className="gs-stagger flex flex-col items-center gap-5 mt-12">
            <div className="flex justify-center gap-4">
              {/* Email — click to copy */}
              <motion.button
                type="button"
                onClick={copyEmail}
                aria-label={emailCopied ? "Email copied" : "Copy email address"}
                className="w-12 h-12 rounded-full border border-rose-200 bg-white flex items-center justify-center text-rose-400 hover:text-rose-600 hover:border-rose-400 hover:shadow-sm hover:shadow-rose-100 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {emailCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Mail className="w-5 h-5" />}
              </motion.button>

              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/anbaralthaf/", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/Anbar26", label: "GitHub" },
              ].map((contact) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contact.label}
                  className="w-12 h-12 rounded-full border border-rose-200 bg-white flex items-center justify-center text-rose-400 hover:text-rose-600 hover:border-rose-400 hover:shadow-sm hover:shadow-rose-100 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <contact.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Email address + copy confirmation */}
            <button
              type="button"
              onClick={copyEmail}
              className="text-sm font-light tracking-wide text-rose-900/55 hover:text-rose-700 transition-colors cursor-pointer"
            >
              {emailCopied ? "✓ Copied to clipboard!" : EMAIL}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-rose-100">
        <div className="max-w-5xl mx-auto text-center text-rose-900/25 text-sm font-light">
          <p>© 2025 Anbar Althaf · Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
