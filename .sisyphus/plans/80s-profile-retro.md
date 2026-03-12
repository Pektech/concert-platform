# 80s Retro Profile Styling Implementation Plan

## Summary
Create a new 80s synthwave/retro-styled profile page that captures the essence of 80s concert posters while maintaining all existing functionality. The new page will be accessible at `/profile/[id]/retro`.

## Deliverables
- New CSS module: `src/styles/80s-profile.module.css`
- New retro profile page: `src/app/profile/[id]/retro/page.tsx`
- Preserved functionality: All user stats, reviews, follow buttons, navigation
- Responsive design: Works on mobile, tablet, desktop
- Performance: No degradation from original page

---

## Tasks

- [x] 1. Create 80s styled CSS module with synthwave aesthetics

  **What to do**:
  - Define 80s synthwave color palette variables:
    - --neon-pink-primary: #FF007F (hot pink)
    - --neon-cyan-secondary: #00FFFF (electric cyan)
    - --laser-yellow-accent: #FFD700 (gold)
    - --electric-purple: #8A2BE2 (deep violet)
    - --retro-grid-green: #39FF14 (neon green)
    - --dark-background: #0A0A0F (night sky base)
  - Create grid background patterns with CSS repeating-linear-gradient
  - Implement neon glow text effects using multi-layered text-shadow
  - Add animated background patterns (scanlines, particles)
  - Create neon border effects with inset glow
  
  **Must NOT do**:
  - Do NOT modify existing globals.css
  - Do NOT change existing color variables
  - Do NOT include layout-specific rules (only reusable visual components)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` (styling expertise)
  - **Skills**: [] (pure CSS work)

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2)
  - **Blocks**: Tasks 3-7 (they depend on styles)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/app/globals.css:7-48` - Color variable pattern to follow
  - `src/app/concerts/[id]/page.tsx:265` - Current gradient usage pattern
  - Research: 80s synthwave color palette principles (vibrant neon on dark)

  **Acceptance Criteria**:
  - [ ] CSS file created at src/styles/80s-profile.module.css
  - [ ] File contains all required color variables
  - [ ] File contains grid pattern classes
  - [ ] File contains text glow effect classes (.neon-80s)
  - [ ] File contains neon border class (.neon-border)
  - [ ] File contains animated background patterns
  - [ ] CSS validates without syntax errors

  **QA Scenarios**:
  ```
  Scenario 1: CSS file validates
    Tool: Bash (npx stylelint or basic syntax check)
    Steps:
      1. Verify file exists
      2. Check for required color variables
      3. Verify CSS syntax is valid
    Evidence: .sisyphus/evidence/task-1-css-valid.txt
    
  Scenario 2: Grid patterns present
    Tool: grep
    Steps:
      1. Search for repeating-linear-gradient patterns
      2. Verify grid/background classes exist
    Evidence: .sisyphus/evidence/task-1-grid-patterns.txt
  ```

- [x] 2. Analyze current profile page structure

  **What to do**:
  - Read src/app/profile/[id]/page.tsx completely
  - Extract component structure (header, stats, reviews, navigation)
  - Identify all functionality to preserve:
    - Auth/session handling with auth()
    - User data fetching with prisma
    - Follow button integration
    - Reviews display logic
    - Navigation to followers/following
  - Document which sections need visual updates

  **Must NOT do**:
  - Do NOT modify the existing profile page
  - Do NOT change any functionality or logic
  - Do NOT create implementation code yet

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` (detailed analysis needed)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 1)
  - **Blocks**: Tasks 3-7 (needs structure understanding)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/app/profile/[id]/page.tsx` - Full profile page to analyze
  - `src/components/follow-button.tsx` - Follow functionality reference
  - `src/lib/auth.ts` - Session management reference

  **Acceptance Criteria**:
  - [ ] Analysis document created: .sisyphus/drafts/profile-structure-analysis.md
  - [ ] Document lists all major sections (header, stats, reviews, nav)
  - [ ] Document identifies all functionality to preserve
  - [ ] Document maps visual elements to enhance

  **QA Scenarios**:
  ```
  Scenario 1: All functionality identified
    Tool: grep
    Steps:
      1. Verify auth/session handling documented
      2. Verify follow functionality points identified
      3. Verify user stats logic identified
      4. Verify reviews display logic identified
    Evidence: .sisyphus/evidence/task-2-functionality-check.txt
  ```

