# Retro Review Cards Implementation Plan

## Styling Requirements
Transform existing review cards to synthwave aesthetic while preserving all functionality:
- All review data display (rating, text, author, concert details) 
- All interactivity (like buttons, editing, deletion for owner)
- All navigation (links to concert, user profile)

## Visual Modifications

### Card Container  
- Apply neon-glassmorphism effect (similar to main background but with card structure)
- Add .neon-border glow effect to card edges
- Implement subtle pulsating glow on hover
- Use dark base with colorful accent borders

### Star Rating Display
- Transform standard star display to neon-lit version
- Use gradient colors from 80s palette (pink-to-cyan)
- Add glow effects that intensify on hover
- Consider subtle animation when ratings update

### Content Area
- Apply subtle CRT-texture style to review text area
- Use appropriate contrast colors from 80s palette for text readability
- Add retro-grid-green highlight to setlist highlights section  
- Preserve all typography hierarchy while enhancing with neon touches

### Author/Concert Information
- Apply 80s-style typography to user/concert names
- Use laser-yellow for author names
- Apply neon glow effects to concert details
- Maintain all navigation links to user/concert profiles

## Functionality Preservation 
- [ ] All interactive elements preserved (edit/delete/like)
- [ ] All navigation links preserved (to concerts/users)
- [ ] All review metadata preserved and displayed
- [ ] All conditional rendering (owner controls, etc.) preserved
- [ ] All error states handled identically