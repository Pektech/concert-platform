# Rollback Plan: Remove 80s Retro Profile Feature

## Summary
Remove all 80s synthwave/retro-themed profile modifications and revert the codebase back to the original design. This involves deleting the new `/profile/[id]/retro` route, reverting the CSS module to neutral styling, and removing related components. The original functionality and styling from the main profile page will be preserved.

## Deliverables
- Deleted: `src/styles/80s-profile.module.css`
- Deleted: `src/app/profile/[id]/retro/page.tsx`
- Reverted: Changes in `src/components/user-reviews-list.tsx` to remove retro styling
- Preserved: Normal `/profile/[id]` functionality with original design

---

## Tasks

- [x] 1. Delete the 80s profile styling CSS module

  **What to do**:
  - Remove the file `src/styles/80s-profile.module.css`
  - This module contained all the vintage poster aesthetic styling based on the warm color palette
  - The file contained various paper/texture/ribbon/vintage effects classes

  **Must NOT do**:
  - Do NOT remove any imports in remaining files yet (will be handled in Task 2)
  - Do NOT delete globals.css or any other CSS module

  **Recommended Agent Profile**:
  - **Category**: `quick` (simple file deletion)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 2, Task 3 (remaining files need to be updated afterward)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `src/styles/80s-profile.module.css` - File to delete

  **Acceptance Criteria**:
  - [ ] File `src/styles/80s-profile.module.css` no longer exists
  - [ ] Directory `src/styles/` does not contain the module file

  **QA Scenarios**:
  ```
  Scenario: CSS file is deleted
    Tool: Bash (ls command)
    Steps:
      1. Check that the CSS file no longer exists in src/styles/
    Expected Result: File not found error when checking for the file
    Evidence: .sisyphus/evidence/task-1-file-deleted.txt
  ```

  **Commit**: NO (group with tasks 2-3)

- [x] 2. Delete the retro profile page route

  **What to do**:
  - Remove the entire directory `src/app/profile/[id]/retro/` and its contents
  - This will delete the page.tsx file and effectively eliminate the /profile/[id]/retro route
  - The directory contains the vintage poster profile implementation

  **Must NOT do**:
  - Do NOT delete the parent `src/app/profile/[id]/` directory
  - Do NOT affect the main `src/app/profile/[id]/page.tsx` file

  **Recommended Agent Profile**:
  - **Category**: `quick` (folder deletion)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1 (need to ensure CSS is gone first)
  - **Blocks**: Task 3 (component updates)

  **References**:
  - `src/app/profile/[id]/retro/page.tsx` - File to delete
  - `src/app/profile/[id]/retro/` - Directory to delete

  **Acceptance Criteria**:
  - [ ] Directory `src/app/profile/[id]/retro/` no longer exists
  - [ ] Route `/profile/[id]/retro` is no longer accessible
  - [ ] Parent profile directory remains untouched

  **QA Scenarios**:
  ```
  Scenario: Retro profile route no longer exists
    Tool: Bash (file check)
    Steps:
      1. Check that the retro directory does not exist
    Expected Result: Directory not found error
    Evidence: .sisyphus/evidence/task-2-route-deleted.txt
  ```

  **Commit**: NO (group with tasks 1,3)

