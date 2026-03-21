# Encore Noir: Design Guidelines & Visual Strategy

This document outlines the visual identity for **Electric Venue**, a concert-focused social platform. The "Encore Noir" system is designed to evoke the atmosphere of a dark, high-energy concert venue.

## 1. Color Palette

### Primary (Electric Accent)
- **Neon Purple / Lavender:** `#BB86FC`
  - **Usage:** Primary action buttons (CTAs), active states in navigation, progress bars, and key interactive elements.
  - **Hover/Pressed:** `#DAB9FF` (lighter tint for feedback).

### Neutral (The Void)
- **Deep Black (Surface 0):** `#0E0E0E` / `#131313`
  - **Usage:** Global background, main app shell.
- **Charcoal (Surface 1):** `#1C1B1B`
  - **Usage:** Card backgrounds, search bars, and distinct UI sections.
- **Medium Gray (Surface 2):** `#353534`
  - **Usage:** Borders, inactive button states, and subtle container overlays.

### Typography & Content
- **Pure White / Bone:** `#E5E2E1`
  - **Usage:** Primary headings and main body text.
- **Muted Lavender / Inactive:** `#978D9D`
  - **Usage:** Secondary text, labels, and inactive navigation items.

---

## 2. Typography Guidelines

The typography in Encore Noir is designed to be bold, modern, and highly readable against dark backgrounds, mimicking the high-impact aesthetic of gig posters.

### Primary Font: Space Grotesk
- **Characteristics:** A quirky, high-contrast sans-serif with a technical yet human feel.
- **Usage:** Used for all major headings, brand identity, and high-impact UI elements.
- **Styles:**
  - **Display (H1):** 48px+ | Bold/Black | Tight Tracking (-0.02em). Used for hero sections and page titles.
  - **Headline (H2/H3):** 24px-32px | Bold | Normal Tracking. Used for section headers.
  - **UI Labels:** 12px-14px | Semi-Bold | Uppercase with Letter Spacing (0.1em). Used for navigation and small labels.

### Secondary Font: Inter (or System Sans)
- **Characteristics:** Clean, neutral, and optimized for screen readability.
- **Usage:** Used for long-form body text, user reviews, and detailed metadata.
- **Styles:**
  - **Body:** 16px | Regular | Line Height 1.5. Used for general content.
  - **Caption:** 12px | Regular | Muted Color (#978D9D). Used for secondary details.

---

## 3. Design Principles

- **High Contrast:** Text and iconography must always maintain high contrast against the dark background.
- **Depth through Layering:** Instead of shadows, depth is created by moving from darker surfaces (background) to slightly lighter surfaces (cards/modals).
- **Neon Glow:** Accents are often used with subtle glows to mimic stage lighting.
- **Bold Visual Hierarchy:** Large, uppercase headings in Space Grotesk define the structure of every page.

---

## 4. Interactive Elements & Behaviors

To ensure a consistent and tactile feel across Electric Venue, all interactive components must adhere to the following specifications:

### Buttons
- **Primary Action:**
  - **Style:** Background `#BB86FC`, Text `#0E0E0E` (for contrast), Space Grotesk Bold, 4px border radius.
  - **Hover:** Background `#DAB9FF`, subtle outer glow (0px 0px 12px rgba(187, 134, 252, 0.4)).
  - **Active:** Scale down to 95%, opacity 90%.
- **Secondary Action:**
  - **Style:** Border 1px solid `#353534`, Transparent background, Text `#E5E2E1`.
  - **Hover:** Background `#353534` at 20% opacity, Border `#978D9D`.
  - **Active:** Scale down to 98%.

### Navigation & Links
- **Primary Links:** Text `#BB86FC`. Underlined on hover with a 2px offset.
- **Secondary/Nav Links:** Text `#E5E2E1` at 70% opacity. Transition to 100% opacity and `#BB86FC` on hover.
- **Active State:** Text `#BB86FC` with a 2px bottom border (indicator).

### Form Inputs
- **Text Inputs & Textareas:**
  - **Background:** Surface 1 (`#1C1B1B`).
  - **Border:** 1px solid `#353534`.
  - **Focus State:** Border color shifts to `#BB86FC` with a soft lavender glow effect. Text becomes high-contrast `#E5E2E1`.
  - **Placeholder:** Text `#978D9D` at 50% opacity.

### Icons & States
- **Library:** Material Symbols (Rounded) for a modern, accessible feel.
- **Inactive/Default:** `#978D9D`.
- **Primary Action/Hover:** `#BB86FC`.
- **Alert/Error:** `#CF6679`.