# CH5 Landing Page Rewrite

## TL;DR

> Replace the current generic agency-template homepage with a truthful, playful CH5 homepage that presents the company as a personal maker company building a constellation of real products and tools.
>
> Deliverables:
> - remove all services/work/process/pricing/fake-social-proof content
> - rewrite homepage copy and section structure around Firefly + featured CH5 projects
> - add a Pretext-powered text moment and a full-page fluid layer with mobile/reduced-motion fallbacks
>
> Estimated Effort: Large
> Parallel Execution: YES — 2 main waves + final verification
> Critical Path: T1 → T3 → T6 → T7 → T8

---

## Context

### Original Request
User wants to redo the entire landing page because it drifted into generic template territory. The page should stop pretending CH5 is a services business and instead reflect the actual soul of the company, its real apps, and its real experimental/product ecosystem.

### Interview Summary
**Key Discussions**:
- CH5 should read as a **personal maker company**.
- Voice should be **CH5 voice**, not first-person Chris memoir voice.
- Tone should be **playful**, but still truthful and non-corporate.
- Homepage should feature: **Firefly, FitBot, Waypoint, MacroBot, Slopcade, Hush**.
- The project set should appear **constellation-first**, not as a plain services list or grid of outbound sales links.
- **Pretext** and a **full-page fluid sim layer** are both in scope.
- **No new automated test stack** should be added; validation stays with `pnpm check`, `pnpm build`, and browser QA.

**Research Findings**:
- Current homepage is almost entirely local/uncommitted and mostly template copy.
- Current page includes fake stats, fake testimonials, broken `Services/Work/Process/Pricing` anchors, and generic CTAs like `Get Started`, `Book a Call`, and `View Pricing`.
- CH5 docs consistently describe a builder-first, technical, anti-marketing ecosystem with Firefly as the flagship product and a wider platform/product world behind it.
- Repo conventions are static-first Astro, React only where browser-only interactivity is needed.

### Metis Review
**Identified Gaps** (addressed in this plan):
- Firefly role was not explicitly locked → defaulted to **hero anchor / flagship**.
- Project-card depth was ambiguous → defaulted to **name + one-line blurb + visual presence**, with selective optional links later.
- Motion fallback requirements were not explicit → made mandatory for mobile, reduced-motion, and no-WebGL cases.
- CTA strategy was unclear → defaulted to **no sales CTA**; focus on orientation/exploration instead.
- Scope creep risk around full-site redesign → locked to **homepage-only rewrite**.

---

## Work Objectives

### Core Objective
Turn the current homepage into a truthful CH5 front door: one page that feels alive, strange, and real, while clearly presenting CH5 as a maker company building actual products and infrastructure rather than selling agency services.

### Concrete Deliverables
- Rewritten homepage metadata, nav, hero, body sections, and footer
- Removal of fake stats, fake testimonials, fake logos, pricing/process/services funnel copy
- A featured product constellation centered on Firefly and supported by FitBot, Waypoint, MacroBot, Slopcade, and Hush
- One scoped Pretext interaction or demo moment on-page
- One page-spanning fluid visual layer with accessibility/performance fallbacks

### Definition of Done
- [x] `pnpm check` passes
- [x] `pnpm build` passes
- [x] Browser QA confirms banned template copy is gone
- [x] Browser QA confirms all required project names appear
- [x] Browser QA confirms motion fallbacks behave correctly

### Must Have
- Truthful CH5 positioning
- Playful but non-corporate copy
- Firefly-led story
- Constellation-style project presentation
- Static-first implementation
- Reduced-motion and no-WebGL fallbacks

### Must NOT Have (Guardrails)
- Services / work-for-hire framing
- Pricing / process / book-a-call funnel language
- Fake testimonials, fake stats, fake logos, invented claims
- Founder first-person memoir tone
- Full-site IA expansion beyond the homepage
- New test framework setup

---

## Verification Strategy

> ZERO HUMAN INTERVENTION — all verification must be executable by the implementing agent.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: none

