# Change Instructions for Vintage Poster Style

## Overview
Completely transform the styling from 80s synthwave/grid/neon to vintage poster aesthetic:
- Replace grid backgrounds with parchment/paper textures
- Replace neon glows with weathered, torn paper edges  
- Replace sharp glassmorphism with aged, poster-on-brick-wall look
- Use requested warm palette but in vintage poster context
- Achieve appearance like concert flyers plastered around town

## Files to Update
1. `src/styles/80s-profile.module.css` - Complete visual overhaul
2. `src/app/profile/[id]/retro/page.tsx` - Update class name references

## Specific Changes Needed

### CSS Module Updates - Complete Overhaul
1. Remove all grid patterns, scanlines, neon effects
2. Replace with vintage paper/textures:
   - Parchment-like base backgrounds
   - Torn/aged edge effects  
   - Subtle paper fibers texture
   - Weathered/stamped appearance for important sections
3. Update variables to warm poster-friendly palette:
   - `--teal-vintage: #2BAF90`
   - `--sage-paper: #A1D4B1`
   - `--amber-highlight: #F1A512` 
   - `--crimson-accent: #DD4111`
   - `--burgundy-shadow: #8C0027`
4. Remove ALL animations like gridMove, scanlineFlicker, neonFlicker
5. Implement background patterns that look like brick walls, old stone, etc.

### Page Component Updates
1. Replace ALL class name references to match new aesthetic
2. Remove any references to neon/glow/80s styling
3. Update the visual presentation to match vintage poster aesthetic
4. Keep all functionality exactly the same

## Verification Steps
- No neon/80s effects remain in final implementation
- Page has vintage poster-on-brickwall appearance
- All original functionality works identically
- Used warm color palette in appropriate vintage context