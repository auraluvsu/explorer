import type { Business, Category } from '@/types/business'

type Row = [
  id: string, name: string, category: Category, tier: Business['tier'],
  scores: [number, number, number, number, number, number],
  profit: [number, number], exit: [number, number],
  basis: Business['exitMultiple']['basis'], con: string, description: string,
]


type Feas = Business['feasibility']
const F = (score: number, leverage: Feas['leverage'], reason: string): Feas => ({ score, leverage, reason })

const feasibilityById: Record<string, Feas> = {
  'micro-saas': F(10, 'high', 'Single-feature tool in TS/Node + Postgres; matches Iris'),
  'productized-service': F(10, 'high', 'Build the delivery system; stack already powers Scents4Pence'),
  'ai-automation-agency': F(9, 'high', 'Python + API glue + GCP; Nyx proves cross-language work'),
  'programmatic-seo': F(9, 'high', 'Static gen + Postgres pipeline; matches ATW pattern'),
  'niche-job-board': F(9, 'high', 'CRUD + payments + search; trivial for stack'),
  'membership-site': F(8, 'high', 'Auth + Stripe + roles; done on Scents4Pence'),
  'newsletter-community': F(7, 'medium', "Content ops + light backend; code is easy, content isn't"),
  'paid-b2b-newsletter': F(7, 'medium', 'Substack/Ghost handles 90%; low code surface'),
  'vertical-saas': F(7, 'medium', 'Buildable; real cost is domain research, not code'),
  'template-shop': F(6, 'low', 'Light code; mostly design + ops'),
  'b2b-leadgen': F(6, 'medium', 'Scraping + enrichment; legally fiddly'),
  'evergreen-course': F(5, 'low', "Platform easy; filming/curriculum isn't his skillset"),
  'high-ticket-course': F(5, 'low', 'Same as above, higher stakes'),
  'niche-affiliate': F(5, 'low', 'Content-heavy, code-light'),
  'service-as-product': F(5, 'medium', 'SOPs + hiring, not engineering'),
  'youtube-funnel': F(4, 'low', 'Content production, not code'),
  'stock-media-foundry': F(3, 'low', 'Design/creative work'),
  'ecom-brand': F(3, 'low', "Store buildable; inventory/sourcing/ads aren't his edge"),
  'print-on-demand': F(2, 'low', 'Design + marketing, minimal code'),
  'micro-acquisition': F(2, 'low', 'Capital + deal skill; almost no engineering leverage'),
}

const marketsById: Record<string, NonNullable<Business['markets']>> = {
  'vertical-saas': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'DACH', lat: 48.5, lng: 10.5 }],
  'productized-service': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Australia', lat: -25.3, lng: 133.8 }],
  'high-ticket-course': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Canada', lat: 56.1, lng: -106.3 }],
  'ecom-brand': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'DACH', lat: 48.5, lng: 10.5 }],
  'newsletter-community': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }],
  'micro-saas': [],
  'b2b-leadgen': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'DACH', lat: 48.5, lng: 10.5 }],
  'print-on-demand': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Canada', lat: 56.1, lng: -106.3 }, { label: 'Australia', lat: -25.3, lng: 133.8 }],
  'youtube-funnel': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'India', lat: 21.1, lng: 78.9 }, { label: 'Brazil', lat: -14.2, lng: -51.9 }],
  'ai-automation-agency': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Australia', lat: -25.3, lng: 133.8 }],
  'niche-job-board': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Canada', lat: 56.1, lng: -106.3 }],
  'programmatic-seo': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'India', lat: 21.1, lng: 78.9 }],
  'niche-affiliate': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Canada', lat: 56.1, lng: -106.3 }],
  'template-shop': [],
  'stock-media-foundry': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'DACH', lat: 48.5, lng: 10.5 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }],
  'paid-b2b-newsletter': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Singapore', lat: 1.35, lng: 103.8 }],
  'micro-acquisition': [],
  'evergreen-course': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'India', lat: 21.1, lng: 78.9 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }],
  'membership-site': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Australia', lat: -25.3, lng: 133.8 }],
  'service-as-product': [{ label: 'United States', lat: 39.8, lng: -98.6 }, { label: 'United Kingdom', lat: 52.5, lng: -1.5 }, { label: 'Netherlands', lat: 52.2, lng: 5.3 }],
}

