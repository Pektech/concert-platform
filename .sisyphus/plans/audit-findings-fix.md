# ConcertVibe Codebase Audit Fixes Work Plan

## TL;DR

> **Quick Summary**: Fix critical TypeScript compilation and broken navigation issues in preparation for main branch merge 
> 
> **Deliverables**: 
> - TypeScript compilation errors fixed
> - Broken navigation links resolved
> - Linting errors addressed 
> - Unused imports cleaned up
> 
> **Estimated Effort**: Short (requires implementation of fixes identified in audit)
> **Parallel Execution**: NO - sequential fixes needed due to interdependencies

---

## Context

### Original Request
Codebase audit revealing critical issues before merging to main branch, including TypeScript errors, navigation issues, and linting errors.

### Audit Summary
Comprehensive audit identified several blocking issues preventing successful merge to main branch, focusing on TypeScript compilation, navigation integrity, code quality, and linting compliance.

---

## Work Objectives

### Core Objective
Resolve all critical audit findings to ensure smooth compilation and proper navigation before main branch deployment

### Concrete Deliverables
- Fixed TypeScript compilation error in artist concerts API route
- Corrected broken navigation links in the feed page
- Implemented linting compliance fixes
- Cleaned up unused imports/variables
- Created missing artist detail page (planned as feature)

### Definition of Done
- [ ] TypeScript compilation passes `npx tsc --noEmit` without errors
- [ ] All navigation links resolve to valid routes
- [ ] ESLint passes all checks without errors
- [ ] No dead code or unused imports remain
- [ ] Build completes successfully

### Must Have
- Fix MusicBrainz API date property type error
- Fix broken links causing 404 in feed functionality
- Resolve all linting violations

### Must NOT Have (Guardrails)
- No original functionality compromised in the process
- No breaking changes to existing APIs
- No new dependencies introduced

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: Yes (ESLint, TypeScript)
- **Automated tests**: Tests-after approach
- **Framework**: No additional unit tests required
- **If TDD**: Not applicable for this refactoring work

### QA Policy
Every task MUST include agent-executed QA scenarios to verify:

- **TypeScript Compilation**: Run `npx tsc --noEimt` and verify no errors
- **Linting**: Run `npm run lint` and verify success
- **Navigation**: Execute each link path that was affected as end-to-end navigation test
- **Building**: Run `npm run build` and verify success

---

## Execution Strategy

### Sequential Execution Needed

Due to the nature of the fixes being largely interconnected dependencies:

```
Wave 1 (Immediate Foundation Fix):
├── Task 1: Fix TypeScript compilation issue in artist concerts route
├── Task 2: Fix linting issues in concert search page 
└── Task 3: Clean up unused import in login form

Wave 2 (Navigation Integrity):
├── Task 4: Fix broken links in feed page
└── Task 5: Comprehensive build test

Wave Final (Verification):
├── Task F1: TypeScript compilation verification
├── Task F2: Linting verification
├── Task F3: End-to-end navigation testing  
└── Task F4: Build verification
```

### Agent Dispatch Summary

