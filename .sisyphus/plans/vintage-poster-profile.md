# Town Poster Style Profile Page Implementation Plan

## Summary
Transform the 80s retro profile page to have the look and feel of a poster plastered around town about a new band. Replace grid/neon effects with vintage poster aesthetics: subtle textures, layered paper look, weathered edges instead of glowing neon. Use your requested warm color palette: #2BAF90, #A1D4B1, #F1A512, #DD4111, #8C0027.

## Deliverables
- Updated: `src/styles/80s-profile.module.css` with poster-style texture aesthetics
- Updated: `src/app/profile/[id]/retro/page.tsx` to use new poster-style classes
- Visual: Vintage poster look reminiscent of flyers on brick walls
- Preserved: All functionality and user experience

---

## Tasks

- [x] 1. Create Poster Texture Styling Module

  **What to do**:
  - Completely update CSS module for poster aesthetic:
  - Create root vars with your warm palette:
    - `--teal-vintage: #2BAF90`
    - `--sage-paper: #A1D4B1` 
    - `--amber-highlight: #F1A512`
    - `--crimson-accent: #DD4111`
    - `--burgundy-shadow: #8C0027`
    - `--poster-bg: #EAE1CA` (light parchment color)
  - Remove all grid effects, neon glows, and scanlines
  - Create poster-appropriate styling with:
    * Paper texture effects using CSS gradients with slight opacity
    * Vintage typography emphasis (strong, bold text with slight shadows)
    * Weathered/aged edges and corners instead of sharp modern borders
    * Subtle layering effects mimicking overlapping posters
    * Aged/stamped look for important elements
  - Implement CSS background patterns like crumpled paper, old wallpaper, etc.
  - Remove animations like gridMove, scanline, etc.

  **Must NOT do**:
  - Do NOT keep any grid patterns
  - Do NOT include any neon glow effect
  - Do NOT include any modern glassmorphism
  - Do NOT maintain 80s synthwave aesthetic

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` 
  - **Skills**: [`playwright` for verification]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: None (standalone implementation)

  **References** (CRITICAL - Be Exhaustive):
  - `src/styles/80s-profile.module.css` - The file to update
  - User requested palette: `#2BAF90`, `#A1D4B1`, `#F1A512`, `#DD4111`, `#8C0027`
  - Poster aesthetics: rough textures, aged paper, weathered look
  - Examples: vintage gig posters, street advertisements from past eras

  **Acceptance Criteria**:
  - [ ] CSS file updated with new palette variables
  - [ ] No neon/glitter/scanline effects in final CSS
  - [ ] All styling creates texture/poster aesthetic
  - [ ] Uses warm color palette requested

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: No neon/glow/scanline effects remain
    Tool: grep
    Steps:
      1. Verify no mention of neon, glow, laser, scan, flicker, grid
      2. Search for terms like text-shadow, box-shadow (verify minimal use for vintage look)
    Expected Result: Only vintage-friendly effects preserved
    Evidence: .sisyphus/evidence/no-neon-effects-verification.txt

  Scenario: CSS contains texture/poster style properties
    Tool: Bash + grep
    Steps:
      1. Verify background patterns/gradients for texture
      2. Check for layered paper effects
      3. Confirm texture-oriented properties present
    Expected Result: Multiple properties supporting poster look
    Evidence: .sisyphus/evidence/texture-effect-verification.txt
  ```

  **Commit**: NO (groups with Task 2)

- [ ] 2. Update Retro Page for Poster Aesthetic

  **What to do**:
  - Remove all references to old neon-based classes
  - Update component with paper/torn edge styling:
    - Replace background patterns with paper/textured effects
    - Add torn or weathered edges to cards
    - Apply warm color palette in appropriate places
    - Maintain all functionality but change visual presentation to poster aesthetic
    - Use typography treatments that look like vintage gig poster fonts
    - Add subtle stamp/watermark effects where appropriate
  - Update class names from old neon-based ones to new poster-themed class names
  - Replace any glowing or modern elements with aged/paper equivalents

  **Must NOT do**:
  - Do NOT keep any neon borders/glowing elements  
  - Do NOT maintain 80s synthwave design
  - Do NOT implement any modern glass or blur effects
  - Do NOT lose any functionality or data presentation

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright` for verification] 

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1 (needs new CSS)

  **References** (CRITICAL - Be Exhaustive):
  - `src/app/profile/[id]/retro/page.tsx` - File to update
  - `src/styles/80s-profile.module.css` - Updated CSS module reference
  - Paper/poster texture examples from vintage gig flyers
  - Maintain functionality while changing visual language completely

  **Acceptance Criteria**:
  - [ ] All outdated neon class names replaced with poster-themed ones
  - [ ] Page presents with vintage poster aesthetic
  - [ ] All functionality preserved
  - [ ] New warm color palette used appropriately

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: No neon-style classes referenced
    Tool: Bash + grep
    Steps:
      1. Verify no neon-related classnames remain
      2. Check for paper/poster class names
    Expected Result: Only vintage poster classes used
    Evidence: .sisyphus/evidence/no-neon-references-verification.txt

  Scenario: Page presents with poster look when viewed
    Tool: Playwright or visual inspection
    Steps:
      1. Load the page in browser
      2. Verify it resembles plastered street poster
      3. Check all elements have texture/paper appearance
    Expected Result: Page looks like vintage gig poster on brick wall
    Evidence: .sisyphus/evidence/poster-aesthetic-verification.png
  ```

  **Commit**: YES
  - Message: `feat: implement vintage poster style profile page`
  - Files: `src/styles/80s-profile.module.css`, `src/app/profile/[id]/retro/page.tsx`

---

## Final Verification Wave 

- [ ] F1. TypeScript validation passes
  Verify `npx tsc --noEmit` produces no errors for updated files

- [ ] F2. Page accessible with poster aesthetic  
  Access `/profile/[valid-user-id]/retro` and verify page loads with textured poster look

- [ ] F3. Vintage poster aesthetic clearly visible
  Verify the weathered paper/brick wall aesthetic is achieved

---

## Success Criteria

1. **Functional**: All original profile features work identically
2. **Visual**: Vintage street poster aesthetic instead of neon grid 
3. **Style**: Uses warm color palette in poster-appropriate context
4. **Texture**: Has appearance of paper/poster plastered to wall
5. **Backward Compatibility**: All user functionality preserved