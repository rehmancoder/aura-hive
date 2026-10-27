// Central place for business details and page copy, used by the page, metadata and structured data.
// Replace the placeholder values (email, phone, socials) before going live.

export const site = {
  name: "Aura Hive",
  legalName: "Aura Hive",
  tagline: "Online digital marketing agency",
  title: "Aura Hive | Digital Marketing Agency for Google Ads, Meta Ads & AI Growth",
  description:
    "Aura Hive is an online digital marketing agency. We run Google Ads and Meta Ads, manage social media, build brands, create AI videos and automate your CRM to help your business grow.",
  keywords: [
    "digital marketing agency",
    "online marketing agency",
    "digital marketing agency UAE",
    "social media advertising agency",
    "Google Ads agency",
    "Meta Ads agency",
    "Facebook and Instagram ads",
    "social media management",
    "brand building agency",
    "AI video creation",
    "CRM automation",
    "CRM management services",
  ],
  email: "hello@aurahive.ae",
  phone: "+971 00 000 0000",
  /** WhatsApp number in international format without + or spaces, e.g. "971501234567". Leave empty to hide WhatsApp buttons. */
  whatsapp: "",
  /** Fully online: no shop or office. Markets you mainly serve, used for structured data. */
  areaServed: ["United Arab Emirates", "Worldwide"],
  socials: {
    instagram: "https://www.instagram.com/aurahive",
    linkedin: "https://www.linkedin.com/company/aurahive",
  },
} as const;

/** Every "Start a project" button points here. */
export const contactPath = "/contact";

/** Contact link that pre-selects a service (or a popular combination) in the form. */
export const contactHref = (opts: { service?: string; plan?: string } = {}) => {
  const q = new URLSearchParams();
  if (opts.service) q.set("service", opts.service);
  if (opts.plan) q.set("plan", opts.plan);
  const qs = q.toString();
  return qs ? `${contactPath}?${qs}#contact-form` : `${contactPath}#contact-form`;
};

/* ------------------------------------------------------------------ */
/* Services: one main services page plus a short page per sub-service  */
/* ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  title: string;
  short: string;
  body: string;
  tags: readonly string[];
  word: string;
  /** What the client gets, shown on the services pages. */
  includes: readonly string[];
};