### QA Policy
- Required command gates: `pnpm check`, `pnpm build`
- Required browser QA: local preview or dev server assertions against rendered homepage
- Evidence saved under `.sisyphus/evidence/`
- Motion/accessibility QA must cover:
  - normal desktop
  - mobile viewport
  - `prefers-reduced-motion`
  - fluid/WebGL unavailable fallback path

---

## Execution Strategy

### Parallel Execution Waves

```text
Wave 1 (foundation + truthful content skeleton)
├── Task 1: Homepage content model + project dataset
├── Task 2: Navbar + footer anti-template rewrite
├── Task 3: Hero rewrite with Firefly as anchor
├── Task 4: Replace “How It Works” with CH5 worldview section
└── Task 5: Replace fake stats/testimonials with constellation section shell

Wave 2 (interactive layer + polish)
├── Task 6: Rewrite capability/feature sections into product ecosystem storytelling
├── Task 7: Add Pretext-powered text interaction
├── Task 8: Add full-page fluid layer with fallbacks
├── Task 9: Mobile/accessibility/performance hardening
└── Task 10: Metadata, cleanup, and banned-copy sweep

Wave FINAL
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review
├── Task F3: Browser QA execution
└── Task F4: Scope fidelity check
```

### Dependency Matrix
- **1**: — → 3, 4, 5, 6
- **2**: — → 10
- **3**: 1 → 7, 8, 9
- **4**: 1 → 6, 9
- **5**: 1 → 6, 9
- **6**: 1, 4, 5 → 9, 10
- **7**: 3 → 9, 10
- **8**: 3 → 9, 10
- **9**: 3, 4, 5, 6, 7, 8 → 10
- **10**: 2, 6, 7, 8, 9 → FINAL

### Agent Dispatch Summary
- **Wave 1**: T1 `deep`, T2 `quick`, T3 `writing`, T4 `writing`, T5 `visual-engineering`
- **Wave 2**: T6 `writing`, T7 `visual-engineering`, T8 `visual-engineering`, T9 `unspecified-high`, T10 `quick`
- **FINAL**: F1 `oracle`, F2 `unspecified-high`, F3 `visual-engineering`, F4 `deep`

---

## TODOs

- [x] 1. Create truthful homepage content model and featured-project dataset

  **What to do**:
  - Introduce one canonical content/data source for the homepage narrative and featured project list
  - Encode required featured names: Firefly, FitBot, Waypoint, MacroBot, Slopcade, Hush
  - Assign each project a one-line truthful blurb and category label as needed (`product`, `tool`, `experiment`, etc.)
  - Default Firefly to hero-anchor status

  **Must NOT do**:
  - Invent metrics, launch claims, customer claims, or availability claims
  - Expand into a CMS or multi-page content system

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: this task locks narrative truth and data shape for the rest of the page
  - **Skills**: [`ui-content-design`]
    - `ui-content-design`: helps keep short public-facing copy precise and non-generic
  - **Skills Evaluated but Omitted**:
    - `brainstorming`: not needed now that direction is already chosen

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 3, 4, 5, 6
  - **Blocked By**: None

  **References**:
  - `src/pages/index.astro:3-10` - current homepage component composition to replace with a new content-driven structure
  - `/Users/hassoncs/Workspaces/personal/ch5-company/app-portfolio.md:7-89` - truthful product descriptions for Firefly, FitBot, NanoClaw, cmux, Slopcade, Waypoint
  - `/Users/hassoncs/Workspaces/personal/ch5-company/README.md:22-40` - CH5 metadata and ownership language; useful for company voice and truth constraints
  - `/Users/hassoncs/Workspaces/personal/ch5-company/platform-stack.md:148-156` - Hush description and secret-management positioning

  **Acceptance Criteria**:
  - [ ] A single source of homepage project/copy data exists and is imported by the homepage
  - [ ] The data source includes all required featured names exactly once
  - [ ] No banned words appear in the new data source: `services`, `pricing`, `book a call`, `get started`

  **QA Scenarios**:
  ```text
  Scenario: Featured dataset renders all required names
    Tool: Bash (grep)
    Preconditions: local changes saved
    Steps:
      1. Search homepage data/component files for `Firefly|FitBot|Waypoint|MacroBot|Slopcade|Hush`
      2. Confirm all six names exist in the new homepage source
    Expected Result: all six names are present in homepage source
    Failure Indicators: any missing project name
    Evidence: .sisyphus/evidence/task-1-featured-projects.txt

  Scenario: Banned sales language absent from content model
    Tool: Bash (grep)
    Preconditions: local changes saved
    Steps:
      1. Search new homepage content source for `Get Started|Book a Call|View Pricing|Services|Process`
      2. Confirm zero matches
    Expected Result: no banned sales language in canonical content source
    Evidence: .sisyphus/evidence/task-1-banned-copy.txt
  ```

  **Commit**: NO

