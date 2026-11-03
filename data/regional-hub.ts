/**
 * Content model for "Saudi as Your Regional Hub".
 *
 * Every figure carries the provenance attributes of the data governance
 * standard (source entity, period, last updated, verification status, owner).
 * Nothing here is a confirmed figure: values are `[approved figure]`
 * placeholders with status `unavailable` until the owning team supplies them.
 * A band renders its "unavailable" behaviour when that is the status.
 */

export type Status = 'verified' | 'published' | 'benchmark' | 'estimate' | 'unavailable';

export interface Provenance {
  source: string;
  period: string;
  updated: string;
  status: Status;
  owner: string;
}

export interface Figure extends Provenance {
  label: string;
  value: string;
}

export const PLACEHOLDER = '[approved figure]';

/* Figures already published on investsaudi.sa (Why Saudi page, read 3 Nov 2026) with the
 * source the site cites. Status "published": on the live site, not yet re-verified by the Data team. */
const published = (cited: string, period: string, owner = 'Data Team'): Provenance => ({
  source: `investsaudi.sa (Why Saudi), citing ${cited}`,
  period,
  updated: 'live site, read 3 Nov 2026',
  status: 'published',
  owner,
});

/* Figures taken from an authority's own publication (not via investsaudi.sa). */
const official = (source: string, period: string, owner = 'Data Team'): Provenance => ({ source, period, updated: 'authority publication, read 3 Nov 2026', status: 'published', owner });
const benchmark = (source: string, period: string, owner = 'Data Team'): Provenance => ({ source, period, updated: 'public benchmark, not re-verified', status: 'benchmark', owner });

const pending = (owner: string, source: string): Provenance => ({
  source,
  period: 'period to be set',
  updated: 'not yet published',
  status: 'unavailable',
  owner,
});

/* Band 1: router vocabularies. The sector list must be replaced by the
 * published controlled vocabulary before build; it is illustrative here. */
export const INDUSTRIES = [
  'Advanced Manufacturing',
  'Chemicals',
  'Energy',
  'Financial Services',
  'Food and Agriculture',
  'Healthcare and Life Sciences',
  'ICT',
  'Logistics',
  'Mining and Metals',
  'Real Estate',
  'Tourism',
];

export interface Market { code: string; name: string; group: 'GCC' | 'Levant and Iraq' | 'North Africa' | 'East and West Africa' | 'South Asia and Türkiye'; city: string; lat: number; lon: number; countryId: string }
export const MARKETS: Market[] = [
  { code: 'AE', name: 'United Arab Emirates', group: 'GCC', city: 'Dubai', lat: 25.25, lon: 55.3, countryId: '784' },
  { code: 'QA', name: 'Qatar', group: 'GCC', city: 'Doha', lat: 25.29, lon: 51.53, countryId: '634' },
  { code: 'KW', name: 'Kuwait', group: 'GCC', city: 'Kuwait City', lat: 29.38, lon: 47.98, countryId: '414' },
  { code: 'BH', name: 'Bahrain', group: 'GCC', city: 'Manama', lat: 26.23, lon: 50.59, countryId: '048' },
  { code: 'OM', name: 'Oman', group: 'GCC', city: 'Muscat', lat: 23.59, lon: 58.41, countryId: '512' },
  { code: 'JO', name: 'Jordan', group: 'Levant and Iraq', city: 'Amman', lat: 31.95, lon: 35.93, countryId: '400' },
  { code: 'IQ', name: 'Iraq', group: 'Levant and Iraq', city: 'Baghdad', lat: 33.31, lon: 44.37, countryId: '368' },
  { code: 'EG', name: 'Egypt', group: 'North Africa', city: 'Cairo', lat: 30.04, lon: 31.24, countryId: '818' },
  { code: 'MA', name: 'Morocco', group: 'North Africa', city: 'Casablanca', lat: 33.57, lon: -7.59, countryId: '504' },
  { code: 'ET', name: 'Ethiopia', group: 'East and West Africa', city: 'Addis Ababa', lat: 9.02, lon: 38.75, countryId: '231' },
  { code: 'KE', name: 'Kenya', group: 'East and West Africa', city: 'Nairobi', lat: -1.29, lon: 36.82, countryId: '404' },
  { code: 'NG', name: 'Nigeria', group: 'East and West Africa', city: 'Lagos', lat: 6.52, lon: 3.38, countryId: '566' },
  { code: 'TR', name: 'Türkiye', group: 'South Asia and Türkiye', city: 'Istanbul', lat: 41.01, lon: 28.98, countryId: '792' },
  { code: 'PK', name: 'Pakistan', group: 'South Asia and Türkiye', city: 'Karachi', lat: 24.86, lon: 67.01, countryId: '586' },
  { code: 'IN', name: 'India', group: 'South Asia and Türkiye', city: 'Mumbai', lat: 19.08, lon: 72.88, countryId: '356' },
];

export type RouteId = 'export' | 'logistics' | 'services' | 'digital' | 'corporate';

export interface Route {
  connectivity: string;
  id: RouteId;
  title: string;
  meta: string;
  description: string;
  icon: string;
  licence: string;
  incentives: string[];
  steps: { title: string; description: string }[];
  startLabel: string;
  startHref: string;
  provenance: Provenance;
}

