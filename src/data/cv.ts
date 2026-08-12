/**
 * Facts from the CV that the portfolio does not already carry.
 *
 * Feeds the assistant only — nothing here is rendered, so adding to this file
 * cannot change the site. Where the CV and the portfolio describe the same
 * thing, the portfolio module stays the source of truth and this file adds only
 * what is missing.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DELIBERATELY OMITTED — private, and kept out on purpose
 * ─────────────────────────────────────────────────────────────────────────────
 * The CV also carries a phone number, a visa/sponsorship status, and by
 * implication a country of residence. None of it is here, and it must not be
 * added.
 *
 * The system prompt does tell the assistant to decline personal questions, but
 * an instruction is a request and a prompt can be argued with. Data that was
 * never sent cannot be leaked, coaxed out, or quoted back — so omission is the
 * control, and the prompt rule is only a courtesy on top of it.
 *
 * Work locations (Dubai, Abu Dhabi) are a different matter: they describe where
 * a job was, they are already on the public site, and they say nothing about
 * where she lives. Those stay.
 */

export const education = {
  institution: "Manipal Institute of Technology",
  degree: "B.Tech — Computer Science and Engineering (AI & ML)",
  period: "Aug 2022 – Aug 2026",
  coursework: [
    "Operating Systems",
    "Data Structures",
    "Algorithms",
    "Object Oriented Programming",
    "Artificial Intelligence",
    "Software Engineering",
    "Machine Learning",
    "Computer Vision",
    "Deep Learning",
    "Neural Networks",
    "Reinforcement Learning",
    "Database Management",
    "Parallel Programming",
  ],
};

/** The CV's own skills breakdown — broader than the three groups on the site. */
export const cvSkills = [
  { group: "Languages", items: ["Python", "C", "C++", "Java", "JavaScript", "SQL", "HTML"] },
  { group: "Frameworks", items: ["Bootstrap", "Django", "Flask", "React.js", "Tailwind CSS"] },
  {
    group: "Libraries",
    items: ["Matplotlib", "NumPy", "OpenCV", "Pandas", "PyTorch", "Scikit-learn", "OpenMPI", "CUDA"],
  },
  {
    group: "APIs & Tools",
    items: ["RESTful APIs", "FastAPI", "JSON", "Git", "JavaFX", "Jupyter Notebook", "MATLAB"],
  },
];

/** Detail the CV adds to roles the portfolio already lists. */
export const experienceExtras: { company: string; notes: string[] }[] = [
  {
    company: "Tenderd",
    notes: [
      "Built a device health-monitoring bot that helps Ops engineers catch telematics devices that stopped reporting while still running, replacing a manual hourly check with automated Slack alerts",
      "In QA, also supported the team in identifying fuel theft events and distinguishing them from jittery sensor data",
    ],
  },
];

/** Projects on the CV but not on the site. */
export const cvProjects = [
  {
    title: "Humanoid Movement Tracking",
    period: "Mar 2025 – May 2025",
    tech: ["Python", "MuJoCo", "PyTorch", "LSTM", "SAC", "A2C", "TD3"],
    notes: [
      "Cloud-enabled MuJoCo simulation pipeline in Python for real-time humanoid motion tracking, with interactive 3D visualisation and LSTM-based forecasting, trained over 8 million steps across 30+ trajectories",
      "Integrated SAC, A2C and TD3 with an ε-greedy exploration strategy to optimise control policies, aiming at predictive movement assistance for people with disabilities",
    ],
  },
];

/** Detail the CV adds to projects the portfolio already lists. */
export const projectExtras: { title: string; period?: string; notes: string[] }[] = [
  {
    title: "Maze Solver",
    period: "Aug 2025 – Nov 2025",
    notes: [
      "Monte Carlo Control, SARSA (on-policy TD) and Q-Learning (off-policy TD) with Q-table updates in a discrete MDP environment",
      "Grid-world simulator with state transitions, stochasticity handling, reward shaping, collision penalties, goal rewards and ε-greedy exploration with decay",
      "React + Tailwind CSS frontend for hyperparameter configuration (α, γ, ε, episodes) and real-time visualisation of learning curves, Q-value convergence and policy heatmaps, over 1,000+ episodes",
    ],
  },
];

export const achievements = [
  "Participated in 5+ international hackathons, including HackWithInfy, Bolt.new and Adobe, collaborating with cross-functional teams",
];

/** Spoken languages — a standard professional CV entry. */
export const spokenLanguages = ["English", "Hindi", "Arabic"];