- **Wave 1**: 3 tasks -> `quick`, `quick`, `quick`
- **Wave 2**: 2 tasks -> `quick`, `deep`  
- **Final**: 4 tasks -> `unspecified-high`, `unspecified-high`, `unspecified-high`, `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [ ] 1. Fix TypeScript Compilation Error

  **What to do**:
  - Modify `/src/app/api/artists/[mbid]/concerts/route.ts`
  - Replace `date: event.date` on line 24 with proper date construction
  - According to MBEvent type, dates are stored in separate year/month/day fields

  **Must NOT do**:
  - Change other functionality or structure of the API route
  - Introduce new date formatting logic without checking for existing utilities

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Simple property mapping update, follows Next.js API Route patterns
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed - simple file modification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1, starts immediately
  - **Blocks**: Task 5 (build test)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/lib/musicbrainz-db.ts:47-65` - MBEvent interface shows date fields are stored as `year`, `month`, `day` separately (not a single date property)

  **API/Type References** (contracts to implement against):
  - `src/app/api/artists/[mbid]/concerts/route.ts:22-32` - current map function that needs date fix

  **WHY Each Reference Matters** (explain the relevance):
  - Need to verify the MBEvent interface in musicbrainz-db.ts to understand the correct field names for date construction
  - Look at the existing mapping pattern in route.ts to follow the same structure

  **Acceptance Criteria**:
  - [ ] Modified route.ts to properly handle date with `year/month/day` fields
  - [ ] `npx tsc --noEmit` runs successfully without error on this file

  **QA Scenarios (MANDATORY):**
  
  ```
  Scenario: TypeScript compilation test after date fix
    Tool: Bash (npx tsc --noEmit)
    Preconditions: TypeScript fix complete in route.ts
    Steps:
      1. Run `npx tsc --noEmit` in project root
      2. Verify command exits with code 0 (no errors)
      3. If errors remain, identify which TypeScript issues remain unfixed
    Expected Result: TypeScript compilation completes with zero errors
    Failure Indicators: Any remaining TypeScript compilation errors reported
    Evidence: .sisyphus/evidence/task-1-typecheck-success.log

  Scenario: Proper date construction in API response
    Tool: Bash (node test)
    Preconditions: TypeScript compilation pass
    Steps:
      1. Create test script that imports the map function logic
      2. Simulate an MBEvent object with year: 2024, month: 4, day: 15
      3. Verify the resulting date field is properly constructed (e.g., "2024-04-15")
    Expected Result: Date field properly constructed from year/month/day components
    Evidence: .sisyphus/evidence/task-1-date-construction-test.log
  ```

  **Evidence to Capture**:
  - [ ] TypeScript compilation log indicating success
  - [ ] Test output confirming date construction accuracy

  **Commit**: YES
  - Message: `fix(api): correct date field mapping in concerts route`
  - Files: src/app/api/artists/[mbid]/concerts/route.ts
  - Pre-commit: `npx tsc --noEmit`

- [ ] 2. Fix Linting Issues in Search Page

  **What to do**:
  - Update `/src/app/concerts/search/page.tsx` to address unescaped apostrophes
  - Replace `<a href="/">` with Next.js `<Link />` component as required by Next.js

  **Must NOT do**:
  - Change any functional behavior of the search page
  - Modify other parts of the component unnecessarily

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Standard JSX escaping fixes and Next.js Link implementation
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed - simple text fixes in existing JSX

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential with other type/linting fixes)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5 (build test)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  > The executor has NO context from your interview. References are their ONLY guide.
  > Each reference must answer: "What should I look at and WHY?"

  **Pattern References** (existing code to follow):
  - `src/app/concerts/search/page.tsx` - examine current Link import pattern to copy
  - Other pages in codebase showing proper apostrophe handling patterns

  **API/Type References** (contracts to implement against):
  - `eslint.config.mjs` - ESLint configuration showing current rules

  **Test References** (testing patterns to follow):
  - `package.json:lint` script that identifies current violations

  **WHY Each Reference Matters** (explain the relevance):
  - Need to properly import and use Link components following consistent patterns
  - Understanding current ESLint config helps address the specific violations

  **Acceptance Criteria**:
  - [ ] npm run lint completes without errors on search page
  - [ ] All apostrophes converted to proper HTML entities
  - [ ] External-facing anchor tags remain as `<a>`, but internal as `<Link>`

  **QA Scenarios (MANDATORY):**
  
  ```
  Scenario: Linting passes after fix
    Tool: Bash (npm run lint)
    Preconditions: Apostrophes and link tags fixed
    Steps:
      1. Run `npm run lint` command
      2. Check output for no more "unescaped-entities" errors
      3. Check output for no more "no-html-link-for-pages" errors on internal links
    Expected Result: ESLint passes without errors or warnings on the modified file
    Failure Indicators: Any ESLint errors after applying fixes
    Evidence: .sisyphus/evidence/task-2-lint-success.log

  Scenario: Proper apostrophe HTML entity replacement
    Tool: Bash (grep)
    Preconditions: Apostrophes changed to HTML entities
    Steps:
      1. Grep for remaining apostrophe characters in the file
      2. Confirm they are either properly escaped entities or legitimate in strings
    Expected Result: Apostrophes in JSX text are properly replaced with entities
    Evidence: .sisyphus/evidence/task-2-apostrophe-fix.log
  ```

  **Evidence to Capture**:
  - [ ] ESLint verification output
  - [ ] Confirmation that all apostrophes are properly escaped

  **Commit**: YES
  - Message: `fix(lint): resolve apostrophe and link violations in search page`
  - Files: src/app/concerts/search/page.tsx
  - Pre-commit: `npm run lint`