/* Band 6: five ways to run the region from Saudi Arabia. RHQ is one card. */
export const ROUTES: Route[] = [
  {
    id: 'export',
    connectivity: 'Sea for Europe, Africa and Asia; road for the GCC; rail where the plant sits on the SAR network.',
    title: 'Export and manufacturing base',
    meta: 'Make in Saudi, sell to the region',
    description: 'Produce in an industrial city or economic zone and ship under GCC and GAFTA rules of origin.',
    icon: 'tool-02',
    licence: 'Industrial licence (MISA) with MODON or economic city land',
    incentives: ['Potentially applicable: SEZ regime (5% CIT for 20 years, 0% WHT, customs deferral) inside a zone; MODON serviced land at published rates; SIDF industrial loans; customs duty exemption on machinery and raw materials for licensed factories. Eligibility is rule-based and confirmed per application.'],
    steps: [
      { title: 'Choose a platform', description: 'Industrial city, SEZ or economic city' },
      { title: 'Licence', description: 'Industrial licence and commercial registration' },
      { title: 'Land and build', description: 'Allocation, permits, utilities' },
      { title: 'Export', description: 'Certificates of origin, customs registration' },
    ],
    startLabel: 'Start an industrial licence',
    startHref: '#',
    provenance: official('MISA e-services catalogue and ECZA', 'as published', 'Investor Services'),
  },
  {
    id: 'logistics',
    connectivity: 'Air cargo at Riyadh, Jeddah and Dammam; container ports on both coasts; GCC road corridors; bonded zones at each.',
    title: 'Distribution and logistics hub',
    meta: 'Store, re-export and serve the region',
    description: 'Operate from a bonded or special logistics zone with duty deferral on goods in transit.',
    icon: 'truck-01',
    licence: 'Service licence (MISA); zone licence where applicable',
    incentives: ['Potentially applicable: ILBZ regime (0% CIT on qualifying activities for 50 years, customs and VAT suspension); SEZ bonded status; customs deferral on goods in transit. Confirmed with the zone authority.'],
    steps: [
      { title: 'Choose a zone', description: 'Special logistics zone, bonded zone or port-side site' },
      { title: 'Licence', description: 'Service licence and zone registration' },
      { title: 'Customs', description: 'Bonded status and ZATCA registration' },
      { title: 'Operate', description: 'Carrier and 3PL partners' },
    ],
    startLabel: 'Start a service licence',
    startHref: '#',
    provenance: official('MISA e-services catalogue and ECZA', 'as published', 'Investor Services'),
  },
  {
    id: 'services',
    connectivity: 'Air connectivity for people; digital connectivity for delivery; data residency per market.',
    title: 'Services and finance centre',
    meta: 'Professional, financial and shared services',
    description: 'Run regional finance, advisory, engineering or shared-service operations from Riyadh or the financial district.',
    icon: 'bank',
    licence: 'Service licence (MISA); sector regulator authorisation where required (SAMA, CMA)',
    incentives: ['Potentially applicable: RHQ package where the entity qualifies; KAFD and business-district programmes; professional accreditation recognition for RHQ staff. Regulated activities follow SAMA or CMA rules.'],
    steps: [
      { title: 'Licence', description: 'Service licence and regulator authorisation' },
      { title: 'Office', description: 'Financial district or business district' },
      { title: 'Talent', description: 'Work visas and professional accreditation' },
      { title: 'Operate', description: 'Banking, payroll, compliance' },
    ],
    startLabel: 'Start a service licence',
    startHref: '#',
    provenance: official('MISA e-services catalogue and ECZA', 'as published', 'Investor Services'),
  },
  {
    id: 'digital',
    connectivity: 'Subsea landings on both coasts, national fibre, cloud regions in Riyadh and Dammam.',
    title: 'Digital and data hub',
    meta: 'Cloud, data centres and regional platforms',
    description: 'Host and serve regional digital services from the cloud computing zone and data-centre sites.',
    icon: 'server-04',
    licence: 'Service licence (MISA); CST registration; cloud zone licence',
    incentives: ['Potentially applicable: Cloud Computing SEZ regime for cloud and data-centre activities; CST data residency framework; industrial electricity tariff. Confirmed with ECZA and CST.'],
    steps: [
      { title: 'Choose a site', description: 'Cloud computing zone or data-centre location' },
      { title: 'Licence', description: 'Service licence and CST registration' },
      { title: 'Connect', description: 'Power, fibre and cross-border capacity' },
      { title: 'Operate', description: 'Data residency and compliance' },
    ],
    startLabel: 'Start a service licence',
    startHref: '#',
    provenance: official('MISA e-services catalogue and ECZA', 'as published', 'Investor Services'),
  },
  {
    id: 'corporate',
    connectivity: 'Flights to every regional capital; the same digital backbone for shared services.',
    title: 'Corporate base (Regional Headquarters)',
    meta: 'Direct and manage the region from Saudi',
    description: 'License a regional headquarters that directs your subsidiaries across the Middle East and North Africa.',
    icon: 'building-07',
    licence: 'RHQ licence (MISA and RCRC)',
    incentives: ['Published for licensed RHQs: 0% corporate income tax and withholding tax on approved RHQ activities for 30 years; 10-year exemption from Saudization requirements; unlimited work visas for RHQ staff; spouse work permits and dependents to age 25; recognition of home-country professional accreditation. Eligibility: two or more subsidiaries in the region, 15 staff including three executives within one year.'],
    steps: [
      { title: 'Eligibility', description: 'Group structure and regional footprint' },
      { title: 'Licence', description: 'RHQ licence application' },
      { title: 'Set up', description: 'Visas, incorporation, government accounts, office' },
      { title: 'Activate', description: 'Approved activities within one year' },
    ],
    startLabel: 'Start an RHQ application',
    startHref: '#',
    provenance: official('MISA RHQ programme page and ZATCA RHQ tax rules', 'rules effective 2024', 'RHQ Program team'),
  },
];

/* Band 2: reach. Five figures, each a record with provenance. */
export const REACH: Figure[] = [
  { label: 'World population within 8 hours by air', value: '50%', ...published('GACA', 'as shown on the live site') },
  { label: 'Consumers within a 4-hour flight', value: '2B+', ...published('Invest Saudi', 'as shown on the live site') },
  { label: 'Continents within a 4-hour flight', value: '3', ...published('Invest Saudi', 'as shown on the live site') },
  { label: 'Largest economy in MENA', value: '$1.2T+', ...published('World Bank', 'as shown on the live site') },
  { label: 'Logistics Performance Index rank', value: '38th', ...published('World Bank', 'as shown on the live site') },
];

/* Reach rings for the globe: angular radius from Riyadh. 4 hours and 8 hours are the two
 * published flight-reach figures; the ring radius is an estimate (about 850 km/h cruise). */
export const REACH_RINGS = [
  { hours: 4, km: 3400, label: '4-hour flight radius', ...published('Invest Saudi', 'as shown on the live site') },
  { hours: 8, km: 6800, label: '8-hour flight radius', ...published('GACA', 'as shown on the live site') },
];

export const HUB_CITIES = [
  { id: 'ruh', name: 'Riyadh', lat: 24.71, lon: 46.68 },
  { id: 'jed', name: 'Jeddah', lat: 21.49, lon: 39.19 },
  { id: 'dmm', name: 'Dammam', lat: 26.43, lon: 50.10 },
];

/* Connectivity headline figures from the live site. */
export const CONNECTIVITY_FIGURES: Figure[] = [
  { label: 'Planned logistics zones by 2030', value: '59', ...published('Invest Saudi', 'as shown on the live site') },
  { label: 'Industrial cities nationwide', value: '39+', ...published('MODON', '2024') },
  { label: 'National 5G coverage', value: '100%', ...published('CITC', 'as shown on the live site') },
  { label: 'Internet penetration', value: '99.7%', ...published('CITC', 'as shown on the live site') },
];

/* Anchor market: domestic figures already on the live site. */
export const DOMESTIC: Figure[] = [
  { label: 'Real GDP growth, 2024', value: '2.7%', ...published('GASTAT', '2024') },
  { label: 'FDI inflows growth, 2024', value: '24%', ...published('GASTAT', '2024') },
];

/* Digital connectivity: landing cities and data-centre locations. Cable names and
 * capacities are not listed until CST supplies them; cities are landing points
 * commonly reported for Red Sea and Gulf systems, status benchmark. */