- [x] 3. Update the user reviews list component

  **What to do**:
  - Remove the 80s styling imports that are no longer needed
  - Remove retro-specific conditional class additions
  - Update the ReviewListItem and UserReviewsList to only support default styling
  - Remove the 'variant' prop from function signatures
  - Clean up any retro-specific styling patterns

  **Must NOT do**:
  - Do NOT remove any core functionality for displaying reviews
  - Do NOT break the main profile page's ability to display reviews
  - Do NOT delete the component entirely

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` (requires understanding of component structure)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1 & 2 (CSS module and retro page must be removed first)
  - **Blocks**: Task 4 (cleanup verification)

  **References**:
  - `src/components/user-reviews-list.tsx` - Component to update
  - `src/app/profile/[id]/page.tsx` - Main profile page to ensure compatibility
  - Default styling patterns from original component

  **Acceptance Criteria**:
  - [ ] File no longer imports the 80s-profile CSS module
  - [ ] 'variant' prop is removed from functions
  - [ ] Conditional classes related to retro styling are removed
  - [ ] Component successfully compiles with TypeScript
  - [ ] Default user profile page still displays reviews correctly

  **QA Scenarios**:
  ```
  Scenario: Component compiles without errors
    Tool: TypeScript compiler
    Steps:
      1. Run tsc on the project
      2. Verify the component compiles
    Expected Result: No TypeScript errors
    Evidence: .sisyphus/evidence/task-3-ts-check.txt

  Scenario: Component works without retro variant
    Tool: Playwright (browser test)
    Steps:
      1. Visit a user profile page on the website
      2. Verify reviews list displays normally without retro styling
    Expected Result: Reviews show with normal styling, no errors
    Evidence: .sisyphus/evidence/task-3-component-working.png
  ```

  **Commit**: YES (grouping tasks 1-3)
  - Message: `revert: remove 80s retro profile feature`
  - Files: Delete `src/styles/80s-profile.module.css`, Delete `src/app/profile/[id]/retro/`, Update `src/components/user-reviews-list.tsx`

- [x] 4. Verify cleanup and functionality

  **What to do**:
  - Run TypeScript/ESLint checks to ensure no broken imports
  - Test that the original profile page functionality works properly
  - Verify no references remain to deleted files/components
  - Test the main /profile/[id] route still loads correctly

  **Must NOT do**:
  - Do NOT introduce new functionality during verification
  - Do NOT make additional code changes (except fixes for revealed issues)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` (comprehensive validation)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: All previous tasks (needs full cleanup to verify)

  **References**:
  - `src/app/profile/[id]/page.tsx` - Main profile page to test
  - `npx tsc --noEmit` - Type check command
  - `npm run lint` - ESLint check command

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` passes with no errors
  - [ ] `npm run lint` passes with no errors
  - [ ] Profile page accessible at /profile/[valid-user-id]
  - [ ] Reviews list displays normally
  - [ ] No errors about missing imports or undefined styles
  - [ ] All profile functionality preserved

  **QA Scenarios**:
  ```
  Scenario: TypeScript compilation passes
    Tool: TypeScript compiler
    Steps:
      1. Run `npx tsc --noEmit` on the entire project
    Expected Result: No compile errors or warning
    Evidence: .sisyphus/evidence/task-4-tsc-check.txt
    
  Scenario: ESLint passes
    Tool: ESLint
    Steps:
      1. Run `npm run lint` on the project
    Expected Result: No linting errors after cleanup
    Evidence: .sisyphus/evidence/task-4-eslint-check.txt
    
  Scenario: Profile page functions normally
    Tool: Playwright or browser
    Steps:
      1. Load a profile page (e.g. /profile/some-user-id)
      2. Verify all functionality works: user data, reviews, follow button
    Expected Result: Profile page loads and works normally with original styling
    Evidence: .sisyphus/evidence/task-4-profile-page-working.png
  ```

  **Commit**: NO

---

## Final Verification Wave (ALL run in parallel after Task 4)

- [x] F1. Project compiles successfully
  Run `npx tsc --noEmit` to verify no TypeScript errors related to removed files

- [x] F2. ESLint passes without errors
  Run `npm run lint` to verify no linting issues post-removal

- [x] F3. Legacy retro route inaccessible
  Attempt to access `/profile/[user-id]/retro` - should now return 404

- [x] F4. Main profile route functions properly
  Access `/profile/[user-id]` - should display with original styling

- [x] F5. No broken imports or dependencies
  Verify no remaining references to the deleted CSS module or route

---

## Success Criteria

1. **Reverted**: 80s retro profile feature completely removed
2. **Clean**: No broken imports or references to deleted files
3. **Preserved**: Original profile page functionality and styling maintained
4. **Verified**: All checks pass (TypeScript, ESLint, functionality)
5. **Working**: Main profile page displays normally with original aesthetics

---

## ✅ Completion Summary

**Completed:** 2026-03-14  
**Commit:** `dc23ce9` - `revert: remove 80s retro profile feature`

### Changes Made:
- Deleted `src/styles/80s-profile.module.css` (452 lines removed)
- Deleted `src/app/profile/[id]/retro/page.tsx` (230 lines removed)
- Updated `src/components/user-reviews-list.tsx` to remove retro variant support

### Verification:
- ✅ TypeScript compilation passes
- ✅ ESLint passes
- ✅ No remaining references to 80s-profile module
- ✅ No remaining references to retro route
- ✅ Main profile page preserved with original styling