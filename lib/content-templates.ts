/**
 * Content Templates for PowerWave AV
 * 
 * These templates guide creation of blog posts, LinkedIn articles, case studies,
 * and other content aligned with the B2B commercial AV strategy.
 */

// ============================================================================
// BLOG POST TEMPLATE
// ============================================================================

export const blogPostTemplate = {
  title: "Template: [Solution/Challenge] in [Industry]",
  slug: "template-topic-slug",
  excerpt:
    "A one-sentence hook that speaks to the reader's pain point or desire. This appears in archives and on social sharing.",
  category: "Sound|Video|Boardrooms|Hospitality|Security|Education|Worship",
  readTime: "5–7 min read",
  image: "/images/blog-[topic].svg",

  // Post Structure
  sections: [
    {
      heading: "Hook / Opening Problem",
      guidelines: [
        "Start with a relatable scenario or statistic",
        "Make it specific to the industry and role (facilities manager, venue owner, etc.)",
        "Show the business impact: guest satisfaction, productivity loss, compliance risk",
        "Example: 'You're hosting a client presentation, and the projector cuts out.'",
      ],
    },
    {
      heading: "The Cost of Not Solving It",
      guidelines: [
        "Quantify the problem if possible (e.g., '15 minute meetings lost per week')",
        "Connect to revenue loss, safety issues, or brand damage",
        "Keep it relatable—avoid being preachy",
      ],
    },
    {
      heading: "The Solution (High Level)",
      guidelines: [
        "Introduce the category of solution (e.g., 'A professional boardroom system')",
        "Explain how it works in simple language",
        "Focus on benefits, not specs",
      ],
    },
    {
      heading: "How It Works (Practical Breakdown)",
      guidelines: [
        "Break the solution into 3–4 practical components",
        "Use analogies if helpful (e.g., 'like a conductor in an orchestra')",
        "Include a short diagram or visual reference if helpful",
      ],
    },
    {
      heading: "Real Example or Case Study",
      guidelines: [
        "Share a real or composite scenario",
        "Show before/after impact",
        "Mention measurable results (time saved, satisfaction score, etc.)",
      ],
    },
    {
      heading: "Common Questions",
      guidelines: [
        "Anticipate reader concerns",
        "Address budget, complexity, timeline",
        "Link to FAQ or buyer's guide for deeper answers",
      ],
    },
    {
      heading: "Next Steps / CTA",
      guidelines: [
        "Offer a low-friction next action (assessment, guide download, consultation)",
        "Link to relevant buyer's guide or case study",
        "Include direct contact info",
      ],
    },
  ],

  seoTips: [
    "Use target keyword in title (e.g., 'Corporate Boardroom Sound System: A Complete Guide')",
    "Include keyword in first 100 words and conclusion",
    "Use H2/H3 headings with relevant terms",
    "Link to related posts and guides",
    "Include metadata: slug, category, read time, image",
  ],

  exampleTopics: [
    "How to Fix Echo and Feedback in Boardroom Audio",
    "Why Your Restaurant Audio Needs Zone-Based Control",
    "Live Streaming Your Church Service: Technical Setup Guide",
    "Interactive Displays in Classrooms: What Teachers Actually Need",
    "CCTV for Retail: Coverage Without Compromising Customer Experience",
    "The Real Cost of Outdated Conference Room Tech",
  ],
};

// ============================================================================
// LINKEDIN ARTICLE TEMPLATE
// ============================================================================

