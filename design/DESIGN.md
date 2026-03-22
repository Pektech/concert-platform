# Design System Specification: The Electric Venue

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Electric Venue."** 

This system is designed to evoke the visceral energy of a live performance—the transition from the deep, velvet shadows of a dark concert hall to the sudden, piercing pulse of a stage light. We are moving away from the "grid-of-boxes" aesthetic common in social platforms. Instead, we embrace a **High-End Editorial** approach. 

By utilizing intentional asymmetry, overlapping elements (like gig posters bleeding into text containers), and dramatic typographic scales, we create an experience that feels as curated as a limited-edition vinyl. This is not just a database; it is a digital archive of a culture.

---

## 2. Colors: Tonal Depth & The Pulse
The palette is rooted in the "After Hours" experience. We use deep neutrals to establish atmosphere and a singular, vibrant accent to command attention.

### The "No-Line" Rule
**Designers are strictly prohibited from using 1px solid borders to define sections.** 
Structure must be achieved through:
- **Background Shifts:** Use `surface-container-low` (#1c1b1b) against a `surface` (#131313) background to denote a change in context.
- **Negative Space:** Use the Spacing Scale (specifically `10` to `16`) to create mental boundaries.

### Surface Hierarchy & Nesting
To avoid a flat, "digital" look, we use a layering logic based on the surface tokens:
- **Base Layer:** `surface_container_lowest` (#0e0e0e) for the deep background.
- **Content Blocks:** `surface_container` (#201f1f) or `surface_container_high` (#2a2a2a).
- **Nested Elements:** Inner cards or metadata chips should use a slightly higher or lower tier (e.g., a `surface_container_highest` tag inside a `surface_container` card) to create depth without visual noise.

### The Glass & Gradient Rule
- **Glassmorphism:** For floating elements like navigation bars or music players, use `surface_variant` (#353534) at 60% opacity with a `backdrop-filter: blur(20px)`.
- **Signature Gradients:** Main CTAs and Hero sections should utilize a subtle linear gradient from `primary` (#dab9ff) to `primary_container` (#bb86fc) at 135 degrees. This adds a "neon" glow that flat hex codes cannot replicate.

---

## 3. Typography: Editorial Authority
We pair a high-impact, geometric sans-serif for headers with a clean, functional sans-serif for long-form reviews to ensure the brand feels both loud and legible.

- **Display & Headlines (Space Grotesk):** These are your "Lead Singers." Use `display-lg` (3.5rem) for artist names and tour titles. The tight tracking and bold weight should feel like a concert poster.
- **Body & Labels (Inter):** This is your "Session Musician." Use `body-md` (0.875rem) for reviews. The generous line-height in Inter ensures that even long-form concert memories are easy to digest in low-light environments.
- **Visual Hierarchy:** Use `primary` (#dab9ff) for `label-md` to highlight "Must-See" tags or dates, creating a clear path for the eye to follow.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "software-like." We use **Ambient Depth** to maintain the sophisticated night-mode aesthetic.

- **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-low` section sitting on a `surface` background provides a soft, natural lift.
- **Ambient Shadows:** For high-priority floating elements (Modals, Dropdowns), use a shadow with a large blur (32px+) and low opacity (6%). The shadow should be tinted with `on_secondary_fixed` (#25123b) to mimic the way purple stage light diffuses in a dark room.
- **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., an input field), use the `outline_variant` (#4b4452) at **20% opacity**. Never use 100% opaque borders.
- **Glassmorphism Depth:** Elements using glass effects should have a top-down `px` highlight (a 1px inner stroke) using `outline` (#978d9d) at 10% opacity to simulate the edge of a glass pane.

---

## 5. Components

### Buttons
- **Primary:** High-impact. Background: `primary_container` (#bb86fc); Text: `on_primary_fixed` (#2a0053). Use `md` (0.375rem) roundedness.
- **Secondary:** Transparent background with a `Ghost Border`. Text: `primary`.
- **Tertiary:** Text-only with an underline that appears on hover, using `primary`.

### Cards & Lists
- **The "No Divider" Rule:** Never use lines to separate list items. Use a background shift to `surface_container_low` on hover, or use `8` (2rem) of vertical spacing to separate artist entries.
- **Glass Cards:** For featured reviews, use `surface_variant` at 40% opacity with a background blur.

### Chips (Genre/Status)
- Use `full` roundedness (Pill shape).
- **Selection Chips:** `secondary_container` (#54406c) with `on_secondary_container` (#c7aee2) text.

### Input Fields
- Use `surface_container_highest` for the field background. 
- Avoid boxes; use a bottom-only "Ghost Border" to feel more like a modern editorial form.

### Specialized Components
- **The Setlist Module:** A vertical timeline using `primary` dots connected by a 20% opacity `primary` line.
- **The "Vibe" Meter:** A custom slider using a gradient track from `primary_container` to `tertiary` (#d4ca38).

---

## 6. Do's and Don'ts

### Do:
- **Embrace the Dark:** Allow the `surface_container_lowest` (#0e0e0e) to dominate the screen. Black space is premium space.
- **Use Large Type:** Don't be afraid to let a header take up 40% of the viewport height in a hero section.
- **Soft Interactions:** Use 300ms transitions for hover states to mimic the fading of lights.

### Don't:
- **No Pure White:** Never use #FFFFFF. Use `on_surface` (#e5e2e1) for text to prevent eye strain.
- **No Sharp Corners:** Avoid the `none` roundedness scale. Even the most "brutal" element should have at least `sm` (0.125rem) rounding to feel sophisticated.
- **No Default Grids:** Don't align everything to a rigid center. Try offsetting an image to the left and text to the right-center to create a dynamic, magazine-style layout.

### Accessibility Note:
Ensure that all `primary` text on `surface` backgrounds maintains a contrast ratio of at least 4.5:1. Use `primary_fixed_dim` (#dab9ff) for smaller labels to ensure readability against the dark charcoal base.