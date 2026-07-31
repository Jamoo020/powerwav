export type Service = {
  title: string;
  description: string;
  features: string[];
  outcomes: string[];
  why: string;
  href: string;
  accent: string;
};

export type Industry = {
  name: string;
  description: string;
  challenges: string[];
  systems: string[];
  href: string;
};

export type ProjectItem = {
  title: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
};

export type LocationPage = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  intro: string;
};

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

export const services: Service[] = [
  {
    title: "Professional Sound Systems",
    description: "Crystal-clear audio for hospitality, worship, corporate events, and live experiences.",
    features: ["PA systems", "Restaurant audio", "Church audio", "DJ and live performance setups"],
    outcomes: [
      "Balanced room coverage with minimal feedback",
      "Intuitive control for staff and presenters",
      "Audio that feels consistent from front to back",
    ],
    why: "Sound is the foundation of every experience. We design systems that make speech, music, and announcements feel natural and impactful.",
    href: "/services",
    accent: "From intimate restaurants to expansive halls, every sound system is tuned for clarity and reliability.",
  },
  {
    title: "Video & Display Solutions",
    description: "High-impact visual display deployments for modern offices, conference spaces, and retail environments.",
    features: ["LED displays", "Video walls", "Projectors", "Interactive displays"],
    outcomes: [
      "Crisp, bright visuals in any lighting condition",
      "Clean cable management and installation",
      "Seamless integration with presentation and signage workflows",
    ],
    why: "Visual communication should be effortless. We pair hardware and control systems so every screen works exactly when you need it.",
    href: "/services",
    accent: "We design immersive visuals that strengthen communication and customer experience.",
  },
  {
    title: "Boardroom & Conference Systems",
    description: "Intelligent meeting rooms with crisp audio, seamless sharing, and polished collaboration experiences.",
    features: ["Wireless presentation", "PTZ cameras", "Meeting automation", "Ceiling speakers"],
    outcomes: [
      "Fast meeting start-up with one-touch controls",
      "Consistent conferencing quality across devices",
      "Professional room layouts that impress guests",
    ],
    why: "A great meeting room removes friction. We build systems that make hybrid collaboration feel easy and dependable.",
    href: "/services",
    accent: "Every deployment prioritizes usability, reliability, and executive-level presentation quality.",
  },
  {
    title: "CCTV & Security Integration",
    description: "Secure, scalable surveillance systems with proactive monitoring and dependable performance.",
    features: ["IP cameras", "DVR/NVR", "Remote monitoring", "Site security design"],
    outcomes: [
      "Clear coverage of critical zones",
      "Remote access for managers and security teams",
      "Expandable systems that grow with your site",
    ],
    why: "Security should be visible and manageable. We design CCTV systems that support fast decisions and operational confidence.",
    href: "/services",
    accent: "We protect people, assets, and operations with systems that are easy to manage.",
  },
  {
    title: "Maintenance & Support",
    description: "Long-term support that protects your investment and keeps systems performing at their best.",
    features: ["Preventive maintenance", "Repairs", "Calibration", "Upgrades"],
    outcomes: [
      "Longer service life for equipment",
      "Fewer interruptions and faster fixes",
      "A partner ready to plan future upgrades",
    ],
    why: "Installation is only the beginning. Our support services keep systems reliable and prepared for change.",
    href: "/maintenance",
    accent: "Our responsive support team helps clients stay operational and future-ready.",
  },
];

export const industries: Industry[] = [
  {
    name: "Corporate",
    description: "Modern boardrooms, executive suites, and collaboration spaces that support hybrid work.",
    challenges: ["Low-quality meetings", "Poor room visibility", "Disjointed conferencing"],
    systems: ["Conference sound", "Wireless presentation", "Video conferencing integration"],
    href: "/industries",
  },
  {
    name: "Hotels",
    description: "Guest-facing AV experiences that elevate hospitality and support events with confidence.",
    challenges: ["Inconsistent guest audio", "Complex event demands", "Need for discreet integration"],
    systems: ["Distributed audio", "LED signage", "Conference room layouts"],
    href: "/industries",
  },
  {
    name: "Restaurants",
    description: "Dining environments need clear music, reliable announcements, and smart background audio.",
    challenges: ["Loud or uneven sound", "Guest comfort issues", "Limited control"],
    systems: ["Restaurant PA", "Background music", "Zone audio control"],
    href: "/industries",
  },
  {
    name: "Churches",
    description: "Worship spaces demand clarity, resilient coverage, and dependable audio performance.",
    challenges: ["Poor speech intelligibility", "Feedback issues", "Hard to scale"],
    systems: ["House sound", "Wireless microphones", "Live streaming support"],
    href: "/industries",
  },
  {
    name: "Schools",
    description: "Education institutions need durable, accessible AV systems for teaching and communication.",
    challenges: ["Outdated classrooms", "Low student engagement", "Maintenance gaps"],
    systems: ["Interactive displays", "Classroom audio", "CCTV and security"],
    href: "/industries",
  },
];

