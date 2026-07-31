# PowerWave AV Implementation - Visual Architecture

## Sales Funnel Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AWARENESS STAGE                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │  Google Search │  │   LinkedIn    │  │   Website     │          │
│  │  - "boardroom"│  │   Posts       │  │   Blog Posts  │          │
│  │  - "church av"│  │   Articles    │  │   Case Studies│          │
│  │  - "hotel av" │  │   Comments    │  │               │          │
│  └───────┬────────┘  └────────┬──────┘  └────────┬──────┘          │
│          │                    │                   │                  │
└──────────┼────────────────────┼───────────────────┼──────────────────┘
           │                    │                   │
           └────────────┬───────┴───────────────────┘
                        │
           ┌────────────▼──────────────┐
           │   POWERWAVE AV WEBSITE    │
           │                            │
           │  ┌──────────────────────┐ │
           │  │ Solution Pages (4)    │ │
           │  │ - Boardrooms         │ │
           │  │ - Hospitality        │ │
           │  │ - Worship            │ │
           │  │ - Education          │ │
           │  └──────────────────────┘ │
           │                            │
           │  ┌──────────────────────┐ │
           │  │ Case Studies (4)     │ │
           │  │ + Videos + Metrics   │ │
           │  └──────────────────────┘ │
           │                            │
           │  ┌──────────────────────┐ │
           │  │ Buyer's Guides (3)   │ │
           │  │ + Checklists + PDF   │ │
           │  └──────────────────────┘ │
           └────────────┬──────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────────────┐
│                    CONSIDERATION STAGE                                │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  INTERACTIVE TOOLS - Generate Leads                           │  │
│  │                                                                │  │
│  │  ┌──────────────────────┐    ┌──────────────────────┐        │  │
│  │  │  QUOTE FORM          │    │  ASSESSMENT TOOL     │        │  │
│  │  │  ✓ 3-Step Process    │    │  ✓ 6 Smart Questions │        │  │
│  │  │  ✓ Budget/Timeline   │    │  ✓ Recommendations  │        │  │
│  │  │  ✓ Vertical Auto-Select   ✓ Email Capture      │        │  │
│  │  │  ✓ Project Details   │    │  ✓ Lead Score       │        │  │
│  │  └──────────────────────┘    └──────────────────────┘        │  │
│  │           │                            │                     │  │
│  │           └────────────┬────────────────┘                     │  │
│  │                        │                                       │  │
│  │            API: /api/quote  /api/assessment                   │  │
│  └────────────────────────┼───────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│             ┌──────────────────────────┐                             │
│             │  Email Notification      │                             │
│             │  ✓ Sent to PowerWave     │                             │
│             │  ✓ Lead Data Captured    │                             │
│             │  ✓ Auto-Confirmation    │                             │
│             │    to Prospect           │                             │
│             └──────────────────────────┘                             │
└───────────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────────────┐
│                    DECISION STAGE                                       │
│                    (Sales Team Engagement)                              │
│                                                                        │
│  Lead Received → Route by Vertical → Contact Within 2 Hours           │
│  ├─ Boardrooms → Enterprise Sales                                     │
│  ├─ Hospitality → Hospitality Sales                                   │
│  ├─ Worship → Non-Profit/Religious Specialist                         │
│  └─ Education → School/Institutional Sales                            │
│                                                                        │
│  Follow-up: Phone → Schedule Site Visit → Proposal → Closing          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Website Architecture

