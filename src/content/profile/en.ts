import type { ProfileText } from "./base";

export const en: ProfileText = {
  role: "Fullstack Developer · UI/UX",
  location: "Remote · LATAM",
  availability: "I reply within 24 h",
  lede: "Hey there! So glad you stopped by.",
  bio: [
    "I’m a fullstack developer and UI/UX designer, and what gets me most excited is building things people genuinely enjoy using. I love being part of the whole ride: from the first chat with a user and the Figma sketch to the database, the deploy and that moment when the metrics shout “it worked!”.",
    "Lately I live where AI meets product: I integrate models, build agents and design interfaces that make all of it feel simple. I thrive in small teams that move fast, write code people actually enjoy reading, and I’m always up for learning something new. Got an idea spinning around? Tell me about it, and let’s make it real.",
  ],
  facts: [
    { label: "Focus", value: "End-to-end product" },
    {
      label: "Languages",
      value: "Spanish, English, Portuguese (intermediate)",
    },
    { label: "Work style", value: "Remote, freelance or full-time" },
  ],
  experienceLede:
    "Experienced in UI/UX, artificial intelligence integrations and AI‑native software.",
  experience: {
    solvertic: {
      role: "AI Engineer",
      period: "2026 — present",
      description:
        "At Solvertic I build software for a university and for a financial system. My work is mostly backend, artificial intelligence and infrastructure: Java microservices with Spring Boot, designed with hexagonal architecture, and AI integrations with Spring AI.",
      highlights: [
        "Java and Spring Boot microservices with hexagonal architecture (ports and adapters).",
        "AI models integrated into the services with Spring AI.",
        "Infrastructure and deployment for the university’s and the financial system’s services.",
      ],
    },
    grazia: {
      role: "Fullstack Developer · AI Engineer · UI/UX",
      period: "2025 — 2026",
      description:
        "Grazia is an AI video creative board: it generates cinematic ads, photorealistic AI influencers, UGC content and real estate videos in minutes, for marketing and e‑commerce teams. My role covers the product end to end: I design the experience, build the frontend and backend, and integrate the generative models into an AI‑native platform.",
      highlights: [
        "UI/UX design of the video, image, voice and audio generation flows.",
        "Generative AI model integration: generation pipelines, job queues and media delivery.",
        "Fullstack development of product features, from Figma design to deploy.",
      ],
    },
    freelance: {
      role: "Freelance web developer",
      company: "Independent clients",
      period: "2024 — 2025",
      description:
        "Custom development for businesses and entrepreneurs. Beyond websites, I built tailored software: systems shaped around each client’s own process. I understand the problem, design the interface and deliver a working product.",
      highlights: [
        "Tailored systems for each business: admin dashboards, automations and integrations, not just websites.",
      ],
    },
  },
  projects: {
    grazia: {
      title: "Grazia AI",
      description:
        "AI video platform: ads, AI influencers, UGC and real estate videos in minutes.",
    },
    rlt: {
      title: "Real Latino Talent",
      description:
        "Website for a remote LATAM staffing agency working with U.S. businesses.",
    },
  },
  stack: [
    {
      name: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "React Native",
      ],
    },
    {
      name: "Backend",
      items: [
        "Node.js",
        "NestJS",
        "PostgreSQL",
        "Prisma",
        "Redis",
        "REST / GraphQL",
      ],
    },
    {
      name: "Design",
      items: [
        "Figma",
        "Design systems",
        "Prototyping",
        "User research",
        "Accessibility",
      ],
    },
    {
      name: "Infra & AI",
      items: ["Docker", "Vercel", "AWS", "CI/CD", "LLM APIs", "Agents"],
    },
  ],
};
