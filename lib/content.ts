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