- [ ] 3. Create retro profile page component

  **What to do**:
  - Create new file: src/app/profile/[id]/retro/page.tsx
  - Copy current profile page logic and structure exactly
  - Import the 80s CSS module from Task 1
  - Apply styling classes to achieve retro aesthetic
  - Maintain ALL functionality exactly as original
  - Update JSX with 80s-themed markup where appropriate
  
  **Must NOT do**:
  - Do NOT remove or change any business logic
  - Do NOT modify underlying data flows
  - Do NOT alter user queries or prisma calls
  - Do NOT change auth/session handling

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` (frontend UI with design)
  - **Skills**: [`playwright`] (for verification)

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Tasks 1, 2 (need CSS and analysis)
  - **Blocks**: Tasks 4-7 (base structure needed first)

  **References**:
  - `src/app/profile/[id]/page.tsx` - Base structure to copy
  - `src/styles/80s-profile.module.css` - Styling from Task 1
  - `.sisyphus/drafts/profile-structure-analysis.md` - Analysis from Task 2
  - `.sisyphus/drafts/retro-profile-implementation-plan.md` - Implementation guide

  **Acceptance Criteria**:
  - [ ] File created at src/app/profile/[id]/retro/page.tsx
  - [ ] Page renders without errors
  - [ ] All profile data displays (name, stats, reviews)
  - [ ] Follow button functional
  - [ ] Navigation links work
  - [ ] All imports correct

  **QA Scenarios**:
  ```
  Scenario 1: Page renders successfully
    Tool: TypeScript compiler (npx tsc --noEmit)
    Steps:
      1. Run typecheck on new file
      2. Verify no compilation errors
    Evidence: .sisyphus/evidence/task-3-typescript-check.txt
    
  Scenario 2: Functionality preserved
    Tool: Playwright (if app running)
    Steps:
      1. Navigate to /profile/test-user/retro
      2. Verify user data displays
      3. Check reviews load
      4. Test follow button
    Evidence: .sisyphus/evidence/task-3-page-render.png
  ```

  **Commit**: NO (group with Task 4)

- [ ] 4. Integrate user stats section with 80s styling

  **What to do**:
  - Update stat cards in retro page to use 80s digital readout aesthetic
  - Apply .neon-border class to stat card containers
  - Use neon-pink/cyan/green colors for stat values
  - Add glow effects that pulse on hover
  - Maintain all stat calculations and data display
  - Preserve navigation links to followers/following
  
  **Must NOT do**:
  - Do NOT change what stats are displayed
  - Do NOT modify stat calculation logic
  - Do NOT alter navigation destinations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 3 (needs base page structure)

  **References**:
  - `src/app/profile/[id]/page.tsx:stat section` - Original stat display
  - `src/styles/80s-profile.module.css` - Styling classes
  - `.sisyphus/drafts/retro-stat-section-plan.md` - Detailed plan

  **Acceptance Criteria**:
  - [ ] Stat cards use 80s styling classes
  - [ ] Neon glow effects applied
  - [ ] Stat values display correctly
  - [ ] Hover effects work
  - [ ] Navigation links functional

  **QA Scenarios**:
  ```
  Scenario 1: Stats display with retro styling
    Tool: Read file + visual inspection
    Steps:
      1. Verify neon classes applied to stat cards
      2. Check stat values render correctly
    Evidence: .sisyphus/evidence/task-4-stats-styled.png
  ```

  **Commit**: YES (with Task 3)
  - Message: `feat(profile): add 80s retro styled profile page`

- [ ] 5. Add background effects and decorations

  **What to do**:
  - Implement animated background grid with perspective lines
  - Add subtle neon particle effects
  - Apply .retro-grid-bg class from CSS module
  - Add scanline overlay effect
  - Ensure effects don't interfere with content readability
  - Optimize for performance (use CSS containment)
  
  **Must NOT do**:
  - Do NOT significantly impact page performance
  - Do NOT interfere with main content visibility
  - Do NOT add complex WebGL/heavy animations

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 3 (needs page structure)

  **References**:
  - `src/styles/80s-profile.module.css` - Background patterns
  - `.sisyphus/drafts/background-effects-plan.md` - Detailed plan
  - `src/app/concerts/[id]/page.tsx:265` - Current background pattern

  **Acceptance Criteria**:
  - [ ] Background grid pattern applied
  - [ ] Animations running smoothly
  - [ ] Content remains readable
  - [ ] Performance acceptable

  **QA Scenarios**:
  ```
  Scenario 1: Background renders without performance issues
    Tool: Playwright + performance check
    Steps:
      1. Measure page load time
      2. Check for frame drops
      3. Verify grid background visible
    Evidence: .sisyphus/evidence/task-5-background.png
  ```

  **Commit**: NO (part of Task 6)

- [ ] 6. Update review listings with retro styling

  **What to do**:
  - Style review cards with 80s aesthetic
  - Apply neon glow effects to review card borders
  - Implement synthwave-style star ratings
  - Use laser-yellow for author names
  - Enhance date/metadata styling with retro touch
  - Maintain all review data and functionality
  
  **Must NOT do**:
  - Do NOT modify review display logic
  - Do NOT change review data structure
  - Do NOT remove any review information

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 3 (needs page structure)

  **References**:
  - `src/app/profile/[id]/page.tsx:review section` - Original review display
  - `src/components/review-card.tsx` - Review card component
  - `src/styles/80s-profile.module.css` - Styling classes
  - `.sisyphus/drafts/retro-review-section-plan.md` - Detailed plan

  **Acceptance Criteria**:
  - [ ] Review cards styled with 80s aesthetic
  - [ ] Star ratings have neon effects
  - [ ] Review data displays correctly
  - [ ] All review functionality preserved

  **QA Scenarios**:
  ```
  Scenario 1: Reviews display with retro styling
    Tool: Read file + verification
    Steps:
      1. Verify neon classes applied to review cards
      2. Check review data renders correctly
      3. Verify star ratings styled
    Evidence: .sisyphus/evidence/task-6-reviews-styled.png
  ```

  **Commit**: NO (part of Task 7)

- [ ] 7. Implement responsive compatibility

  **What to do**:
  - Verify 80s styling works on mobile devices
  - Adjust grid patterns for smaller screens
  - Ensure text remains readable at all sizes
  - Optimize animations for mobile performance
  - Test at breakpoints: 375px (mobile), 768px (tablet), 1024px+ (desktop)
  - Respect prefers-reduced-motion
  
  **Must NOT do**:
  - Do NOT compromise desktop experience
  - Do NOT turn off all animations (just reduce for accessibility)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: All previous tasks (needs full page to test)

  **References**:
  - `src/app/concerts/[id]/page.tsx` - Responsive patterns
  - `src/app/layout.tsx` - Viewport configuration
  - `.sisyphus/drafts/responsiveness-plan.md` - Detailed plan

  **Acceptance Criteria**:
  - [ ] Styling adapts to mobile viewport (375px)
  - [ ] Styling adapts to tablet viewport (768px)
  - [ ] Background effects scale appropriately
  - [ ] Text readable at all sizes
  - [ ] All functionality accessible on mobile

  **QA Scenarios**:
  ```
  Scenario 1: Mobile viewport renders correctly
    Tool: Playwright
    Steps:
      1. Load page at 375x667 viewport
      2. Verify styling adapts
      3. Check text readability
    Evidence: .sisyphus/evidence/task-7-mobile-view.png
    
  Scenario 2: Performance acceptable on mobile
    Tool: Playwright with CPU throttling
    Steps:
      1. Enable CPU throttling
      2. Scroll through page
      3. Monitor performance
    Evidence: .sisyphus/evidence/task-7-performance.json
  ```

  **Commit**: YES
  - Message: `feat(profile): add responsive 80s styling to retro profile page`

---

## Final Verification Wave (ALL run in parallel after Task 7)

- [ ] F1. Page renders without TypeScript errors
  ```bash
  npx tsc --noEmit
  ```
  Must show ZERO errors related to new files

- [ ] F2. ESLint validation passes
  ```bash
  npx eslint src/app/profile/[id]/retro/page.tsx src/styles/80s-profile.module.css
  ```
  Must show ZERO errors

- [ ] F3. Page accessible in browser
  - Navigate to /profile/[valid-user-id]/retro
  - Verify page loads without runtime errors
  - Check console for no errors
  Evidence: .sisyphus/evidence/final-page-accessible.png

- [ ] F4. All functionality works
  - Follow button toggles correctly
  - Stats display accurate values
  - Reviews load and display
  - Navigation links work
  Evidence: .sisyphus/evidence/final-functional-test.mp4

- [ ] F5. Visual design matches 80s aesthetic
  - Neon colors visible (pink #FF007F, cyan #00FFFF, yellow #FFD700)
  - Grid background present
  - Glow effects applied
  - Retro styling evident throughout
  Evidence: .sisyphus/evidence/final-visual-design.png

---

## Success Criteria

1. **Functional**: All original profile features work identically
2. **Visual**: Clear 80s synthwave aesthetic implemented
3. **Performance**: No degradation from original page
4. **Responsive**: Works on all device sizes
5. **Accessible**: Respects motion preferences, maintains contrast ratios

## Evidence Directory

All evidence files stored in: `.sisyphus/evidence/`
- task-1-css-valid.txt
- task-1-grid-patterns.txt
- task-2-functionality-check.txt
- task-3-typescript-check.txt
- task-3-page-render.png
- task-4-stats-styled.png
- task-5-background.png
- task-6-reviews-styled.png
- task-7-mobile-view.png
- task-7-performance.json
- final-page-accessible.png
- final-functional-test.mp4
- final-visual-design.png