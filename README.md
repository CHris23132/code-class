# Code Class

A responsive, framework-free HTML, CSS, and JavaScript learning website with Firebase accounts, based on the supplied Code Class PDF.

## Run locally

```sh
npm run dev
```

Open http://localhost:3000. Set `PORT` to use another port. Node.js 18 or later is required for the development server and build script; the deployed website only requires static hosting.

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

## Edit content

- `course.js`: modules, lessons, prompts, commands, checklists, resource links
- `app.js`: routing, components, dialogs, persistence, search, and export
- `styles.css`: complete desktop/mobile design system
- `index.html`: application shell and metadata

## Verification

The course was manually exercised in Chrome through all 12 completion flows, including the final achievement. Responsive layouts and saved notes/search behavior were reviewed in the browser. `npm run check` checks JavaScript syntax; `npm run build` produces the static deployment folder.

The Start here guide is available at `/#start`, with entry links from the sidebar, dashboard, and classroom. Both prompts and commands appear in the library when a lesson includes both. All 20 copy buttons were verified against their displayed text in Chrome.

## Branding

The site uses the supplied Adult AI Code Class flyer palette: navy `#071827`, cyan `#38D9F5`, lime `#DDFB70`, and off-white `#F5F5EF`. The reusable brand colors live in the `:root` tokens in `styles.css`. Navy anchors navigation and hero panels, cyan highlights navigation and progress, and lime marks primary actions. Supporting text colors are adjusted for readable contrast. The favicon and browser theme color use the same palette.
