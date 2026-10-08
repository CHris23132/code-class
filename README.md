# Code Class

A responsive, framework-free HTML, CSS, and JavaScript learning website with Firebase accounts, based on the supplied Code Class PDF.

## Run locally

```sh
npm run dev
```

Open http://localhost:3000 for the course gallery, or http://localhost:3000/future-founder-class.html for the Future Founder class. Set `PORT` to use another port. Node.js 18 or later is required for the development server and build script; the deployed website only requires static hosting.

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

Visitors can open and complete lessons 1–2, save their checklists and lesson notes, and copy any prompt or command without an account. Firebase Anonymous Authentication creates a guest UID when enabled; guest progress is saved to that UID's `students/{uid}` document and also cached in localStorage. If anonymous auth or its Firestore rule is not enabled yet, the two free lessons still work and progress remains on that device. After lesson 2, a clear prompt invites the learner to create a free account before lesson 3. Sign-up links email/password credentials to the anonymous Firebase user, preserving its UID and progress. Sign-up collects name, email, and role (Student, Founder, Educator, Developer, Designer, Other).

Each student has one document in the Firestore `students` collection, keyed by their Firebase Auth UID:

```
students/{uid}
  uid, email, name, role, app: "codeclass"
  createdAt, updatedAt, lastActiveAt          (server timestamps)
  project:  { name, idea }
  progress: { completedLessons: number[], completedCount, totalLessons, percent,
              currentStep, currentStepTitle, lastLessonId, started, completedAt,
              checks: { [lessonId]: boolean[] } }
  notes:    { project, [lessonId]: string }
```

Guest changes save to Firestore about a second after each edit when anonymous access is enabled, and are cached in localStorage under `codeclass-v1`. Linking email/password upgrades the same Firebase UID, so the existing progress document becomes the account's document. Signing in on another device loads it. Signing out clears the local copy. Security rules for the `students` collection, including owner-only anonymous guest access, are in `firestore-students.rules`. Paste the block into your existing Firestore rules; don't replace them. In Firebase Console, enable Authentication → Sign-in method → Anonymous as well as Email/Password.

The Firebase web config lives in `firebase.js`. The SDK is installed from npm and bundled into `vendor/firebase.js` by `npm run build:firebase` (which `npm run dev` and `npm run build` also run), so the site stays deployable to GitHub Pages without a bundler at runtime. Commit `vendor/firebase.js`. For GitHub Pages, add your `<user>.github.io` domain under Firebase Console → Authentication → Settings → Authorized domains.

Completion is self-reported using the lesson checklists; the website does not inspect students' external app projects. Notes can be exported from the My notes page.

The course uses the original PDF's progression, consolidating its skipped numbering into 12 consecutive lessons. The Expo version guidance accounts for device compatibility. The Firebase lessons use local emulators or restricted security rules, explain that budget alerts are not spending caps, and require each student to use their own Firebase configuration. The source worksheet is included unchanged for reference.

Google Fonts provides DM Sans and Manrope, with sans-serif fallbacks. The hero artwork is built entirely in CSS. Firebase is the only runtime dependency, served from the bundled `vendor/firebase.js`.

## Product page

Each course has a standalone sales page, plus a gallery that filters courses by goal:

- `index.html`: the course gallery and the site’s home page. Its header has a Student login link to the Future Founder class. Choosing a goal under "What do you want to build?" highlights the best-match course with a glow and fades unrelated ones. On phones, the best match also moves to the top. The goal-to-course mapping is the third value in each `goals` entry in `scripts/products.js`. Link straight to a goal with `?goal=app` (for example `chris23132.github.io/code-class/?goal=ai`), `mobile`, `business`, `ai`, or `income`.
- `future-founder.html`, `ios-app-builder.html`, `ai-app-wizard.html`, `business-accelerator.html`: one landing page per course.

These pages are generated. Edit course content (price, checkout URL, headline, phases, offer stack, guarantee, FAQ, gallery goals) in `scripts/products.js`, then run `npm run build:products`. `npm run dev` and `npm run build` regenerate them automatically. Commit the generated `.html` files so GitHub Pages can serve them.

The pages use their own lightweight `product.css`, `product.js`, and `catalog.js`, and don't load the course app or Firebase, so they stay fast on phones. Every Enroll button on a page goes to that course's `checkoutUrl`. Until it's set, the buttons scroll to the offer section. Box images are compressed WebP files in `assets/products/`, with the original PNGs kept alongside them.

## Funnel (Phase 1)

- `workshop.html`: the $47 "First Screen" live workshop. One action: buy a seat.
- `future-founder.html`: the $497 "Build & Launch" live program, with a video slot in the hero and a $297 self-serve downsell under the offer.
- `thanks-workshop.html`: delivery after the $47 checkout. It holds the Calendly booking, the software link, and the ebook. It's marked `noindex`.

All settings live in `scripts/products.js`. Fill them in, run `npm run build:products`, and commit the regenerated pages. Until a URL starts with `http`, the page treats it as not set: buttons scroll to the offer section, and the thank-you page shows "coming soon" states.

| Setting | Where |
| --- | --- |
| `STRIPE_WORKSHOP_URL` | `funnel.workshopCheckout` |
| `STRIPE_PROGRAM_URL` | `checkoutUrl` on `future-founder` |
| `EVERGREEN_COURSE_URL` ($297 downsell) | `funnel.evergreenCheckout` |
| `VSL_URL_PLACEHOLDER` (YouTube, Vimeo, Loom, or a direct embed URL) | `vslUrl` on `future-founder` |
| `CALENDLY_WORKSHOP_URL`, `SOFTWARE_ACCESS_URL`, `EBOOK_URL` | `funnel.calendly`, `funnel.software`, `funnel.ebook` |
| Next workshop / cohort dates (weekly) | `funnel.workshopDate`, `funnel.cohortDate`, for example `'Thursday, Oct 15'`. When empty, the pages say "date announced soon". |

Stripe Payment Link for the workshop: turn on required email collection, and set "After payment" to redirect to `https://chris23132.github.io/code-class/thanks-workshop.html`.

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
