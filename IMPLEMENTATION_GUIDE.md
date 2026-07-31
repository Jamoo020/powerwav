# PowerWave AV - B2B Commercial Strategy Implementation

## Overview

This implementation adds comprehensive B2B commercial AV marketing infrastructure to PowerWave AV's website, focusing on local Kenyan keywords, high-intent corporate clients, and solution-specific verticals.

## What's Been Implemented

### 1. **Vertical-Specific Landing Pages** ✅
**Files:**
- `lib/content.ts` - Data types and content for `VerticalLanding[]`
- `components/vertical-solution-page.tsx` - Reusable component

**Verticals Created:**
- Hotels & Restaurants (hospitality/guest experience)
- Churches & Worship (sound systems, live streaming)
- Schools & Education (interactive displays, hybrid teaching)

**Features:**
- Industry-specific challenge identification
- Purpose-built solution breakdowns
- Measurable benefit statements
- Integrated quote forms
- One-touch CTA optimization

**How to Deploy:**
Create pages in `app/solutions/[slug]/page.tsx` that import and use `VerticalSolutionPage`.

---

### 2. **Interactive Tools** ✅

#### A. **Multi-Step Quote Form**
**File:** `components/quote-form.tsx`

**Capabilities:**
- 3-step form process (contact → project details → message)
- Dynamic vertical selection
- Budget and timeline estimation
- Smart question branching
- API endpoint: `POST /api/quote`

**Usage:**
```tsx
import { QuoteForm } from "@/components/quote-form";

<QuoteForm 
  vertical="Hotels & Hospitality" 
  onSubmit={(data) => console.log(data)}
/>
```

**Data Collected:**
- Contact info (name, company, email, phone)
- Project type, room size, budget, timeline
- Detailed requirements

---

#### B. **Room Assessment Questionnaire**
**File:** `components/room-assessment.tsx`

**Capabilities:**
- 6-question interactive assessment
- Scoring algorithm based on industry challenges
- Personalized recommendation output
- Email capture for follow-up
- API endpoint: `POST /api/assessment`

**Usage:**
```tsx
import { RoomAssessmentQuestionnaire } from "@/components/room-assessment";

<RoomAssessmentQuestionnaire 
  title="Quick Room Assessment"
  description="Answer questions about your space..."
/>
```

**Output:**
- Assessment score (0–100)
- Recommendation level (standard, targeted, comprehensive)
- Actionable insights
- Email capture for personalized proposal

---

### 3. **Enhanced Case Studies** ✅
**File:** `app/projects/case-studies.tsx`

**Features:**
- Video integration (YouTube embeds)
- Metrics showcase (quantified results)
- Client testimonials
- Challenge → Solution → Results narrative
- Interactive case study tabs
- Professional photography

**Case Studies Included:**
1. Executive Boardroom Upgrade (Corporate)
2. Hotel Guest Experience Upgrade (Hospitality)
3. Restaurant Sound Transformation (Hospitality)
4. Church Worship Enhancement (Worship)

**Data Structure:**
```tsx
interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: Array<{ label: string; value: string }>;
  videoUrl?: string;
  testimonial?: { quote: string; name: string; role: string };
}
```

---

### 4. **Buyer's Guides** ✅
**Files:**
- `lib/content.ts` - `buyerGuides[]` array with guide data
- `app/resources/buyer-guides/page.tsx` - Display page

**Guides Created:**
1. **"Complete Guide to Corporate Video Conferencing"**
   - For: Facilities managers, IT decision-makers
   - Includes: Feature checklist, budget planning, technical considerations

2. **"Venue Owner's Guide to Commercial Restaurant Sound"**
   - For: Restaurant owners, hospitality managers
   - Includes: Zone audio explained, equipment breakdown, content curation tips

3. **"How to Choose the Right Commercial AV Partner"**
   - For: Any organization evaluating vendors
   - Includes: Vendor evaluation criteria, scope definition, support planning

**Features:**
- Expandable sections
- Practical checklists
- PDF download capability (ready for email service integration)
- CTA for consultations

---

