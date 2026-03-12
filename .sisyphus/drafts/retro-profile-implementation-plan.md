# Retro Profile Page Implementation Plan

## Component Structure
Based on src/app/profile/[id]/page.tsx, implement new version at src/app/profile/[id]/retro/page.tsx

## Required Imports to Retain
Same as original - preserve all current imports for functionality
'@/lib/auth' - for session management
'@/lib/prisma' - for data fetching
'use client' - all client components  
'next/navigation' - for routing
All current UI component imports

## Data Fetching Logic
EXACTLY the same as original page:
- Get session data using auth()
- Fetch user with stats using prisma
- Fetch user's reviews using prisma
- Preserve all conditional logic around ownership

## JSX Structure Changes Needed
### Header Area
- Use neon-pink/cyan gradients instead of current purple
- Apply .neon-80s class to user name typography
- Update FollowButton styling to match 80s aesthetic  

### Stat Grid
- Use retro styled StatCard components
- Apply .neon-border to stat cards
- Add retro-grid-green accents

### Reviews Section  
- Apply 80s-themed ReviewCard components
- Add background animation to reviews container
- Keep all interactive elements functional

### Navigation Links
- Style follower/following links with laser-yellow accents
- Maintain all existing functionality

## Functionality Preservation Checklist
- [ ] Follow button works identically
- [ ] Owner profile checks work identically  
- [ ] Navigation to followers/following preserved
- [ ] User stats calculation unchanged
- [ ] Session checking preserved
- [ ] Error handling maintained