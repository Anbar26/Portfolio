/**
 * Project content. Lifted verbatim out of Home.tsx when the section was rebuilt
 * as the photo stack — titles, descriptions, tech lists, links and accents are
 * unchanged.
 *
 * `image` is the one addition — the stack is built around a picture of the work.
 * These are WebP at 1400px wide, which covers a 2x display at the card's real
 * size; the 1536px PNGs they came from were 2.7MB each, and three of those is
 * eight megabytes of hero imagery on a page that is mostly scroll animation.
 * A project without an image falls back to its own accent wash with its title
 * on it, so the stack behaves identically either way.
 */
export const projects = [
  {
    title: "RedTeam AI",
    tag: "AI Security",
    description:
      "A CLI-first platform for red-teaming ML models. Adversarial attacks — FGSM, boundary, model extraction, prompt injection — run locally so the model never leaves your machine, while a FastAPI backend scores results, tracks history, and generates PDF audit reports.",
    tags: ["Python", "FastAPI", "PyTorch", "Next.js"],
    href: "https://github.com/Anbar26/redteam-ai",
    image: "/projects/redteam-ai.webp",
    accent: {
      panel: "from-rose-200 via-rose-50 to-white",
      dot: "bg-rose-400",
      number: "text-rose-300",
      tag: "bg-rose-50/80 border-rose-200 text-rose-800",
      blob: "bg-rose-300/50",
      text: "text-rose-500",
      border: "border-rose-300",
      glow: "shadow-rose-200/60",
      tint: "bg-rose-50/60",
    },
  },
  {
    title: "Codebase Onboarding Agent",
    tag: "AI Agent",
    description:
      "A Chrome extension that adds an “Explain Repo” button to any GitHub page. An AI agent explores the codebase locally via Ollama and generates a full onboarding guide in a sidebar — nothing is ever sent to an external API.",
    tags: ["Python", "Ollama", "Chrome Extension"],
    href: "https://github.com/Anbar26/codebase-onboarding-agent",
    image: "/projects/codebase-onboarding-agent.webp",
    accent: {
      panel: "from-teal-200 via-teal-50 to-white",
      dot: "bg-teal-400",
      number: "text-teal-300",
      tag: "bg-teal-50/80 border-teal-200 text-teal-800",
      blob: "bg-teal-300/50",
      text: "text-teal-500",
      border: "border-teal-300",
      glow: "shadow-teal-200/60",
      tint: "bg-teal-50/60",
    },
  },
  {
    title: "Maze Solver",
    tag: "Reinforcement Learning",
    description:
      "A reinforcement learning system where an agent learns to navigate a maze by trial and error, comparing Monte Carlo, SARSA, and Q-Learning side by side. An interactive web UI trains the agents and visualizes learned policies, trajectories, and convergence metrics in real time.",
    tags: ["Python", "FastAPI", "React", "TypeScript"],
    href: "https://github.com/Anbar26/Maze_Solver",
    image: "/projects/maze-solver.webp",
    accent: {
      panel: "from-indigo-200 via-indigo-50 to-white",
      dot: "bg-indigo-400",
      number: "text-indigo-300",
      tag: "bg-indigo-50/80 border-indigo-200 text-indigo-800",
      blob: "bg-indigo-300/50",
      text: "text-indigo-500",
      border: "border-indigo-300",
      glow: "shadow-indigo-200/60",
      tint: "bg-indigo-50/60",
    },
  },
];

export type ProjectItem = (typeof projects)[number];
