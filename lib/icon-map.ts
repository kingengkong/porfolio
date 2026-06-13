import * as LucideIcons from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";

export type IconName =
  | "BadgeCheck" | "BriefcaseBusiness" | "Camera" | "Code2" | "Database"
  | "FileCode2" | "Github" | "GraduationCap" | "Instagram" | "Linkedin"
  | "Mail" | "MessageCircle" | "Network" | "Palette" | "Server"
  | "ShieldCheck" | "Terminal" | "Wrench" | "ExternalLink" | "X"
  | "Send" | "ArrowDown" | "Download" | "Menu" | "Sun" | "Moon"
  | "ArrowUp" | "HelpCircle";

export type IconComponent = React.FC<LucideProps>;

export function getIconComponent(iconName: string | LucideIcon): IconComponent {
  if (typeof iconName !== "string") {
    return iconName as IconComponent;
  }
  const cleanIconName = iconName.trim();
  const IconComponent = (LucideIcons as any)[cleanIconName];
  return IconComponent || LucideIcons.HelpCircle;
}

export const AVAILABLE_ICONS: IconName[] = [
  "BadgeCheck", "BriefcaseBusiness", "Camera", "Code2", "Database",
  "FileCode2", "Github", "GraduationCap", "Instagram", "Linkedin",
  "Mail", "MessageCircle", "Network", "Palette", "Server",
  "ShieldCheck", "Terminal", "Wrench"
];