- [x] 2. Rewrite navbar and footer so they stop acting like an agency funnel

  **What to do**:
  - Remove `Services / Work / Process / Pricing` nav items and broken anchors
  - Replace nav/footer structure with truthful homepage navigation and non-sales footer content
  - Remove CTA buttons that imply lead-gen funneling

  **Must NOT do**:
  - Keep dead anchors
  - Introduce contact-sales language by another name

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: isolated structural rewrite in a small number of files
  - **Skills**: [`ui-content-design`]
    - `ui-content-design`: good for terse nav/footer labels
  - **Skills Evaluated but Omitted**:
    - `visual-tdd`: not necessary yet for simple label/anchor cleanup

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 10
  - **Blocked By**: None

  **References**:
  - `src/components/Navbar.tsx:3-29` - current broken service-funnel nav and `Get Started` CTA
  - `src/components/CtaFooter.tsx:19-41` - current sales CTA/footer buttons to replace
  - `src/components/CtaFooter.tsx:45-63` - current footer link area to preserve or rewrite carefully
  - `README.md:13-17` - repo purpose: lightweight public presence, not sales funnel

  **Acceptance Criteria**:
  - [ ] Rendered nav contains none of: `Services`, `Work`, `Process`, `Pricing`
  - [ ] Rendered page contains none of: `Get Started`, `Book a Call`, `View Pricing`
  - [ ] All remaining nav anchors scroll to real sections or use valid routes

  **QA Scenarios**:
  ```text
  Scenario: Nav and footer no longer show agency funnel language
    Tool: Playwright / browser automation
    Preconditions: local dev server running on homepage
    Steps:
      1. Open `/`
      2. Assert nav text does not contain `Services`, `Work`, `Process`, `Pricing`
      3. Assert page text does not contain `Get Started`, `Book a Call`, `View Pricing`
    Expected Result: banned nav/footer CTA copy is absent
    Failure Indicators: any banned label remains visible
    Evidence: .sisyphus/evidence/task-2-nav-footer.png

  Scenario: Nav links are not broken
    Tool: Playwright / browser automation
    Preconditions: local dev server running
    Steps:
      1. Collect visible nav links
      2. Click each internal anchor link
      3. Confirm URL hash maps to an existing section id or route change succeeds
    Expected Result: no dead links or broken anchors
    Evidence: .sisyphus/evidence/task-2-nav-links.json
  ```

  **Commit**: NO