```
PowerWave AV Website
│
├── Home Page
│   ├── Hero Section
│   ├── Services Overview
│   ├── Case Study Highlight
│   └── CTA: Assessment / Quote
│
├── Solutions (NEW) 👈
│   ├── /solutions/corporate-boardrooms/
│   │   ├── Challenge Section
│   │   ├── Solution Breakdown
│   │   ├── Key Benefits
│   │   └── Quote Form (Pre-filled: "Corporate")
│   │
│   ├── /solutions/hotels-restaurants/
│   │   ├── Challenge Section
│   │   ├── Solution Breakdown
│   │   ├── Key Benefits
│   │   └── Quote Form (Pre-filled: "Hospitality")
│   │
│   ├── /solutions/churches-worship/
│   │   ├── Challenge Section
│   │   ├── Solution Breakdown
│   │   ├── Key Benefits
│   │   └── Quote Form (Pre-filled: "Worship")
│   │
│   └── /solutions/education-schools/
│       ├── Challenge Section
│       ├── Solution Breakdown
│       ├── Key Benefits
│       └── Quote Form (Pre-filled: "Education")
│
├── Projects (ENHANCED) 👈
│   ├── /projects/
│   │   ├── Category Filter
│   │   └── Traditional Case Studies
│   │
│   └── /projects/case-studies/ (NEW)
│       ├── Case Study 1: Executive Boardroom
│       │   ├── Before/After Image
│       │   ├── Embedded Video
│       │   ├── Metrics (ROI, Uptime, %)
│       │   └── Client Testimonial
│       │
│       ├── Case Study 2: Hotel Experience
│       │   ├── Before/After Image
│       │   ├── Embedded Video
│       │   ├── Metrics
│       │   └── Client Testimonial
│       │
│       ├── Case Study 3: Restaurant Audio
│       │   ├── Before/After Image
│       │   ├── Embedded Video
│       │   ├── Metrics
│       │   └── Client Testimonial
│       │
│       └── Case Study 4: Church Worship
│           ├── Before/After Image
│           ├── Embedded Video
│           ├── Metrics
│           └── Client Testimonial
│
├── Resources (NEW) 👈
│   └── /resources/buyer-guides/
│       ├── Guide 1: Corporate Video Conferencing
│       │   ├── Expandable Sections
│       │   ├── Checklist
│       │   └── Download PDF
│       │
│       ├── Guide 2: Restaurant Sound Systems
│       │   ├── Expandable Sections
│       │   ├── Checklist
│       │   └── Download PDF
│       │
│       └── Guide 3: Choose AV Partner
│           ├── Expandable Sections
│           ├── Checklist
│           └── Download PDF
│
├── Blog (Existing)
│   ├── Post: Boardroom Tech Guide
│   ├── Post: Restaurant Audio Setup
│   ├── Post: Church Live Streaming
│   └── Post: Classroom Interactive Displays
│
├── Contact (Existing)
│   ├── Contact Form
│   ├── Phone / WhatsApp
│   └── Location Map
│
└── Other Pages (Existing)
    ├── About
    ├── Services
    ├── Industries
    ├── FAQ
    └── Terms/Privacy
```

---

## Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    LIB/CONTENT.TS                              │
│  (Central Data Source - All Content Lives Here)               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │ verticalLandings │  │  buyerGuides[]   │  │  projects[] │  │
│  │ (4 verticals)    │  │  (3 guides)      │  │ (4 studies) │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬──────┘  │
│           │                     │                    │         │
└───────────┼─────────────────────┼────────────────────┼─────────┘
            │                     │                    │
    ┌───────▼──────┐      ┌───────▼──────┐    ┌──────▼────────┐
    │  Components/ │      │ /resources/  │    │ /projects/   │
    │ vertical-    │      │ buyer-guides │    │ case-studies  │
    │ solution-    │      │    /page.tsx │    │    .tsx       │
    │ page.tsx     │      └──────────────┘    └───────────────┘
    └───────┬──────┘
            │
    ┌───────▼────────────────────────┐
    │  Renders 4 Solution Pages:      │
    │  - /solutions/boardrooms/       │
    │  - /solutions/hospitality/      │
    │  - /solutions/worship/          │
    │  - /solutions/education/        │
    └────────────────────────────────┘
