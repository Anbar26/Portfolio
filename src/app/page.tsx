import Home from "@/components/Home";
import { SITE_URL } from "./layout";
import { EMAIL, LINKS, NAME } from "@/data/about";
import { certifications } from "@/data/certifications";
import { experiences } from "@/data/experiences";
import { cvSkills, education } from "@/data/cv";

/*
 * No `metadata` export here. It used to carry a thinner title and description
 * than the layout's and, being the more specific of the two, quietly won.
 */

/**
 * Structured data — how a search engine learns that this page is a person
 * rather than a document, and what she does.
 *
 * Built from the same modules the page renders, so a new certification or job
 * appears here without anyone remembering to update it. Everything is already
 * public on the page; nothing private is added for the crawler's benefit.
 */
function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NAME,
    givenName: "Anbar",
    familyName: "Althaf",
    jobTitle: "AI & Machine Learning Engineer",
    url: SITE_URL,
    email: `mailto:${EMAIL}`,
    sameAs: [LINKS.github, LINKS.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.institution,
    },
    knowsAbout: cvSkills.flatMap((g) => g.items),
    hasOccupation: experiences.map((e) => ({
      "@type": "Occupation",
      name: e.title,
      occupationLocation: { "@type": "Place", name: e.location },
      skills: e.tags.join(", "),
    })),
    worksFor: experiences.map((e) => ({ "@type": "Organization", name: e.company })),
    hasCredential: certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
  };
}

export default function Page() {
  return (
    <>
      {/*
        Rendered as a plain script tag rather than through next/script: this has
        to be in the server-rendered HTML, because a crawler that does not run
        JavaScript is exactly the reader it exists for.
      */}
      <script
        type="application/ld+json"
        // The content is built from our own data, not from user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <Home />
    </>
  );
}
