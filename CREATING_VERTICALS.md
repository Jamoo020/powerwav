# Quick Start: Creating Vertical Solution Pages

## Overview

The vertical landing page system is designed to be easily cloned and customized for new industries. Here's how to create a new solution page.

---

## Step 1: Add Data to `lib/content.ts`

Add your vertical to the `verticalLandings` array:

```typescript
// In verticalLandings array, add:
{
  slug: "av-solutions-retail-security", // URL slug
  vertical: "Retail & Security",         // Display name
  title: "AV Solutions for Retail & Security",
  description: "...",
  heroHeading: "Protect and Engage with Smart AV",
  heroSubheading: "Seamless surveillance + customer-facing displays for modern retail.",
  
  challenges: [
    {
      icon: "eye-off",
      title: "Inconsistent Monitoring",
      description: "Dead zones in surveillance coverage miss critical areas.",
    },
    // ... 2-3 more challenges
  ],
  
  solutions: [
    {
      icon: "video",
      title: "Integrated CCTV Systems",
      description: "Comprehensive surveillance with centralized monitoring.",
      features: [
        "IP cameras with night vision",
        "24/7 DVR/NVR recording",
        "Remote mobile access",
        "Analytics and motion detection",
      ],
    },
    // ... 1-2 more solutions
  ],
  
  keyBenefits: [
    "Reduce theft and shrinkage",
    "Monitor staff compliance",
    "Engage customers with displays",
    // ... more benefits
  ],
  
  ctaHeading: "Ready to secure your retail space?",
  ctaSubheading: "Let's design a system that protects your business.",
}
```

---

## Step 2: Create the Page Route

Create: `app/solutions/retail-security/page.tsx`

```typescript
"use client";

import { VerticalSolutionPage } from "@/components/vertical-solution-page";

export default function RetailSecurityPage() {
  return <VerticalSolutionPage slug="av-solutions-retail-security" />;
}
```

That's it! The component automatically:
- Pulls your data from `lib/content.ts`
- Renders challenges, solutions, benefits
- Includes the quote form
- Adds SEO structure
- Handles mobile responsiveness

---

## Step 3: Add to Navigation (Optional)

Update `components/site-shell.tsx` to add your vertical to the Solutions dropdown:

```typescript
const navLinks = [
  // ... existing links
  { 
    label: "Solutions", 
    href: "#", 
    submenu: [
      { label: "Corporate Boardrooms", href: "/solutions/corporate-boardrooms" },
      { label: "Hotels & Hospitality", href: "/solutions/hotels-restaurants" },
      { label: "Churches & Worship", href: "/solutions/churches-worship" },
      { label: "Schools & Education", href: "/solutions/education-schools" },
      { label: "Retail & Security", href: "/solutions/retail-security" }, // NEW
    ]
  },
  // ... rest of nav
];
```

---

## Step 4: Test

1. Navigate to `http://localhost:3000/solutions/retail-security`
2. Verify all sections load
3. Test the quote form
4. Check mobile view

---

## Customization Guide

### Changing Icons

In the `challenges` and `solutions` arrays, replace icon strings:

```typescript
// Available icon names (from lucide-react):
icon: "volume-x"        // For audio problems
icon: "wifi-off"        // For connectivity issues
icon: "eye-off"         // For visibility/monitoring
icon: "alert-circle"    // For warning/security
icon: "users"           // For team/people issues
icon: "monitor-off"     // For display issues
```

See `components/icons.tsx` for available icons.

---

### Customizing Colors

The component uses CSS variables. To use different colors per vertical:

```typescript
// In the component wrapper (if you want unique styling):
<div className="solutions-page" style={{ "--color-primary": "#rgb-value" }}>
  <VerticalSolutionPage slug="..." />
</div>
```

---

### Adding Video to Solutions

```typescript
solutions: [
  {
    icon: "video",
    title: "Video Conferencing",
    description: "...",
    features: [...],
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID", // Optional
  },
]
```

---

## Example: Complete Retail & Security Vertical