- [x] 3. Rewrite the hero around Firefly and CH5’s real identity

  **What to do**:
  - Replace generic “website your brand deserves” messaging
  - Make Firefly the anchor product without collapsing the rest of CH5 out of existence
  - Remove fake partner logos and generic AI-web-design claims
  - Keep hero legible underneath future motion layers

  **Must NOT do**:
  - Sound like a VC deck or design agency
  - Use founder first-person voice

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: hero copy is the highest-leverage narrative surface
  - **Skills**: [`ui-content-design`]
    - `ui-content-design`: ideal for sharp public homepage headline/subhead work
  - **Skills Evaluated but Omitted**:
    - `brainstorming`: planning already resolved the direction

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 7, 8, 9
  - **Blocked By**: 1

  **References**:
  - `src/components/Hero.tsx:27-76` - current hero copy, buttons, and fake logos to replace
  - `/Users/hassoncs/Workspaces/personal/ch5-company/app-portfolio.md:9-31` - Firefly positioning and architecture clues
  - `/Users/hassoncs/Workspaces/personal/ch5-company/README.md:38-49` - durable, anti-hype voice cues

  **Acceptance Criteria**:
  - [ ] Hero includes `Firefly`
  - [ ] Hero does not include `The Website Your Brand Deserves`
  - [ ] Hero does not include fake brand logos list (`Stripe`, `Vercel`, `Linear`, `Notion`, `Figma`)
  - [ ] Hero copy reads as product/ecosystem introduction, not client-service offer

  **QA Scenarios**:
  ```text
  Scenario: Hero reflects Firefly-led CH5 narrative
    Tool: Playwright / browser automation
    Preconditions: homepage running locally
    Steps:
      1. Open `/`
      2. Assert hero region contains `Firefly`
      3. Assert hero region does not contain `The Website Your Brand Deserves`
      4. Capture hero screenshot
    Expected Result: Firefly-led hero appears with new truthful copy
    Evidence: .sisyphus/evidence/task-3-hero.png

  Scenario: Fake trust badges/logos removed
    Tool: Playwright / browser automation
    Preconditions: homepage running locally
    Steps:
      1. Search visible hero area for `Stripe`, `Vercel`, `Linear`, `Notion`, `Figma`
      2. Assert none are visible
    Expected Result: fake social proof removed
    Evidence: .sisyphus/evidence/task-3-no-fake-logos.json
  ```

  **Commit**: NO

- [x] 4. Replace “How It Works” with a CH5 worldview / company-thesis section

  **What to do**:
  - Replace the current process-sell section with a short truthful statement of what CH5 is
  - Use the section to define the company as a personal maker company building products, tools, and experiments
  - Set up an emotional handoff into the constellation section

  **Must NOT do**:
  - Recreate process language (`share your vision`, `we ship it`, etc.)
  - Turn this into a consulting explainer

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: mostly narrative/content rewrite
  - **Skills**: [`ui-content-design`]
    - `ui-content-design`: strong fit for section-level positioning copy
  - **Skills Evaluated but Omitted**:
    - `visual-engineering`: not primary driver for this task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 6, 9
  - **Blocked By**: 1

  **References**:
  - `src/components/StartSection.tsx:11-29` - process-oriented section to remove/replace
  - `/Users/hassoncs/Workspaces/personal/ch5-company/README.md:3-8` - “cross-project context” / ecosystem framing
  - `/Users/hassoncs/Workspaces/personal/ch5-company/agent-ecosystem.md:95-96` - ownership split sentence for structural truth

  **Acceptance Criteria**:
  - [ ] Section no longer contains `How It Works`
  - [ ] Section no longer contains `You dream it. We ship it.`
  - [ ] Section introduces CH5 worldview without services language

  **QA Scenarios**:
  ```text
  Scenario: Process section replaced by worldview section
    Tool: Playwright / browser automation
    Preconditions: local homepage running
    Steps:
      1. Open homepage
      2. Search page for `How It Works` and `You dream it. We ship it.`
      3. Assert neither string exists
      4. Capture screenshot of replacement section
    Expected Result: old process section gone; new worldview section visible
    Evidence: .sisyphus/evidence/task-4-worldview.png

  Scenario: Services phrasing does not leak into replacement copy
    Tool: Bash (grep)
    Preconditions: changes saved
    Steps:
      1. Search replacement section file for `vision`, `ship it`, `launch in days`, `strategy call`
      2. Confirm banned phrases are absent
    Expected Result: no process-funnel language remains
    Evidence: .sisyphus/evidence/task-4-copy-sweep.txt
  ```

  **Commit**: NO

