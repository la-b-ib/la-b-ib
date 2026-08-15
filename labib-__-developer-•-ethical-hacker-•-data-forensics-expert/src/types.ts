export type DefconLevel = 1 | 2 | 3 | 4 | 5;

export type Theme = 'dark' | 'light';

export type CategoryFilter = 'all' | 'offsec' | 'dfir' | 'fullstack' | 'crypto' | 'auth';

export interface Skill {
  id: string;
  title: string;
  category: 'offsec' | 'dfir' | 'fullstack' | 'crypto';
  level: number;
  levelLabel: string;
  expYears: string;
  command: string;
  icon: string; // Remix icon class e.g. 'ri-shield-keyhole-line'
  description: string;
}

export interface Mission {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  period: string;
  category: 'offsec' | 'dfir' | 'fullstack';
  summary: string;
  bullets: string[];
  tech: string[];
  isCurrent?: boolean;
}

export interface Casefile {
  id: string;
  caseId: string;
  title: string;
  category: 'dfir' | 'offsec' | 'fullstack' | 'auth';
  badge: string;
  badgeColor: 'red' | 'teal' | 'purple' | 'cyan' | 'green';
  summary: string;
  details: string[];
  codeSnippet: string;
  language: string;
  tech: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface CredentialProfile {
  name: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
  badgeColor: string;
  status: string;
  description: string;
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  category: 'cybersecurity' | 'cloud' | 'automation' | 'analytics';
  description: string;
  link: string;
  icon: string;
  issueDate?: string;
  credentialId?: string;
  status?: string;
}

export interface VerifiedBadge {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  description: string;
  link: string;
  icon: string;
}

export interface Dispatch {
  id: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  fullMarkdown: string;
  codeSnippet?: string;
  category: 'dfir' | 'offsec' | 'arch' | 'ai_security' | 'cloud';
  tags: string[];
  cveReference?: string;
  threatLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFORMATIONAL';
  keyTakeaways?: string[];
  viewsCount?: number;
}

export interface Recommendation {
  id: string;
  name: string;
  role: string;
  organization?: string;
  linkedIn?: string;
  quote: string;
  badgeColor?: string;
  imageUrl?: string;
}

export interface EducationData {
  institution: string;
  degree: string;
  duration: string;
  cgpa: string;
  locationCoords: string;
  coreCoursework: string[];
}

export interface ThesisData {
  title: string;
  type: string;
  summary?: string;
}

export interface PublicationData {
  id: string;
  title: string;
  conference: string;
  location: string;
  date: string;
  isbn: string;
  doi: string;
}

export interface AwardData {
  id: string;
  title: string;
  issuer?: string;
}

export interface OrganizationGroup {
  category: string;
  items: string[];
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info' | 'teal' | 'amber';
  text: string;
}

export type AuditMode = 'full_audit' | 'yara_gen' | 'exploit_poc' | 'patch_diff';

export interface AuditFollowupMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SecurityAuditResult {
  vulnerabilityType: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  cwe: string;
  owaspCategory?: string;
  mitreAttck?: string;
  riskScore: number; // 0 to 100
  cvssVector?: string;
  exploitability?: 'High' | 'Medium' | 'Low';
  analysis: string;
  exploitVectorDetails?: string;
  recommendedRemediation: string;
  patchedSnippet: string;
  diffUnified?: string;
  yaraRule?: string;
  detectionSignature?: string;
}