```typescript
{
  slug: "av-solutions-retail-security",
  vertical: "Retail & Security",
  title: "AV Solutions for Retail & Security",
  description: "Comprehensive surveillance and customer engagement systems for modern retail environments.",
  
  heroHeading: "Protect Sales and Secure Operations",
  heroSubheading: "Integrated CCTV and customer displays built for busy retail spaces.",
  
  challenges: [
    {
      icon: "eye-off",
      title: "Coverage Blind Spots",
      description: "Traditional CCTV leaves gaps. Customers and staff move between unmonitored areas.",
    },
    {
      icon: "alert-circle",
      title: "Slow Incident Response",
      description: "Reviewing footage after an incident wastes time. You need live alerts and quick access.",
    },
    {
      icon: "monitor-off",
      title: "Outdated Customer Displays",
      description: "Static signage and old TVs fail to capture customer attention or drive impulse sales.",
    },
  ],
  
  solutions: [
    {
      icon: "video",
      title: "Smart CCTV Coverage",
      description: "360° coverage with AI-powered motion detection and instant alerts.",
      features: [
        "Multi-zone IP cameras with analytics",
        "Cloud or on-premise NVR storage",
        "Mobile alerts for suspicious activity",
        "Searchable footage archive",
      ],
    },
    {
      icon: "tv",
      title: "Dynamic Digital Signage",
      description: "High-impact displays that drive customer engagement and sales.",
      features: [
        "4K displays with brightness for retail environments",
        "Remote content scheduling",
        "Promotion rotation by time of day",
        "Integration with POS for real-time offers",
      ],
    },
    {
      icon: "lock",
      title: "Access Control Integration",
      description: "Combine surveillance with smart door locks for complete security.",
      features: [
        "Keycard/mobile app access",
        "Audit trail of entries/exits",
        "Emergency lockdown capability",
        "Integration with alarm systems",
      ],
    },
  ],
  
  keyBenefits: [
    "Reduce theft and shrinkage by up to 30%",
    "Quick incident investigation saves time and legal liability",
    "Customer-facing displays increase engagement and sales",
    "Mobile monitoring lets managers oversee from anywhere",
    "Insurance companies often offer discounts for professional systems",
  ],
  
  ctaHeading: "Ready to protect and engage your retail space?",
  ctaSubheading: "Let's design a security solution that works for your store.",
}
```

---

## Creating Multiple Verticals Quickly

1. **Copy the template** above
2. **Update these fields:**
   - `slug` (unique URL identifier)
   - `vertical` (display name)
   - `title` (page title)
   - `heroHeading` and `heroSubheading`
   - `challenges[]` (3 industry-specific problems)
   - `solutions[]` (3 solution categories)
   - `keyBenefits[]` (5–6 measurable benefits)
   - `ctaHeading` and `ctaSubheading`

3. **Create the route file:** `app/solutions/[slug]/page.tsx` (5 lines of code)
4. **Test and deploy**

---

## Common Verticals to Add

Based on your target industries:

1. **Retail & Security** (stores, shopping centers)
2. **Healthcare** (hospitals, clinics, patient experience)
3. **Legal Offices** (conference rooms, client confidentiality)
4. **Banks & Financial** (secure boardrooms, waiting areas)
5. **Manufacturing** (plant safety, quality control)
6. **Hospitality Expanded** (resorts, game lodges)
7. **Government/Public** (offices, town halls)

---

## SEO Tips for New Verticals

For each vertical, target these keywords:

```
1. Service + Location + Industry
   "CCTV installation Nairobi for retail"
   "Digital signage systems Kenya for stores"

2. Problem + Solution
   "How to prevent retail theft Kenya"
   "Best surveillance system for small retail"

3. Buying Guide
   "Retail security system checklist"
   "How much does CCTV cost Kenya"
```

Add these to:
- Page title tag
- Meta description
- H1/H2 headings
- First 100 words of content

---

## Using Quote Form Data

When users submit the quote form on a vertical page, they send:

```json
{
  "vertical": "Retail & Security",  // Automatically pre-filled!
  "projectType": "New installation",
  "roomSize": "Medium (50–200 sqm)",
  "budget": "KES 600k–1.5M",
  "timeline": "1–3 months",
  "details": "Need CCTV for store + stockroom..."
}
```

This pre-filled vertical helps your sales team understand the context immediately.

---

## Analytics Tracking

To track which verticals convert best, add UTM parameters:

```
/solutions/retail-security?utm_source=linkedin&utm_medium=social&utm_campaign=retail
/solutions/hospitals?utm_source=google&utm_medium=search&utm_campaign=healthcare
```

Google Analytics will show conversion rates per vertical → helps you prioritize marketing spend.

---

## Troubleshooting

**Q: Page shows "Page not found"**
- A: Ensure your slug in `lib/content.ts` matches the route filename exactly

**Q: Data doesn't load**
- A: Verify the `verticalLandings` array exists and exports in `lib/content.ts`

**Q: Quote form doesn't submit**
- A: Check `/api/quote` is working. Test with curl:
  ```bash
  curl -X POST http://localhost:3000/api/quote \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com",...}'
  ```

**Q: Styling looks different**
- A: Verify CSS variables are defined in your global stylesheet

---

## Next: Automate with Script

For 10+ verticals, consider scripting page generation:

```bash
# Script to auto-create pages
for vertical in retail healthcare legal manufacturing; do
  mkdir -p "app/solutions/$vertical"
  cat > "app/solutions/$vertical/page.tsx" << 'EOF'
import { VerticalSolutionPage } from "@/components/vertical-solution-page";
export default function Page() {
  return <VerticalSolutionPage slug="av-solutions-$vertical" />;
}
EOF
done
```

---

## Summary

✅ Add vertical data to `lib/content.ts`  
✅ Create `app/solutions/[slug]/page.tsx` file  
✅ Add to navigation (optional)  
✅ Test and deploy  
✅ Monitor analytics for conversion rates

**Time to add one vertical: ~5 minutes**