### 5. **Content Templates & Calendar** ✅
**File:** `lib/content-templates.ts`

**Included Templates:**
- **Blog Post Template** (7-section structure with SEO tips)
- **LinkedIn Strategy** (4 content formats with scripts)
- **Video Production Guide** (4 video types with editing tips)
- **Email Campaign Template** (segmented by industry/role)
- **Monthly Content Calendar** (quota and theme planning)

**Blog Topics Suggested:**
- "How to Fix Echo and Feedback in Boardroom Audio"
- "Why Your Restaurant Audio Needs Zone-Based Control"
- "Live Streaming Your Church Service: Technical Setup"
- "CCTV for Retail: Coverage Without Compromising UX"

**LinkedIn Formats:**
1. Success Story / Case Study
2. Expertise / Educational Post
3. Industry Insight / Trend
4. Behind-the-Scenes / Team Culture

---

### 6. **API Endpoints** ✅

#### `POST /api/quote`
**File:** `app/api/quote/route.ts`

Handles quote form submissions.

**Payload:**
```json
{
  "name": "John Doe",
  "company": "ABC Corp",
  "email": "john@abc.com",
  "phone": "0715825819",
  "vertical": "Corporate / Boardrooms",
  "projectType": "New installation",
  "roomSize": "Medium (50–200 sqm)",
  "budget": "KES 600k–1.5M",
  "timeline": "1–3 months",
  "details": "Need boardroom with conferencing..."
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Thank you! We've received your quote request..."
}
```

**Next Step:** Integrate with email service (Resend, SendGrid) or CRM (Pipedrive, HubSpot).

---

#### `POST /api/assessment`
**File:** `app/api/assessment/route.ts`

Handles room assessment submissions.

**Payload:**
```json
{
  "email": "user@company.com",
  "responses": { "0": 1, "1": 2, "2": 3, ... },
  "score": 12
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Assessment complete! We'll send detailed report..."
}
```

**Next Step:** Generate PDF report with recommendations, send via email.

---

### 7. **Navigation Updates** ✅
**File:** `components/site-shell.tsx`

**Changes:**
- Added "Solutions" dropdown menu with vertical links
- Reordered nav: Home → About → Services → Solutions → Case Studies → Buyer Guides → Blog → Contact
- Added "Solutions" submenu with:
  - Corporate Boardrooms
  - Hotels & Hospitality
  - Churches & Worship
  - Schools & Education

---

## Data Structure (Added to `lib/content.ts`)

### VerticalLanding Type
```tsx
export type VerticalLanding = {
  slug: string;
  vertical: string;
  title: string;
  description: string;
  heroHeading: string;
  heroSubheading: string;
  challenges: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  solutions: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
  }>;
  keyBenefits: string[];
  ctaHeading: string;
  ctaSubheading: string;
};
```

### BuyerGuide Type
```tsx
export type BuyerGuide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  checklist: string[];
  cta: string;
};
```

---

## File Structure

```
powerwave-av-site/
├── app/
│   ├── api/
│   │   ├── quote/route.ts (NEW)
│   │   └── assessment/route.ts (NEW)
│   ├── projects/
│   │   └── case-studies.tsx (NEW)
│   ├── resources/
│   │   └── buyer-guides/page.tsx (NEW)
│   └── solutions/
│       └── [slug]/page.tsx (TO CREATE)
├── components/
│   ├── quote-form.tsx (NEW)
│   ├── room-assessment.tsx (NEW)
│   ├── vertical-solution-page.tsx (NEW)
│   └── site-shell.tsx (UPDATED)
└── lib/
    ├── content.ts (UPDATED - added types & data)
    └── content-templates.ts (NEW)
```

---

## How to Use This Implementation

### Creating Vertical Landing Pages

1. Create a new directory: `app/solutions/[slug]/page.tsx`
2. Use the component:

```tsx
"use client";
import { VerticalSolutionPage } from "@/components/vertical-solution-page";

export default function HotelsSolutionPage() {
  return <VerticalSolutionPage slug="av-solutions-hotels-restaurants" />;
}
```

3. Repeat for other verticals: `churches-worship`, `education-schools`, etc.