export const projects: ProjectItem[] = [
  {
    title: "Executive Boardroom Upgrade",
    category: "Boardrooms",
    summary: "A premium boardroom deployment with seamless conferencing, elegant presentation, and reliable automation.",
    challenge: "The client needed a workspace that could support modern hybrid meetings without visual clutter.",
    solution: "PowerWave AV designed a refined room with ceiling speakers, wireless presentation, and a professional camera setup.",
    results: "The boardroom now supports productive collaboration and feels aligned with the organization’s brand.",
    image: "/images/project-boardroom.jpeg",
  },
  {
    title: "Hotel Sound & Display Rollout",
    category: "Hospitality",
    summary: "A multi-zone audio and digital display system that improved guest communication and event readiness.",
    challenge: "The hotel needed discreet, reliable AV that worked across public spaces and meeting zones.",
    solution: "We deployed distributed audio, LED signage, and centralized control for a polished guest experience.",
    results: "Guest communication became clearer and the property could host events more confidently.",
    image: "/images/project-hotel.jpeg",
  },
  {
    title: "Retail Security & Display Deployment",
    category: "Security",
    summary: "An integrated security and digital signage solution for a busy retail environment.",
    challenge: "The business wanted stronger oversight without compromising the customer experience.",
    solution: "We delivered a layered CCTV design paired with digital displays that supported sales and communication.",
    results: "Operations became safer and the store environment felt more dynamic and controlled.",
    image: "/images/project-security.jpeg",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "PowerWave AV delivered a boardroom experience that feels premium and effortless. The team was highly responsive from planning through handover.",
    name: "Nadia K.",
    role: "Operations Director",
  },
  {
    quote: "Their installation quality and after-sales support have made our hotel events easier to manage and much more professional.",
    name: "James M.",
    role: "Hotel General Manager",
  },
  {
    quote: "The sound quality and attention to detail were outstanding. We trust them with every new site upgrade.",
    name: "Asha T.",
    role: "Facilities Lead",
  },
];

export const faqs: FaqEntry[] = [
  {
    question: "How quickly can you respond to a consultation request?",
    answer: "We typically schedule a discovery call or site visit promptly, depending on your location and project urgency.",
  },
  {
    question: "Do you provide installation and maintenance for existing systems?",
    answer: "Yes. We handle new installations, upgrades, repairs, preventive maintenance, and technical support.",
  },
  {
    question: "Can you design systems for hotels, restaurants, and boardrooms?",
    answer: "Absolutely. We tailor each solution to the space, audience, and business goals of the client.",
  },
  {
    question: "Do you work across Kenya?",
    answer: "Yes. We provide service across Nairobi and other regions through structured project delivery and support planning.",
  },
  {
    question: "Do you offer quotations for large multi-site projects?",
    answer: "Yes. We can support rollout planning, site surveys, and phased implementation for larger organisations.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "choosing-the-right-boardroom-technology",
    title: "Choosing the Right Boardroom Technology",
    excerpt: "A practical guide to building meeting rooms that are reliable, beautiful, and ready for hybrid work.",
    category: "Boardrooms",
    image: "/images/blog-boardroom.svg",
    readTime: "6 min read",
  },
  {
    slug: "how-led-displays-improve-customer-experience",
    title: "How LED Displays Improve Customer Experience",
    excerpt: "Discover why modern displays create stronger environments for hotels, retail spaces, and events.",
    category: "Video",
    image: "/images/blog-led.svg",
    readTime: "5 min read",
  },
  {
    slug: "restaurant-sound-system-guide",
    title: "Restaurant Sound System Guide",
    excerpt: "Learn how to select and tune audio for dining rooms that need comfort, clarity, and control.",
    category: "Sound",
    image: "/images/blog-restaurant.svg",
    readTime: "7 min read",
  },
  {
    slug: "planning-hybrid-classrooms",
    title: "Planning AV for Hybrid Classrooms",
    excerpt: "How to design classroom audio-visual systems that support both in-person teaching and remote learning.",
    category: "Education",
    image: "/images/blog-classroom.svg",
    readTime: "6 min read",
  },
  {
    slug: "hospitality-audio-that-feels-effortless",
    title: "Hospitality Audio That Feels Effortless",
    excerpt: "Tips for creating background sound and announcements that enhance guest experience without distraction.",
    category: "Hospitality",
    image: "/images/blog-hospitality.svg",
    readTime: "6 min read",
  },
  {
    slug: "what-to-ask-about-cctv-and-access-control",
    title: "What to Ask About CCTV and Access Control",
    excerpt: "A simple checklist for choosing CCTV and security systems that protect people, property, and operations.",
    category: "Security",
    image: "/images/blog-security.svg",
    readTime: "5 min read",
  },
];

