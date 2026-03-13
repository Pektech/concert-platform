# 80s Profile Warm Palette Implementation Plan

## Summary
Update the existing 80s retro profile styling to use a warmer, more balanced color palette that maintains the 80s aesthetic but is less harsh/neon. Replace neon colors with the warmer palette requested: #2BAF90 (teal), #A1D4B1 (sage), #F1A512 (amber), #DD4111 (crimson), #8C0027 (burgundy).

## Deliverables
- Updated: `src/styles/80s-profile.module.css` with warm color palette
- Updated: `src/app/profile/[id]/retro/page.tsx` to use new class names
- Preserved: All 80s aesthetic elements (grids, glow effects, animations, structure)

---

## Tasks

- [ ] 1. Update CSS module to warm color palette

  **What to do**:
  - Change CSS root variables:
    - `--teal-primary: #2BAF90` (was: `--neon-pink-primary: #FF007F`)
    - `--sage-secondary: #A1D4B1` (was: `--neon-cyan-secondary: #00FFFF`) 
    - `--amber-accent: #F1A512` (was: `--laser-yellow-accent: #FFD700`)
    - `--crimson: #DD4111` (was: `--electric-purple: #8A2BE2`)
    - `--burgundy: #8C0027` (was: `--retro-grid-green: #39FF14`)
  - Rename classes:
    - `.neon-80s` → `.warm-glow-text`
    - `.neon-border` → `.warm-border`
  - Update rgba values in box-shadow/text-shadow to match new colors
  - Update grid background to burgundy color
  - Maintain all animations and structure
  
  **Must NOT do**:
  - Do NOT break existing functionality
  - Do NOT change CSS structure significantly
  - Do NOT remove animations or visual effects

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` 
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: None (independent change)

  **References** (CRITICAL - Be Exhaustive):
  - `src/styles/80s-profile.module.css` - The file to update
  - User requested palette: `#2BAF90`, `#A1D4B1`, `#F1A512`, `#DD4111`, `#8C0027`
  - Current structure patterns in existing CSS module

  **Acceptance Criteria**:
  - [ ] CSS file updated with new color variables
  - [ ] Class names updated correctly (neon-80s → warm-glow-text, neon-border → warm-border)
  - [ ] All rgba references updated to match warm palette
  - [ ] All animations preserved
  - [ ] CSS syntax valid

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Updated CSS has correct color values
    Tool: Bash + grep
    Steps:
      1. Verify new variables present in :root
      2. Check rgba values updated correctly
      3. Confirm all color values match requested palette
    Expected Result: All five new color values present
    Evidence: .sisyphus/evidence/css-color-update-verifcation.txt

  Scenario: CSS contains new class names
    Tool: grep
    Steps:
      1. Verify old .neon-80s classes renamed to .warm-glow-text
      2. Verify old .neon-border classes renamed to .warm-border
    Expected Result: No old class names remain, new class names present
    Evidence: .sisyphus/evidence/css-class-rename-verification.txt
  ```

  **Commit**: NO (groups with Task 2)

- [ ] 2. Update retro page to use new class names  

  **What to do**:
  - Replace all instances of:
    - `styles['neon-80s']` → `styles['warm-glow-text']`
    - `styles['neon-border']` → `styles['warm-border']`
  - Keep `styles['retro-grid-bg']` as is (only color change via CSS)
  - Update color selectors within class strings where used
  - Verify all references throughout the page code
  
  **Must NOT do**:
  - Do NOT modify any functionality or data flows
  - Do NOT change business logic
  - Do NOT break any existing feature

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright` for verification] 

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1 (needs updated CSS)

  **References** (CRITICAL - Be Exhaustive):
  - `src/app/profile/[id]/retro/page.tsx` - File to update
  - `src/styles/80s-profile.module.css` - Updated CSS module reference
  - Existing structure in retro page for pattern consistency

  **Acceptance Criteria**:
  - [ ] All old class names replaced with new ones
  - [ ] Page compiles without errors
  - [ ] No functionality broken
  - [ ] All instances updated throughout file

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: JavaScript class name references updated
    Tool: Bash + grep
    Steps:
      1. Verify no more 'neon-80s' references remain
      2. Verify all 'neon-border' replaced with 'warm-border'
      3. Verify correct use of new 'warm-glow-text' and 'warm-border' classes
    Expected Result: All outdated class references updated
    Evidence: .sisyphus/evidence/ts-class-reference-update.txt

  Scenario: Page compiles without errors after changes
    Tool: TypeScript compiler
    Steps:
      1. Run TypeScript validation
      2. Check for compilation errors
    Expected Result: Page compiles without errors
    Evidence: .sisyphus/evidence/typescript-compilation-success.txt
  ```

  **Commit**: YES
  - Message: `feat(styles): update 80s profile to warm balanced color palette`
  - Files: `src/styles/80s-profile.module.css`, `src/app/profile/[id]/retro/page.tsx`

---

## Final Verification Wave 

- [ ] F1. TypeScript validation passes
  Verify `npx tsc --noEmit` produces no errors for updated files

- [ ] F2. Page accessible and functioning  
  Access `/profile/[valid-user-id]/retro` and verify page loads with new styling

- [ ] F3. Warm color palette visible and consistent
  Verify the new colors (#2BAF90, #A1D4B1, etc.) are applied throughout page

---

## Success Criteria

1. **Functional**: All original profile features work identically
2. **Visual**: Warmer, more balanced 80s aesthetic implemented  
3. **Accessibility**: Improved color balance vs harsh neons
4. **Backward Compatibility**: All existing functionality preserved