- [x] 5. Replace fake stats/testimonials with the constellation section shell

  **What to do**:
  - Remove fake stats and fake testimonials entirely
  - Reuse the visual real estate for a truthful project constellation shell or equivalent ecosystem section
  - Ensure the section can later host project nodes without visual clutter

  **Must NOT do**:
  - Replace fake proof with different fake proof
  - Collapse into a boring feature-card grid unless necessary for mobile fallback

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: structural and visual replacement of major page blocks
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: useful for reworking section composition and visual hierarchy
  - **Skills Evaluated but Omitted**:
    - `visual-tdd`: useful later, but this task is still structure-first

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: 6, 9
  - **Blocked By**: 1

  **References**:
  - `src/components/Stats.tsx:1-38` - fake metrics block to delete/replace
  - `src/components/Testimonials.tsx:3-53` - fake testimonial block to delete/replace
  - `/Users/hassoncs/Workspaces/personal/ch5-company/app-portfolio.md:61-89` - backlog/experiment products useful for constellation framing

  **Acceptance Criteria**:
  - [ ] Page no longer contains `200+`, `98%`, `3.2x`, `5 days`
  - [ ] Page no longer contains `Sarah Chen`, `Marcus Webb`, `Elena Voss`
  - [ ] Replacement section exists and can visibly host multiple CH5 projects

  **QA Scenarios**:
  ```text
  Scenario: Fake stats and testimonials removed
    Tool: Playwright / browser automation
    Preconditions: homepage running
    Steps:
      1. Open homepage
      2. Assert text does not contain `200+`, `98%`, `3.2x`, `5 days`
      3. Assert text does not contain `Sarah Chen`, `Marcus Webb`, `Elena Voss`
    Expected Result: all fake proof removed from rendered page
    Evidence: .sisyphus/evidence/task-5-no-fake-proof.json

  Scenario: Replacement section renders
    Tool: Playwright / browser automation
    Preconditions: homepage running
    Steps:
      1. Scroll to replacement ecosystem section
      2. Capture screenshot showing multiple project placeholders/nodes/cards
    Expected Result: a truthful constellation shell is visible
    Evidence: .sisyphus/evidence/task-5-constellation-shell.png
  ```

  **Commit**: NO

- [x] 6. Turn generic feature sections into CH5 ecosystem storytelling

  **What to do**:
  - Replace generic `Capabilities` and `Why Us` sections with sections that explain the CH5 world
  - Ensure Firefly, FitBot, Waypoint, MacroBot, Slopcade, and Hush all appear in the body
  - Use constellation-first presentation, but keep text legible and mobile-friendly

  **Must NOT do**:
  - Reuse generic B2B benefit-card language (`convert`, `secure by default`, etc.)
  - Turn project mentions into a giant undifferentiated blob

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: message architecture and section narrative are the key work
  - **Skills**: [`ui-content-design`, `frontend-ui-ux`]
    - `ui-content-design`: keeps project descriptions sharp
    - `frontend-ui-ux`: helps maintain readable structure while shifting layout
  - **Skills Evaluated but Omitted**:
    - `brainstorming`: no longer needed after planning lock

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 10
  - **Blocked By**: 1, 4, 5

  **References**:
  - `src/components/FeaturesChess.tsx:4-68` - generic capability section to repurpose or replace
  - `src/components/FeaturesGrid.tsx:4-63` - generic “Why Us” grid to repurpose or replace
  - `/Users/hassoncs/Workspaces/personal/ch5-company/app-portfolio.md:9-89` - source of truthful project descriptions
  - `/Users/hassoncs/Workspaces/personal/ch5-company/platform-stack.md:107-156` - Ghost Browser, cmux, ch5, Hush context if needed for surrounding ecosystem language

  **Acceptance Criteria**:
  - [ ] Rendered homepage contains `Firefly`, `FitBot`, `Waypoint`, `MacroBot`, `Slopcade`, `Hush`
  - [ ] Rendered homepage does not contain `Capabilities`, `Why Us`, `Built to Convert`, `Secure by Default`
  - [ ] Project presentation is visibly grouped or differentiated, not a flat paragraph dump

  **QA Scenarios**:
  ```text
  Scenario: All required projects appear in body copy
    Tool: Playwright / browser automation
    Preconditions: homepage running
    Steps:
      1. Open homepage
      2. Assert body text contains all required project names
      3. Save DOM text snapshot
    Expected Result: all six required names render
    Evidence: .sisyphus/evidence/task-6-project-names.json

  Scenario: Generic feature language removed
    Tool: Playwright / browser automation
    Preconditions: homepage running
    Steps:
      1. Search rendered page for `Capabilities`, `Why Us`, `Built to Convert`, `Secure by Default`
      2. Assert zero matches
    Expected Result: template feature framing gone
    Evidence: .sisyphus/evidence/task-6-no-template-features.json
  ```

  **Commit**: NO