export const locationPages: LocationPage[] = [
  { slug: "audio-visual-company-nairobi", title: "Audio Visual Company Nairobi", description: "Professional AV, boardroom, conference, and CCTV solutions for Nairobi businesses.", keyword: "Audio Visual Company Nairobi", intro: "PowerWave AV supports Nairobi offices, hotels, restaurants, and institutions with high-performance AV deployments and dependable support." },
  { slug: "boardroom-installation-nairobi", title: "Boardroom Installation Nairobi", description: "Premium boardroom installations in Nairobi with conferencing, presentation, and automation systems.", keyword: "Boardroom Installation Nairobi", intro: "We create executive-grade boardrooms that feel polished, functional, and ready for hybrid collaboration." },
  { slug: "conference-room-solutions-kenya", title: "Conference Room Solutions Kenya", description: "Conference room solutions for businesses across Kenya, designed for modern collaboration and premium presentation.", keyword: "Conference Solutions Kenya", intro: "From intimate meeting rooms to large conference spaces, we install systems that keep teams connected." },
  { slug: "led-display-installation-kenya", title: "LED Display Installation Kenya", description: "LED display installation for retail, corporate, hotel, and event environments across Kenya.", keyword: "LED Display Installation Kenya", intro: "Our display solutions help businesses create stronger visual impact and communicate more effectively." },
  { slug: "restaurant-sound-systems-kenya", title: "Restaurant Sound Systems Kenya", description: "Restaurant sound systems tailored for atmosphere, clarity, and control across Kenyan hospitality venues.", keyword: "Restaurant Sound Systems Kenya", intro: "We design dining audio that supports comfort, ambience, and clear communication without overwhelming guests." },
  { slug: "church-sound-systems-kenya", title: "Church Sound Systems Kenya", description: "Church sound systems designed for worship, speech, and live services with dependable clarity.", keyword: "Church Sound Systems Kenya", intro: "PowerWave AV delivers systems that strengthen worship experiences and improve communication across the congregation." },
  { slug: "hotel-audio-visual-solutions", title: "Hotel Audio Visual Solutions", description: "Hotel AV solutions for events, guest experience, and professional spaces in Kenya.", keyword: "Hotel Audio Systems Kenya", intro: "We support hotels with elegant audio, display, and conferencing systems that feel polished and guest-ready." },
  { slug: "cctv-installation-nairobi", title: "CCTV Installation Nairobi", description: "Reliable CCTV installation services for Nairobi businesses, schools, and properties.", keyword: "CCTV Installation Kenya", intro: "Our security systems blend dependable surveillance with practical monitoring and scalable design." },
  { slug: "interactive-display-installation", title: "Interactive Display Installation", description: "Interactive display installations for education, training, and collaboration spaces.", keyword: "Interactive Display Installation", intro: "We provide interactive displays that improve engagement and align with modern teaching and presentation needs." },
  { slug: "video-conferencing-solutions-kenya", title: "Video Conferencing Solutions Kenya", description: "Video conferencing installations for modern offices, boardrooms, and hybrid work environments.", keyword: "Video Conferencing Solutions Kenya", intro: "Our conferencing systems are designed to make remote collaboration feel seamless and professional." },
];