```

---

## Form Submission Flow

```
USER INTERACTION
    │
    ├─── Quote Form (3-step)
    │    ├─ Step 1: Contact Info + Vertical
    │    ├─ Step 2: Project Details (Type, Room Size, Budget, Timeline)
    │    └─ Step 3: Additional Details + Submit
    │
    └─── Assessment Questionnaire (6 questions)
         ├─ Q1: Industry Type
         ├─ Q2: Current Audio Quality
         ├─ Q3: Biggest Challenge
         ├─ Q4: User Count
         ├─ Q5: Display Needs
         └─ Q6: Remote Access Importance
              │
              │ SUBMIT
              ▼
    ┌────────────────────────────────────┐
    │  API ENDPOINT                      │
    │  /api/quote  OR  /api/assessment   │
    └────────────────────┬───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │ Validate │    │ Score    │    │ Save to  │
    │ Fields   │    │ Results  │    │ Database │
    │          │    │ (if assm)│    │ (optional)
    └─────────┘    └──────────┘    └──────────┘
         │               │              │
         └───────────────┼──────────────┘
                         │
                    ┌────▼─────┐
                    │   EMAIL   │
                    │   SERVICE │
                    │ (Resend)  │
                    └────┬──────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    ┌──────────────┐          ┌─────────────────┐
    │ Auto Reply   │          │ Admin Alert     │
    │ to Prospect  │          │ to PowerWave    │
    │ Confirm      │          │ with Lead Data  │
    │ Details      │          │ & Vertical      │
    └──────────────┘          └─────────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ CRM / Sheet  │
                              │ Lead Storage │
                              └──────────────┘
```

---

## Content Marketing Flow

```
CONTENT CREATION (Using Templates)
    │
    ├─── Blog Post (Weekly)
    │    ├─ Write using lib/content-templates.ts
    │    ├─ Optimize for keyword (e.g., "boardroom Nairobi")
    │    ├─ Internal link to solution page
    │    └─ Publish to /blog/[slug]/
    │
    ├─── LinkedIn Post (3-4x/week)
    │    ├─ Choose format (Case Study, Expertise, Trend, Behind-the-scenes)
    │    ├─ Write using templates
    │    ├─ Add 3-5 hashtags
    │    └─ Publish + Engage
    │
    ├─── Video Content (2-3x/week)
    │    ├─ Record using video guide
    │    ├─ Edit with captions/overlays
    │    ├─ Add music + branding
    │    └─ Distribute: YouTube, LinkedIn, Instagram, TikTok
    │
    └─── Email Campaign (Weekly)
         ├─ Segment by vertical
         ├─ Use email templates
         ├─ Target: Quote leads, Assessment leads
         └─ Send: Welcome, Case Study, Offer

                     │
                     ▼
         SOCIAL PROOF ACCUMULATION
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
  ┌────────┐    ┌─────────┐    ┌─────────┐
  │ Blog   │    │ Social  │    │ Email   │
  │ Traffic│    │Engagement    │ Clicks  │
  │        │    │ & Shares    │        │
  └────────┘    └─────────┘    └─────────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
                     ▼
      WEBSITE TRAFFIC + CONVERSIONS
                     │
              (Forms Submitted)
                     │
           (Qualified Leads Generated)
