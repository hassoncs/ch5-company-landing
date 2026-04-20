export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: "product" | "tool" | "experiment";
  status?: "active" | "backlog";
  role?: "hero";
}

export const projects: Project[] = [
  {
    id: "firefly",
    name: "Firefly",
    tagline: "Privacy-first AI that reads your devices locally, masks PII before the cloud thinks.",
    category: "product",
    status: "active",
    role: "hero",
  },
  {
    id: "fitbot",
    name: "FitBot",
    tagline: "AI fitness coach that logs your workouts and coaches you back.",
    category: "product",
    status: "active",
  },
  {
    id: "waypoint",
    name: "Waypoint",
    tagline: "iOS navigation and location app for finding your way without the noise.",
    category: "product",
    status: "backlog",
  },
  {
    id: "macrobot",
    name: "MacroBot",
    tagline: "Keyboard macro automation for power users who hate repeating themselves.",
    category: "tool",
    status: "backlog",
  },
  {
    id: "slopcade",
    name: "Slopcade",
    tagline: "Game arcade for when you need to lose a few minutes on purpose.",
    category: "experiment",
    status: "backlog",
  },
  {
    id: "hush",
    name: "Hush",
    tagline: "SOPS-based secret manager for repos. No server, no thumbprint, fully automated.",
    category: "tool",
    status: "active",
  },
];

export const heroContent = {
  headline: "Real things, built slow.",
  subhead:
    "CH5 is a personal maker company. We ship apps that solve actual problems, then keep them running. No pitch decks, no growth theater.",
  badge: "Personal maker company",
};