export const verticalLandings: VerticalLanding[] = [
  {
    slug: "av-solutions-hotels-restaurants",
    vertical: "Hospitality",
    title: "AV Solutions for Hotels & Restaurants",
    description: "Deliver unforgettable guest experiences with premium audio, display, and conferencing systems tailored for hospitality venues.",
    heroHeading: "Transform Guest Experience with Premium AV",
    heroSubheading: "From elegant dining audio to high-impact event spaces, we design systems that elevate hospitality.",
    challenges: [
      {
        icon: "volume-x",
        title: "Poor Audio Quality",
        description: "Inconsistent sound across dining rooms, lobbies, and event spaces affects guest comfort and satisfaction.",
      },
      {
        icon: "wifi-off",
        title: "Complex Event Management",
        description: "Managing presentations, background audio, and announcements during events requires reliable automation.",
      },
      {
        icon: "eye-off",
        title: "Discreet Integration",
        description: "Guests expect technology to enhance, not dominate. Visible cables and equipment damage aesthetic appeal.",
      },
    ],
    solutions: [
      {
        icon: "volume-2",
        title: "Distributed Audio Systems",
        description: "Multi-zone sound that delivers consistent, restaurant-grade audio across all guest spaces.",
        features: ["Zone-based volume control", "Remote management", "Background music integration", "Announcement capability"],
      },
      {
        icon: "tv",
        title: "LED Displays & Digital Signage",
        description: "High-impact visual displays for wayfinding, promotions, and event announcements.",
        features: ["24/7 content scheduling", "Easy content management", "Integration with booking systems", "Guest-facing displays"],
      },
      {
        icon: "video",
        title: "Event & Conference AV",
        description: "Seamless AV solutions for boardrooms, banquet halls, and event spaces.",
        features: ["Wireless presentation", "PTZ cameras for live streaming", "One-touch automation", "Professional lighting control"],
      },
    ],
    keyBenefits: [
      "Guest satisfaction increases with premium audio and visual experiences",
      "Event management becomes faster and more professional",
      "Clean, cable-free installations maintain venue aesthetics",
      "Centralized control reduces staff training needs",
      "Scalable systems grow with your business",
    ],
    ctaHeading: "Ready to elevate your hospitality venue?",
    ctaSubheading: "Let's discuss a custom AV solution for your property.",
  },
  {
    slug: "av-solutions-churches-worship",
    vertical: "Worship",
    title: "AV Solutions for Churches & Worship Spaces",
    description: "Strengthen worship experiences with reliable sound systems, live streaming, and visual displays for congregations of any size.",
    heroHeading: "Empower Worship with Professional Audio-Visual",
    heroSubheading: "Crystal-clear sound, seamless streaming, and inspiring visuals for your ministry.",
    challenges: [
      {
        icon: "volume-x",
        title: "Poor Speech Intelligibility",
        description: "Acoustical challenges in older or irregular spaces make sermons, announcements hard to understand.",
      },
      {
        icon: "alert-circle",
        title: "Feedback & Technical Issues",
        description: "Unpredictable audio problems disrupt services and undermine confidence in your setup.",
      },
      {
        icon: "globe",
        title: "Limited Reach Beyond the Building",
        description: "Sick or homebound members miss services; live streaming reaches broader audiences.",
      },
    ],
    solutions: [
      {
        icon: "mic-2",
        title: "House Sound Systems",
        description: "Professionally tuned sound that delivers clarity from the pulpit to every pew.",
        features: ["Wireless microphones", "Feedback prevention", "Adjustable zone control", "Simple operator interface"],
      },
      {
        icon: "video",
        title: "Live Streaming & Recording",
        description: "Professional video capture and streaming for in-person and remote participation.",
        features: ["HD camera and switcher", "Multi-platform streaming (YouTube, Facebook)", "Recording for archive", "On-screen graphics and lower thirds"],
      },
      {
        icon: "tv",
        title: "Visual Display Systems",
        description: "Lyrics, scripture, and visual content that enhance worship and engagement.",
        features: ["Large format projectors or LED screens", "Easy content scheduling", "Synchronized with music/sermon flow", "Accessible content management"],
      },
    ],
    keyBenefits: [
      "Congregants hear every word clearly, regardless of seating",
      "Services reach members at home and beyond your physical location",
      "Reduced technical interruptions build confidence and focus on worship",
      "Volunteer operators quickly master simple interfaces",
      "Professional presentation strengthens ministry credibility",
    ],
    ctaHeading: "Build a stronger worship experience.",
    ctaSubheading: "Contact us for a consultation tailored to your congregation's needs.",
  },
  {
    slug: "av-solutions-education-schools",
    vertical: "Education",
    title: "AV Solutions for Schools & Educational Institutions",
    description: "Create engaging learning environments with interactive displays, classroom audio, and seamless hybrid teaching technology.",
    heroHeading: "Modernize Learning with Smart AV",
    heroSubheading: "Empower educators and engage students with interactive, reliable classroom technology.",
    challenges: [
      {
        icon: "monitor-off",
        title: "Outdated Classroom Tech",
        description: "Old projectors, broken speakers, and disconnected equipment frustrate educators and limit engagement.",
      },
      {
        icon: "users",
        title: "Hybrid & Remote Teaching",
        description: "Supporting in-person and remote students simultaneously requires professional video conferencing.",
      },
      {
        icon: "alert-triangle",
        title: "Maintenance & Support Gaps",
        description: "Broken equipment goes unfixed; no clear vendor support leaves schools stranded.",
      },
    ],
    solutions: [
      {
        icon: "grid-3x3",
        title: "Interactive Displays",
        description: "Touch-enabled displays that transform passive classrooms into collaborative learning spaces.",
        features: ["Large format (65\"–86\")", "Touch and gesture recognition", "Interactive annotation tools", "Easy app integration"],
      },
      {
        icon: "video",
        title: "Hybrid Classroom Systems",
        description: "Seamless capture and sharing of lessons to students on and off campus.",
        features: ["Auto-tracking PTZ cameras", "Clear audio capture", "Screen sharing and student interaction", "Recording for review"],
      },
      {
        icon: "wifi",
        title: "Network & Security Integration",
        description: "Robust, manageable systems designed for school IT environments and student safety.",
        features: ["Managed connectivity", "Parental control options", "Data privacy compliance", "Centralized monitoring"],
      },
    ],
    keyBenefits: [
      "Students stay more engaged with modern, interactive learning tools",
      "Teachers reduce prep time and focus on instruction",
      "Hybrid teaching reaches all learners, regardless of attendance",
      "Professional support ensures minimal downtime",
      "Systems scale across multiple classrooms and campuses",
    ],
    ctaHeading: "Ready to upgrade your educational spaces?",
    ctaSubheading: "Let's design a cohesive AV strategy for your school or institution.",
  },
];