export interface DigitalNode extends Provenance { id: string; name: string; kind: 'landing' | 'datacentre' | 'cloud'; lat: number; lon: number; note: string }
export const DIGITAL_NODES: DigitalNode[] = [
  { id: 'd-jed', name: 'Jeddah', kind: 'landing', lat: 21.54, lon: 39.17, note: 'Red Sea subsea landing city (Europe to Asia systems)', ...benchmark('CST; submarine cable registries', 'to confirm cable list') },
  { id: 'd-ynb', name: 'Yanbu', kind: 'landing', lat: 24.09, lon: 38.06, note: 'Red Sea subsea landing city', ...benchmark('CST; submarine cable registries', 'to confirm cable list') },
  { id: 'd-khb', name: 'Al Khobar', kind: 'landing', lat: 26.28, lon: 50.21, note: 'Arabian Gulf subsea landing city (Gulf systems)', ...benchmark('CST; submarine cable registries', 'to confirm cable list') },
  { id: 'd-ruh', name: 'Riyadh', kind: 'cloud', lat: 24.71, lon: 46.68, note: 'Cloud Computing SEZ seat; hyperscale regions announced or operating', ...benchmark('ECZA; provider announcements', 'to confirm per provider') },
  { id: 'd-dmm', name: 'Dammam', kind: 'cloud', lat: 26.43, lon: 50.10, note: 'Hyperscale cloud region (announced)', ...benchmark('Provider announcements', 'to confirm per provider') },
  { id: 'd-neom', name: 'NEOM', kind: 'datacentre', lat: 28.0, lon: 35.2, note: 'Data-centre and landing projects, planned', ...benchmark('NEOM announcements', 'planned, not operating') },
];
export const DIGITAL_FIGURES: Figure[] = [
  { label: 'National 5G coverage', value: '100%', ...published('CITC', 'as shown on the live site') },
  { label: 'Internet penetration', value: '99.7%', ...published('CITC', 'as shown on the live site') },
  { label: 'G20 digital economy ranking', value: '2nd', ...published('CST', '2024') },
  { label: 'Digital economy valuation', value: '$132B', ...published('Vision 2030', '2025') },
];

/* Why each mode matters, by business model. Links go to existing entities. */
export const MODE_RELEVANCE: Record<'air' | 'sea' | 'ground' | 'digital', { who: string; why: string }[]> = {
  air: [
    { who: 'Regional headquarters and professional services', why: 'Executives reach every GCC capital in under two hours and most of the region within four, from three international airports.' },
    { who: 'High-value and time-sensitive exports', why: 'Air cargo from Riyadh, Jeddah and Dammam serves pharmaceuticals, electronics and e-commerce; the Riyadh logistics zone sits beside the airport.' },
    { who: 'What is planned, not operating', why: 'King Salman International Airport in Riyadh and the new national carrier are development programmes; capacity figures are not used until published.' },
  ],
  sea: [
    { who: 'Manufacturers and exporters', why: 'Red Sea ports face Europe, Africa and the Suez route; Gulf ports face the GCC and Asia. A plant at KAEC, Jazan, Jubail or Yanbu sits beside a port.' },
    { who: 'Importers and distributors', why: 'Container terminals at Jeddah and Dammam feed the domestic market and re-export through bonded zones.' },
    { who: 'What this is not', why: 'A port does not confer preferential access; that comes from the agreements in the market-access section and from each market’s regulator.' },
  ],
  ground: [
    { who: 'Consumer goods and food', why: 'Trucks reach Kuwait, Bahrain, Qatar, the UAE and Jordan from Riyadh or Dammam within a day, inside the GCC customs union for GCC-origin goods.' },
    { who: 'Industrial supply chains', why: 'Operating rail links Riyadh with Dammam and the north; the Landbridge and GCC Railway are planned and shown dotted.' },
    { who: 'Regional distribution', why: 'Inland logistics at the Riyadh zone and MODON cities serve the GCC by road without a sea leg.' },
  ],
  digital: [
    { who: 'Cloud, AI and data businesses', why: 'Subsea systems land on both coasts and hyperscale regions operate or are announced in Riyadh and Dammam; the Cloud Computing SEZ licenses data-centre activity.' },
    { who: 'Financial and professional services', why: 'National 5G and near-universal internet support regional service delivery from Saudi offices; data residency rules decide what can be served cross-border.' },
    { who: 'What to verify', why: 'Cable names, capacities and each provider’s live region status are confirmed with CST and the providers before they appear here.' },
  ],
};

export interface Node extends Provenance { id: string; name: string; mode: 'sea' | 'air' | 'land'; location: string; capacity: string; transit: string; lat: number; lon: number }
export const NODES: Node[] = [
  { id: 'jip', name: 'Jeddah Islamic Port', mode: 'sea', location: 'Jeddah, Red Sea', lat: 21.47, lon: 39.17, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('Mawani', 'Mawani port statistics') },
  { id: 'kap', name: 'King Abdullah Port', mode: 'sea', location: 'King Abdullah Economic City, Red Sea', lat: 22.43, lon: 39.08, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('Mawani', 'Mawani port statistics') },
  { id: 'dmm', name: 'King Abdulaziz Port', mode: 'sea', location: 'Dammam, Arabian Gulf', lat: 26.47, lon: 50.2, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('Mawani', 'Mawani port statistics') },
  { id: 'jub', name: 'Jubail Commercial Port', mode: 'sea', location: 'Jubail, Arabian Gulf', lat: 27.03, lon: 49.66, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('Mawani', 'Mawani port statistics') },
  { id: 'ruh', name: 'King Khalid International Airport', mode: 'air', location: 'Riyadh', lat: 24.96, lon: 46.7, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('GACA', 'GACA air cargo statistics') },
  { id: 'jed', name: 'King Abdulaziz International Airport', mode: 'air', location: 'Jeddah', lat: 21.68, lon: 39.16, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('GACA', 'GACA air cargo statistics') },
  { id: 'dmmair', name: 'King Fahd International Airport', mode: 'air', location: 'Dammam', lat: 26.47, lon: 49.8, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('GACA', 'GACA air cargo statistics') },
  { id: 'land', name: 'Saudi Landbridge (rail, planned)', mode: 'land', location: 'Jeddah to Riyadh to Dammam', lat: 24.0, lon: 45.0, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('Saudi Arabia Railways', 'SAR programme status') },
  { id: 'border', name: 'Road corridors to GCC, Jordan and Iraq', mode: 'land', location: 'Batha, Salwa, Al Haditha, Jadidat Arar', lat: 28.5, lon: 46.5, capacity: PLACEHOLDER, transit: PLACEHOLDER, ...pending('ZATCA', 'ZATCA land port statistics') },
];