export const linkedinTemplate = {
  formats: [
    {
      name: "Success Story / Case Study",
      structure: [
        "Hook: 'We just helped a 50-person boardroom eliminate a 10-minute setup ritual.'",
        "Problem: 'Hybrid meetings kept failing because...'",
        "Solution: 'We designed a system that...'",
        "Result: 'Now every meeting starts on time, every time.'",
        "Lesson: 'Here's what we learned about professional meeting rooms...'",
      ],
      length: "500–800 words",
      cta: "Curious about your boardroom setup? Let's chat.",
    },
    {
      name: "Expertise / Educational Post",
      structure: [
        "Question: 'What makes a restaurant sound system work?'",
        "Context: 'We work with 20+ venues across Nairobi. Here's what we've learned...'",
        "Key Point 1: '[Insight]'",
        "Key Point 2: '[Insight]'",
        "Key Point 3: '[Insight]'",
        "Takeaway: 'The best system is the one your team can actually use.'",
      ],
      length: "600–1000 words",
      cta: "What's your biggest audio challenge? I'd love to hear.",
    },
    {
      name: "Industry Insight / Trend",
      structure: [
        "Observation: 'Hybrid work is accelerating AV adoption in Kenya.'",
        "Data: '[If you have it] 45% of Nairobi businesses now use video conferencing.'",
        "Implication: 'This changes what we need to design for...'",
        "Action: 'Here's how we're adapting our approach...'",
        "Invitation: 'What trends are you seeing in your industry?'",
      ],
      length: "400–600 words",
      cta: "Share your observations in the comments.",
    },
    {
      name: "Behind-the-Scenes / Team Culture",
      structure: [
        "Scenario: 'Yesterday, we tuned audio in a boardroom for 6 hours.'",
        "Why: 'Getting it right matters—this is where deals get made.'",
        "Mindset: 'Our team believes every detail matters.'",
        "Lesson for Others: 'This is why quality installation takes time, not corners.'",
      ],
      length: "300–500 words",
      cta: "Professional AV is a craft. Who else takes pride in the details?",
    },
  ],

  tips: [
    "Start with a hook in first sentence",
    "Use short paragraphs (2–3 lines max)",
    "Include 1 question to drive engagement",
    "Add 3–5 relevant hashtags (#Boardrooms #AV #KenyaBusinesses)",
    "Post Tuesday–Thursday, 8–10 AM for best reach",
    "Tag relevant organizations or industry peers",
    "Include a soft CTA, not a hard sell",
  ],

  hashtagPrimer:
    "#AudioVisual #Boardrooms #HybridWork #CorporateEvents #Hospitality #Kenya #NairobiBusinesses #ProAV #EventTech #CommunicationTech #Conferencing #DigitalTransformation #BusinessSolutions",
};

// ============================================================================
// VIDEO CONTENT TEMPLATE
// ============================================================================

export const videoTemplate = {
  formats: [
    {
      name: "Before & After Transformation (30–60 sec)",
      script: [
        "OPEN: 'This boardroom setup was chaos. Watch what changed.'",
        "BEFORE: [Show messy cables, confused users, broken screen]",
        "DURING: [Quick montage of installation]",
        "AFTER: [Clean, functional, one-touch operation]",
        "TEXT OVERLAY: 'Setup time: 10 minutes → 1 minute'",
        "CLOSE: 'PowerWave AV. Professional installations, lasting results.'",
      ],
      where: "Instagram, TikTok, YouTube Shorts",
      notes:
        "Keep pacing fast. Use trending audio. Show real problems and solutions.",
    },
    {
      name: "Expert Tip / Quick How-To (1–2 min)",
      script: [
        "OPEN: 'Quick tip: How to reduce echo in a restaurant.'",
        "Explain: 'Most echo comes from hard surfaces. Here's what we do...'",
        "Show: [Diagram, before/after, or quick demo]",
        "CLOSE: 'Questions? Let's connect.'",
      ],
      where: "LinkedIn, YouTube, Instagram Reels",
      notes: "Position the expert (founder, tech lead) as the narrator. Build authority.",
    },
    {
      name: "Customer Interview / Testimonial (2–3 min)",
      script: [
        "INTRO: 'Meet [Customer Name], [Role], at [Organization]'",
        "Interview Q: 'What was your biggest challenge before?'",
        "Interview Q: 'How has it changed?'",
        "FOOTAGE: [Show system in action, customer using it]",
        "QUOTE CARD: [Key testimonial quote on screen]",
        "CTA: 'Ready to transform your space?'",
      ],
      where: "Website homepage, YouTube playlist, case study pages",
      notes:
        "Authentic interviews beat scripted content. Let customers tell their story.",
    },
    {
      name: "Process Video / Installation Timelapse (1–2 min)",
      script: [
        "OPEN: 'A luxury boardroom installation in Nairobi, condensed.'",
        "MONTAGE: [Fast-forward clips of installation process]",
        "TEXT OVERLAY: [Key milestones, day 1, day 2, etc.]",
        "FINAL SHOT: [Polished room ready for use]",
        "CLOSE: 'The attention to detail matters.'",
      ],
      where: "LinkedIn, YouTube, Instagram",
      notes:
        "Satisfying to watch. Demonstrates professionalism. No speaking required.",
    },
  ],

  shootingTips: [
    "Use natural lighting when possible; avoid harsh shadows",
    "Stable camera on tripod; avoid handheld shaking",
    "Clear audio (wireless mic if interviewing)",
    "B-roll: wide shots, close-ups of details, people interacting with systems",
    "Get permission from clients before filming",
    "Shoot in 16:9 for web, and consider vertical 9:16 for mobile/social",
  ],

  editingTips: [
    "Keep cuts quick (2–4 seconds per shot)",
    "Use music to set tone (copyright-free music from Epidemic Sound, etc.)",
    "Add text overlays for key points (no audio required to understand)",
    "Color grade for professional look (consistency across all videos)",
    "Add captions (50% of people watch muted)",
    "Include intro/outro branding (2–3 seconds)",
  ],
};

