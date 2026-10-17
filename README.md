# Code Class

A responsive, framework-free HTML, CSS, and JavaScript learning website with Firebase accounts, based on the supplied Code Class PDF.

## Run locally

```sh
npm run dev
```

Open http://localhost:3000 for the First Screen workshop (the home page), http://localhost:3000/courses.html for the course gallery, or http://localhost:3000/future-founder-class.html for the Future Founder class. Set `PORT` to use another port. Node.js 18 or later is required for the development server and build script; the deployed website only requires static hosting.

## Build

```sh
npm run check
npm run build
```

Deploy the contents of `dist/` to a static host. All page navigation uses URL hashes, so no server route rewrites are required. The included Node server is for local previews and only serves the public website files.

## Included

- Start here guide covering setup, prompts vs. commands, lesson completion, and the final milestone
- Dashboard with four modules and 12 detailed lessons
- Lesson checklists with completion gating and saved progress
- Searchable lessons and copyable AI prompts / terminal commands that work without signing in, including focused follow-ups and separate iOS/Android commands
- Project details and a personal profile
- Autosaved project and lesson notes, with Markdown export
- Original five-page PDF download and official documentation links
- Printable course achievement after all lessons are complete
- Responsive mobile navigation, keyboard support, and reduced-motion support

## Data and scope

The whole course (all 12 lessons, the prompt library, notes and resources) is locked behind an access code. The current code is `APP2026`, and it's case-insensitive. New students click **I have a code — unlock** and enter the code with their name, email, password and role (Student, Founder, Educator, Developer, Designer, Other). The code is checked before the account is created. Returning students just sign in. A signed-in student whose record isn't unlocked yet, such as an older free account, sees a single access-code field. The unlock is saved on the student's Firestore record as `access: { code, unlockedAt }`, so it follows them to any device.

The codes are stored in `ACCESS_CODE_HASHES` at the top of `app.js` as SHA-256 hashes, not plain text. To add a code for a new cohort, run `npm run access-code -- NEWCODE` and paste the printed hash into that list. Remove a hash to stop new sign-ups with that code; students who already unlocked keep access. This is a client-side gate, so it keeps casual visitors out but isn't DRM: the lesson text ships in `course.js`.

Each student has one document in the Firestore `students` collection, keyed by their Firebase Auth UID:

```
students/{uid}
  uid, email, name, role, app: "codeclass"
  access:   { code, unlockedAt }              (set when the access code is accepted)
  createdAt, updatedAt, lastActiveAt          (server timestamps)
  project:  { name, idea }
  progress: { completedLessons: number[], completedCount, totalLessons, percent,
              currentStep, currentStepTitle, lastLessonId, started, completedAt,
              checks: { [lessonId]: boolean[] } }
  notes:    { project, [lessonId]: string }
```

Changes save to Firestore about a second after each edit and are cached in localStorage under `codeclass-v1`. Signing in on another device loads it. Signing out clears the local copy. Security rules for the `students` collection, including owner-only anonymous guest access, are in `firestore-students.rules`. Paste the block into your existing Firestore rules; don't replace them. In Firebase Console, enable Authentication → Sign-in method → Email/Password.

The Firebase web config lives in `firebase.js`. The SDK is installed from npm and bundled into `vendor/firebase.js` by `npm run build:firebase` (which `npm run dev` and `npm run build` also run), so the site stays deployable to GitHub Pages without a bundler at runtime. Commit `vendor/firebase.js`. For GitHub Pages, add your `<user>.github.io` domain under Firebase Console → Authentication → Settings → Authorized domains.

Completion is self-reported using the lesson checklists; the website does not inspect students' external app projects. Notes can be exported from the My notes page.

The course uses the original PDF's progression, consolidating its skipped numbering into 12 consecutive lessons. The Expo version guidance accounts for device compatibility. The Firebase lessons use local emulators or restricted security rules, explain that budget alerts are not spending caps, and require each student to use their own Firebase configuration. The source worksheet is included unchanged for reference.

Google Fonts provides DM Sans and Manrope, with sans-serif fallbacks. The hero artwork is built entirely in CSS. Firebase is the only runtime dependency, served from the bundled `vendor/firebase.js`.

## Product page

Each course has a standalone sales page, plus a gallery that filters courses by goal:

- `index.html`: the site's home page, the free First App Class offer page (see Funnel below). `workshop.html` now redirects here.
- `courses.html`: the course gallery. Its header has a Student login link to the Future Founder class. Choosing a goal under "What do you want to build?" highlights the best-match course with a glow and fades unrelated ones. On phones, the best match also moves to the top. The goal-to-course mapping is the third value in each `goals` entry in `scripts/products.js`. Link straight to a goal with `?goal=app` (for example `torontoinnovationlab.com/courses.html?goal=ai`), `mobile`, `business`, `ai`, or `income`. Every "All courses" link points here.
- `future-founder.html`, `ios-app-builder.html`, `ai-app-wizard.html`, `business-accelerator.html`: one landing page per course.

These pages are generated. Edit course content (price, checkout URL, headline, phases, offer stack, guarantee, FAQ, gallery goals) in `scripts/products.js`, then run `npm run build:products`. `npm run dev` and `npm run build` regenerate them automatically. Commit the generated `.html` files so GitHub Pages can serve them.

The pages use their own lightweight `product.css`, `product.js`, and `catalog.js`, and don't load the course app or Firebase, so they stay fast on phones. Every Enroll button on a page goes to that course's `checkoutUrl`. Until it's set, the buttons scroll to the offer section. Box images are compressed WebP files in `assets/products/`, with the original PNGs kept alongside them.

## Funnel: free class

