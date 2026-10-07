const sharedFaq = {
  noCode: ['I’ve never written a line of code.', 'That’s who this is built for. The AI writes the code; you direct it. If you can follow a recipe, you can do this.'],
  stuck: ['What if I get stuck?', 'Every step ends with a checkpoint so you know it works before moving on, and the prompts are engineered to get you unstuck. If you’re still stuck, email me.'],
  time: ['How much time does it take?', 'One focused weekend, or about 4 hours at your own pace.']
};
const guidedSoftware = thing => ['Guided software, not just videos.', `An interactive step-by-step walkthrough. Every prompt is copy-paste ready, and a checkpoint at every step makes sure your ${thing} works before you move on.`];
const notFor = ['You want a computer science degree', 'You won’t touch a keyboard'];

export const goals = [
  ['all', 'All courses'],
  ['app', 'My own app', 'future-founder'],
  ['mobile', 'iPhone & mobile', 'ios-app-builder'],
  ['business', 'Tools for a business', 'business-accelerator'],
  ['ai', 'AI tools', 'ai-app-wizard'],
  ['income', 'A skill I can get paid for', 'business-accelerator']
];

export const products = [
  {
    slug: 'future-founder',
    name: 'Future Founder',
    tagline: 'Build your own Instagram-style app',
    price: 297,
    checkoutUrl: '',
    goals: ['app', 'mobile', 'income'],
    badge: 'Best place to start',
    summary: 'Build a real Instagram-style app with login and a database — from zero, in one weekend.',
    title: 'Future Founder — Build Your First Real App in a Weekend',
    description: 'A guided, step-by-step system — video lessons plus interactive software — that takes you from zero to a real Instagram-style app on your phone, with a real database and real login. No experience needed.',
    ogDescription: 'Stop watching coding tutorials. Ship a real Instagram-style app with a real database and real login. No experience needed.',
    headline: 'Build your first real app in a weekend — <span class="highlight">no experience needed.</span>',
    finalHeadline: 'Build your first real app in a weekend.',
    subhead: 'A guided, step-by-step system — video lessons plus interactive software that walks you through every prompt, every click, every checkpoint — until your app is live with a real database and real login.',
    trust: ['No experience needed', 'Go at your pace', 'Real app, real database, real login'],
    problemTitle: 'Here’s why you haven’t built your app yet.',
    problems: [
      ['Tutorials teach syntax.', 'Nobody teaches you how the pieces connect into a real product.'],
      ['You get stuck at 11pm', 'on a Firebase error with no one to ask — so you quit.'],
      ['Dev agencies quoted you $30k–$80k,', 'so the idea sits in your notes app.']
    ],
    outcomeEyebrow: 'Your weekend project',
    outcomeTitle: 'In one weekend, you will have built <span class="highlight">this:</span>',
    screensLabel: 'Screens from the app you will build: feed, new post, messages, and profile',
    screens: [
      ['Feed', `<div class="app-bar"><b class="app-logo">hello<span>world.</span></b><span class="app-icons">♡ ✉</span></div>
              <div class="stories"><i class="av a1"></i><i class="av a2"></i><i class="av a3"></i><i class="av a4"></i><i class="av a5"></i></div>
              <div class="post-head"><i class="av a2 sm"></i><span>maya.builds</span></div>
              <div class="post-img img-sunset"></div>
              <div class="post-actions">♡ <span>💬</span> <span>↗</span></div>
              <p class="post-meta"><b>128 likes</b></p>
              <p class="post-meta"><b>maya.builds</b> shipped my first app today 🚀</p>`],
      ['Post creation', `<div class="app-bar"><span>Cancel</span><b>New post</b><span class="lime-text">Share</span></div>
              <div class="upload"><svg class="icon"><use href="#i-plus"/></svg><span>Add a photo</span></div>
              <div class="field-line">Write a caption…</div>
              <div class="field-line short">Add location</div>
              <div class="share-btn">Share post</div>`],
      ['Direct messages', `<div class="app-bar"><span>‹</span><b>jordan.k</b><span></span></div>
              <div class="chat">
                <p class="bubble them">did you really build this yourself??</p>
                <p class="bubble me">yep 😅 this weekend</p>
                <p class="bubble them">with login and everything?</p>
                <p class="bubble me">real database, real accounts</p>
                <p class="bubble them">ok I need one for my business</p>
              </div>
              <div class="chat-input">Message…</div>`],
      ['Profile', `<div class="app-bar"><b>@you</b><span>☰</span></div>
              <div class="profile-top"><i class="av a3 lg"></i><div class="stats"><span><b>24</b>posts</span><span><b>1.2k</b>followers</span><span><b>310</b>following</span></div></div>
              <p class="profile-name"><b>You</b><br>Future founder · building in public</p>
              <div class="edit-btn">Edit profile</div>
              <div class="grid"><i class="img-sunset"></i><i class="img-sea"></i><i class="img-lime"></i><i class="img-sea"></i><i class="img-lime"></i><i class="img-sunset"></i></div>`]
    ],
    outcomes: ['Design professional app screens with AI', 'Set up a real cloud database that saves user data', 'Add login, profiles, and user accounts', 'Deploy a production build to a real phone'],
    applied: 'And you’ll understand the full anatomy of modern apps — the same foundation behind every internal business tool, client project, and startup MVP.',
    different: [guidedSoftware('app'), ['Production-grade, not toy projects.', 'Real Firebase backend. Real auth. Real deployment. The same stack companies pay developers $150/hr to build.']],
    phases: [
      ['Setup', 35, ['Your workspace ready with Cursor, Node, and Expo', 'Your first app created from a single AI prompt', 'Your app running live in the browser']],
      ['Design', 65, ['Professional screens designed with AI', 'Your app running on your own phone', 'Your work saved and backed up on GitHub']],
      ['Accounts &amp; Data', 90, ['A real Firebase cloud database', 'Sign-in, user accounts, and profiles', 'Posts, comments, likes, and messages that save']],
      ['Build &amp; Share', 30, ['A production build for iOS or Android', 'Your app tested on a real device', 'A finished app you can show anyone']]
    ],
    appliedTrack: 'the applied track: turning these skills into company tools and client work.',
    forYou: ['You have an app idea you keep putting off', 'You want a skill people will pay you for', 'You learn best by building something real'],
    notForYou: notFor,
    stack: [
      ['Future Founder Course — video lessons + guided software', 497],
      ['Interactive prompt library + checkpoints', 197],
      ['Production demo app source code', 97],
      ['“From clone to company tools” applied track', 197, true]
    ],
    guarantee: ['The First-Screen Guarantee', 'follow Phase 1 and if you don’t have an app running on your phone within 7 days, email me and I’ll refund every cent.'],
    finalTrust: 'First-Screen Guarantee: an app on your phone in 7 days, or every cent back.',
    faq: [
      sharedFaq.noCode,
      sharedFaq.stuck,
      sharedFaq.time,
      ['Do I need a Mac or paid tools?', 'No. Everything is free to start, and it works on Mac or Windows.'],
      ['How is this different from YouTube tutorials?', 'Tutorials end. This ends with a production app on your phone — plus the applied track that turns it into income.']
    ],
    finalLead: 'No experience needed. A real app on your phone, with a real database and real login.'
  },
  {
    slug: 'ios-app-builder',
    name: 'iOS App Builder',
    tagline: 'Build and release to the App Store',
    price: 297,
    checkoutUrl: '',
    goals: ['app', 'mobile', 'income'],
    summary: 'Design, build, test, and submit your own iPhone app to the App Store — no Mac required.',
    title: 'iOS App Builder — From Idea to the App Store',
    description: 'A guided, step-by-step system — video lessons plus interactive software — that takes you from idea to your own iOS app submitted to the App Store. No experience and no Mac needed.',
    ogDescription: 'From idea to the App Store. Build and release your first iOS app — no experience and no Mac needed.',
    headline: 'From idea to the App Store — <span class="highlight">build and release your first iOS app.</span>',
    finalHeadline: 'From idea to the App Store.',
    subhead: 'A guided, step-by-step system — video lessons plus interactive software that walks you through every prompt, every build, every checkpoint — until your app is submitted to the App Store.',
    trust: ['No experience needed', 'No Mac required', 'From first screen to App Store'],
    problemTitle: 'Here’s why your app isn’t on the App Store yet.',
    problems: [
      ['Tutorials stop at “Hello World.”', 'Nobody walks you through certificates, builds, and App Store review.'],
      ['App Store rejections feel like a black box', '— one vague email and the whole project stalls.'],
      ['You think you need a Mac, Xcode, and Swift', 'before you can even start.']
    ],
    outcomeEyebrow: 'Your launch',
    outcomeTitle: 'By the end, your app will be <span class="highlight">ready to ship:</span>',
    screensLabel: 'Screens from the release you will complete: your app, TestFlight, App Store listing, and a live notification',
    screens: [
      ['Your app', `<div class="onboard"><div class="app-icon big"></div><b>Daily Wins</b><p>Track one small win a day.</p><div class="dots"><i class="on"></i><i></i><i></i></div></div>
              <div class="share-btn">Get started</div>`],
      ['TestFlight', `<div class="app-bar"><b>TestFlight</b><span>Apps</span></div>
              <div class="tf-row"><div class="app-icon"></div><div><b>Daily Wins</b><small>Version 1.0 (3)</small></div><span class="pill">Install</span></div>
              <div class="note-card"><b>What to test</b><p>New onboarding flow and streak reminders.</p></div>
              <div class="note-card"><b>Testers</b><p>12 invited · 9 installed</p></div>`],
      ['App Store', `<div class="store-head"><div class="app-icon"></div><div><b>Daily Wins</b><small>Habit tracker</small><span class="pill">Get</span></div></div>
              <div class="store-stats"><span><b>4.9</b>★★★★★</span><span><b>#12</b>Health</span><span><b>4+</b>Age</span></div>
              <div class="shots"><i class="img-sea"></i><i class="img-lime"></i><i class="img-sunset"></i></div>
              <p class="post-meta"><b>What’s New</b><br>Version 1.0 — our very first release!</p>`],
      ['Live', `<div class="lock"><span class="lock-time">9:41</span><span class="lock-date">Saturday</span>
              <div class="notif"><div class="app-icon tiny"></div><div><b>Daily Wins</b><p>Your app is now available on the App Store 🎉</p></div></div>
              <div class="notif"><div class="app-icon tiny"></div><div><b>Daily Wins</b><p>You hit a 7-day streak 🔥</p></div></div></div>`]
    ],
    outcomes: ['Design a polished iOS app with AI', 'Test it on your own iPhone with TestFlight', 'Build it in the cloud — no Mac required', 'Submit it to App Store review with confidence'],
    applied: 'And you’ll know the full release process — the same pipeline you’ll use for every future app, client project, and update.',
    different: [guidedSoftware('build'), ['Release-ready, not just a prototype.', 'Real builds. Real TestFlight. Real App Store submission. The release process agencies charge thousands to handle.']],
    phases: [
      ['Setup', 30, ['Your workspace ready with Cursor, Expo, and your Apple account', 'Your app created from a single AI prompt', 'Your app running on your iPhone']],
      ['Design', 70, ['Polished iOS screens designed with AI', 'App icon, splash screen, and onboarding', 'Your work saved and backed up on GitHub']],
      ['Build &amp; Test', 60, ['A real iOS build made in the cloud', 'Your app installed through TestFlight', 'Feedback from real testers']],
      ['Release', 60, ['App Store listing, screenshots, and privacy details', 'Your submission to App Store review', 'A plan for shipping updates after launch']]
    ],
    appliedTrack: 'the applied track: publishing apps for clients and shipping updates.',
    forYou: ['You have an app idea you want on the App Store', 'You want a skill people will pay you for', 'You learn best by building something real'],
    notForYou: ['You want to learn Swift line by line', 'You won’t touch a keyboard'],
    stack: [
      ['iOS App Builder Course — video lessons + guided software', 497],
      ['Interactive prompt library + checkpoints', 197],
      ['App Store launch checklist + templates', 97],
      ['“Shipping apps for clients” applied track', 197, true]
    ],
    guarantee: ['The First-Build Guarantee', 'follow the course and if you don’t have your app installed on your iPhone within 7 days, email me and I’ll refund every cent.'],
    finalTrust: 'First-Build Guarantee: your app on your iPhone in 7 days, or every cent back.',
    faq: [
      sharedFaq.noCode,
      ['Do I need a Mac?', 'No. Your app is built in the cloud with Expo, so you can do everything from a Mac or Windows computer. You’ll need an iPhone to test on.'],
      ['What does it cost to publish?', 'Building and testing are free to start. Publishing on the App Store requires an Apple Developer Program membership, which Apple charges $99 a year for.'],
      ['Will Apple approve my app?', 'Approval is Apple’s decision, but the course walks you through the guidelines, privacy details, and common rejection reasons so your submission is as strong as it can be.'],
      ['How much time does it take?', 'About 4 hours of guided work, plus Apple’s review time.']
    ],
    finalLead: 'No experience and no Mac needed. Your own iOS app, ready for the App Store.'
  },
  {
    slug: 'ai-app-wizard',
    name: 'AI App Wizard',
    tagline: 'Build custom AI tools',
    price: 297,
    checkoutUrl: '',
    goals: ['ai', 'business', 'income'],
    summary: 'Build your own AI assistants, summarizers, and content generators — on your own backend.',
    title: 'AI App Wizard — Build Custom AI Tools',
    description: 'A guided, step-by-step system — video lessons plus interactive software — that takes you from zero to your own custom AI tools, running on your own backend. No experience needed.',
    ogDescription: 'Stop renting AI. Start owning it. Build custom AI tools on your own backend — no experience needed.',
    headline: 'Build custom AI tools — <span class="highlight">stop renting AI, start owning it.</span>',
    finalHeadline: 'Stop renting AI. Start owning it.',
    subhead: 'A guided, step-by-step system — video lessons plus interactive software that walks you through every prompt, every API call, every checkpoint — until your own AI tool is live with real users.',
    trust: ['No experience needed', 'Go at your pace', 'Your AI, your data, your rules'],
    problemTitle: 'Here’s why you’re still renting AI.',
    problems: [
      ['You pay for five AI subscriptions,', 'and none of them fit how you actually work.'],
      ['AI tutorials stop at a chatbot demo.', 'Nobody shows you how to build a real product around it.'],
      ['Pasting company data into public AI apps', 'makes you nervous — and it should.']
    ],
    outcomeEyebrow: 'Your AI toolkit',
    outcomeTitle: 'By the end, you will have built <span class="highlight">this:</span>',
    screensLabel: 'Screens from the AI tools you will build: assistant, document summarizer, content generator, and usage dashboard',
    screens: [
      ['AI assistant', `<div class="app-bar"><b>Assistant</b><span class="ai-label">✦ AI</span></div>
              <div class="chat">
                <p class="bubble me">Summarize this week’s customer feedback</p>
                <p class="bubble them ai"><b>✦ Here’s the summary</b><br>• 62% love the new checkout<br>• Top request: dark mode<br>• 3 refund issues to follow up</p>
                <p class="bubble me">Draft replies to the refund ones</p>
              </div>
              <div class="chat-input">Ask anything…</div>`],
      ['Doc summarizer', `<div class="app-bar"><b>Summarize</b><span>⋯</span></div>
              <div class="doc-card"><span class="doc-icon">PDF</span><div><b>vendor-contract.pdf</b><small>14 pages · uploaded</small></div></div>
              <div class="note-card"><b>✦ Summary</b><p>2-year term, auto-renews. 60-day cancellation notice. Prices rise 5% each year.</p></div>
              <div class="chip-row"><span class="chip warn">3 risks</span><span class="chip">5 dates</span><span class="chip">2 costs</span></div>`],
      ['Content generator', `<div class="app-bar"><b>Generate</b><span>History</span></div>
              <div class="field-line">Product: Trail running shoes</div>
              <div class="chip-row"><span class="chip on">Playful</span><span class="chip">Pro</span><span class="chip">Bold</span></div>
              <div class="share-btn">Generate ✦</div>
              <div class="note-card"><b>Instagram caption</b><p>Mud? Rocks? Monday? These shoes don’t care. 🏔️</p></div>`],
      ['Under the hood', `<div class="app-bar"><b>Settings</b><span></span></div>
              <div class="note-card"><b>🔒 API key</b><p>Stored securely on your server. Never in the app.</p></div>
              <div class="note-card"><b>Requests this month</b><p>1,240 of 5,000</p><div class="meter"><i style="width:25%"></i></div></div>
              <div class="note-card"><b>Cost so far</b><p>$3.18 · limit $20</p></div>`]
    ],
    outcomes: ['Build an AI assistant customized with your instructions', 'Summarize documents and data automatically', 'Generate content in your brand’s voice', 'Keep API keys and data secure on your own backend'],
    applied: 'And you’ll understand how modern AI products are put together — the same pattern behind every AI startup, internal copilot, and client automation.',
    different: [guidedSoftware('AI tool'), ['Your own AI, not another subscription.', 'Real AI APIs. Real backend. Real security. The custom AI tools companies are paying developers $150/hr to build right now.']],
    phases: [
      ['Setup', 30, ['Your workspace ready with Cursor and Firebase', 'Your first AI call working from a single prompt', 'A simple AI app running in the browser']],
      ['Your AI assistant', 70, ['A chat assistant with your own instructions', 'Conversation history saved to a database', 'A clean, professional interface designed with AI']],
      ['Real AI tools', 80, ['Document and data summarizers', 'A content generator in your brand’s voice', 'API keys locked away on the server']],
      ['Launch &amp; Share', 50, ['Sign-in so real users can use your tool', 'Usage limits that keep costs predictable', 'Your AI tool deployed and shareable']]
    ],
    appliedTrack: 'the applied track: building and selling custom AI tools for companies.',
    forYou: ['You want AI tools that fit how you work', 'You want a skill companies are paying for right now', 'You learn best by building something real'],
    notForYou: ['You want to research how AI models are trained', 'You won’t touch a keyboard'],
    stack: [
      ['AI App Wizard Course — video lessons + guided software', 497],
      ['Interactive prompt library + checkpoints', 197],
      ['AI tool starter source code', 97],
      ['“Selling AI tools to companies” applied track', 197, true]
    ],
    guarantee: ['The First-Tool Guarantee', 'follow Phase 1 and if you don’t have a working AI app running in your browser within 7 days, email me and I’ll refund every cent.'],
    finalTrust: 'First-Tool Guarantee: a working AI app in 7 days, or every cent back.',
    faq: [
      sharedFaq.noCode,
      ['Do I need to understand machine learning?', 'No. You’ll use AI models through their APIs, the same way most AI products are built. You direct the AI; it does the heavy lifting.'],
      ['What does the AI cost to run?', 'AI providers charge per use. While you’re building, that’s usually a few cents to a few dollars, and the course shows you how to set limits so there are no surprises.'],
      ['Is my data safe?', 'Your tool runs on your own backend, and API keys never reach the browser. You decide what data goes where.'],
      sharedFaq.time
    ],
    finalLead: 'No experience needed. Your own AI tool, on your own backend, ready for real users.'
  },
  {
    slug: 'business-accelerator',
    name: 'Business Accelerator',
    tagline: 'Custom automations for companies',
    price: 297,
    checkoutUrl: '',
    goals: ['business', 'income'],
    summary: 'Build the dashboards, approval flows, and automations companies pay developers $150/hr for.',
    title: 'Business Accelerator — Build the Internal Tools Companies Pay $150/Hr For',
    description: 'A guided, step-by-step system — video lessons plus interactive software — that takes you from zero to real internal business tools: dashboards, approval workflows, and automations. No experience needed.',
    ogDescription: 'Build the internal tools companies pay $150/hr for. Dashboards, workflows, and automations — no experience needed.',
    headline: 'Build the internal tools companies pay <span class="highlight">$150/hr for.</span>',
    finalHeadline: 'Build the internal tools companies pay $150/hr for.',
    subhead: 'A guided, step-by-step system — video lessons plus interactive software that walks you through every prompt, every click, every checkpoint — until you’ve built a real dashboard, approval workflow, and automation on a real database.',
    trust: ['No experience needed', 'Go at your pace', 'Real tools, real data, real users'],
    problemTitle: 'Here’s why you’re not getting paid to build yet.',
    problems: [
      ['Businesses are drowning in spreadsheets', 'and copy-paste work — but nobody showed you how to turn that into software.'],
      ['Generic no-code tools hit a wall', 'the moment a client needs something custom.'],
      ['You don’t have a portfolio piece', 'that proves you can deliver, so you can’t charge real rates.']
    ],
    outcomeEyebrow: 'Your first client-ready tool',
    outcomeTitle: 'By the end, you will have built <span class="highlight">this:</span>',
    screensLabel: 'Screens from the business tool you will build: dashboard, approvals, automation, and team roles',
    screens: [
      ['Dashboard', `<div class="app-bar"><b>Ops dashboard</b><span>Today</span></div>
              <div class="kpis"><div><small>Orders</small><b>142</b></div><div><small>Revenue</small><b>$12.4k</b></div><div><small>Open tickets</small><b>8</b></div><div><small>Hours saved</small><b>31</b></div></div>
              <div class="bars"><i style="height:40%"></i><i style="height:65%"></i><i style="height:50%"></i><i style="height:80%"></i><i style="height:60%"></i><i style="height:95%"></i><i style="height:75%"></i></div>`],
      ['Approvals', `<div class="app-bar"><b>Approvals</b><span class="pill">3</span></div>
              <div class="row-item"><div><b>Refund · $240</b><small>Dana · Customer care</small></div><span class="pill lime">Approve</span></div>
              <div class="row-item"><div><b>Time off · 2 days</b><small>Sam · Warehouse</small></div><span class="pill lime">Approve</span></div>
              <div class="row-item"><div><b>Invoice #1042</b><small>$3,100 · Supplier</small></div><span class="pill lime">Approve</span></div>
              <div class="row-item done"><div><b>✓ Expense · $86</b><small>Approved automatically</small></div></div>`],
      ['Automation', `<div class="app-bar"><b>New order flow</b><span class="pill lime">On</span></div>
              <div class="flow"><span>When a new order arrives</span><i>↓</i><span>Check stock in the database</span><i>↓</i><span>Email the customer</span><i>↓</i><span>Alert the team if stock is low</span></div>`],
      ['Team &amp; roles', `<div class="app-bar"><b>Team</b><span>+</span></div>
              <div class="row-item"><div class="who"><i class="av a2 sm"></i><b>Alex Rivera</b></div><span class="chip on">Admin</span></div>
              <div class="row-item"><div class="who"><i class="av a1 sm"></i><b>Dana Lee</b></div><span class="chip">Manager</span></div>
              <div class="row-item"><div class="who"><i class="av a3 sm"></i><b>Sam Patel</b></div><span class="chip">Staff</span></div>
              <div class="row-item"><div class="who"><i class="av a4 sm"></i><b>Jo Kim</b></div><span class="chip">Staff</span></div>
              <div class="edit-btn">Invite teammate</div>`]
    ],
    outcomes: ['Build a live dashboard on top of real company data', 'Create approval workflows with roles and permissions', 'Automate emails, alerts, and repetitive tasks', 'Deploy a secure tool a whole team can log in to'],
    applied: 'And you’ll know how to scope and deliver tools like this for real companies — the skill behind every internal-tools agency and freelance automation business.',
    different: [guidedSoftware('tool'), ['Real business software, not demos.', 'Real database. Real logins and roles. Real automations. The internal tools companies pay developers $150/hr to build.']],
    phases: [
      ['Foundations', 35, ['Your workspace ready with Cursor and Firebase', 'A business tool scaffolded from a single AI prompt', 'Your tool running live in the browser']],
      ['Dashboards', 60, ['A dashboard with live charts and KPIs', 'Tables to search, filter, and edit records', 'A clean, professional design made with AI']],
      ['Workflows &amp; Roles', 80, ['Team logins with admin, manager, and staff roles', 'Approval flows for requests, refunds, and time off', 'Data secured by role']],
      ['Automate &amp; Deliver', 65, ['Automatic emails, alerts, and scheduled reports', 'Your tool deployed for a whole team', 'A handoff checklist for client work']]
    ],
    appliedTrack: 'the applied track: finding your first client and pricing custom tools.',
    forYou: ['You want a skill companies will pay you for', 'You see manual work at your job that should be automated', 'You learn best by building something real'],
    notForYou: notFor,
    stack: [
      ['Business Accelerator Course — video lessons + guided software', 497],
      ['Interactive prompt library + checkpoints', 197],
      ['Internal tool starter source code', 97],
      ['“Your first client” applied track', 197, true]
    ],
    guarantee: ['The First-Tool Guarantee', 'follow Phase 1 and if you don’t have a working business tool running in your browser within 7 days, email me and I’ll refund every cent.'],
    finalTrust: 'First-Tool Guarantee: a working tool in 7 days, or every cent back.',
    faq: [
      sharedFaq.noCode,
      sharedFaq.stuck,
      sharedFaq.time,
      ['Do I need paid tools?', 'No. Everything is free to start on Firebase’s free tier, and it works on Mac or Windows.'],
      ['Why not just use a no-code tool?', 'No-code is great until a client needs something custom. You’ll own the code, so there are no per-seat fees and no ceiling on what you can build.']
    ],
    finalLead: 'No experience needed. A real tool, with real logins and real data, that a whole team can use.'
  }
];