export const services = [
  {
    slug: "advertising",
    title: "Advertising",
    short: "Paid campaigns across every major platform",
    body: "Full-funnel ad campaigns planned around your goals, from awareness to sales, with every dirham tracked from first click to final enquiry.",
    tags: ["Strategy", "Media planning", "Retargeting"],
    word: "Ads",
    includes: ["Campaign strategy and media plan", "Ads on Google, Meta, TikTok and Snapchat", "Retargeting and lookalike audiences", "Conversion tracking and reporting"],
  },
  {
    slug: "google-ads",
    title: "Google Ads",
    short: "Search, Performance Max and YouTube",
    body: "Reach people at the moment they search for what you sell, with Search, Performance Max and YouTube campaigns tuned daily for cost per lead.",
    tags: ["Search", "Performance Max", "YouTube"],
    word: "Google",
    includes: ["Keyword research and account structure", "Search, Performance Max and YouTube campaigns", "Ad copy and extension testing", "Daily bid and budget tuning"],
  },
  {
    slug: "meta-ads",
    title: "Meta Ads",
    short: "Facebook, Instagram and WhatsApp campaigns",
    body: "Scroll-stopping Facebook and Instagram campaigns with AI-built audiences, fast creative testing and leads sent straight to WhatsApp or your CRM.",
    tags: ["Facebook", "Instagram", "Lead forms"],
    word: "Meta",
    includes: ["Facebook and Instagram campaigns", "AI-built audiences and lookalikes", "New creative tested every week", "Lead forms connected to WhatsApp or your CRM"],
  },
  {
    slug: "social-media-management",
    title: "Social media management",
    short: "Content calendars, posting and community",
    body: "We plan, design and publish your content, reply to your community and report on what grows your following and your sales.",
    tags: ["Content calendar", "Posting", "Community"],
    word: "Social",
    includes: ["Monthly content calendar", "Post, carousel and story design", "Scheduling and publishing", "Community replies and a monthly report"],
  },
  {
    slug: "brand-building",
    title: "Brand building and development",
    short: "Identity, voice and positioning",
    body: "Positioning, visual identity and a clear brand voice, so customers recognise you instantly and remember you after the first ad.",
    tags: ["Positioning", "Identity", "Brand voice"],
    word: "Brand",
    includes: ["Positioning and key messages", "Logo, colours and typography", "Tone of voice guide", "Brand guidelines for your team"],
  },
  {
    slug: "digital-marketing",
    title: "Digital marketing services",
    short: "One plan across every online channel",
    body: "A single growth plan across ads, social, email and your website, run by one team so every channel works toward the same targets.",
    tags: ["Growth plan", "Email", "Landing pages"],
    word: "Digital",
    includes: ["One growth plan across every channel", "Email marketing", "Landing pages built to convert", "Monthly strategy reviews"],
  },
  {
    slug: "ai-video-creation",
    title: "AI video creation",
    short: "Reels, ads and product videos made with AI",
    body: "Short-form videos, ad cuts and product clips produced with AI in days, not weeks, then finished by our editors to match your brand.",
    tags: ["Reels", "Video ads", "AI avatars"],
    word: "Video",
    includes: ["Short-form reels and TikToks", "Video ads in every format", "AI avatars and voiceovers", "Product and explainer videos"],
  },
  {
    slug: "crm-ai-automation",
    title: "CRM AI automation",
    short: "Instant follow-up and lead scoring",
    body: "AI that scores every lead, replies on WhatsApp and email within seconds and books calls for your team, day and night.",
    tags: ["Lead scoring", "WhatsApp", "Chatbots"],
    word: "Automate",
    includes: ["AI lead scoring", "Instant WhatsApp and email replies", "Chatbots and appointment booking", "Automatic follow-up sequences"],
  },
  {
    slug: "crm-management",
    title: "CRM management",
    short: "Setup, pipelines and clean data",
    body: "We set up and look after your CRM: pipelines, fields, reports and clean data, so your sales team always knows who to call next.",
    tags: ["HubSpot", "Zoho", "Pipelines"],
    word: "CRM",
    includes: ["CRM setup and migration", "Pipelines, fields and automations", "Data clean-up", "Sales reports and dashboards"],
  },
] as const satisfies readonly Service[];

export const servicePath = (slug: string) => `/services/${slug}`;

/** Services grouped for the navigation dropdown: three columns, like the three bars of the logo. */
export const serviceGroups = [
  {
    id: "advertising-services",
    title: "Advertising",
    intro: "Get in front of the right people at the right moment, on the platforms where they already spend their time.",
    slugs: ["advertising", "google-ads", "meta-ads"],
  },
  {
    id: "brand-and-content",
    title: "Brand and content",
    intro: "Look and sound like a brand people trust, and show up every day with content worth stopping for.",
    slugs: ["social-media-management", "brand-building", "ai-video-creation"],
  },
  {
    id: "growth-and-crm",
    title: "Growth and CRM",
    intro: "Turn attention into customers, with one plan across channels and a CRM that follows up every lead for you.",
    slugs: ["digital-marketing", "crm-ai-automation", "crm-management"],
  },
].map((g) => ({ ...g, items: g.slugs.map((s) => services.find((x) => x.slug === s)!) }));

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { label: "Services", href: "/services", dropdown: true },
  { label: "About us", href: "/about" },
  { label: "How we work", href: "/#process" },
  { label: "Contact us", href: "/contact" },
] as const;