- [x] 7. Add one scoped Pretext-powered text interaction

  **What to do**:
  - Install and integrate Pretext in a tightly scoped way
  - Use it for one meaningful CH5 text moment: hero typography, constellation labels, or a short demo section
  - Keep semantic text/fallback DOM intact

  **Must NOT do**:
  - Let Pretext become the whole site
  - Ship canvas/text behavior with no readable non-JS fallback

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: interaction-heavy frontend work
  - **Skills**: [`context7-auto-research`, `frontend-ui-ux`]
    - `context7-auto-research`: helpful for current Pretext API usage patterns
    - `frontend-ui-ux`: helps integrate interaction cleanly into page layout
  - **Skills Evaluated but Omitted**:
    - `visual-tdd`: not required unless implementing pixel-tight comparisons

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 10
  - **Blocked By**: 3

  **References**:
  - `https://pretextjs.dev/pretext-demo` - demo gallery for scoped use-case inspiration
  - `src/components/Hero.tsx:33-47` - likely insertion point if hero gets the text interaction
  - `src/pages/index.astro:27-38` - overall page composition for choosing insertion point

  **Acceptance Criteria**:
  - [ ] Pretext dependency is installed and used in at least one rendered homepage interaction
  - [ ] The page remains readable with JS disabled or with interaction unavailable
  - [ ] `pnpm check` and `pnpm build` still pass after integration

  **QA Scenarios**:
  ```text
  Scenario: Pretext interaction renders on desktop
    Tool: Playwright / browser automation
    Preconditions: homepage running with normal desktop viewport
    Steps:
      1. Open homepage
      2. Navigate to the Pretext-enhanced region
      3. Trigger the intended interaction if needed
      4. Capture screenshot
    Expected Result: Pretext effect is visible and text remains legible
    Evidence: .sisyphus/evidence/task-7-pretext-desktop.png

  Scenario: Semantic fallback remains readable
    Tool: Playwright / browser automation
    Preconditions: homepage running
    Steps:
      1. Emulate reduced capabilities or disable JS for the interaction region if practical
      2. Confirm the same core text content is still readable in DOM
    Expected Result: no blank hero/section due to interaction failure
    Evidence: .sisyphus/evidence/task-7-pretext-fallback.png
  ```

  **Commit**: NO

