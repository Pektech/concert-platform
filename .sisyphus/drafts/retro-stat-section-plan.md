# Retro Stat Cards Implementation Plan

## Styling Requirements
Transform standard stat cards to 80s digital readout aesthetic while preserving:
- All numerical values and calculations  
- All navigation functionality (href links)
- All conditional display logic

## Visual Modifications Needed

### Card Container
- Replace current bg-white/5 with neon-glass effect
- Use .neon-border class on card edges  
- Add subtle animation on hover (gentle glow pulsation)

### Value Display
- Apply retro-grid-green highlighting to large numbers
- Add .neon-80s text effects to emphasize stats
- Consider pixel-style or retro digital font for numbers

### Label Text
- Match current label structure but add 80s aesthetic
- Use laser-yellow or neon-cyan text (appropriately contrasted)
- Implement gradient text similar to current site but with 80s palette

## HTML/CSS Modifications
Each stat card should implement:
- Outer glassmorphism container (backdrop-blur) with neon accents
- Inner number display with strong neon glow effect
- Label with 80s-style accent text
- Maintained href navigation to related sections
- Preserved conditional rendering based on user relationships

## Functionality Preservation
- [ ] All href links function identically
- [ ] Conditional display logic preserved  
- [ ] Navigation behavior unchanged
- [ ] All stat calculations preserved
- [ ] Error states handled identically