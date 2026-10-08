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

- `index.html`: the site's home page, which is the First Screen workshop page. The same page is also generated as `workshop.html`, so existing links and the Calendly setup keep working. Both declare the home page as canonical.
- `courses.html`: the course gallery. Its header has a Student login link to the Future Founder class. Choosing a goal under "What do you want to build?" highlights the best-match course with a glow and fades unrelated ones. On phones, the best match also moves to the top. The goal-to-course mapping is the third value in each `goals` entry in `scripts/products.js`. Link straight to a goal with `?goal=app` (for example `torontoinnovationlab.com/courses.html?goal=ai`), `mobile`, `business`, `ai`, or `income`. Every "All courses" link points here.
- `future-founder.html`, `ios-app-builder.html`, `ai-app-wizard.html`, `business-accelerator.html`: one landing page per course.

These pages are generated. Edit course content (price, checkout URL, headline, phases, offer stack, guarantee, FAQ, gallery goals) in `scripts/products.js`, then run `npm run build:products`. `npm run dev` and `npm run build` regenerate them automatically. Commit the generated `.html` files so GitHub Pages can serve them.

The pages use their own lightweight `product.css`, `product.js`, and `catalog.js`, and don't load the course app or Firebase, so they stay fast on phones. Every Enroll button on a page goes to that course's `checkoutUrl`. Until it's set, the buttons scroll to the offer section. Box images are compressed WebP files in `assets/products/`, with the original PNGs kept alongside them.

## Funnel (Phase 1)

- `workshop.html`: the $47 "First Screen" live workshop. One action: book a seat. All five "Save my seat" buttons scroll to the `#booking` section. That section embeds the live Calendly event (`funnel.calendly`), where visitors pick a weekend slot and pay $47 through Calendly's Stripe integration.
- `future-founder.html`: the $497 "Build & Launch" live program, with a video slot in the hero and a $297 self-serve downsell under the offer.
- `thanks-workshop.html`: Calendly redirects here after booking. In order, it shows the "You're in" headline, the $497 Build & Launch upsell, the software link, and the ebook. It's marked `noindex`.

The workshop schedule is the `SESSION` constant at the top of `scripts/products.js`. Keep its slots in sync with the Calendly event. The hero, offer card, and final section show "Every Saturday & Sunday — next session Saturday, Oct 10 at 10:00 AM ET". The next slot is worked out in the visitor's browser, so it never goes stale. There's no seats-left count; Calendly enforces the 20-seat cap.

**Launch rule:** a page isn't done until every CTA is click-verified against a real destination. Run `npm run verify:launch` after building. It fails while any checkout button points at a placeholder or a "Save my seat" button doesn't go to `#booking`. It also fails if the Calendly embed is missing, a placeholder string or "announced soon" remains, the support email is missing, or the thank-you links aren't set. Don't send ad traffic until it passes and you've clicked every button on the live page.

`terms.html` and `refund.html` are generated plain-language drafts linked from every footer. The refund page pulls each course's guarantee from `scripts/products.js`. Have them reviewed before launch. The support email (`funnel.supportEmail`) appears in the footer and on both pages once set.

The other settings also live in `scripts/products.js`. Fill them in, run `npm run build:products`, and commit the regenerated pages. Until a URL starts with `http`, the page treats it as not set: buttons scroll to the offer section, and the thank-you page shows "coming soon" states.

| Setting | Where |
| --- | --- |
| Workshop booking (Calendly event) | `funnel.calendly` |
| `STRIPE_PROGRAM_URL` | `checkoutUrl` on `future-founder` |
| `EVERGREEN_COURSE_URL` ($297 downsell) | `funnel.evergreenCheckout` |
| `VSL_URL_PLACEHOLDER` (YouTube, Vimeo, Loom, or a direct embed URL) | `vslUrl` on `future-founder` |
| `SOFTWARE_ACCESS_URL`, `EBOOK_URL` | `funnel.software`, `funnel.ebook` |
| Workshop weekly slots | `SESSION.slots` |
| Next Build & Launch cohort date | `funnel.cohortDate`, for example `'Monday, October 19'` |
| `SUPPORT_EMAIL` | `funnel.supportEmail` |
| Meta Pixel ID | `funnel.metaPixel` (also hard-coded in `future-founder-class.html`) |

Every page loads the Meta Pixel (Christopher's Pixel P3) and fires `PageView`. The workshop page (`index.html` and `workshop.html`) also fires `ViewContent`. `thanks-workshop.html` fires `trackCustom('WorkshopBooked')`, and Calendly only redirects there after a paid booking, so each fire is one $47 sale. `npm run verify:launch` fails if any of these events go missing.

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