// ============================================================================
// EMAIL CAMPAIGN TEMPLATE
// ============================================================================

export const emailTemplate = {
  segments: [
    {
      name: "Corporate Decision-Makers (Facilities, IT)",
      subject: "Is Your Boardroom Causing Missed Opportunities?",
      preview: "Most setup delays can be eliminated. Here's how.",
      body: [
        "Hi [Name],",
        "Every minute a client waits for your boardroom to be ready is a minute not spent on the meeting.",
        "[Insight from recent project or stat]",
        "We've helped [X] organizations eliminate setup delays with professional conferencing systems.",
        "[CTA: 'See how →'] [Link to boardroom guide or case study]",
        "Or schedule a 15-minute conversation: [Link to calendar]",
        "— PowerWave AV",
      ],
    },
    {
      name: "Hospitality Venues (GM, F&B Manager)",
      subject: "Your Restaurant Audio Could Be Your Best Marketing Tool",
      preview: "One detail guests notice: how the space sounds.",
      body: [
        "Hi [Name],",
        "Guest feedback we hear: 'The ambience was perfect.'",
        "That ambience isn't accidental—it's designed.",
        "We've tuned audio systems for 15+ venues in Nairobi. Here's what we learned: [Link to blog post]",
        "[CTA: 'Download our venue sound checklist'] or reply to chat.",
        "Best,",
        "— PowerWave AV",
      ],
    },
    {
      name: "Churches / Educational Institutions",
      subject: "Your Message Deserves to Be Heard Clearly",
      preview: "Live streaming and clarity, designed for your mission.",
      body: [
        "Hi [Name],",
        "Whether in the sanctuary or online, your message matters.",
        "Modern sound and streaming systems help you reach everyone—in-person and remote.",
        "[Link to church or education case study]",
        "[CTA: 'Let's discuss your needs →'] [Link to consultation booking]",
        "—PowerWave AV",
      ],
    },
  ],

  bestPractices: [
    "Segment by industry/role; avoid generic blasts",
    "Personalize: '[Name]', '[Company]'",
    "Lead with benefit, not feature",
    "Include one clear CTA per email",
    "Keep body short (3–5 sentences max)",
    "Add PS with direct contact or one more resource",
  ],
};

// ============================================================================
// QUICK CONTENT CALENDAR GUIDE
// ============================================================================

export const contentCalendarGuide = {
  monday: "Share an insight or tip (blog post, tip video)",
  tuesday: "Industry news or trend + perspective",
  wednesday: "Behind-the-scenes or team/project focus",
  thursday: "Case study or customer success story",
  friday: "Weekend-casual content or community question",

  monthlyThemes: [
    "Month 1: Boardroom fundamentals and conferecing",
    "Month 2: Hospitality (hotels & restaurants)",
    "Month 3: Worship and education",
    "Month 4: Buyer's guide month (downloadable resources)",
    "Repeat or adjust based on engagement and client feedback",
  ],

  contentQuota: [
    "3–4 LinkedIn posts per week",
    "1 long-form blog post per week",
    "2–3 short videos (reels/shorts) per week",
    "1 email campaign per week to targeted segments",
    "1 case study or deep dive per month",
  ],
};

const contentTemplates = {
  blogPostTemplate,
  linkedinTemplate,
  videoTemplate,
  emailTemplate,
  contentCalendarGuide,
};

export default contentTemplates;