---

### Integrating Email Services

For the quote form and assessment, connect to an email service:

**Option 1: Resend** (Recommended for simplicity)
```tsx
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// In /api/quote route:
await resend.emails.send({
  from: "noreply@powerwaveav.com",
  to: form.email,
  subject: "Quote Request Received",
  html: `<p>Thanks for your interest...</p>`,
});
```

**Option 2: SendGrid**
```tsx
// Similar approach with SendGrid client
```

**Option 3: Google Sheets** (Free, simple)
- Add responses to a Google Sheet via Google Forms API or webhook

---

### PDF Guide Generation

For "Download Guide" buttons:

**Option 1: PDFKit Library**
```tsx
import PDFDocument from "pdfkit";

// Generate PDF from buyerGuide data
```

**Option 2: External Service (Easier)**
- Use **Puppeteer** or **Playwright** to generate PDFs server-side
- Or use **Typeform** to embed buyer guides as forms

---

## SEO & Local Optimization

### Keywords Targeted
- "Corporate boardroom installation Nairobi"
- "Commercial sound systems Kenya"
- "Video conferencing setup for offices"
- "Hotel audio visual solutions"
- "Church sound systems Kenya"
- "Interactive displays for schools"

### On-Page SEO
- **Title tags:** Include location + service (e.g., "Boardroom Installation Nairobi | PowerWave AV")
- **Meta descriptions:** Under 160 chars, include keyword
- **H1/H2 structure:** Clear hierarchy with keywords
- **Internal linking:** Blog → Guides → Case Studies → Verticals
- **Local schema:** Add JSON-LD for local business, Organization, Product

### Content Strategy
- 1 blog post per week (target 1000–2000 words, SEO-optimized)
- 3–4 LinkedIn posts per week (industry insights, case studies)
- 2–3 video reels per week (Instagram, TikTok, YouTube Shorts)
- Monthly email campaigns (segmented by vertical)

---

## Integration Checklist

- [ ] Create `.env.local` file with API keys:
  - `RESEND_API_KEY` (or your email service)
  - `DATABASE_URL` (if storing leads in a database)
  
- [ ] Connect email service to `/api/quote` and `/api/assessment`
- [ ] Create solution pages under `app/solutions/`
- [ ] Set up Google Sheets or CRM for lead capture
- [ ] Test all forms and interactive components
- [ ] Add images/videos to case studies
- [ ] Configure next.config.ts for image optimization
- [ ] Set up Analytics (Google Analytics 4) for tracking conversions
- [ ] Create LinkedIn Company Page content calendar
- [ ] Schedule first 4 weeks of blog posts and social content

---

## Metrics to Track

### Website Metrics
- Conversion rate on quote forms
- Assessment completion rate
- Average time on case study pages
- Click-through rate from blog to guides
- Bounce rate by vertical landing page

### Lead Metrics
- Leads by vertical (boardrooms, hospitality, worship, education)
- Lead quality score (assessed via LinkedIn, company size, etc.)
- Sales cycle from lead to proposal
- Proposal-to-close rate

### Content Metrics
- LinkedIn engagement (likes, comments, shares)
- Blog traffic and ranking position
- Video views and completion rate
- Email open and click-through rates

---

## Next Steps

1. **Email Integration:** Connect `/api/quote` and `/api/assessment` to email service
2. **Create Solution Pages:** Set up pages for each vertical under `app/solutions/`
3. **Media Production:** Film case study videos and before/after photography
4. **Content Calendar:** Launch blog and LinkedIn posting schedule
5. **CRM Setup:** Choose CRM (HubSpot, Pipedrive) and sync leads
6. **Analytics:** Set up Google Analytics 4 conversion tracking
7. **LinkedIn Strategy:** Activate company page content and employee advocacy

---

## Support & Documentation

- **Framer Motion docs:** For animation refinements
- **Next.js API Routes:** For backend logic
- **Resend Docs:** For email integration
- **Stripe (optional):** For payment processing if offering packages

---

**Implementation Date:** July 2026  
**Status:** ✅ Complete – Ready for deployment and content creation