- [x] 8. Add the full-page fluid simulation layer with performance and fallback rules

  **What to do**:
  - Adapt or recreate the desired fluid-sim aesthetic as a page-spanning background layer
  - Keep it behind content and non-obstructive
  - Add reduced-motion and no-WebGL fallback behavior
  - Ensure it works with touch and does not depend on hover-only interaction

  **Must NOT do**:
  - Obscure text contrast/readability
  - Require WebGL for comprehension of the page
  - Treat the fetched CodePen title alone as a complete implementation spec; executor must inspect actual source or recreate the effect cleanly

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: animation/rendering-heavy frontend work
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: helps balance aesthetics, layering, and readability
  - **Skills Evaluated but Omitted**:
    - `ghost-browser`: not an implementation skill; useful later for QA only

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 9, 10
  - **Blocked By**: 3

  **References**:
  - `https://codepen.io/editor/fand/pen/019d61f5-aadf-7e18-851c-0ebd317146c7` - intended visual inspiration; exact source must be inspected during execution
  - `src/components/Hero.tsx:7-25` - existing full-bleed hero background layering approach
  - `src/pages/index.astro:27-38` - page wrapper where a global background layer may be introduced
  - `README.md:3-17` - lightweight public presence; visual layer must not bloat beyond reason

  **Acceptance Criteria**:
  - [ ] Fluid layer is visible on normal desktop rendering
  - [ ] Content remains readable above it
  - [ ] Reduced-motion mode disables or simplifies nonessential motion
  - [ ] Graceful fallback appears when the effect cannot render

  **QA Scenarios**:
  ```text
  Scenario: Fluid background visible without obscuring content
    Tool: Playwright / browser automation
    Preconditions: homepage running in desktop viewport
    Steps:
      1. Open homepage
      2. Capture top-of-page and mid-page screenshots
      3. Confirm headline/project text remains readable over background
    Expected Result: effect visible, copy readable
    Evidence: .sisyphus/evidence/task-8-fluid-desktop.png

  Scenario: Reduced motion simplifies the effect
    Tool: Playwright / browser automation
    Preconditions: browser emulates `prefers-reduced-motion: reduce`
    Steps:
      1. Open homepage with reduced-motion emulation
      2. Capture screenshot / DOM snapshot
      3. Confirm effect is simplified or disabled while content still renders
    Expected Result: motion-heavy layer does not continue at full intensity
    Evidence: .sisyphus/evidence/task-8-fluid-reduced-motion.png
  ```

  **Commit**: NO

- [x] 9. Harden mobile, accessibility, and performance behavior

  **What to do**:
  - Make the constellation readable on small screens
  - Ensure touch devices do not rely on hover
  - Preserve text contrast and heading hierarchy
  - Trim or simplify expensive motion where necessary

  **Must NOT do**:
  - Let the desktop concept collapse into unreadable mobile clutter
  - Leave reduced-motion unsupported

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: this is a cross-cutting integration/polish pass
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: strongest fit for responsive/accessibility polish
  - **Skills Evaluated but Omitted**:
    - `visual-tdd`: optional, not required by current test strategy

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: 10
  - **Blocked By**: 3, 4, 5, 6, 7, 8

  **References**:
  - `src/components/Hero.tsx:27-76` - hero readability and layering constraints
  - `src/components/Navbar.tsx:32-36` - existing mobile menu surface that may need truthful mobile treatment
  - `/Users/hassoncs/Workspaces/personal/ch5-company/app-portfolio.md:42-69` - project list to keep readable when layout collapses

  **Acceptance Criteria**:
  - [ ] Mobile viewport still shows Firefly and at least the full featured project set accessibly
  - [ ] Reduced-motion behavior is implemented and testable
  - [ ] No text sits unreadably over the fluid layer in key sections

  **QA Scenarios**:
  ```text
  Scenario: Mobile constellation remains readable
    Tool: Playwright / browser automation
    Preconditions: browser set to iPhone-sized viewport
    Steps:
      1. Open homepage
      2. Scroll through hero and project sections
      3. Assert required project names remain visible/reachable
      4. Capture screenshots
    Expected Result: mobile experience is readable and navigable
    Evidence: .sisyphus/evidence/task-9-mobile.png

  Scenario: Touch/no-hover path still works
    Tool: Playwright / browser automation
    Preconditions: mobile emulation active
    Steps:
      1. Interact with any constellation/project affordances via tap only
      2. Confirm information reveals do not require hover
    Expected Result: mobile users can access project info without hover
    Evidence: .sisyphus/evidence/task-9-touch.json
  ```

  **Commit**: NO

