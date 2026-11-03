/**
 * Company marks for the showcase, loaded in the visitor's browser at runtime
 * (none are stored in this repository). For each company the page tries, in
 * order: the logo file on Wikimedia Commons (rendered at 320px), then the
 * company's site icon via Google's favicon service, then the monogram. All
 * marks are the companies' trademarks, shown here for the prototype only;
 * production use needs each company's consent and the brand team's files,
 * as the page states beneath the wall.
 */
export interface LogoSpec { domain: string; commons?: string[]; dark?: boolean }

const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=320`;
const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const LOGOS: Record<string, LogoSpec> = {
  'Siemens': { domain: 'siemens.com', commons: ['Siemens-logo.svg'] },
  'Northern Trust': { domain: 'northerntrust.com', commons: ['Northern Trust logo.svg', 'Northern Trust Logo.svg'] },
  'Pfizer': { domain: 'pfizer.com', commons: ['Pfizer (2021).svg', 'Pfizer logo.svg'] },
  'PepsiCo': { domain: 'pepsico.com', commons: ['PepsiCo logo.svg', 'PepsiCo Logo.svg'] },
  'IHG Hotels and Resorts': { domain: 'ihg.com', commons: ['IHG Hotels & Resorts logo.svg', 'IHG Hotels and Resorts logo.svg', 'InterContinental Hotels Group logo.svg'] },
  'Bechtel': { domain: 'bechtel.com', commons: ['Bechtel logo.svg', 'Bechtel Logo.svg'] },
  'Lucid': { domain: 'lucidmotors.com', commons: ['Lucid Motors Logo.svg', 'Lucid Motors logo.svg'] },
  'Hyundai': { domain: 'hyundai.com', commons: ['Hyundai Motor Company logo.svg'] },
  'SABIC': { domain: 'sabic.com', commons: ['SABIC logo.svg', 'Sabic-logo.svg', 'SABIC Logo.svg'] },
  'Almarai': { domain: 'almarai.com', commons: ['Almarai logo.svg', 'Almarai Logo.svg'] },
  'DHL': { domain: 'dhl.com', commons: ['DHL Logo.svg', 'DHL logo.svg'] },
  'Maersk': { domain: 'maersk.com', commons: ['Maersk Group Logo.svg', 'Maersk Logo.svg'] },
  'Google Cloud': { domain: 'cloud.google.com', commons: ['Google Cloud logo.svg'] },
  'Oracle': { domain: 'oracle.com', commons: ['Oracle logo.svg', 'Oracle Corporation logo.svg'] },
  'Ma’aden': { domain: 'maaden.com.sa', commons: ['Maaden logo.svg', 'Maaden Logo.svg', "Ma'aden logo.svg"] },
  'PwC': { domain: 'pwc.com', commons: ['PricewaterhouseCoopers Logo.svg', 'PwC logo.svg'] },
};

/** Ordered candidate URLs for a company name; empty when the company has no spec. */
export function logoCandidates(name: string): string[] {
  const s = LOGOS[name];
  if (!s) return [];
  return [...(s.commons ?? []).map(commons), favicon(s.domain)];
}
