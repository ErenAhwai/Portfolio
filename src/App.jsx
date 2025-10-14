// src/App.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Mail,
  MapPin,
  School,
  Briefcase,
  Wrench,
  BookOpen,
  FileDown,
  ExternalLink,
  Trophy,
  Heart,
  CalendarRange,
  Sparkles,
} from "lucide-react";

/**
 * 🔒 Asset handling that NEVER crashes:
 * - If you drop files in src/assets, they’ll be bundled and used.
 * - If not, we fall back to /public files (works locally & on GH Pages subpaths).
 */
const assets = import.meta.glob("./assets/*", { eager: true, as: "url" });
const BASE = import.meta.env.BASE_URL || "/";

// Prefer bundled (no 404 in build). Otherwise use public path.
const bundledAvatar = assets["./assets/headshot.jpg"];
const bundledResume = assets["./assets/resume.pdf"];

const avatarSrcDefault = bundledAvatar || new URL("avatar.jpg", BASE).href;
const resumeHrefDefault = bundledResume || new URL("resume.pdf", BASE).href;

// =====================
// ✨ THEME + SMALL UTILS (Calm palette)
// =====================
const Section = ({ id, title, children, kicker }) => (
  <section id={id} className="scroll-mt-24 container mx-auto max-w-6xl px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      {kicker && (
        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
          {kicker}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-[#9dbf9a] via-[#e6d5b8] to-[#f3a38c] dark:from-[#9dbf9a] dark:via-[#e6d5b8] dark:to-[#f3a38c] bg-clip-text text-transparent">
        {title}
      </h2>
      {children}
    </motion.div>
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-1 text-sm leading-5 mr-2 mb-2 shadow-sm backdrop-blur">
    {children}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 dark:border-white/10 shadow-[0_8px_30px_-12px_rgba(99,102,241,.35)] p-5 bg-white/90 dark:bg-zinc-900/50 backdrop-blur ${className}`}
  >
    {children}
  </div>
);

// =====================
// 🧠 DATA
// =====================
const PROFILE = {
  name: "Eren Ahwai",
  tagline: "ECE @ Queen's • Builder • PM/Software",
  location: "Kingston, ON, Canada",
  email: "your.email@queensu.ca",
  github: "https://github.com/erenahwai",
};

const EDUCATION = [
  {
    school: "Queen's University",
    dates: "2024 – Present",
    start: "2024-09-01",
    end: "2028-04-30",
    city: "Kingston, ON, Canada",
    bullets: ["3.49 GPA", "Dean's Honour List"],
  },
  {
    school: "West Carleton Secondary School",
    dates: "2020 – 2024",
    start: "2020-09-01",
    end: "2024-06-30",
    city: "Ottawa, ON, Canada",
    bullets: ["94% AVG", "Silver Medal (Gr 9–12)"],
  },
];

const EXPERIENCE = [
  {
    role: "Tutor",
    org: "Tutorax",
    dates: "May 2025 – Present",
    start: "2025-05-01",
    end: "2025-10-01",
    summary:
      "Help students master course concepts through 1-on-1 sessions; report progress; tailor per learner.",
    skills: ["Communication", "Time Management", "Teaching", "Organization"],
  },
  {
    role: "Ski Instructor",
    org: "Mount Pakenham",
    dates: "Nov 2021 – Mar 2022",
    start: "2021-11-01",
    end: "2022-03-31",
    summary:
      "Taught safe skiing and technique; delivered constructive feedback; adapted to age groups.",
    skills: ["Teamwork", "Patience", "Adaptability"],
  },
];

const EXTRAS = [
  {
    title: "ESSDev Project Manager",
    org: "Queen's Engineering Society",
    dates: "Sept 2025 – Present",
    start: "2025-09-01",
    end: "2025-10-01",
    bullets: ["Leadership", "Planning", "Organization", "Communication"],
  },
  {
    title: "Software Member",
    org: "Queen's Aerospace Design Team",
    dates: "Nov 2024 – Present",
    start: "2024-11-01",
    end: "2025-10-01",
    bullets: ["Python • ROS2 • PX4", "Git", "Collaboration"],
  },
  {
    title: "Webmaster",
    org: "IEEE Ottawa Robotics Competition",
    dates: "Nov 2023 – May 2024",
    start: "2023-11-01",
    end: "2024-05-31",
    bullets: ["WordPress", "Problem-Solving", "Commitment"],
  },
];

const PROJECTS = [
  {
    name: "Photo Optimizer",
    dates: "Summer 2025 – Present",
    start: "2025-06-01",
    end: "2025-10-01",
    city: "Ottawa, ON",
    desc: "Ranks/selects best photos from a set.",
    tech: ["Python", "OpenCV"],
    links: [{ href: "https://github.com/erenahwai", label: "GitHub" }],
  },
  {
    name: "GR12 Progress Report",
    dates: "Sept 2022 – Jan 2023",
    start: "2022-09-01",
    end: "2023-01-31",
    city: "Ottawa, ON",
    desc: "Progress reporting system for admins.",
    tech: ["PHP", "SQL", "JS", "HTML/CSS"],
  },
];

const PASSIONS = [
  { title: "Rock Climbing", dates: "Summer 2023 – Present", items: ["Indoor Bouldering", "Outdoor"] },
  { title: "Music", dates: "Summer 2025 – Present", items: ["Guitar", "Piano"] },
  { title: "Sports", dates: "2010s – Present", items: ["Hockey (GO SENS GO)", "Soccer"] },
];

// =====================
// 🗓️ INTERACTIVE TIMELINE (Balanced hues)
// =====================
function buildTimeline() {
  const hue = "from-[#9dbf9a] to-[#f3a38c]"; // calm family

  const edu = [
    {
      type: "Education",
      title: "Queen's University — Computer Engineering (Innovation)",
      subtitle:
        "1st-year BASc. Key courses in programming, data structures, digital systems. GPA 3.49; Dean’s Scholar (2025).",
      start: new Date("2024-09-01"),
      end: new Date("2028-04-30"),
      badge: "2024 – Present",
      color: hue,
    },
    {
      type: "Education",
      title: "West Carleton Secondary School",
      subtitle:
        "94% average; Silver Medal (Gr 9–12). Strong STEM focus; leadership in clubs and robotics events.",
      start: new Date("2020-09-01"),
      end: new Date("2024-06-30"),
      badge: "2020 – 2024",
      color: hue,
    },
  ];

  const exp = [
    {
      type: "Experience",
      title: "Tutor — Tutorax",
      subtitle:
        "1-on-1 sessions to lift understanding; adapted teaching per student; communicated progress to parents.",
      start: new Date("2025-05-01"),
      end: new Date("2025-10-01"),
      badge: "May 2025 – Present",
      color: hue,
    },
    {
      type: "Experience",
      title: "Ski Instructor — Mount Pakenham",
      subtitle:
        "Taught safe fundamentals and technique; tailored feedback across age groups; teamwork on the hill.",
      start: new Date("2021-11-01"),
      end: new Date("2022-03-31"),
      badge: "Nov 2021 – Mar 2022",
      color: hue,
    },
  ];

  const extra = [
    {
      type: "Extracurricular",
      title: "Project Manager — Engineering Society Software Dev Team",
      subtitle:
        "Led 3 devs building a résumé help service; taught Git/GitHub; planned with a spiral model to ship sustainably.",
      start: new Date("2025-05-01"),
      end: new Date("2025-10-01"),
      badge: "May 2025 – Present",
      color: hue,
    },
    {
      type: "Extracurricular",
      title: "Software Developer — Queen’s Aerospace Design Team",
      subtitle:
        "Linux env setup with Bash; drone code with PX4 + ROS2; collaborated with Git to meet competition tasks.",
      start: new Date("2024-11-01"),
      end: new Date("2025-10-01"),
      badge: "Nov 2024 – Present",
      color: hue,
    },
    {
      type: "Extracurricular",
      title: "Orientation Leader (FREC) — Queen’s Engineering Society",
      subtitle:
        "Mentored first-years through transition; ran activities for a 20-student group; connected them to resources.",
      start: new Date("2025-09-01"),
      end: new Date("2025-10-01"),
      badge: "2025 – Present",
      color: hue,
    },
    {
      type: "Extracurricular",
      title: "Webmaster — IEEE Ottawa Robotics Competition",
      subtitle:
        "Maintained/updated the site so 80+ students could register; kept content current for multiple events.",
      start: new Date("2023-11-01"),
      end: new Date("2024-05-31"),
      badge: "Nov 2023 – May 2024",
      color: hue,
    },
  ];

  const proj = [
    {
      type: "Project",
      title: "Photo Optimizer",
      subtitle:
        "Ranks/selects best shots from a set using simple heuristics; rapid Python/OpenCV iteration.",
      start: new Date("2025-06-01"),
      end: new Date("2025-10-01"),
      badge: "Summer 2025 – Present",
      color: hue,
    },
    {
      type: "Project",
      title: "Grade 12 Progress Report System",
      subtitle:
        "PHP/JS/SQL web app with CSV ETL into DB; teacher marking UI and email distribution; Bootstrap UI.",
      start: new Date("2022-09-01"),
      end: new Date("2023-01-31"),
      badge: "Sept 2022 – Jan 2023",
      color: hue,
    },
  ];

  return [...edu, ...exp, ...extra, ...proj].sort((a, b) => a.start - b.start);
}

// =====================
// 🧭 NAV
// =====================
const Nav = () => {
  const items = [
    { id: "about", label: "About" },
    { id: "timeline", label: "Timeline" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "extracurriculars", label: "Extracurriculars" },
    { id: "projects", label: "Projects" },
    { id: "passions", label: "Passions" },
    { id: "resume", label: "Résumé" },
  ];
  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/70 dark:bg-zinc-950/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="font-semibold tracking-tight text-lg">
          {PROFILE.name}
        </a>
        <div className="hidden md:flex gap-2">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {it.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
};

// =====================
// 🖼️ Avatar (no state, no surprises)
// =====================
const Avatar = () => (
  <div className="size-44 md:size-52 rounded-2xl border border-white/15 shadow-2xl bg-gradient-to-br from-[#9dbf9a]/10 to-[#f3a38c]/10 overflow-hidden">
    <img src={avatarSrcDefault} alt={`${PROFILE.name} avatar`} className="w-full h-full object-cover" />
  </div>
);

// =====================
// 🌈 APP (calm background)
// =====================
export default function App() {
  return (
    <div
      id="top"
      className="min-h-screen text-zinc-900 dark:text-zinc-100 bg-[radial-gradient(900px_500px_at_80%_-10%,rgba(157,190,154,0.18),transparent_60%),radial-gradient(700px_420px_at_-20%_110%,rgba(243,163,140,0.15),transparent_60%),linear-gradient(180deg,#0f1517_0%,#1b2427_100%)]"
    >
      <Nav />

      {/* HERO */}
      <header className="container mx-auto max-w-6xl px-4 pt-16 pb-10">
        <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-[#9dbf9a] via-[#e6d5b8] to-[#f3a38c] dark:from-[#9dbf9a] dark:via-[#e6d5b8] dark:to-[#f3a38c] bg-clip-text text-transparent">
              {PROFILE.name}
            </h1>
            <p className="text-lg text-zinc-200/90 mb-6 max-w-prose">{PROFILE.tagline}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 bg-white/10 hover:bg-white/15 text-white"
              >
                <Mail size={18} /> Contact
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 bg-gradient-to-r from-[#f3a38c]/25 to-[#e46a6b]/25 hover:from-[#f3a38c]/35 hover:to-[#e46a6b]/35 text-white"
              >
                <Github size={18} /> GitHub
              </a>
              <a
                href={resumeHrefDefault}
                download
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 bg-gradient-to-r from-[#9dbf9a]/25 to-[#f3a38c]/25 hover:from-[#9dbf9a]/35 hover:to-[#f3a38c]/35 text-white"
              >
                <FileDown size={18} /> Download Résumé
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
              <MapPin size={16} /> {PROFILE.location}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="justify-self-center">
            <Avatar />
          </motion.div>
        </div>
      </header>

      <Section id="about" title="Overview" kicker="About">
        <Card>
          <p className="leading-7">
            Snapshot of my journey so far — from high school awards to building software and leading teams at Queen's.
            Scroll for details, or jump via the top nav.
          </p>
        </Card>
      </Section>

      <Section id="timeline" title="Interactive Timeline" kicker="Highlights">
        <Timeline />
      </Section>

      <Section id="education" title="Education" kicker="Academics">
        <div className="grid md:grid-cols-2 gap-6">
          {EDUCATION.map((ed) => (
            <Card key={ed.school}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <School size={18} /> {ed.school}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{ed.city}</p>
                </div>
                <Pill>{ed.dates}</Pill>
              </div>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                {ed.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="experience" title="Professional Experience" kicker="Work">
        <div className="space-y-4">
          {EXPERIENCE.map((ex) => (
            <Card key={ex.role}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase size={18} /> {ex.role}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{ex.org}</span>
                  <span>•</span>
                  <span>{ex.dates}</span>
                </div>
              </div>
              <p className="mt-2 leading-7">{ex.summary}</p>
              <div className="mt-3">
                {ex.skills.map((s, i) => (
                  <Pill key={i}>{s}</Pill>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="extracurriculars" title="Extracurriculars" kicker="Leadership & Teams">
        <div className="grid md:grid-cols-3 gap-4">
          {EXTRAS.map((it) => (
            <Card key={it.title}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wrench size={18} /> {it.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{it.org}</p>
              <Pill>{it.dates}</Pill>
              <div className="mt-2 flex flex-wrap">
                {it.bullets.map((b, i) => (
                  <Pill key={i}>{b}</Pill>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="projects" title="Projects" kicker="Builds">
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((p) => (
            <Card key={p.name}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen size={18} /> {p.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{p.city}</p>
                </div>
                <Pill>{p.dates}</Pill>
              </div>
              <p className="mt-2 leading-7">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((t, i) => (
                  <Pill key={i}>{t}</Pill>
                ))}
              </div>
              {p.links && p.links.length > 0 && (
                <div className="mt-4 flex gap-3">
                  {p.links.map((l, i) => (
                    <a key={i} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm underline">
                      <ExternalLink size={16} /> {l.label}
                    </a>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>

      <Section id="passions" title="Passions" kicker="Life">
        <div className="grid md:grid-cols-3 gap-4">
          {PASSIONS.map((ps) => (
            <Card key={ps.title}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Heart size={18} /> {ps.title}
              </h3>
              <Pill>{ps.dates}</Pill>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                {ps.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="resume" title="Résumé" kicker="Download & quick facts">
        <Card>
          <div className="grid md:grid-cols-[1fr,auto] gap-4 items-center">
            <div>
              <p className="leading-7">
                Grab a PDF version of my résumé, or skim highlights below.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>
                  <Trophy size={14} className="mr-1" /> Dean's Honour List
                </Pill>
                <Pill>GPA 3.49</Pill>
                <Pill>ROS2 • PX4 • OpenCV</Pill>
                <Pill>Python • C • PHP • SQL • JS</Pill>
              </div>
            </div>
            <a
              href={resumeHrefDefault}
              download
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 bg-gradient-to-r from-[#9dbf9a]/25 to-[#f3a38c]/25 hover:from-[#9dbf9a]/35 hover:to-[#f3a38c]/35 text-white justify-self-start md:justify-self-end"
            >
              <FileDown size={18} /> Download PDF
            </a>
          </div>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-300 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</span>
          <a className="inline-flex items-center gap-2" href={PROFILE.github} target="_blank" rel="noreferrer">
            <Github size={16} /> GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
