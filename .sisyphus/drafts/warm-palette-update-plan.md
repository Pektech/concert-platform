# Update Instructions for Warm 80s Palette

## Overview
Modify the existing 80s profile styling to use the warm, balanced color palette:
- Deep Teal: #2BAF90 (original: #FF007F neon pink) 
- Sage Green: #A1D4B1 (original: #00FFFF neon cyan)
- Amber: #F1A512 (original: #FFD700 laser yellow)
- Crimson: #DD4111 (original: #8A2BE2 electric purple)
- Burgundy: #8C0027 (original: #39FF14 retro grid green)

## Files to Update
1. `src/styles/80s-profile.module.css` - Update CSS variables and classes
2. `src/app/profile/[id]/retro/page.tsx` - Update class name references

## Specific Changes Needed

### CSS Module Updates
1. Update root variables in `:root` selector:
   - `--teal-primary: #2BAF90` (replace `--neon-pink-primary`)
   - `--sage-secondary: #A1D4B1` (replace `--neon-cyan-secondary`)
   - `--amber-accent: #F1A512` (replace `--laser-yellow-accent`)
   - `--crimson: #DD4111` (replace `--electric-purple`)
   - `--burgundy: #8C0027` (replace `--retro-grid-green`)

2. Update class names:
   - `.neon-80s` → `.warm-glow-text`
   - `.neon-border` → `.warm-border`

3. Update rgba values in shadows and effects to match warm palette
4. Update grid background from green to burgundy

### Page Component Updates
1. Replace `styles['neon-80s']` with `styles['warm-glow-text']`
2. Replace `styles['neon-border']` with `styles['warm-border']`
3. Update color variant classes accordingly

## Verification Steps
- Verify CSS validates with new color scheme
- Verify page compiles without TypeScript errors
- Verify warm color palette renders correctly
- Ensure all original functionality preserved