const rows: Row[] = [
  ['vertical-saas', 'Vertical SaaS', 'SaaS', 'high-ceiling', [4, 5, 8, 10, 9, 7], [500000, 3000000], [4, 8], 'arr', 'Long build and slow sales cycles before first revenue.', 'Software for one industry (dental, HVAC, freight) with sticky workflows and recurring revenue.'],
  ['productized-service', 'Productized Service', 'Service', 'high-ceiling', [9, 9, 5, 6, 4, 5], [150000, 600000], [2, 4], 'annual-profit', 'Founder-dependent; buyers discount heavily.', 'A fixed-scope, fixed-price service sold like a product.'],
  ['high-ticket-course', 'High-Ticket Course', 'Education', 'high-ceiling', [8, 9, 3, 9, 7, 4], [200000, 1000000], [2, 3], 'annual-profit', 'Depends on a personal brand and constant launches.', 'Cohort or premium course priced $1k+ with community and coaching.'],
  ['ecom-brand', 'E-commerce Brand', 'Product', 'high-ceiling', [5, 4, 3, 7, 6, 4], [150000, 800000], [3, 5], 'annual-profit', 'Inventory cash tied up; ad costs keep climbing.', 'Owned-brand physical product with repeat purchase and DTC channels.'],
  ['newsletter-community', 'Newsletter + Community', 'Media', 'high-ceiling', [5, 8, 4, 9, 8, 6], [150000, 700000], [2, 4], 'arr', 'Audience growth is slow and sponsor-concentrated.', 'Free newsletter feeding a paid community and sponsorships.'],
  ['micro-saas', 'Micro-SaaS', 'SaaS', 'high-ceiling', [6, 8, 7, 9, 7, 3], [100000, 500000], [3, 5], 'arr', 'Crowded niches and easy-to-clone features.', 'Small single-purpose tool solving one painful workflow.'],
  ['b2b-leadgen', 'B2B Lead Gen / Data', 'Service', 'high-ceiling', [7, 7, 6, 8, 7, 5], [200000, 800000], [3, 5], 'annual-profit', 'Data quality and compliance risk.', 'Sell qualified leads or enriched datasets to B2B buyers.'],
  ['print-on-demand', 'Print-on-Demand', 'Product', 'high-ceiling', [9, 10, 2, 6, 3, 2], [40000, 150000], [1.5, 2.5], 'annual-profit', 'Razor-thin margins and extreme saturation.', 'Designs printed and shipped by a third party with zero inventory.'],
  ['youtube-funnel', 'YouTube Funnel', 'Media', 'high-ceiling', [3, 9, 3, 8, 6, 4], [150000, 900000], [2, 4], 'annual-profit', 'Slow to compound; algorithm dependence.', 'Video channel that funnels viewers into offers, affiliates and products.'],
  ['ai-automation-agency', 'AI Automation Agency', 'Service', 'high-ceiling', [8, 8, 5, 7, 5, 4], [200000, 900000], [2, 4], 'annual-profit', 'Tooling shifts monthly; clients churn.', 'Build and maintain AI workflows for SMB back offices.'],
  ['niche-job-board', 'Niche Job Board', 'Marketplace', 'sellable-lowcost', [4, 9, 7, 5, 9, 6], [200000, 500000], [3, 4], 'annual-profit', 'Chicken-and-egg cold start.', 'Paid listings for a single industry or role.'],
  ['programmatic-seo', 'Programmatic SEO / Directory', 'Content', 'sellable-lowcost', [3, 8, 5, 7, 9, 5], [100000, 350000], [2.5, 3.5], 'monthly-profit', 'Google updates can erase traffic overnight.', 'Templated pages at scale, monetised with ads, leads or listings.'],
  ['niche-affiliate', 'Niche Affiliate Site', 'Content', 'sellable-lowcost', [3, 9, 4, 6, 9, 5], [100000, 400000], [2.5, 3.75], 'monthly-profit', 'Platform and commission-rate risk.', 'Review and comparison content earning affiliate commissions.'],
  ['template-shop', 'Digital Template Shop', 'Product', 'sellable-lowcost', [7, 9, 4, 7, 6, 3], [50000, 200000], [2, 3], 'annual-profit', 'Low barriers; buyers price in copycats.', 'Notion, Figma and spreadsheet templates sold on marketplaces.'],
  ['stock-media-foundry', 'Stock Media Foundry', 'Media', 'sellable-lowcost', [4, 8, 4, 5, 7, 3], [50000, 150000], [2, 3], 'annual-profit', 'AI-generated media is eroding prices.', 'Photos, video and audio licensed through stock platforms.'],
  ['paid-b2b-newsletter', 'Paid B2B Newsletter', 'Media', 'sellable-lowcost', [5, 9, 5, 6, 9, 6], [100000, 300000], [2, 4], 'arr', 'Churn if the author steps away.', 'Subscription intelligence for professionals in one vertical.'],
  ['micro-acquisition', 'Micro-Acquisition / Flipping', 'Marketplace', 'sellable-lowcost', [6, 5, 6, 4, 10, 5], [80000, 300000], [2, 3], 'annual-profit', 'Needs capital and diligence skill.', 'Buy small sites and apps, improve them, resell.'],
  ['evergreen-course', 'Evergreen Low-Ticket Course', 'Education', 'sellable-lowcost', [6, 8, 3, 7, 7, 4], [150000, 300000], [2, 3], 'annual-profit', 'Ad-dependent and vulnerable to refunds.', 'Sub-$200 course sold via automated funnels.'],
  ['membership-site', 'Membership Community', 'Community', 'sellable-lowcost', [4, 8, 5, 6, 8, 6], [150000, 400000], [2, 3], 'arr', 'Engagement fatigue drives churn.', 'Paid community with resources, events and peer access.'],
  ['service-as-product', 'Service-as-a-Product', 'Service', 'sellable-lowcost', [5, 7, 6, 5, 8, 5], [200000, 500000], [2, 4], 'annual-profit', 'Delivery quality relies on a small team.', 'Systemised services with SOPs so the business runs without the founder.'],
]

export const BUSINESSES: Business[] = rows.map(
  ([id, name, category, tier, s, p, e, basis, biggestCon, description]) => ({
    id, name, category, tier,
    scores: { speed: s[0], cost: s[1], mktg: s[2], scale: s[3], sell: s[4], sat: s[5], feas: feasibilityById[id].score },
    feasibility: feasibilityById[id],
    markets: marketsById[id],
    profitCeiling: { low: p[0], high: p[1], currency: 'USD', note: 'Estimate' },
    exitMultiple: { low: e[0], high: e[1], basis, note: 'Estimate' },
    biggestCon, description,
  }),
)
