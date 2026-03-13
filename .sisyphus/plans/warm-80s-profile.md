# Update 80s Profile Styling to Warm Balanced Palette

## Summary
Replace the harsh neon colors in the 80s CSS module with the warmer, more balanced palette requested:
- Deep Teal: #2BAF90 (instead of neon pink)
- Sage Green: #A1D4B1 (instead of cyan)
- Amber: #F1A512 (instead of laser yellow)  
- Crimson: #DD4111 (instead of electric purple)
- Burgundy: #8C0027 (instead of retro grid green)

## Deliverables
- Modified: `src/styles/80s-profile.module.css` with updated color palette
- Modified: `src/app/profile/[id]/retro/page.tsx` to use new class names
- Preserved: All 80s aesthetic elements (grids, glow effects, animations)

---

## Tasks

- [ ] 1. Update 80s CSS module with warm color palette

  **What to do**:
  - Replace CSS root variables with new warm palette:
    - --teal-primary: #2BAF90 (instead of --neon-pink-primary)
    - --sage-secondary: #A1D4B1 (instead of --neon-cyan-secondary) 
    - --amber-accent: #F1A512 (instead of --laser-yellow-accent)
    - --crimson: #DD4111 (instead of --electric-purple)  
    - --burgundy: #8C0027 (instead of --retro-grid-green)
  - Rename classes from `.neon-border` to `.warm-border` and `.neon-80s` to `.warm-glow-text`
  - Update all rgba values in box-shadow and text-shadow to match new colors
  - Update grid background to use burgundy instead of green
  - Maintain all animations (glowFlicker, gridMove, scanlineMove)

  **Must NOT do**:
  - Change any existing functionality
  - Remove animations or effects
  - Modify original globals.css

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/styles/80s-profile.module.css` - Original file to update
  - Hex values from user request: #2BAF90, #A1D4B1, #F1A512, #DD4111, #8C0027

  **Acceptance Criteria**:
  - [ ] CSS validates with new color palette
  - [ ] All variables updated with warm colors
  - [ ] New class names properly implemented
  - [ ] All rgba shadow values updated correctly

  **QA Scenarios**:
  ```
  Scenario: CSS file updated with warm colors
    Tool: Bash (grep to verify colors)
    Steps:
      1. Check that new variables are in :root
      2. Verify all rgba values updated
      3. Confirm classes renamed appropriately
    Evidence: .sisyphus/evidence/warm-palette-update.txt

  Scenario: CSS compiles without errors  
    Tool: npx tsc --noEmit
    Steps:
      1. Run validation on the CSS file
      2. Check for syntax errors
    Evidence: .sisyphus/evidence/css-validation.txt
  ```

- [ ] 2. Update retro profile page to use new class names

  **What to do**:
  - Replace all usage of:
    - `styles['neon-80s']` with `styles['warm-glow-text']`
    - `styles['neon-border']` with `styles['warm-border']` 
    - `styles['retro-grid-bg']` stays the same
  - Update color variant classes from `.pink`, `.cyan`, `.yellow`, `.purple`, `.green` to the new color names in class strings  
  - Verify all instances throughout file (user name, headers, cards, stats)

  **Must NOT do**:
  - Change any functionality or logic
  - Modify data fetching or business logic
  - Remove any sections or components

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1

  **References**:
  - `src/app/profile/[id]/retro/page.tsx` - File to update
  - `src/styles/80s-profile.module.css` - New class names reference

  **Acceptance Criteria**:
  - [ ] All old class names replaced with new ones
  - [ ] File compiles without errors
  - [ ] Color variant classes updated appropriately
  - [ ] All functionality still works

  **QA Scenarios**:
  ```
  Scenario: All class names updated properly
    Tool: grep
    Steps:
      1. Verify no more neon-80s classes remain
      2. Verify no more neon-border classes remain
      3. Confirm warm-border and warm-glow-text are in use
    Evidence: .sisyphus/evidence/class-name-update.txt
    
  Scenario: Page compiles without errors
    Tool: TypeScript compiler
    Steps:
      1. Verify TypeScript still compiles
    Evidence: .sisyphus/evidence/ts-compile-check.txt
  ```

---

## Final Verification Wave

- [ ] F1. Page renders without TypeScript errors
  ```bash
  npx tsc --noEmit
  ```

- [ ] F2. New styling visible when accessing /profile/[user-id]/retro
  - Navigate to retro profile page
  - Verify warmer, less neon color palette
  - All original functionality intact

---

## Success Criteria

1. **Functional**: All original profile features work identically
2. **Visual**: Warmer, more balanced 80s aesthetic using requested color palette
3. **Performance**: No degradation from original
4. **Compatibility**: All existing functionality preserved
