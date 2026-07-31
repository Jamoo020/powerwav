# PowerWave AV - Complete Deployment & Launch Checklist

## Pre-Launch Technical Setup (Week 1)

### Environment & Dependencies
- [ ] Verify Node.js version (recommend 18.17+)
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` file with:
  ```
  RESEND_API_KEY=your_key_here
  NEXT_PUBLIC_SITE_URL=https://yourdomain.com
  DATABASE_URL=optional_for_lead_storage
  ```
- [ ] Test build: `npm run build`
- [ ] Test local dev: `npm run dev`

### Email Service Setup (Choose One)

**Option A: Resend (Recommended)**
- [ ] Sign up at resend.com
- [ ] Create API key
- [ ] Add to `.env.local`
- [ ] Test with sample email in `/api/quote` route

**Option B: SendGrid**
- [ ] Sign up at sendgrid.com
- [ ] Create API key
- [ ] Add to `.env.local`
- [ ] Update `/api/quote` and `/api/assessment` with SendGrid client

**Option C: Google Sheets**
- [ ] Create Google Sheet for leads
- [ ] Set up Google Forms API integration
- [ ] Connect via Zapier or webhook

### Database (Optional, for Lead History)
- [ ] Choose: Supabase, MongoDB Atlas, or Firebase
- [ ] Create database schema
- [ ] Add connection string to `.env.local`
- [ ] Update `/api/quote` and `/api/assessment` to save to database

---

## Content & Design Preparation (Week 1-2)

### Images & Media
- [ ] Collect/shoot high-res boardroom photos (2-3 images)
- [ ] Collect/shoot hotel/hospitality images (2-3 images)
- [ ] Collect/shoot church/worship images (2-3 images)
- [ ] Collect/shoot school/education images (2-3 images)
- [ ] Compress images (target: <200KB each, WebP format)
- [ ] Add to `/public/images/` directory
- [ ] Update paths in `lib/content.ts` for case studies

### Video Content
- [ ] Record or source 3-4 case study videos (YouTube links)
- [ ] Add YouTube embed URLs to `lib/content.ts` → `projects/case-studies.tsx`
- [ ] Create 2-3 short reels (30-60 sec) for social media launch

### Testimonials
- [ ] Reach out to 3-4 real clients for quotes
- [ ] Get permission to use names/roles
- [ ] Add to `testimonials[]` array in `lib/content.ts`

### Buyer's Guides
- [ ] Review 3 buyer guides in `lib/content.ts`
- [ ] Verify all checklists are complete
- [ ] Add sample PDFs to `/public/guides/` (optional)
- [ ] Update guide download links

---

## Page Creation & Setup (Week 2)

### Solution Pages (Main Priority)
- [ ] Create `app/solutions/` directory
- [ ] Create `app/solutions/corporate-boardrooms/page.tsx`
- [ ] Create `app/solutions/hotels-restaurants/page.tsx`
- [ ] Create `app/solutions/churches-worship/page.tsx`
- [ ] Create `app/solutions/education-schools/page.tsx`
- [ ] Test each page loads correctly
- [ ] Verify quote forms work on each page
- [ ] Check mobile responsiveness

### Case Studies Page
- [ ] Verify `/app/projects/case-studies.tsx` exists
- [ ] Add YouTube video URLs for each case study
- [ ] Add client testimonials
- [ ] Add metrics/results numbers
- [ ] Test video embeds load
- [ ] Test case study switcher functionality

### Buyer's Guides Page
- [ ] Verify `/app/resources/buyer-guides/page.tsx` exists
- [ ] Test expandable guide sections
- [ ] Verify all checklists display
- [ ] Test download PDF flow (if implemented)

### Navigation
- [ ] Verify "Solutions" dropdown appears in header
- [ ] Test all dropdown links work
- [ ] Check mobile menu shows all options
- [ ] Verify active state highlighting

---

## Form & API Testing (Week 2)

### Quote Form Testing
- [ ] Test on desktop browser
- [ ] Test on mobile browser
- [ ] Fill out all 3 steps
- [ ] Submit form
- [ ] Verify email received at `info@powerwaveav.com`
- [ ] Check email formatting and content
- [ ] Verify fallback error message if email fails
- [ ] Test with different verticals (auto-filled correctly?)

### Assessment Questionnaire Testing
- [ ] Answer all 6 questions
- [ ] Verify score calculation
- [ ] Confirm recommendation displays
- [ ] Enter email and submit
- [ ] Verify confirmation email received
- [ ] Check assessment data captures in email or database

### Contact Form Testing (existing)
- [ ] Verify existing contact form still works
- [ ] Test email delivery
- [ ] Check error handling

### API Endpoints
- [ ] Test `/api/quote` with curl:
  ```bash
  curl -X POST http://localhost:3000/api/quote \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","company":"Test Co","email":"test@test.com","phone":"0700000000","vertical":"Corporate",...}'
  ```
- [ ] Test `/api/assessment` with curl
- [ ] Verify error responses for missing fields

---

## SEO & Meta Tags (Week 2-3)

### Site-Wide
- [ ] Update `metadata.ts` with site title, description
- [ ] Add favicon to `/public/favicon.ico`
- [ ] Create `robots.txt` and `sitemap.xml`
- [ ] Add Google Analytics 4 tracking code
- [ ] Add Google Search Console verification

### Per-Page Meta Tags
- [ ] Corporate Boardrooms page:
  - Title: "Corporate Boardroom Solutions Nairobi | PowerWave AV"
  - Meta: "Professional video conferencing and meeting room systems"
  - Keyword: "boardroom installation Nairobi"

- [ ] Hotels & Hospitality page:
  - Title: "Hotel Audio Visual Solutions Kenya | PowerWave AV"
  - Meta: "Guest experience audio and display systems"
  - Keyword: "hotel AV solutions Kenya"

- [ ] Churches & Worship page:
  - Title: "Church Sound Systems Kenya | PowerWave AV"
  - Meta: "Worship audio and live streaming solutions"
  - Keyword: "church sound systems Kenya"

- [ ] Schools & Education page:
  - Title: "Interactive Displays for Schools Kenya | PowerWave AV"
  - Meta: "Classroom AV and hybrid teaching technology"
  - Keyword: "interactive displays for schools"

- [ ] Case Studies page:
  - Title: "AV Case Studies & Success Stories | PowerWave AV"
  - Meta: "Real project transformations across industries"

- [ ] Buyer's Guides page:
  - Title: "AV Buyer's Guides & Resources | PowerWave AV"
  - Meta: "Free guides to help you choose AV solutions"

### Structured Data (JSON-LD)
- [ ] Add Organization schema to homepage
- [ ] Add LocalBusiness schema (Nairobi, Kenya)
- [ ] Add BreadcrumbList for navigation

---

## Analytics Setup (Week 3)

### Google Analytics 4
- [ ] Set up GA4 property
- [ ] Add tracking code to `app/layout.tsx` or use next-gtag
- [ ] Create conversion goals:
  - [ ] Quote form submission
  - [ ] Assessment completion
  - [ ] Contact form submission
  - [ ] Case study viewed
  - [ ] Guide downloaded

### Conversion Tracking
- [ ] Set up event tracking for form submissions
- [ ] Set up goal for `vertical=` parameter (track by industry)
- [ ] Set up goal for `utm_source=` (track by traffic source)

### Custom Dashboard
- [ ] Create dashboard for:
  - Leads by vertical (boardrooms, hospitality, worship, education)
  - Conversion rate by page
  - Traffic sources
  - Bounce rates

---

## Content Calendar & Launch (Week 3)

### Blog Content (Pre-write 4 posts)
- [ ] Post 1: "How to Choose a Video Conferencing System"
  - Target: `video conferencing Kenya`
  - Internal link: `/solutions/corporate-boardrooms`

- [ ] Post 2: "Restaurant Sound Systems: A Complete Guide"
  - Target: `restaurant sound systems Kenya`
  - Internal link: `/solutions/hotels-restaurants`

- [ ] Post 3: "Live Streaming Your Church Service"
  - Target: `live streaming church Kenya`
  - Internal link: `/solutions/churches-worship`

- [ ] Post 4: "Interactive Displays in Modern Classrooms"
  - Target: `interactive displays schools Kenya`
  - Internal link: `/solutions/education-schools`

### LinkedIn Content Calendar
- [ ] Week 1: Company overview + 3 case studies
- [ ] Week 2: Expertise posts + team introduction
- [ ] Week 3: Industry insights + trend commentary
- [ ] Week 4: Client testimonials + before/after

### Email Campaign (Pre-write 2 sequences)
- [ ] Email 1: Welcome sequence for quote form leads
  - Send: Day 1 - Thank you + next steps
  - Send: Day 3 - Relevant case study
  - Send: Day 7 - Limited-time offer

- [ ] Email 2: Assessment follow-up
  - Send: Day 0 - Assessment results
  - Send: Day 2 - Related guide
  - Send: Day 7 - Consultation booking link

---

## Launch Day (Week 3, Friday or Monday)

### Final QA
- [ ] Run full QA checklist (all forms, all pages)
- [ ] Check all links work (internal + external)
- [ ] Verify images load on all pages
- [ ] Test mobile responsiveness (iPhone + Android)
- [ ] Check page load speed (target: <3 seconds)
- [ ] Verify no console errors (dev tools)
- [ ] Backup database/content

### Deployment
- [ ] Deploy to production (Vercel, Netlify, or self-hosted)
- [ ] Verify site loads on production URL
- [ ] Test forms work on production
- [ ] Verify analytics tracking fires
- [ ] Confirm email notifications arrive

### Monitoring
- [ ] Monitor error logs for first 2 hours
- [ ] Check analytics for traffic spikes
- [ ] Verify form submissions come through
- [ ] Monitor email delivery rate

### Social Media Announcement
- [ ] Post on LinkedIn: "We're excited to announce our new vertical solutions pages!"
- [ ] Include links to all 4 verticals
- [ ] Encourage followers to take assessment
- [ ] Share 1-2 case studies

---

## Post-Launch (Week 4 Onwards)

### Week 1 After Launch
- [ ] Monitor form submissions daily
- [ ] Check conversion rates by vertical
- [ ] Respond to leads within 2 hours
- [ ] Gather user feedback (design, clarity, functionality)
- [ ] Fix any reported bugs
- [ ] Publish first blog post

### Week 2-4
- [ ] Publish 1 blog post per week
- [ ] Post on LinkedIn 3-4x per week
- [ ] Send weekly email to assessment leads
- [ ] Track which content drives most engagement
- [ ] Optimize high-performing content

### Month 2 Onwards
- [ ] Review analytics monthly
- [ ] Optimize conversion funnels
- [ ] A/B test page headlines, CTAs
- [ ] Expand to new verticals based on demand
- [ ] Plan paid ads (Google, LinkedIn) based on organic performance
- [ ] Build referral program (internal + external partners)

---

## Key Metrics to Track

**Daily:**
- [ ] Form submissions count
- [ ] Email delivery success rate

**Weekly:**
- [ ] New leads by vertical
- [ ] Website traffic (total + by source)
- [ ] Conversion rate (visitor → lead)
- [ ] Engagement rate (LinkedIn posts)

**Monthly:**
- [ ] Cost per lead (if running ads)
- [ ] Lead quality score
- [ ] Sales cycle length (lead → proposal)
- [ ] Proposal close rate
- [ ] Content performance (blog traffic, shares)

---

## Troubleshooting Checklist

**If forms don't submit:**
- [ ] Check API endpoint is deployed
- [ ] Verify email service credentials
- [ ] Check browser console for errors
- [ ] Verify environment variables loaded

**If pages show 404:**
- [ ] Verify file paths match URL structure
- [ ] Check for typos in route filenames
- [ ] Rebuild and redeploy

**If images don't load:**
- [ ] Verify paths start with `/` (e.g., `/images/file.jpg`)
- [ ] Check file exists in `/public/` directory
- [ ] Try clearing browser cache

**If analytics don't track:**
- [ ] Verify GA tracking code in HTML
- [ ] Check Google Analytics property ID
- [ ] Allow 24 hours for data to appear in GA

**If email delivery fails:**
- [ ] Verify API key is correct
- [ ] Check email service status
- [ ] Test with curl command
- [ ] Check spam folder

---

## Success Criteria

Launch is successful if, by end of Week 1:

✅ Website loads without errors  
✅ Quote form receives 5+ submissions  
✅ Assessment questionnaire receives 10+ completions  
✅ All 4 solution pages load and function  
✅ Case studies display with images/videos  
✅ Analytics tracking shows traffic data  
✅ Email notifications arrive for form submissions  
✅ Mobile experience is smooth  
✅ No critical errors in logs  
✅ Team can respond to leads within 2 hours  

---

## Support Contacts

**If you need help with:**
- **Next.js/React:** Next.js docs, Stack Overflow
- **Framer Motion:** Framer docs
- **Email Service:** Resend docs, SendGrid docs
- **Analytics:** Google Analytics support
- **Deployment:** Vercel docs, hosting provider support

---

## Final Reminders

1. **Test everything twice** (desktop + mobile)
2. **Back up before deploying** (database, content, code)
3. **Monitor first week closely** (bugs, form issues, email delivery)
4. **Respond to leads quickly** (within 2 hours = higher conversion)
5. **Keep content updated** (weekly blog, regular LinkedIn posts)
6. **Track metrics obsessively** (what works, what doesn't)
7. **Iterate based on data** (don't guess, measure)

---

**You're ready to launch! 🚀**

**Next: Choose your email service and start testing forms.**