```

---

## Analytics Tracking Structure

```
GOOGLE ANALYTICS 4
│
├── Page Views
│   ├─ Solution Pages (track by vertical)
│   ├─ Case Study Page (track video plays)
│   ├─ Buyer's Guide Page (track expansions)
│   └─ Blog Posts (track scroll depth)
│
├── Events
│   ├─ Quote Form Step 1 Completed
│   ├─ Quote Form Step 2 Completed
│   ├─ Quote Form Step 3 Submitted
│   ├─ Assessment Question 1-6
│   ├─ Assessment Submitted
│   ├─ Contact Form Submitted
│   ├─ Video Played (Case Studies)
│   └─ Guide Downloaded
│
├── Conversions (Goals)
│   ├─ Quote Form Submission
│   │   ├─ By Vertical (Boardrooms, Hospitality, etc.)
│   │   ├─ By Traffic Source (Organic, Paid, Direct)
│   │   └─ Conversion Rate
│   │
│   ├─ Assessment Submission
│   │   ├─ Completion Rate
│   │   └─ By Recommendation Level
│   │
│   └─ Contact Form Submission
│
├── Funnel Analysis
│   ├─ Visitor → Page View → Form View → Form Submit
│   ├─ Blog Post → Solution Page → Form Submit
│   ├─ Assessment → Email Capture → Email Click
│   └─ Case Study View → Contact CTA Click
│
└── Custom Dimensions
    ├─ Vertical (Boardrooms, Hospitality, Worship, Education)
    ├─ Form Type (Quote, Assessment, Contact)
    ├─ Traffic Source (Organic, Paid, Social, Direct)
    └─ Lead Quality Score (High, Medium, Low)
```

---

## SEO Keyword Architecture

```
HIGH-INTENT KEYWORDS
│
├── CORPORATE / BOARDROOMS
│   ├─ "Corporate boardroom installation Nairobi"
│   ├─ "Video conferencing systems Kenya"
│   ├─ "Hybrid meeting room setup"
│   └─ Content: Solution Page + Blog Post + Case Study
│
├── HOSPITALITY (Hotels & Restaurants)
│   ├─ "Hotel audio visual solutions Kenya"
│   ├─ "Restaurant sound systems Nairobi"
│   ├─ "Venue AV rental Kenya"
│   └─ Content: Solution Page + Blog Post + Case Study (x2)
│
├── WORSHIP (Churches)
│   ├─ "Church sound systems Kenya"
│   ├─ "Live streaming church Nairobi"
│   ├─ "Worship audio installation"
│   └─ Content: Solution Page + Blog Post + Case Study
│
├── EDUCATION (Schools)
│   ├─ "Interactive displays for schools Kenya"
│   ├─ "Classroom AV systems Nairobi"
│   ├─ "Hybrid classroom technology"
│   └─ Content: Solution Page + Blog Post
│
└── INFORMATIONAL (Buyer Intent)
    ├─ "How to choose AV system"
    ├─ "What makes good boardroom audio"
    ├─ "Best commercial sound system"
    └─ Content: Buyer's Guides + Blog Posts
```

---

## Conversion Attribution

```
MULTI-TOUCH ATTRIBUTION

Example Journey 1 (2-week conversion):
  Day 1: Google Search "boardroom installation Nairobi"
         → Solution Page View → Quiz 30% → Leave
  Day 3: LinkedIn Ad for "Corporate AV"
         → Case Study View
  Day 5: Email from newsletter
         → Blog Post "Choosing Boardroom Tech" → Quote Form → Submit ✅

Example Journey 2 (Same-day conversion):
  Day 1: LinkedIn Post about hotel AV
         → Solution Page (Hospitality) → Assessment → Quote Form → Submit ✅

Example Journey 3 (4-week nurture):
  Day 1: Google Search "church sound systems"
         → Solution Page (Worship) → Leave
  Day 7: Email campaign
         → Buyer's Guide for Religious Institutions
  Day 14: Retargeting Ad
         → Case Study (Church) → Request Consultation ✅
  Day 28: Sales Call → Proposal → Close ✅
```

---

**This architecture enables:**
- ✅ Multiple entry points for different buyer personas
- ✅ Clear segmentation by industry/vertical
- ✅ Measurable attribution for each channel
- ✅ Scalable addition of new verticals
- ✅ Data-driven optimization

**Implementation Timeline:**
- Week 1: Deploy core (solution pages, case studies, forms)
- Week 2-3: Launch content (blog, LinkedIn, email)
- Week 4+: Optimize based on analytics
