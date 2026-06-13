export type AboutItem = {
  title: string;
  description: string;
  icon: string;
};

export type Social = {
  label: string;
  href: string;
  icon: string;
};

export type Profile = {
  name: string;
  title: string;
  description: string;
  summary: string;
  roles: string[];
  email: string;
  location: string;
  avatar: string;
  profileImage: string;
  cvUrl: string;
  socials: Social[];
};

export type SkillCategory = {
  title: string;
  icon: string;
  skills: {
    name: string;
    percentage: number;
    icon: string;
  }[];
};

export type Project = {
  title: string;
  description: string;
  image: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
};

export type Certificate = {
  title: string;
  issuer: string;
  image: string;
};

export type Stat = {
  label: string;
  value: number;
  suffix: string;
  icon: string;
};

export type ContactItem = {
  label: string;
  value?: string;
  href: string;
  icon: string;
};

export type AboutSection = {
  profileNotes: {
    heading: string;
    description: string;
  };
  sectionDescription: string;
};

export type GalleryPhoto = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  filter: 'original' | 'grayscale';
  uploadedAt: string;
  order: number;
};