- [ ] 3. Clean Up Unused Imports

  **What to do**:
  - Modify `/src/components/login-form.tsx` to remove unused useEffect import
  
  **Must NOT do**:
  - Change any functional logic in the login form
  - Remove other imports that are being used

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Removing a single character in an import statement
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (standalone cleanup task)
  - **Parallel Group**: Wave 1
  - **Blocks**: Build verification task
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/components/login-form.tsx` line 3 - examine the current import structure

  **Acceptance Criteria**:
  - [ ] Unused useEffect import removed
  - [ ] TypeScript compilation still passes
  - [ ] Component functionality remains unchanged

  **QA Scenarios (MANDATORY):**
  
  ```
  Scenario: TypeScript compilation after removing unused import
    Tool: Bash (npx tsc --noEmit)
    Preconditions: Unused import removed from login-form.tsx
    Steps:
      1. Run `npx tsc --noEmit` in project root
      2. Verify no new type errors emerged
    Expected Result: TypeScript compilation still passes completely
    Failure Indicators: New type errors after removing import
    Evidence: .sisyphus/evidence/task-3-tsc-after-import-removal.log

  Scenario: Functionality verification after import cleanup
    Tool: Playwright or manual test (navigation)
    Preconditions: Build completed after fix
    Steps:
      1. Start development server
      2. Navigate to login page
      3. Verify the login form still functions correctly
    Expected Result: Login form renders and operates without issues
    Evidence: .sisyphus/evidence/task-3-login-still-functional.log
  ```

  **Evidence to Capture**:
  - [ ] TypeScript compilation after cleanup
  - [ ] Navigation verification that login still works

  **Commit**: YES
  - Message: `chore: remove unused useEffect import in login form`
  - Files: src/components/login-form.tsx
  - Pre-commit: `npm run lint`

- [ ] 4. Fix Broken Navigation in Feed Page

  **What to do**:
  - Update `/src/app/feed/page.tsx` to change broken `/browse` links to working `/reviews` links
  - Addresses lines 86 and 107 in the component

  **Must NOT do**:
  - Alter the overall structure or intent of the feed component
  - Make significant UI/UX changes beyond fixing the navigation destination

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Simple link path updates (property changes)
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed - straightforward navigation URL fix

  **Parallelization**:
  - **Can Run In Parallel**: NO (blocks successful navigation testing)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task F3 (navigation testing)
  - **Blocked By**: Wave 1 (compilation fixes)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/app/feed/page.tsx` - review current link patterns and structure to maintain consistency
  - `src/app/reviews/page.tsx` - verify target route exists with proper functionality

  **Acceptance Criteria**:
  - [ ] Link routes changed from `/browse` to `/reviews` 
  - [ ] Feed page builds without breaking
  - [ ] Links navigate to existing reviews page correctly

  **QA Scenarios (MANDATORY):**
  
  ```
  Scenario: Fixed navigation links work properly
    Tool: Playwright (interactive)
    Preconditions: Fixed feed page built successfully
    Steps:
      1. Navigate to feed page at `/feed`
      2. Click on or simulate clicks on both former "/browse" links
      3. Verify navigation occurs to `/reviews` page
      4. Verify `/reviews` page loads as expected
    Expected Result: Links navigate users from feed to reviews page with no 404 errors
    Failure Indicators: Navigation to non-existent route or unexpected routing behavior
    Evidence: .sisyphus/evidence/task-4-navigation-test-result.png

  Scenario: UI behavior after link fixes
    Tool: Interactive navigation 
    Preconditions: Fixed links implemented 
    Steps:
      1. Visit feed page and verify it renders properly
      2. Check that link text appropriately reflects destination page
      3. Test other functionality on feed page works normally
    Expected Result: Feed page behaves as before but navigation links now work properly
    Evidence: .sisyphus/evidence/task-4-feed-behavior-check.log
  ```

  **Evidence to Capture**:
  - [ ] Navigation test confirming links work correctly
  - [ ] UI verification that page still functions as expected

  **Commit**: YES
  - Message: `fix(nav): update broken links from /browse to /reviews`
  - Files: src/app/feed/page.tsx
  - Pre-commit: Manual test of links