- [x] 10. Final cleanup: metadata rewrite, component cleanup, banned-copy sweep

  **What to do**:
  - Rewrite page title/description to match the new positioning
  - Remove or retire no-longer-needed template components/copy paths
  - Run a final source sweep for banned terms and stale template strings
  - Ensure homepage file composition matches the new section inventory

  **Must NOT do**:
  - Leave dead imports/components behind if the page no longer uses them
  - Leave stale agency copy hidden in the rendered homepage path

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: cleanup and consistency sweep across a small set of files
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: not needed without commit creation in this task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: FINAL
  - **Blocked By**: 2, 6, 7, 8, 9

  **References**:
  - `src/pages/index.astro:12-13` - current title/description to rewrite
  - `src/pages/index.astro:27-38` - final composition should match the new homepage structure
  - `src/components/Navbar.tsx:4-29` - stale template terms to ensure removed
  - `src/components/CtaFooter.tsx:20-41` - stale CTA language to ensure removed

  **Acceptance Criteria**:
  - [ ] Title/description no longer describe CH5 as an AI-powered software studio selling apps/services
  - [ ] Source sweep finds none of: `Get Started`, `Book a Call`, `View Pricing`, `Services`, `Process`, `Client satisfaction`
  - [ ] `pnpm check` passes
  - [ ] `pnpm build` passes

  **QA Scenarios**:
  ```text
  Scenario: Banned homepage copy fully removed from source and render
    Tool: Bash (grep) + Playwright / browser automation
    Preconditions: changes saved; homepage running
    Steps:
      1. Grep source for `Get Started|Book a Call|View Pricing|Client satisfaction|Services|Process`
      2. Assert zero matches in homepage code paths
      3. Open homepage and assert same strings are absent from rendered page
    Expected Result: no stale template copy remains
    Evidence: .sisyphus/evidence/task-10-copy-sweep.txt

  Scenario: Build and check gates pass
    Tool: Bash
    Preconditions: dependencies installed
    Steps:
      1. Run `pnpm check`
      2. Run `pnpm build`
    Expected Result: both commands succeed with zero errors
    Evidence: .sisyphus/evidence/task-10-build-check.txt
  ```

  **Commit**: YES
  - Message: `feat(homepage): rewrite ch5 landing page around real product constellation`
  - Files: `src/pages/index.astro`, `src/components/*`, any new homepage data/interaction files
  - Pre-commit: `pnpm check && pnpm build`

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle` — APPROVE
  All required project names present, banned content absent, FluidBackground + PretextHeadline + Constellation all verified.

- [x] F2. **Code Quality Review** — `unspecified-high` — APPROVE
  pnpm check: 0 errors. pnpm build: clean. No dead imports, no TypeScript hacks. Minor: Navbar #about anchor now fixed.

- [x] F3. **Real Browser QA** — APPROVE
  All 6 project names in built HTML. 0 banned copy matches. Section anchors #about/#projects/#ecosystem present. Hero copy correct. Evidence: .sisyphus/evidence/final-qa/browser-qa.txt

- [x] F4. **Scope Fidelity Check** — `deep` — APPROVE
  Homepage-only. No new pages, no test framework, no CMS, no services/pricing/process patterns reintroduced.

---

## Commit Strategy

- **1**: `refactor(homepage): remove generic agency template framing`
- **2**: `feat(homepage): add truthful ch5 narrative and project constellation`
- **3**: `feat(homepage): add pretext interaction and fluid background`
- **4**: `fix(homepage): polish mobile fallback and accessibility`

---

## Success Criteria

### Verification Commands
```bash
pnpm check
pnpm build
```

### Final Checklist
- [x] All required project names present
- [x] Firefly leads the page
- [x] No fake stats/testimonials/logos remain
- [x] No services/process/pricing/get-started funnel language remains
- [x] Pretext interaction works with fallback
- [x] Fluid layer works with reduced-motion and no-WebGL graceful behavior
- [x] Homepage remains lightweight, static-first, and readable