The home page (`index.html`) sells one thing: a free 45-minute live class. It has no nav menu and one action. Every "Claim my free seat" button (header, hero, offer, sticky mobile bar) scrolls to `#booking`, which embeds the free Calendly event (`freeClass.calendly`). The only links off the page are the footer's Terms and support email.

Section order: hero (headline, subheadline, CTA, approved proof strip, Christopher's photo) → problem → why live building works → the 3 steps → the free-seat offer stack ($0) → the origin story slides → real scarcity (max 20 seats, 4 weekend slots) → FAQ → booking.

- **Headline A/B test:** the live H1 is `freeClass.headline` in `scripts/products.js`. The two alternates in `freeClass.altHeadlines` are written into the page as HTML comments under the H1. Swap one in, rebuild, and push.
- **Copy and settings:** proof strip (`freeClass.proof`), offer stack (`freeClass.stack`; add a value like `'$97'` to show one struck through), weekend slots (`freeClass.slots`; keep in sync with Calendly), and seat cap.
- **Story slides:** `assets/free-class/story-1.webp` to `story-5.webp`, from `~/Downloads/slides`, with faces already blurred.
- `thanks-free-class.html`: the free Calendly event redirects here. In order: "You're in", the Build-With-Me 1-on-1 upsell, what to expect, and the recording note. The upsell button emails the support address until `freeClass.oneOnOne` is set (point it at `packages.html` when ready). It's marked `noindex`.
- `packages.html`: the Build-With-Me 1-on-1 tiers ($497 / $997 / $1,497). No nav menu. Every paid CTA is an exact Stripe Payment Link from `packages.tiers` in `scripts/products.js`. Includes the comparison table and the Tier 1 upgrade note ($497 applies to the full build).
- `thanks-workshop.html` still exists for the old paid $47 Calendly event, which hasn't been changed.
- **Course software:** the course software is still locked by access code. `APP2026` and `CODECLASS2026` both work.

**Launch rule:** run `npm run verify:launch` after building. It checks that `index.html`, `thanks-free-class.html`, `packages.html`, and `terms.html` have:
- no old $47 or workshop strings;
- exactly one CTA wording on the free class, with every CTA pointing at `#booking`;
- no nav menu and no off-page links beyond the footer (plus Stripe on packages);
- the free Calendly embed, both alternate H1 comments, the support email, and both Meta Pixels;
- exact Stripe links, USD prices, the upgrade note, and the comparison table on packages;
- the upsell block on the thank-you page, plus a real 1-on-1 booking link.

`future-founder.html`, the course pages, `courses.html`, and `refund.html` still exist but aren't linked from the home page.


| Setting | Where |
| --- | --- |
| Free class booking (Calendly event) | `freeClass.calendly` |
| Build-With-Me 1-on-1 booking link | `freeClass.oneOnOne` (set to `packages.html` when wiring the thank-you upsell) |
| Build-With-Me package Stripe links | `packages.tiers` in `scripts/products.js` |
| `STRIPE_PROGRAM_URL` | `checkoutUrl` on `future-founder` |
| `EVERGREEN_COURSE_URL` ($297 downsell) | `funnel.evergreenCheckout` |
| `VSL_URL_PLACEHOLDER` (YouTube, Vimeo, Loom, or a direct embed URL) | `vslUrl` on `future-founder` |
| `SOFTWARE_ACCESS_URL`, `EBOOK_URL` | `funnel.software`, `funnel.ebook` |
| Free class weekend slots | `freeClass.slots` |
| Next Build & Launch cohort date | `funnel.cohortDate`, for example `'Monday, October 19'` |
| `SUPPORT_EMAIL` | `funnel.supportEmail` |
| Meta Pixel IDs | `funnel.metaPixels` (also hard-coded in `future-founder-class.html`) |

Every page loads both Meta Pixels (Christopher's Pixel P3 and Christopher Walsh - Pixel) and fires `PageView` to each. Every event below goes to both pixels. The home page (`index.html`, the free class) also fires `ViewContent`. `thanks-free-class.html` fires only `PageView`, so a custom conversion on "URL contains `thanks-free-class.html`" counts free-class bookings. The old paid flow is unchanged: `thanks-workshop.html` fires `trackCustom('WorkshopBooked')`, and Calendly only redirects there after a paid booking, so each fire is one $47 sale. `npm run verify:launch` checks that both pixels and `ViewContent` are on the free-class pages.

Checkout buttons use `<meta name="checkout-url">` with `data-enroll`. A named button such as `data-enroll="evergreen"` reads `<meta name="checkout-url-evergreen">` instead, so later ladder rungs ($149/mo Build Club, $1,997 1-on-1) can be added the same way.

## Edit content

- `course.js`: modules, lessons, prompts, commands, checklists, resource links
- `app.js`: routing, components, dialogs, persistence, search, and export
- `styles.css`: complete desktop/mobile design system
- `future-founder-class.html`: the Future Founder class (application shell and metadata)

## Verification

The course was manually exercised in Chrome through all 12 completion flows, including the final achievement. Responsive layouts and saved notes/search behavior were reviewed in the browser. `npm run check` checks JavaScript syntax; `npm run build` produces the static deployment folder.

The Start here guide is available at `/#start`, with entry links from the sidebar, dashboard, and classroom. Both prompts and commands appear in the library when a lesson includes both. All 20 copy buttons were verified against their displayed text in Chrome.

## Branding

The site uses the supplied Adult AI Code Class flyer palette: navy `#071827`, cyan `#38D9F5`, lime `#DDFB70`, and off-white `#F5F5EF`. The reusable brand colors live in the `:root` tokens in `styles.css`. Navy anchors navigation and hero panels, cyan highlights navigation and progress, and lime marks primary actions. Supporting text colors are adjusted for readable contrast. The favicon and browser theme color use the same palette.