export const buyerGuides: BuyerGuide[] = [
  {
    slug: "corporate-video-conferencing-guide",
    title: "Complete Guide to Corporate Video Conferencing Systems",
    description: "A comprehensive guide for project managers and facilities leaders choosing video conferencing solutions for modern offices.",
    category: "Boardrooms",
    sections: [
      {
        heading: "Why Video Conferencing Matters for Corporate Spaces",
        content: "Hybrid work is here to stay. A well-designed conferencing setup removes friction, improves participation, and creates professional meeting experiences that strengthen business relationships.",
      },
      {
        heading: "Key Features to Look For",
        content: "Look for systems offering: 4K camera quality, crystal-clear audio with echo cancellation, wireless content sharing, PTZ (pan-tilt-zoom) camera control, and integration with platforms like Zoom, Teams, and Google Meet.",
      },
      {
        heading: "Room Size Matters",
        content: "Small meeting rooms (4–6 people) need focused audio and a single camera. Mid-size conference rooms (8–20) require wider angle cameras and multi-zone audio. Large boardrooms (20+) need distributed systems with multiple cameras and presentation displays.",
      },
      {
        heading: "Installation & Integration Considerations",
        content: "Professional installation ensures seamless integration with your IT infrastructure, security protocols, and corporate aesthetics. Plan for cable management, power distribution, and network bandwidth.",
      },
      {
        heading: "Budget Planning",
        content: "Entry-level systems start around KES 300,000; mid-range systems run KES 600,000–1.5M; premium, fully automated boardrooms can exceed KES 2M. Consider ongoing support and upgrades.",
      },
    ],
    checklist: [
      "Define room size and typical meeting participant count",
      "Choose camera type (fixed vs. PTZ, 1080p vs. 4K)",
      "Select audio solution (table microphones, ceiling mics, soundbar)",
      "Plan content sharing method (wireless, HDMI, network)",
      "Review platform compatibility (Zoom, Teams, Cisco, etc.)",
      "Assess IT infrastructure and network capacity",
      "Budget for professional installation and cable management",
      "Plan ongoing support and maintenance",
    ],
    cta: "Request a consultation to design the perfect conferencing setup for your boardroom.",
  },
  {
    slug: "restaurant-sound-system-buyers-guide",
    title: "A Venue Owner's Guide to Commercial Restaurant Sound Systems",
    description: "Learn how to choose a sound system that enhances ambience, supports operations, and delights your guests.",
    category: "Hospitality",
    sections: [
      {
        heading: "The Foundation: Why Sound Matters in Restaurants",
        content: "Sound shapes the entire dining experience. Good audio sets the mood, enhances conversation, and creates an environment guests want to return to. Poor sound—crackling speakers, dead zones, jarring volume changes—damages your brand.",
      },
      {
        heading: "Understanding Audio Zones",
        content: "Restaurants work best with zone-based systems: dining room (background ambience), bar/lounge (slightly louder), entry/waiting area (welcoming), kitchen (communication). Each zone needs independent volume and content control.",
      },
      {
        heading: "Key System Components",
        content: "A professional restaurant system includes: source (streaming, FM radio, announcements), amplifier, ceiling speakers, volume control panels, and backup power. Avoid cheap consumer systems that lack durability and control.",
      },
      {
        heading: "Content & Programming",
        content: "Curate playlists by daypart: upbeat morning, casual lunch, ambient early dinner, energetic late evening. Consider integrating background music subscription services (Jukebox, Spotify for Business) or hiring a DJ.",
      },
      {
        heading: "Installation Quality",
        content: "Professional installation includes: acoustical assessment, speaker placement, hidden wiring, and proper calibration. Avoid surface-mounted speakers; concealed ceiling and wall systems maintain aesthetics.",
      },
    ],
    checklist: [
      "Assess restaurant layout and square footage",
      "Identify acoustic challenges (hard surfaces, high ceilings, busy streets)",
      "Determine number of audio zones needed",
      "Choose music source (streaming service, DJ, radio)",
      "Plan speaker placement (ceiling, walls, subwoofers)",
      "Select control system (manual volume, app-based, touchpad)",
      "Budget for professional installation (hidden wiring, calibration)",
      "Arrange ongoing support and content management",
    ],
    cta: "Let's design a sound system that matches your restaurant's ambience and operational needs.",
  },
  {
    slug: "choosing-commercial-av-installation-partner",
    title: "How to Choose the Right Commercial AV Installation Partner",
    description: "A practical guide for decision-makers selecting a reliable AV vendor for your organization.",
    category: "General",
    sections: [
      {
        heading: "Beyond Price: What Truly Matters",
        content: "Cost is one factor, but reliability, expertise, responsiveness, and long-term support matter more. A cheap installation can become expensive when systems fail during critical moments.",
      },
      {
        heading: "Evaluating Vendor Experience",
        content: "Ask for case studies and references in your industry. A vendor experienced with hotels understands hospitality workflows. One skilled in corporate settings knows conferencing integration. Request specific examples of similar projects.",
      },
      {
        heading: "Understanding the Full Scope",
        content: "A complete proposal includes: site survey, system design, equipment specifications, installation timeline, cable management, training, and ongoing support. Avoid vendors who give quotes without visiting your space.",
      },
      {
        heading: "Support & Maintenance Plans",
        content: "Ask about response times, preventive maintenance schedules, spare parts availability, and upgrade paths. Good vendors treat support as part of the relationship, not an afterthought.",
      },
      {
        heading: "Quality of Life: Usability & Training",
        content: "The best system is useless if staff can't operate it. Look for vendors who design for ease of use, provide thorough training, and create simple reference guides.",
      },
    ],
    checklist: [
      "Request 3+ references in your industry",
      "Review case studies and photos of completed projects",
      "Verify certifications and partnerships (Crestron, Biamp, etc.)",
      "Schedule a site survey and consultation",
      "Request a detailed scope of work and timeline",
      "Compare warranty and support options",
      "Ask about staff training and documentation",
      "Confirm ongoing maintenance and escalation procedures",
    ],
    cta: "Ready to partner with an AV expert? Contact us for a no-pressure consultation.",
  },
];