export const footerLinks = {
  company: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "All services", href: "/services" },
    { label: "Industries", href: "/#industries" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact us", href: "/contact" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Home page copy                                                      */
/* ------------------------------------------------------------------ */

/** Small activity cards that float around the 3D logo in the hero. */
export const heroSignals = [
  { label: "Meta Ads", value: "Variant B is winning" },
  { label: "New lead", value: "Replied on WhatsApp in 9s" },
  { label: "Google Ads", value: "Budget moved to Search" },
  { label: "AI video", value: "3 new reels ready" },
] as const;

export const marqueeServices = [
  "Google Ads",
  "Meta Ads",
  "Social media",
  "AI video",
  "Brand building",
  "CRM automation",
] as const;

export const tools = [
  "Google Ads",
  "Meta Ads",
  "Instagram",
  "Facebook",
  "TikTok",
  "Snapchat",
  "LinkedIn",
  "YouTube",
  "WhatsApp Business",
  "HubSpot",
  "Zoho CRM",
] as const;

/** The six AI agents that make up "the hive". */
export const agents = [
  {
    name: "Audience agent",
    body: "Builds and refreshes buyer audiences for Google and Meta from your CRM, site visitors and lookalikes.",
    bars: [0.4, 0.7, 1, 0.7, 0.4],
  },
  {
    name: "Creative agent",
    body: "Drafts ad copy, designs and AI video cuts in dozens of variations for every test.",
    bars: [1, 0.5, 0.8, 0.3, 0.6],
  },
  {
    name: "Bidding agent",
    body: "Moves budget between campaigns toward the lowest cost per lead, every hour.",
    bars: [0.3, 0.45, 0.6, 0.8, 1],
  },
  {
    name: "Social agent",
    body: "Plans your content calendar, schedules posts and flags comments that need a reply.",
    bars: [0.6, 1, 0.6, 1, 0.6],
  },
  {
    name: "Lead agent",
    body: "Scores every enquiry in your CRM and starts the WhatsApp or email follow-up within seconds.",
    bars: [1, 0.8, 0.6, 0.4, 0.2],
  },
  {
    name: "Insight agent",
    body: "Spots changes in performance and writes your plain-language weekly report.",
    bars: [0.5, 0.5, 1, 0.5, 0.5],
  },
] as const;

export const industries = [
  {
    name: "Real estate",
    image: "/images/realestate.webp",
    alt: "Gold and black towers rising like a city skyline",
    body: "Off-plan launches and ready properties. We fill your pipeline with qualified buyers and investors, then route them straight into your CRM.",
    points: ["Off-plan launch campaigns", "Lead scoring for brokers", "WhatsApp follow-up"],
  },
  {
    name: "Hospitality",
    image: "/images/hospitality.webp",
    alt: "Gold arches framing a glowing sphere",
    body: "Hotels, restaurants and venues. More direct bookings and full tables, with less reliance on third-party platforms.",
    points: ["Direct booking campaigns", "Seasonal and event offers", "Social content and reels"],
  },
  {
    name: "Healthcare",
    image: "/images/healthcare.webp",
    alt: "Gold and white capsules scattered across a dark floor",
    body: "Clinics and wellness brands. Compliant campaigns that bring patients who book, with appointment reminders handled for you.",
    points: ["Treatment-specific campaigns", "Appointment booking flows", "Reminder automation"],
  },
  {
    name: "Education",
    image: "/images/education.webp",
    alt: "Gold steps spiralling upward toward a golden sphere",
    body: "Schools, universities and training centres. Enrolment campaigns timed to intake dates, with nurturing for parents and students.",
    points: ["Intake and open-day campaigns", "Parent and student nurture", "Explainer videos"],
  },
  {
    name: "E-commerce",
    image: "/images/ecommerce.webp",
    alt: "Gold and black parcels stacked and floating",
    body: "Online stores. Profitable growth from catalogue ads, abandoned-cart flows and product videos that keep selling.",
    points: ["Catalogue and Advantage+ ads", "Cart and win-back automation", "AI product videos"],
  },
] as const;

/** Describes what every client gets; not performance claims. */
export const included = [
  { value: 6, suffix: "", label: "AI agents on every account" },
  { value: 24, suffix: "/7", label: "spend and lead monitoring" },
  { value: 1, suffix: "", label: "live dashboard for all channels" },
  { value: 100, suffix: "%", label: "online, wherever you are" },
] as const;

export const steps = [
  {
    title: "Listen",
    body: "On a video call, we review your ad accounts, social pages and CRM, and agree the numbers that matter to your business.",
  },
  {
    title: "Build",
    body: "Our AI tools draft audiences, ads, videos and automations. Strategists choose what goes live.",
  },
  {
    title: "Launch",
    body: "Campaigns, content and CRM automations go live together, so every lead is tracked from the first day.",
  },
  {
    title: "Learn",
    body: "We test, cut what doesn't work and scale what does, and report back every week in plain language.",
  },
] as const;

export const faqs = [
  {
    q: "What services does Aura Hive offer?",
    a: "We run Google Ads and Meta Ads campaigns, manage social media, build and develop brands, create AI videos, and set up, manage and automate your CRM. You can use one service or bring them together under one growth plan.",
  },
  {
    q: "Do you have an office I can visit?",
    a: "No. Aura Hive is a fully online agency with no shop or office. We work with clients over video calls, WhatsApp and email, and share progress through a live dashboard, so you can work with us from anywhere.",
  },
  {
    q: "How soon will I see results from ads?",
    a: "Google and Meta campaigns usually start bringing enquiries within the first two weeks. Brand building and social growth take longer, typically a few months. We agree realistic targets with you before we start.",
  },
  {
    q: "What is CRM AI automation?",
    a: "It connects your ads and social pages to your CRM, then uses AI to score each lead and reply on WhatsApp or email within seconds, so no enquiry waits until the next morning.",
  },
  {
    q: "Can you work with the CRM we already use?",
    a: "Yes. We work with HubSpot, Zoho, Salesforce and most popular CRMs. If you don't have one yet, we can recommend and set one up for you.",
  },
  {
    q: "Is there a minimum contract or budget?",
    a: "We offer monthly retainers and fixed-scope projects. Tell us your goals and current budget, and we'll recommend the plan that fits.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* About page copy                                                     */
/* ------------------------------------------------------------------ */

export const about = {
  title: "About Us",
  description:
    "Meet Aura Hive, an online digital marketing agency that brings strategists, creatives and AI tools together to grow brands through ads, social media, AI video and CRM automation.",
  hero: {
    headline: ["We", "build", "the", "aura", "around", "your", "brand."],
    body: "Aura Hive is an online digital marketing agency. We bring strategists, creatives and AI tools together in one team, so your brand gets seen, gets chosen and keeps growing.",
  },
  /** Floating cards around the 3D halo in the hero: who is in the hive. */
  chips: [
    { label: "In the hive", value: "Strategists" },
    { label: "In the hive", value: "Designers and editors" },
    { label: "In the hive", value: "Six AI agents" },
    { label: "In the hive", value: "Ad and CRM specialists" },
  ],
  marquee: ["Strategy", "Creativity", "AI", "Data", "Brand", "Growth"],
  name: {
    title: "Why we're called Aura Hive",
    parts: [
      {
        word: "Aura",
        body: "The feeling people get when they see your brand: trust, quality and the urge to find out more. It's built one ad, one post and one reply at a time. Building it is our job.",
      },
      {
        word: "Hive",
        body: "Many minds working as one. Our strategists, designers, video editors and AI agents share one plan and one set of data, so nothing falls through the gaps.",
      },
    ],
  },
  mission: {
    label: "Our mission",
    lines: ["To give growing brands", "a full marketing team,", "run online, that moves", "at their speed."],
  },
  values: {
    title: "What we stand for",
    intro: "Three principles, like the three bars in our logo. The one in the middle carries the most weight.",
    items: [
      {
        title: "Results you can see",
        body: "Every campaign is tied to leads and sales, and you see them on a live dashboard. No vanity numbers.",
      },
      {
        title: "AI with human judgment",
        body: "AI does the heavy lifting: testing ads, editing videos, following up leads. People set the strategy, check the work and own the results.",
      },
      {
        title: "Brand first",
        body: "Growth that cheapens your brand isn't growth. Every ad, post and video has to look and sound like you.",
      },
    ],
  },
  online: {
    title: "One team, fully online",
    intro:
      "We don't have a shop or an office, and that's deliberate. Everything we do happens online, which keeps us fast and keeps you close to the work.",
    points: [
      {
        title: "Work with us from anywhere",
        body: "Kick-off, reviews and reports all happen over video calls, WhatsApp and email.",
      },
      {
        title: "One shared workspace",
        body: "Your plan, content calendar and results live in one place you can open at any time.",
      },
      {
        title: "Faster turnaround",
        body: "No travel and no waiting for meeting rooms. Changes go live as soon as you approve them.",
      },
      {
        title: "More budget for marketing",
        body: "Without office overheads, more of what you pay goes into work that grows your brand.",
      },
    ],
  },
  services: {
    title: "What we do",
    intro: "Nine services in three groups. Use one, or let us run them together under one plan.",
  },
  cta: {
    lines: ["Let's work", "together."] as [string, string],
    body: "Tell us where your brand is today and where you want it to be. We'll come back with a short plan and a clear proposal.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Services page copy                                                  */
/* ------------------------------------------------------------------ */

export const servicesPage = {
  title: "Digital Marketing Services",
  description:
    "Explore Aura Hive's digital marketing services: Google Ads, Meta Ads, advertising, social media management, brand building, AI video creation, CRM AI automation and CRM management.",
  hero: {
    headline: ["Nine", "services.", "One", "growth", "plan."],
    body: "Pick one service or bring several together. Every service shares the same data and the same team, so your ads, content and CRM all push in the same direction.",
  },
  combos: {
    title: "Popular starting points",
    intro: "Most clients start with one of these combinations, then add more as they grow.",
    items: [
      {
        id: "launch",
        title: "Launch a brand",
        body: "For new businesses and rebrands that need to look right and get noticed fast.",
        slugs: ["brand-building", "social-media-management", "ai-video-creation"],
      },
      {
        id: "leads",
        title: "Get more leads",
        body: "For businesses that need enquiries now, with every lead followed up in seconds.",
        slugs: ["google-ads", "meta-ads", "crm-ai-automation"],
      },
      {
        id: "scale",
        title: "Scale what works",
        body: "For growing teams ready to run every channel and their CRM as one system.",
        slugs: ["digital-marketing", "advertising", "crm-management"],
      },
    ],
  },
  faqs: [
    {
      q: "Can I hire you for just one service?",
      a: "Yes. Many clients start with a single service, such as Meta Ads or social media management, and add more later. Each service works on its own and gets stronger when combined.",
    },
    {
      q: "Which service should I start with?",
      a: "If you need enquiries quickly, start with Google Ads or Meta Ads together with CRM AI automation. If you're launching or rebranding, start with brand building and social media. On a short call, we'll recommend the right mix for your goals.",
    },
    {
      q: "Do you create the ads, designs and videos?",
      a: "Yes. Our designers and video editors create every ad, post and video, using AI tools to produce more variations faster. You approve the work before anything goes live.",
    },
    {
      q: "Which advertising platforms do you manage?",
      a: "Google (Search, Performance Max and YouTube), Meta (Facebook and Instagram), TikTok, Snapchat and LinkedIn.",
    },
    {
      q: "How do you report results?",
      a: "You get a live dashboard showing spend, leads and sales across every channel, plus a short weekly summary in plain language explaining what changed and what we'll do next.",
    },
  ],
  cta: {
    lines: ["Not sure where", "to start?"] as [string, string],
    body: "Tell us about your business and your goals. We'll recommend the right services and send a short plan with a clear proposal.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Individual service pages                                            */
/* ------------------------------------------------------------------ */

type Step = { title: string; body: string };
type Qa = { q: string; a: string };

export type ServiceDetail = {
  /** Page title shown in Google results and browser tabs (the site name is added automatically). */
  seoTitle: string;
  /** Big headline under the service name in the hero. */
  headline: string;
  intro: string;
  /** Particle shape for the page's 3D hero (see components/three/shapes.ts). */
  shape:
    | "target"
    | "magnifier"
    | "feed"
    | "postGrid"
    | "gem"
    | "growthColumns"
    | "playButton"
    | "network"
    | "funnel";
  steps: readonly [Step, Step, Step];
  faqs: readonly Qa[];
};

export const serviceDetails: Record<(typeof services)[number]["slug"], ServiceDetail> = {
  advertising: {
    seoTitle: "Online Advertising Services",
    headline: "Ads that reach the right people, wherever they scroll.",
    intro:
      "We plan and run paid campaigns across Google, Meta, TikTok and Snapchat as one budget, moving spend to whichever platform brings you customers at the lowest cost.",
    shape: "target",
    steps: [
      { title: "Plan", body: "We agree your goal and budget, choose the right platforms and set up tracking so every lead is counted." },
      { title: "Launch", body: "Campaigns go live with several audiences and creatives, so we learn quickly what works." },
      { title: "Improve", body: "Every week we cut what isn't working, scale what is and report back in plain language." },
    ],
    faqs: [
      {
        q: "How much should I spend on ads?",
        a: "It depends on your market and your goals. We'll recommend a starting budget on our first call, then adjust it as results come in.",
      },
      {
        q: "Which platforms should I advertise on?",
        a: "Wherever your customers spend their time. For most businesses that's a mix of Google and Meta, with TikTok or Snapchat for younger audiences. We test and move budget to what works.",
      },
      {
        q: "Do you create the ads?",
        a: "Yes. Our designers and AI video tools create the images, videos and copy, and you approve everything before it goes live.",
      },
    ],
  },
  "google-ads": {
    seoTitle: "Google Ads Management",
    headline: "Be the answer when customers search for you.",
    intro:
      "We build and manage Google Ads campaigns across Search, Performance Max and YouTube, tuned every day to bring you enquiries at a lower cost.",
    shape: "magnifier",
    steps: [
      { title: "Research", body: "We find the searches your customers make and structure your account around them." },
      { title: "Build", body: "We write the ads, set up extensions and connect conversion tracking to your website or CRM." },
      { title: "Tune", body: "We adjust bids, budgets and keywords every day, and test new ads every month." },
    ],
    faqs: [
      {
        q: "How soon will Google Ads bring results?",
        a: "Search campaigns can bring enquiries within days of going live. Results usually improve over the first month as Google learns from your data.",
      },
      {
        q: "What is Performance Max?",
        a: "A Google campaign type that shows your ads across Search, YouTube, Display, Gmail and Maps from one campaign, using AI to find people likely to become customers.",
      },
      {
        q: "Do I need a website?",
        a: "You need at least a landing page for people to visit. We can build a fast one designed to turn clicks into enquiries.",
      },
    ],
  },
  "meta-ads": {
    seoTitle: "Meta Ads Management: Facebook and Instagram Ads",
    headline: "Stop the scroll on Facebook and Instagram.",
    intro:
      "We run Meta Ads with AI-built audiences and fresh creative every week, and send each lead straight to WhatsApp or your CRM.",
    shape: "feed",
    steps: [
      { title: "Audience", body: "We build audiences from your customers, website visitors and lookalikes." },
      { title: "Creative", body: "We produce images, reels and carousels in several versions, then test them against each other." },
      { title: "Follow-up", body: "Leads go straight to WhatsApp or your CRM with an instant reply, so none go cold." },
    ],
    faqs: [
      {
        q: "Facebook or Instagram: which is better?",
        a: "Usually both. Meta shows your ads where they perform best, and we shape the creative for each placement.",
      },
      {
        q: "Can leads come through WhatsApp?",
        a: "Yes. We can run click-to-WhatsApp ads or instant forms, and connect both to your CRM for follow-up.",
      },
      {
        q: "How often do you change the ads?",
        a: "We test new creative every week. Ads that start to tire are replaced before results drop.",
      },
    ],
  },
  "social-media-management": {
    seoTitle: "Social Media Management Services",
    headline: "Show up every day, without lifting a finger.",
    intro:
      "We plan, design and publish your social media content, reply to your community, and report on what grows your following and your sales.",
    shape: "postGrid",
    steps: [
      { title: "Plan", body: "Each month we agree a content calendar built around your offers, launches and seasons." },
      { title: "Create", body: "Our designers and AI tools produce posts, carousels, stories and reels in your brand style." },
      { title: "Publish and reply", body: "We schedule everything, answer comments and messages, and send you a monthly report." },
    ],
    faqs: [
      {
        q: "Which platforms do you manage?",
        a: "Instagram, Facebook, TikTok, LinkedIn and more. We focus on the platforms where your customers are.",
      },
      {
        q: "Do I approve posts before they go live?",
        a: "Yes. You see the full calendar in advance and can approve posts or ask for changes.",
      },
      {
        q: "How many posts a month do I get?",
        a: "It depends on your plan. We'll recommend a posting rhythm based on your goals and platforms.",
      },
    ],
  },
  "brand-building": {
    seoTitle: "Brand Building and Development",
    headline: "A brand people recognise and remember.",
    intro:
      "We shape your positioning, visual identity and voice, so every ad, post and page looks and sounds unmistakably like you.",
    shape: "gem",
    steps: [
      { title: "Discover", body: "We learn about your business, customers and competitors, and find what makes you different." },
      { title: "Design", body: "We create your logo, colours, typography and key messages, and refine them with you." },
      { title: "Guide", body: "You get clear brand guidelines so your team and partners stay consistent." },
    ],
    faqs: [
      {
        q: "Do you design logos?",
        a: "Yes. Logo design is part of brand building, alongside colours, typography and a tone of voice.",
      },
      {
        q: "Can you refresh an existing brand?",
        a: "Yes. We can update your look and messaging while keeping what your customers already know and trust.",
      },
      {
        q: "What do I receive at the end?",
        a: "Your logo files, colour palette, fonts, tone of voice guide and brand guidelines, ready for your team to use.",
      },
    ],
  },
  "digital-marketing": {
    seoTitle: "Digital Marketing Services",
    headline: "One plan for every online channel.",
    intro:
      "We bring your ads, social media, email and website together under one growth plan, run by one team working toward the same targets.",
    shape: "growthColumns",
    steps: [
      { title: "Audit", body: "We review your current channels, results and competitors to find the biggest opportunities." },
      { title: "Plan", body: "We build one plan with clear targets, budgets and priorities for every channel." },
      { title: "Run and review", body: "We run the plan and meet you every month to review results and agree next steps." },
    ],
    faqs: [
      {
        q: "What does digital marketing include?",
        a: "Everything that grows your business online: advertising, social media, email marketing, landing pages and the tracking that ties them together.",
      },
      {
        q: "Is this right for a small business?",
        a: "Yes. We scale the plan to your budget and start with the channels most likely to bring results.",
      },
      {
        q: "Do I need all your services?",
        a: "No. We recommend only what fits your goals, and you can add more as you grow.",
      },
    ],
  },
  "ai-video-creation": {
    seoTitle: "AI Video Creation",
    headline: "Scroll-stopping videos, made in days.",
    intro:
      "We use AI to produce reels, video ads and product videos fast, then our editors finish each one so it looks and sounds like your brand.",
    shape: "playButton",
    steps: [
      { title: "Script", body: "We write short scripts and opening hooks built for each platform." },
      { title: "Produce", body: "AI tools generate visuals, voiceovers and avatars, combined with your own footage and photos." },
      { title: "Edit", body: "Our editors polish every video and deliver it in each format you need." },
    ],
    faqs: [
      {
        q: "Do I need to film anything?",
        a: "No. We can create videos entirely with AI visuals, avatars and voiceovers, or combine them with footage you already have.",
      },
      {
        q: "Can AI videos match my brand?",
        a: "Yes. Every video uses your colours, fonts and tone, and our editors check each one before you see it.",
      },
      {
        q: "Which formats do you deliver?",
        a: "Vertical videos for reels, TikTok and stories, square videos for feeds, and landscape videos for YouTube and websites.",
      },
    ],
  },
  "crm-ai-automation": {
    seoTitle: "CRM AI Automation",
    headline: "Every lead answered in seconds.",
    intro:
      "We connect your ads and social pages to your CRM, then use AI to score each lead, reply on WhatsApp or email and book calls for your team, day and night.",
    shape: "network",
    steps: [
      { title: "Connect", body: "We link your ad platforms, website forms and WhatsApp to your CRM." },
      { title: "Automate", body: "We set up AI lead scoring, instant replies, chatbots and follow-up sequences." },
      { title: "Hand over", body: "Hot leads go straight to your sales team with their full history, ready to call." },
    ],
    faqs: [
      {
        q: "Will customers know they're talking to AI?",
        a: "We recommend being open about automated replies. They're written in your brand voice, and a person takes over whenever a lead is ready or asks for one.",
      },
      {
        q: "Which CRMs do you work with?",
        a: "HubSpot, Zoho, Salesforce and most popular CRMs. If you don't have one yet, we can recommend and set one up.",
      },
      {
        q: "What happens outside working hours?",
        a: "The automation keeps working. Leads get an instant reply and can book a call, so your team starts the day with conversations already under way.",
      },
    ],
  },
  "crm-management": {
    seoTitle: "CRM Management Services",
    headline: "A CRM your sales team actually uses.",
    intro:
      "We set up and look after your CRM: pipelines, fields, automations, reports and clean data, so your team always knows who to call next.",
    shape: "funnel",
    steps: [
      { title: "Set up", body: "We configure or migrate your CRM, with pipelines and fields that match how you sell." },
      { title: "Clean", body: "We remove duplicates, fill in missing details and set rules that keep your data clean." },
      { title: "Report", body: "We build dashboards that show leads, deals and revenue at a glance, and keep improving them." },
    ],
    faqs: [
      {
        q: "Can you move us from spreadsheets to a CRM?",
        a: "Yes. We import your contacts and deals, set up your pipeline and train your team to use it.",
      },
      {
        q: "Do you train our team?",
        a: "Yes. We run training sessions over video call and share short guides for everyday tasks.",
      },
      {
        q: "Is CRM management a one-time setup?",
        a: "It can be. Many clients also keep us on monthly to manage changes, data quality and reports.",
      },
    ],
  },
};

/** The group a service belongs to. */
export const groupOf = (slug: string) => serviceGroups.find((g) => g.slugs.includes(slug))!;

/* ------------------------------------------------------------------ */
/* Contact page copy                                                   */
/* ------------------------------------------------------------------ */

export const contactPage = {
  title: "Contact Us",
  description:
    "Contact Aura Hive, an online digital marketing agency. Tell us about your brand and goals, and we'll reply with a short plan and a clear proposal for ads, social media, AI video and CRM.",
  hero: {
    headline: ["Let's", "grow", "your", "brand."],
    body: "Tell us where your brand is today and where you want it to be. We read every message ourselves and reply with next steps.",
  },
  steps: [
    { title: "We review", body: "We read your message and look at your current ads, social pages and website." },
    { title: "We talk", body: "We set up a short video call to understand your goals and answer your questions." },
    { title: "You get a plan", body: "We send a clear plan and proposal. You decide if and when to start." },
  ],
  faqs: [
    {
      q: "What happens after I send the form?",
      a: "We review your goals and current marketing, then reply by email to arrange a short video call. After the call, we send you a plan with a clear proposal.",
    },
    {
      q: "Can we meet in person?",
      a: "We're a fully online agency, so we meet over video calls and keep in touch on WhatsApp and email. That means we can work with you wherever you are.",
    },
    {
      q: "What should I include in my message?",
      a: "Your goals, the services you're interested in, what marketing you're doing today and your timeline. A rough monthly budget helps us recommend the right plan.",
    },
    {
      q: "Do I have to sign a long contract?",
      a: "We offer monthly retainers and fixed-scope projects. We'll explain the options clearly in your proposal.",
    },
  ],
} as const;
