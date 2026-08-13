"use client";

import type { ProjectItem } from "@/data/projects";

/**
 * One card in the pile.
 *
 * A photograph in a rounded frame and nothing else — no buttons, no borders, no
 * body copy. The card has to read at a glance while it is mid-flight and tilted,
 * so everything explanatory lives beside the stack rather than on it.
 *
 * Until a project has a screenshot the face falls back to that project's own
 * accent wash with its title on it. Same box, same corners, same shadow, so the
 * stack behaves identically the day real images arrive.
 */
export default function ProjectCard({
  project,
  z,
}: {
  project: ProjectItem;
  z: number;
}) {
  return (
    <div className="project-card" style={{ zIndex: z }}>
      <div className="project-card-face">
        {project.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={project.image} alt={project.title} draggable={false} />
        ) : (
          <div className={`project-card-wash bg-gradient-to-br ${project.accent.panel}`}>
            <span className="project-card-kicker">{project.tag}</span>
            <span className="project-card-title">{project.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