- [ ] 5. Build Verification After Core Changes

  **What to do**:
  - Attempt full build of the application after implementing core fixes
  - May need to adjust build script or environment to handle Prisma migration requirement

  **Must NOT do**:
  - Attempt to deploy or push to remote (only local build verification)
  
  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `deep`
    - Reason: May need to handle environment-specific build process challenges
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (verification task after implementation)
  - **Parallel Group**: Wave 2 (final verification step)
  - **Blocks**: None (final verification)
  - **Blocked By**: All fixes from Wave 1 and 2

  **References** (CRITICAL - Be Exhaustive):

  **API/Type References** (contracts to implement against):
  - `package.json:build` script showing the build workflow
  - `prisma.schema` - for understanding migration requirements

  **Acceptance Criteria**:
  - [ ] `npm run build` attempts to complete successfully
  - [ ] Adjusted build process to handle local/development environment vs production
  - [ ] Build output indicates successful static generation of pages

  **QA Scenarios (MANDATORY):**
  
  ```
  Scenario: Successful build after all fixes
    Tool: Bash (npm run build)
    Preconditions: All previous fixes implemented
    Steps:
      1. Run `npm run build` command
      2. Observe build process and output
      3. If Prisma error occurs, note adjustment needed for local development 
    Expected Result: Application compiles and builds without blocking errors
    Failure Indicators: Compilation errors remaining or blocking build process
    Evidence: .sisyphus/evidence/task-5-build-process-output.log

  Scenario: Verification that all functionality integrated properly
    Tool: Development server test  
    Preconditions: Build may fail due to environment-specific DB requirements
    Steps:
      1. Run `npm run dev` to test in development environment
      2. Manually test that all pages affected by fixes work properly
      3. Test the API route that was fixed for TypeScript
      4. Test the navigation links that were corrected
    Expected Result: Development server runs properly and implements all fixes
    Evidence: .sisyphus/evidence/task-5-dev-server-verification.log
  ```

  **Evidence to Capture**:
  - [ ] Build process output showing success or noting environment requirement
  - [ ] Dev server verification of all fixes

  **Commit**: NO (verification only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **TypeScript Compilation Verification** — `unspecified-high`
  Run full `npx tsc --noEmit` to verify all TypeScript errors are resolved. Verify all changes were properly type-safe. Confirm no regressions were introduced in typing.
  Output: `TypeScript: PASS/FAIL with errors if any`

- [ ] F2. **Linter Pass Verification** — `unspecified-high`
  Run `npm run lint` and ensure all linting errors are corrected. Check that no new linting violations were introduced.
  Output: `ESLint: PASS/FAIL with violations if any`

- [ ] F3. **Navigation Flow Test** — `unspecified-high` (+ playwright skill if UI involved)
  Manually navigate the application flow and verify all fixed links direct to appropriate destinations. Test critical workflows that use the corrected navigation paths.
  Output: `Navigation: PASS/FAIL (broken links) with paths tested`

- [ ] F4. **Integration Verification** — `deep`
  Test that all changes integrate properly together (no conflicts between fixes), that functionality remains as expected, and that no side effects were introduced.
  Output: `Integration: PASS/FAIL with any issues found`

---

## Commit Strategy

- **1**: `feat(build): resolve audit critical issues` - API fixes, login form cleanup, nav fixes
- **2**: `chore(build): adjust build process for local dev` - build script adjustments if needed

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit  # Expected: no compilation errors
npm run lint  # Expected: no linting errors
```

### Final Checklist
- [ ] All TypeScript compilation errors resolved
- [ ] All eslint violations resolved
- [ ] All broken navigation links fixed
- [ ] All functionality tests pass
- [ ] Build completes without errors (with environment considerations noted)