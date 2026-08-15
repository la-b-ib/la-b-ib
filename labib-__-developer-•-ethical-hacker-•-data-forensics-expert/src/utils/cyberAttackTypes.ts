export interface CyberAttackTypeInfo {
  name: string;
  color: string;
  category?: string;
}

export const CYBER_ATTACK_COLOR_MAP: Record<string, string> = {
  'Ransomware': '#e84118', // Nasturcian Flower
  'Zero-Day Exploit': '#9c88ff', // Periwinkle
  'DDoS (Distributed Denial of Service)': '#c23616', // Harley Orange
  'DDoS': '#c23616',
  'SQL Injection (SQLi)': '#fbc531', // Rise-N-Shine
  'SQL Injection': '#fbc531',
  'Phishing / Spear Phishing': '#00a8ff', // Protoss Pylon
  'Phishing': '#00a8ff',
  'Man-in-the-Middle (MitM)': '#0097e6', // Vanadyl Blue
  'MitM': '#0097e6',
  'Cross-Site Scripting (XSS)': '#44bd32', // Skirret Green
  'XSS': '#44bd32',
  'Credential Stuffing': '#8c7ae6', // Matt Purple
  'Malware / Trojan': '#e84118', // Nasturcian Flower
  'Malware': '#e84118',
  'Business Email Compromise (BEC)': '#4cd137', // Elf Green
  'BEC': '#4cd137',
  'DNS Spoofing / Cache Poisoning': '#487eb0', // Seabrook
  'DNS Spoofing': '#487eb0',
  'Brute Force Attack': '#fbc531', // Rise-N-Shine
  'Brute Force': '#fbc531',
  'Drive-By Download': '#c23616', // Harley Orange
  'Supply Chain Attack': '#9c88ff', // Periwinkle
  'Insider Threat / Exfiltration': '#7f8fa6', // Blueberry Soda
  'Pass-the-Hash': '#8c7ae6', // Matt Purple
  'Reconnaissance': '#00a8ff', // Protoss Pylon
  'Cross-Site Request Forgery (CSRF)': '#4cd137', // Elf Green
  'CSRF': '#4cd137',
  'Buffer Overflow': '#e84118', // Nasturcian Flower
  'Session Hijacking': '#e1b12c', // Nanohanacha Gold
  'Cryptojacking': '#fbc531', // Rise-N-Shine
  'API Abuse / Broken Auth': '#44bd32', // Skirret Green
  'Watering Hole Attack': '#9c88ff', // Periwinkle
  'SIM Swapping': '#0097e6', // Vanadyl Blue
  'Keylogging / Spyware': '#4cd137', // Elf Green
};

export const ALL_CYBER_ATTACK_TYPES: string[] = [
  'Ransomware',
  'Zero-Day Exploit',
  'DDoS (Distributed Denial of Service)',
  'SQL Injection (SQLi)',
  'Phishing / Spear Phishing',
  'Man-in-the-Middle (MitM)',
  'Cross-Site Scripting (XSS)',
  'Credential Stuffing',
  'Malware / Trojan',
  'Business Email Compromise (BEC)',
  'DNS Spoofing / Cache Poisoning',
  'Brute Force Attack',
  'Drive-By Download',
  'Supply Chain Attack',
  'Insider Threat / Exfiltration',
  'Pass-the-Hash',
  'Reconnaissance',
  'Cross-Site Request Forgery (CSRF)',
  'Buffer Overflow',
  'Session Hijacking',
  'Cryptojacking',
  'API Abuse / Broken Auth',
  'Watering Hole Attack',
  'SIM Swapping',
  'Keylogging / Spyware',
];

export function getAttackColor(type: string, fallbackSeverity?: string): string {
  if (CYBER_ATTACK_COLOR_MAP[type]) {
    return CYBER_ATTACK_COLOR_MAP[type];
  }
  // Partial match check
  for (const [key, color] of Object.entries(CYBER_ATTACK_COLOR_MAP)) {
    if (type.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(type.toLowerCase())) {
      return color;
    }
  }
  if (fallbackSeverity === 'CRITICAL') return '#FF3366';
  if (fallbackSeverity === 'HIGH') return '#FFB800';
  return '#00F0FF';
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