/* Band 4: market access records. */
export interface Agreement extends Provenance { id: string; name: string; type: 'Customs union' | 'Free trade agreement' | 'Double tax treaty' | 'Investment agreement'; markets: string[]; inForce: 'In force' | 'Status to confirm'; summary: string }
export const AGREEMENTS: Agreement[] = [
  { id: 'gcc', name: 'GCC Customs Union', type: 'Customs union', markets: ['AE', 'QA', 'KW', 'BH', 'OM'], inForce: 'In force', summary: 'Single customs territory since 2003: common external tariff (5% on most goods) and free movement of GCC-origin goods between the six states.', ...benchmark('GCC Secretariat; ZATCA', 'in force since 2003') },
  { id: 'gafta', name: 'Greater Arab Free Trade Area (GAFTA)', type: 'Free trade agreement', markets: ['AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'IQ', 'EG', 'MA'], inForce: 'In force', summary: 'Duty-free trade in goods of Arab origin across 18 Arab League states, full liberalisation since 2005, subject to 40% local value-added rules of origin.', ...benchmark('Arab League; Ministry of Commerce', 'in force since 1998, full tariff removal 2005') },
  { id: 'efta', name: 'GCC and EFTA Free Trade Agreement', type: 'Free trade agreement', markets: [], inForce: 'In force', summary: 'Preferential access for goods between the GCC and Iceland, Liechtenstein, Norway and Switzerland.', ...benchmark('GCC Secretariat; EFTA', 'in force since 2014') },
  { id: 'sg', name: 'GCC and Singapore Free Trade Agreement', type: 'Free trade agreement', markets: [], inForce: 'In force', summary: 'Preferential access for goods between the GCC and Singapore; a corridor for Asian re-export.', ...benchmark('GCC Secretariat', 'in force since 2013') },
  { id: 'wto', name: 'WTO membership', type: 'Free trade agreement', markets: [], inForce: 'In force', summary: 'Most-favoured-nation treatment with all WTO members, including every market on this page.', ...benchmark('WTO', 'member since 2005') },
];

/* Double tax treaties between Saudi Arabia and each market. "Published": confirmed in
 * the ZATCA treaty list or treaty text. "Benchmark": widely reported, to confirm with ZATCA. */
export interface Treaty extends Provenance { market: string; treaty: 'In force' | 'Signed, not yet in force' | 'No treaty listed'; since?: string; note: string }
export const TREATIES: Treaty[] = [
  { market: 'AE', treaty: 'In force', since: '2019', note: 'First GCC-to-GCC treaty; covers dividends, interest and royalties.', ...official('ZATCA treaty list', 'effective 1 Jan 2019') },
  { market: 'EG', treaty: 'In force', since: '2018', note: 'Convention published on the ZATCA agreements page.', ...official('ZATCA treaty list', 'in force') },
  { market: 'TR', treaty: 'In force', since: '2009', note: 'Long-standing convention.', ...official('ZATCA treaty list', 'in force') },
  { market: 'PK', treaty: 'In force', since: '2006', note: 'Long-standing convention.', ...official('ZATCA treaty list', 'in force') },
  { market: 'IN', treaty: 'In force', since: '2006', note: 'Convention with 2018 protocol.', ...official('ZATCA treaty list', 'in force') },
  { market: 'JO', treaty: 'In force', since: '2017', note: 'To confirm effective date with ZATCA.', ...benchmark('ZATCA treaty list', 'reported in force') },
  { market: 'MA', treaty: 'In force', since: '2017', note: 'To confirm effective date with ZATCA.', ...benchmark('ZATCA treaty list', 'reported in force') },
  { market: 'ET', treaty: 'In force', since: '2016', note: 'To confirm effective date with ZATCA.', ...benchmark('ZATCA treaty list', 'reported in force') },
  { market: 'IQ', treaty: 'Signed, not yet in force', note: 'Signed 2021; ratification status to confirm.', ...benchmark('ZATCA treaty list', 'status to confirm') },
  { market: 'KE', treaty: 'Signed, not yet in force', note: 'Ratification status to confirm.', ...benchmark('ZATCA treaty list', 'status to confirm') },
  { market: 'KW', treaty: 'No treaty listed', note: 'GCC nationals and companies are generally subject to zakat rather than income tax in Saudi Arabia.', ...benchmark('ZATCA treaty list', 'no treaty listed') },
  { market: 'QA', treaty: 'No treaty listed', note: 'As above for GCC entities.', ...benchmark('ZATCA treaty list', 'no treaty listed') },
  { market: 'BH', treaty: 'No treaty listed', note: 'As above for GCC entities.', ...benchmark('ZATCA treaty list', 'no treaty listed') },
  { market: 'OM', treaty: 'No treaty listed', note: 'As above for GCC entities.', ...benchmark('ZATCA treaty list', 'no treaty listed') },
  { market: 'NG', treaty: 'No treaty listed', note: 'No convention in force.', ...benchmark('ZATCA treaty list', 'no treaty listed') },
];

/* Band 5: platforms to operate from. */
export interface Platform extends Provenance { id: string; name: string; kind: 'Special Economic Zone' | 'Logistics zone' | 'Industrial city' | 'Economic city'; location: string; permits: string[]; authority: string; routes: RouteId[]; href: string; connectedTo: string[] }
export const SEZ_INCENTIVES = [
  '5% corporate income tax for up to 20 years',
  '0% withholding tax on repatriation of profits to a foreign country',
  '0% customs duty deferral for goods inside the zone',
  '0% VAT on intra-zone goods exchanged within or between zones',
  'Flexible Saudization and expatriate fee relief during the first five years',
];
export const PLATFORMS: Platform[] = [
  { id: 'kaec-sez', name: 'King Abdullah Economic City SEZ', kind: 'Special Economic Zone', location: 'Rabigh, Makkah Province, on the Red Sea beside King Abdullah Port', permits: ['Automotive, advanced manufacturing, consumer goods, ICT and medtech', 'Port-side manufacturing for export to Africa and Europe', ...SEZ_INCENTIVES.slice(0, 2)], authority: 'ECZA', routes: ['export', 'logistics'], href: 'https://investsaudi.sa', connectedTo: ['King Abdullah Port (sea)', 'Haramain rail', 'Jeddah airport, about 1 hour by road'], ...published('ECZA, as shown on the live site', 'launched April 2023') },
  { id: 'jazan-sez', name: 'Jazan SEZ', kind: 'Special Economic Zone', location: 'Jazan, south-west coast, beside Jazan City for Primary and Downstream Industries', permits: ['Food processing, metals conversion and logistics', 'Red Sea port access to East Africa', ...SEZ_INCENTIVES.slice(0, 2)], authority: 'ECZA', routes: ['export', 'logistics'], href: 'https://investsaudi.sa', connectedTo: ['Jazan port (sea)', 'Jazan airport', 'Al Tuwal crossing to Yemen'], ...published('ECZA, as shown on the live site', 'launched April 2023') },
  { id: 'rak-sez', name: 'Ras Al-Khair SEZ', kind: 'Special Economic Zone', location: 'Eastern Province, Arabian Gulf', permits: ['Shipbuilding, maritime industries and offshore rigs', 'Industrial port and the King Salman maritime complex', ...SEZ_INCENTIVES.slice(0, 2)], authority: 'ECZA', routes: ['export'], href: 'https://investsaudi.sa', connectedTo: ['Ras Al-Khair industrial port (sea)', 'Jubail and Dammam by road'], ...published('ECZA, as shown on the live site', 'launched April 2023') },
  { id: 'cloud-sez', name: 'Cloud Computing SEZ', kind: 'Special Economic Zone', location: 'Riyadh (KACST Innovation Tower) with data centres anywhere in the Kingdom', permits: ['Cloud services and data-centre operations', 'Data residency framework under CST', 'SEZ tax regime for cloud activities'], authority: 'ECZA with CST', routes: ['digital'], href: 'https://investsaudi.sa', connectedTo: ['Riyadh cloud regions', 'Subsea landings at Jeddah and Al Khobar via national fibre'], ...published('ECZA, as shown on the live site', 'launched April 2023') },
  { id: 'ilbz', name: 'Riyadh Integrated Special Logistics Zone', kind: 'Logistics zone', location: 'King Khalid International Airport, Riyadh', permits: ['Bonded storage, re-export and light value-added assembly', '0% corporate income tax on qualifying activities for 50 years', 'Customs and VAT suspension inside the zone'], authority: 'GACA', routes: ['logistics', 'digital'], href: 'https://investsaudi.sa', connectedTo: ['King Khalid International Airport (air cargo)', 'Riyadh to Dammam expressway', 'SAR East line'], ...official('GACA ILBZ rules', 'operating since 2022') },
  { id: 'modon', name: 'Industrial cities (MODON)', kind: 'Industrial city', location: '39+ cities nationwide', permits: ['Serviced industrial land at published annual rates', 'Factory licensing and ready-built units', 'Utilities, logistics and worker housing services'], authority: 'MODON', routes: ['export'], href: 'https://investsaudi.sa', connectedTo: ['Nearest port and airport per city', 'National highway network'], ...published('MODON', '2024') },
  { id: 'rcjy', name: 'Jubail and Yanbu industrial cities', kind: 'Industrial city', location: 'Jubail (Arabian Gulf) and Yanbu (Red Sea)', permits: ['Petrochemicals, chemicals and energy-intensive industry', 'Deep-water industrial ports on both coasts', 'Feedstock and utilities at industrial tariffs'], authority: 'Royal Commission for Jubail and Yanbu', routes: ['export'], href: 'https://investsaudi.sa', connectedTo: ['Jubail Commercial Port and King Fahd Industrial Port (sea)', 'Yanbu Commercial Port (sea)', 'SAR East line at Jubail'], ...benchmark('RCJY', 'as published') },
];

/* Band 7: industry in the region. Served only when the sector team has
 * published the regional layer for the selected industry. */
export interface IndustryRegion extends Provenance { industry: string; summary: string; saudiPosition: string; connectivity: string; nationalFigures: Figure[]; demandByMarket?: { market: string; value: number }[]; sectorHref: string }
const sectorPage = (i: string) => `/sectors/${i.toLowerCase().replace(/\s+and\s+/g, '-').replace(/\s+/g, '-')}`;
const nf = (label: string, value: string, cited: string, period: string): Figure => ({ label, value, ...published(cited, period) });
export const INDUSTRY_REGION: Record<string, IndustryRegion> = {
  'Advanced Manufacturing': { industry: 'Advanced Manufacturing', summary: 'Regional demand for machinery, vehicles, electrical equipment and building products is met mostly by imports from Asia and Europe. A Saudi plant serves the GCC duty-free and GAFTA markets under rules of origin.', saudiPosition: 'The largest industrial base in the region, with NIDLP localisation programmes in automotive, defence and renewables equipment.', connectivity: 'Produce here, then export by sea from KAEC, Jubail or Yanbu and by road to the GCC. Check rules of origin per market before pricing the route.', nationalFigures: [nf('Industrial cities nationwide', '39+', 'MODON', '2024'), nf('Localization target in priority programmes', '70%', 'NIDLP, GAMI, MCIT', 'as shown on the live site')], sectorHref: sectorPage('Advanced Manufacturing'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  Chemicals: { industry: 'Chemicals', summary: 'The Gulf is a net exporter of basic chemicals and a net importer of specialty and performance chemicals; downstream conversion for the region is the open space.', saudiPosition: 'Home to the largest petrochemical complexes in the region at Jubail and Yanbu, with feedstock at industrial tariffs.', connectivity: 'Jubail and Yanbu ship from their own industrial ports; downstream converters can sit in the SEZs beside them.', nationalFigures: [nf('Gas feedstock price', '$2.15/MMBtu', 'Invest Saudi energy page', 'as shown on the live site')], sectorHref: sectorPage('Chemicals'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  Energy: { industry: 'Energy', summary: 'Every market on this page is adding renewable capacity and grid infrastructure; Saudi projects are the largest single pipeline in the region for turbines, panels, cables and storage.', saudiPosition: 'The regional reference market for utility-scale solar and wind procurement at record tariffs.', connectivity: 'Equipment moves by sea into Jubail, Dammam and Jeddah; project sites are served by the national highway network.', nationalFigures: [nf('Renewable capacity delivered in 5 years', '64 GW', 'Invest Saudi energy page', 'as shown on the live site'), nf('Renewables targeted by 2030', '130 GW', 'Invest Saudi energy page', 'as shown on the live site'), nf('Electricity from renewables by 2030', '50%', 'Ministry of Energy', 'as shown on the live site')], sectorHref: sectorPage('Energy'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  'Financial Services': { industry: 'Financial Services', summary: 'Regional banking, asset management and fintech serve a fast-growing banked population across the GCC, Egypt and Pakistan; licensing is national, so a regional base needs a regulator that moves quickly.', saudiPosition: 'The largest capital market in the region (Tadawul) and a financial district (KAFD) built for regional headquarters.', connectivity: 'Serve Saudi demand from Riyadh and reach regional clients by air within hours; cross-border services depend on each market’s regulator, not on distance.', nationalFigures: [nf('Largest economy in MENA', '$1.2T+', 'World Bank', 'as shown on the live site')], sectorHref: sectorPage('Financial Services'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  'Food and Agriculture': { industry: 'Food and Agriculture', summary: 'The GCC imports most of its food; processing, cold-chain and halal certification from a Saudi base reach the Gulf by road within a day and the Red Sea markets by sea.', saudiPosition: 'The largest food market in the GCC and a regional exporter of dairy, poultry and processed foods.', connectivity: 'Road corridors put the GCC within a day; cold-chain and halal certification travel with the goods.', nationalFigures: [], sectorHref: sectorPage('Food and Agriculture'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  'Healthcare and Life Sciences': { industry: 'Healthcare and Life Sciences', summary: 'Pharmaceuticals and medical devices are imported across the region; local manufacturing with SFDA registration opens the GCC through mutual recognition.', saudiPosition: 'The largest healthcare market in the region, with the Health Sector Transformation Program and NUPCO procurement as demand anchors.', connectivity: 'Manufacture with SFDA registration, distribute by air cargo for time-sensitive products and by road across the GCC.', nationalFigures: [], sectorHref: sectorPage('Healthcare and Life Sciences'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  ICT: { industry: 'ICT', summary: 'Cloud, data centres and digital services for the Middle East and North Africa are consolidating in a few hubs; data residency rules in each market decide where regional platforms sit.', saudiPosition: 'The largest ICT market in the region by spend, with hyperscale cloud regions and the Cloud Computing SEZ.', connectivity: 'Cloud regions and subsea landings support regional platforms; data residency rules in each market decide what is served from Saudi Arabia.', nationalFigures: [nf('Digital economy valuation', '$132B', 'Vision 2030', '2025'), nf('G20 digital economy ranking', '2nd', 'CST', '2024'), nf('National 5G coverage', '100%', 'CITC', 'as shown on the live site')], sectorHref: sectorPage('ICT'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  Logistics: { industry: 'Logistics', summary: 'Trade between Asia, Europe and Africa crosses the region by sea; the hubs compete on port capacity, customs speed and re-export regimes.', saudiPosition: 'Two coastlines, the Landbridge programme and 59 planned logistics zones under the National Transport and Logistics Strategy.', connectivity: 'Ports on two coasts, three cargo airports, GCC road corridors and bonded zones; the integrated view on the globe shows how they join.', nationalFigures: [nf('Logistics Performance Index rank', '38th', 'World Bank', '2023'), nf('Planned logistics zones by 2030', '59', 'Invest Saudi', 'as shown on the live site')], sectorHref: sectorPage('Logistics'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  'Mining and Metals': { industry: 'Mining and Metals', summary: 'Regional demand for steel, aluminium, copper and phosphate products tracks construction and energy investment; the Arabian Shield is the largest under-explored mineral belt in the region.', saudiPosition: 'A national mining strategy targeting the sector as the third pillar of industry, with Ma’aden as the anchor.', connectivity: 'Ras Al-Khair and Jubail ports export concentrates and metals; the SAR North line carries phosphate and bauxite to the coast.', nationalFigures: [], sectorHref: sectorPage('Mining and Metals'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  'Real Estate': { industry: 'Real Estate', summary: 'Giga-projects and housing programmes make Saudi Arabia the largest construction market in the region; regional contractors and suppliers base here to serve it.', saudiPosition: 'Giga-projects (NEOM, Qiddiya, Red Sea, Diriyah, ROSHN) and a national housing programme.', connectivity: 'Materials arrive by sea and road; giga-project sites sit on the highway network and planned rail.', nationalFigures: [], sectorHref: sectorPage('Real Estate'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
  Tourism: { industry: 'Tourism', summary: 'Religious, leisure and business travel across the region grows with air connectivity; hotel and experience operators run regional portfolios from one base.', saudiPosition: 'Target of 150 million visits by 2030, with Red Sea and Diriyah destinations under construction.', connectivity: 'Air connectivity drives arrivals; Red Sea and Riyadh airports and the planned King Salman airport are the capacity story.', nationalFigures: [], sectorHref: sectorPage('Tourism'), ...benchmark('Sector team narrative', 'regional demand figures pending') },
};

/* Band 8: companies serving the region from Saudi. Logos need consent per
 * company; none is shown until consent is recorded. */
export interface Company extends Provenance { id: string; name: string; industry: string; route: RouteId; base: string; consent: boolean; story?: string }
const announced = (cited: string): Provenance => ({ source: `Public announcement, ${cited}`, period: 'announced', updated: 'logo use needs the company’s consent', status: 'published', owner: 'Investor Services' });
export const COMPANIES: Company[] = [
  { id: 'c1', name: 'Siemens', industry: 'Advanced Manufacturing', route: 'corporate', base: 'Riyadh', consent: false, story: 'Regional headquarters licence announced 2024.', ...announced('company and MISA statements') },
  { id: 'c2', name: 'Northern Trust', industry: 'Financial Services', route: 'corporate', base: 'Riyadh', consent: false, ...announced('company and MISA statements') },
  { id: 'c3', name: 'Pfizer', industry: 'Healthcare and Life Sciences', route: 'corporate', base: 'Riyadh', consent: false, ...announced('company and MISA statements') },
  { id: 'c4', name: 'PepsiCo', industry: 'Food and Agriculture', route: 'corporate', base: 'Riyadh', consent: false, ...announced('company and MISA statements') },
  { id: 'c5', name: 'IHG Hotels and Resorts', industry: 'Tourism', route: 'corporate', base: 'Riyadh', consent: false, ...announced('company and MISA statements') },
  { id: 'c6', name: 'Bechtel', industry: 'Real Estate', route: 'corporate', base: 'Riyadh', consent: false, ...announced('company and MISA statements') },
  { id: 'c7', name: 'Lucid', industry: 'Advanced Manufacturing', route: 'export', base: 'King Abdullah Economic City', consent: false, story: 'First electric vehicle plant in the Kingdom, assembling for the region.', ...announced('company statements') },
  { id: 'c8', name: 'Hyundai', industry: 'Advanced Manufacturing', route: 'export', base: 'King Abdullah Economic City', consent: false, ...announced('company statements') },
  { id: 'c9', name: 'SABIC', industry: 'Chemicals', route: 'export', base: 'Jubail and Riyadh', consent: false, story: 'Exports chemicals and polymers to every market on this page.', ...announced('company reports') },
  { id: 'c10', name: 'Almarai', industry: 'Food and Agriculture', route: 'export', base: 'Riyadh', consent: false, story: 'Dairy, juice and bakery distributed across the GCC, Jordan and Egypt by road and sea.', ...announced('company reports') },
  { id: 'c11', name: 'DHL', industry: 'Logistics', route: 'logistics', base: 'Riyadh ILBZ', consent: false, ...announced('company statements') },
  { id: 'c12', name: 'Maersk', industry: 'Logistics', route: 'logistics', base: 'Jeddah Islamic Port', consent: false, story: 'Integrated logistics park at Jeddah serving the Red Sea and East Africa.', ...announced('company statements') },
  { id: 'c13', name: 'Google Cloud', industry: 'ICT', route: 'digital', base: 'Dammam', consent: false, story: 'Cloud region serving the Middle East.', ...announced('company statements') },
  { id: 'c14', name: 'Oracle', industry: 'ICT', route: 'digital', base: 'Riyadh and Jeddah', consent: false, ...announced('company statements') },
  { id: 'c15', name: 'Ma’aden', industry: 'Mining and Metals', route: 'export', base: 'Ras Al-Khair and Riyadh', consent: false, story: 'Phosphate and aluminium exported to Asia, Africa and the Americas.', ...announced('company reports') },
  { id: 'c16', name: 'PwC', industry: 'Financial Services', route: 'services', base: 'Riyadh', consent: false, ...announced('company and MISA statements') },
];

/* Band 9: hub comparison. Attribute set per route; every cell a sourced figure.
 * Saudi values are not pre-filled with favourable numbers; where another hub
 * leads, the cell says so once the figures are in. */
export const HUBS = ['Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Egypt', 'Türkiye'] as const;
export interface ComparisonRow extends Provenance { attribute: string; routes: RouteId[]; values: Record<(typeof HUBS)[number], string> }
const cells = (): Record<(typeof HUBS)[number], string> => ({ 'Saudi Arabia': PLACEHOLDER, 'United Arab Emirates': PLACEHOLDER, Qatar: PLACEHOLDER, Egypt: PLACEHOLDER, Türkiye: PLACEHOLDER });
const v = (sa: string, ae: string, qa: string, eg: string, tr: string): Record<(typeof HUBS)[number], string> => ({ 'Saudi Arabia': sa, 'United Arab Emirates': ae, Qatar: qa, Egypt: eg, Türkiye: tr });
export const COMPARISON: ComparisonRow[] = [
  { attribute: 'Corporate income tax, standard rate', routes: ['export', 'logistics', 'services', 'digital', 'corporate'], values: v('20% (zakat 2.5% for GCC-owned share)', '9% (0% below AED 375k)', '10%', '22.5%', '25%'), ...benchmark('National tax authorities', '2025 rates') },
  { attribute: 'Tax treatment for regional headquarters', routes: ['corporate'], values: v('0% CIT and WHT on RHQ activities for 30 years', '0% on qualifying free-zone income', 'Standard rate; QFC regime 10%', 'Standard rate', 'Regional management office exemptions'), ...benchmark('MISA RHQ rules; national authorities', '2024') },
  { attribute: 'Special zone corporate tax', routes: ['export', 'logistics', 'digital'], values: v('5% for 20 years (SEZ); 0% for 50 years (ILBZ)', '0% on qualifying free-zone income', '0% for up to 20 years (QFZA)', '0% in SCZone for up to 50 years', 'CIT exemption in free zones for manufacturers'), ...benchmark('ECZA, GACA; zone authorities', '2024') },
  { attribute: 'Re-export and bonded regime', routes: ['logistics', 'export'], values: v('SEZs, ILBZ and bonded zones; customs deferral', 'Free zones at every port and airport', 'Free zones at Hamad Port and airport', 'SCZone and free zones', 'Free zones and inward processing'), ...benchmark('Customs authorities', '2024') },
  { attribute: 'Logistics Performance Index rank (of 139)', routes: ['logistics', 'export'], values: v('38th (3.4)', '7th (4.0)', '34th (3.5)', '57th (3.1)', '38th (3.5)'), ...benchmark('World Bank LPI', '2023') },
  { attribute: 'Container throughput, largest port (TEU)', routes: ['logistics', 'export'], values: v('Jeddah Islamic Port, about 5.6M', 'Jebel Ali, about 14.5M', 'Hamad Port, about 1.5M', 'East Port Said, about 4.5M', 'Ambarli, about 2.5M'), ...benchmark('Port authorities, indicative', '2023, to confirm') },
  { attribute: 'Markets within a 4-hour flight', routes: ['services', 'corporate', 'digital'], values: v('GCC, Levant, Egypt, East Africa, Pakistan, India', 'GCC, Levant, Pakistan, India', 'GCC, Levant, Egypt, Pakistan', 'North Africa, Levant, Europe', 'Europe, Levant, Caucasus, North Africa'), ...benchmark('Great-circle distance', 'estimate') },
  { attribute: 'Double tax treaties with your selected markets', routes: ['services', 'corporate'], values: v('See the treaty list above', 'About 140 treaties', 'About 80 treaties', 'About 60 treaties', 'About 90 treaties'), ...benchmark('National tax authorities', 'approximate counts') },
  { attribute: 'Work visa processing time', routes: ['services', 'digital', 'corporate'], values: v(PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER), ...pending('Data Team', 'Immigration authorities') },
  { attribute: 'Industrial land and prime office cost', routes: ['export', 'services', 'corporate'], values: v(PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER), ...pending('Data Team', 'Named real-estate benchmark') },
  { attribute: 'Industrial electricity tariff', routes: ['export', 'digital'], values: v(PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER), ...pending('Data Team', 'Energy regulators') },
];

/* Band 10: talent and living, from the live site. */
export const TALENT_FIGURES: Figure[] = [
  { label: 'Safety index, G20', value: '1st', ...published('GASTAT', '2023') },
  { label: 'Female labour-force participation', value: '34.2%', ...published('GASTAT', 'Q3 2025') },
  { label: 'Saudi unemployment rate', value: '7.5%', ...published('GASTAT', 'Q2 2025') },
  { label: 'Dependents residency age for RHQ staff', value: 'up to 25', ...official('MISA RHQ programme', 'as published', 'RHQ Program team') },
];

/* Band 10: FAQ and continue. */
export const FAQ_ITEMS = [
  { q: 'Do I need a regional headquarters licence to serve the region from Saudi Arabia?', a: 'No. The RHQ licence is one of five routes on this page. Exporting, distributing, running services or hosting digital platforms each use an ordinary MISA licence and, where relevant, a zone registration.' },
  { q: 'Which markets can I reach duty-free from a Saudi base?', a: 'Goods of Saudi origin move within the GCC Customs Union and the Greater Arab Free Trade Area subject to rules of origin. Select your markets above to see which agreements apply.' },
  { q: 'Are the incentives on this page guaranteed?', a: 'No. Incentives are shown as potentially applicable. Eligibility depends on sector, activity, investor type, zone and size, and is confirmed by the programme owner during the application.' },
  { q: 'How current are the figures?', a: 'Every figure carries its source, period and status. "Published" means it is already on investsaudi.sa with the source it cites; "benchmark" means a public figure not yet re-verified by the Ministry; "estimate" means computed from distance; "unavailable" means no published value exists and none is invented.' },
  { q: 'Can I serve the region from a special economic zone without a Saudi distributor?', a: 'Yes for goods that stay in the zone or are re-exported. Sales into the Saudi market go through a licensed entity and pay the applicable duty and VAT on leaving the zone.' },
  { q: 'What does the road network give me that a port alone does not?', a: 'Same-day or next-day trucking to Kuwait, Bahrain, Qatar, the UAE and Jordan from Riyadh or Dammam, inside the GCC customs union for GCC-origin goods. Click Saudi Arabia on the globe to see each crossing.' },
];

/* National logistics layer shown when the visitor clicks Saudi Arabia on the globe.
 * Geometry is schematic: straight corridors between known cities and border posts,
 * not surveyed alignments. Replace with MoT (roads), SAR (rail), Mawani (ports),
 * GACA (airports) and ZATCA (land ports) geometry when supplied. */
export type CorridorKind = 'road' | 'rail' | 'rail-planned';
export interface Corridor extends Provenance { id: string; name: string; kind: CorridorKind; to?: string; points: [number, number][] /* [lon, lat] */ }
export interface LandPort extends Provenance { id: string; name: string; neighbour: string; neighbourCode: string; lat: number; lon: number; mode: 'road' | 'causeway' | 'road-rail-planned' }

const schematic = (owner: string, source: string): Provenance => ({ source, period: 'schematic corridor, not surveyed geometry', updated: 'not yet published', status: 'estimate', owner });

export const CORRIDORS: Corridor[] = [
  { id: 'r-ruh-dmm', name: 'Riyadh to Dammam expressway', kind: 'road', points: [[46.68, 24.71], [49.57, 25.38], [50.10, 26.43]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-ruh-jed', name: 'Riyadh to Jeddah via Taif', kind: 'road', points: [[46.68, 24.71], [43.5, 22.9], [40.42, 21.27], [39.19, 21.49]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-jed-med', name: 'Jeddah to Makkah and Madinah', kind: 'road', points: [[39.19, 21.49], [39.83, 21.42], [39.61, 24.47]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-ruh-jo', name: 'Riyadh to Al Haditha (Jordan)', kind: 'road', to: 'JO', points: [[46.68, 24.71], [43.97, 26.33], [41.69, 27.52], [40.2, 29.8], [37.1, 31.4]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-ruh-iq', name: 'Hail to Jadidat Arar (Iraq)', kind: 'road', to: 'IQ', points: [[41.69, 27.52], [41.0, 30.9]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-dmm-kw', name: 'Dammam to Al Khafji (Kuwait)', kind: 'road', to: 'KW', points: [[50.10, 26.43], [49.0, 27.6], [48.5, 28.43]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-dmm-bh', name: 'King Fahd Causeway (Bahrain)', kind: 'road', to: 'BH', points: [[50.10, 26.43], [50.45, 26.18]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-hof-qa', name: 'Hofuf to Salwa (Qatar)', kind: 'road', to: 'QA', points: [[49.57, 25.38], [50.83, 24.73]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-hof-ae', name: 'Hofuf to Al Batha (United Arab Emirates)', kind: 'road', to: 'AE', points: [[49.57, 25.38], [51.6, 24.3]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-ruh-om', name: 'Riyadh to Ramlat Khaila (Oman)', kind: 'road', to: 'OM', points: [[46.68, 24.71], [49.08, 24.13], [51.3, 20.0], [55.1, 19.6]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-ruh-ye', name: 'Riyadh to Najran and Al Wadiah (Yemen)', kind: 'road', to: 'YE', points: [[46.68, 24.71], [44.2, 17.5], [47.1, 17.0]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'r-jed-jz', name: 'Jeddah to Jazan and Al Tuwal (Yemen)', kind: 'road', to: 'YE', points: [[39.19, 21.49], [41.15, 19.1], [42.57, 16.89], [42.8, 16.4]], ...schematic('Ministry of Transport', 'MoT road network') },
  { id: 'rl-ns', name: 'SAR North to South line (Riyadh to Qurayyat)', kind: 'rail', points: [[46.68, 24.71], [43.97, 26.33], [41.69, 27.52], [40.2, 29.8], [37.35, 31.33]], ...schematic('Saudi Arabia Railways', 'SAR network map') },
  { id: 'rl-east', name: 'SAR East line (Riyadh to Dammam)', kind: 'rail', points: [[46.68, 24.71], [49.57, 25.38], [50.10, 26.43]], ...schematic('Saudi Arabia Railways', 'SAR network map') },
  { id: 'rl-haramain', name: 'Haramain high-speed (Makkah to Madinah)', kind: 'rail', points: [[39.83, 21.42], [39.19, 21.49], [39.1, 22.4], [39.61, 24.47]], ...schematic('Saudi Arabia Railways', 'SAR network map') },
  { id: 'rl-landbridge', name: 'Landbridge (Jeddah to Riyadh), planned', kind: 'rail-planned', points: [[39.19, 21.49], [43.5, 22.9], [46.68, 24.71]], ...schematic('Saudi Arabia Railways', 'SAR programme status') },
  { id: 'rl-gcc', name: 'GCC Railway (Dammam to Kuwait and UAE), planned', kind: 'rail-planned', to: 'AE', points: [[48.5, 28.43], [50.10, 26.43], [49.57, 25.38], [51.6, 24.3]], ...schematic('GCC Secretariat', 'GCC Railway programme') },
];

export const LAND_PORTS: LandPort[] = [
  { id: 'lp-haditha', name: 'Al Haditha', neighbour: 'Jordan', neighbourCode: 'JO', lat: 31.4, lon: 37.1, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-arar', name: 'Jadidat Arar', neighbour: 'Iraq', neighbourCode: 'IQ', lat: 30.9, lon: 41.0, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-khafji', name: 'Al Khafji', neighbour: 'Kuwait', neighbourCode: 'KW', lat: 28.43, lon: 48.5, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-causeway', name: 'King Fahd Causeway', neighbour: 'Bahrain', neighbourCode: 'BH', lat: 26.18, lon: 50.45, mode: 'causeway', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-salwa', name: 'Salwa', neighbour: 'Qatar', neighbourCode: 'QA', lat: 24.73, lon: 50.83, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-batha', name: 'Al Batha', neighbour: 'United Arab Emirates', neighbourCode: 'AE', lat: 24.3, lon: 51.6, mode: 'road-rail-planned', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-khaila', name: 'Ramlat Khaila', neighbour: 'Oman', neighbourCode: 'OM', lat: 19.6, lon: 55.1, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-wadiah', name: 'Al Wadiah', neighbour: 'Yemen', neighbourCode: 'YE', lat: 17.0, lon: 47.1, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
  { id: 'lp-tuwal', name: 'Al Tuwal', neighbour: 'Yemen', neighbourCode: 'YE', lat: 16.4, lon: 42.8, mode: 'road', ...schematic('ZATCA', 'ZATCA land ports') },
];

export const SAUDI_CITIES = [
  { id: 'ruh', name: 'Riyadh', lat: 24.71, lon: 46.68 },
  { id: 'jed', name: 'Jeddah', lat: 21.49, lon: 39.19 },
  { id: 'dmm', name: 'Dammam', lat: 26.43, lon: 50.10 },
  { id: 'mak', name: 'Makkah', lat: 21.42, lon: 39.83 },
  { id: 'med', name: 'Madinah', lat: 24.47, lon: 39.61 },
  { id: 'hof', name: 'Hofuf', lat: 25.38, lon: 49.57 },
  { id: 'qas', name: 'Buraydah', lat: 26.33, lon: 43.97 },
  { id: 'hail', name: 'Hail', lat: 27.52, lon: 41.69 },
  { id: 'taif', name: 'Taif', lat: 21.27, lon: 40.42 },
  { id: 'jaz', name: 'Jazan', lat: 16.89, lon: 42.57 },
  { id: 'naj', name: 'Najran', lat: 17.5, lon: 44.2 },
  { id: 'tab', name: 'Tabuk', lat: 28.38, lon: 36.57 },
  { id: 'neom', name: 'NEOM', lat: 28.0, lon: 35.2 },
];
