# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

---

## 0.1.1 — 2026-04-04

### Fixes

- Filter unlisted item types from nav-group-project (#247)
- Add `listed` field to demo mock so nav shows item types in demo mode
- Remove reconciliation plan UI after daemon removed those RPCs

---

## 2026-03-03

### Features

- Make URL the single source of truth for org and project (#135, #174)

### Refactors

- Remove agent terminology from app codebase (#133)
- Remove remaining `max-lines-per-function` ESLint suppressions (#134, #158)

### Tests

- Add e2e tests verifying issues table centering and column visibility (#184)

---

## 2026-02-27

### Features

- Add e2e visual testing job to CI workflow (#118, closes #85)
- Replace hardcoded hex colors with design system tokens (#131, #151)
- Add dynamic page types driven by `.centy/<type>/config.yaml` (#181)
- Add `force-static` to all pages missing static generation config (#183)

### Fixes

- Sync `ProjectProvider` state from URL on page load and navigation (#125, #182)
- Resolve `ItemTypeConfigProto` field 8 collision causing "String" in nav
- Use `route()` instead of `Object.assign` for nav item URLs

---

## 2026-02-25

### Features

- Use URL query params as single source of truth for issue table filters (#123, #173)
- Fail build when required environment variables are missing (#122)
- Hide `ProjectSelector` when no organization is explicitly selected (#119, #121)
- Capitalize plural field for nav-group-project item type labels (#117)
- Add untrack action to organizations management page (#176)

### Fixes

- Use project item type statuses for org issue status dropdown (#114, closes #175)
- Restore hardcoded fallbacks for env URL constants (#112)
- Remove unused `effectiveOrg`/`effectiveProject` props from nav components (#120, #121)

---

## 2026-02-24

### Features

- Add sort controls to organizations management page (#100, closes #175)

### Fixes

- Replace generic `Error` with custom error classes (#97, #99, #166, #167)
- Remove `security/detect-object-injection` ESLint overrides (#98, #160)
- Remove all `eslint-disable` comments (#105)

### Refactors

- Remove agent terminology from app (#104)
- Improve project-selector accessibility and deduplicate keyboard navigation (#101, #68)

---

## 2026-02-23

### Features

- Add E2E tests for create issue/doc forms (#95)
- Align project with `eslint-config-agent` rules (#82, #45)
- Persist sorting and filter settings for aggregate issues view (#72)

### Fixes

- Migrate frontend to generic items API
- Show all projects when no org is explicitly selected
- Resolve ESLint errors blocking CI (#81, #162)
- Read issue statuses from item type config (#85, #175)
- Add missing spec files, remove `ddd/require-spec-file` override (#92, #93, #161)

### Refactors

- Make URL the single source of truth for org and project (#87, closes #174)
- Merge create doc and issue hooks into `useCreateItemSubmit` (#86)

---

## 2026-02-22

### Features

- Add org issue management UI (#67, #55)
- Add daemon page accessible via status button (#63, #41)
- Auto-save form draft for create issue and doc pages (#66, #37)
- Auto-generate project config page from proto schema (#61, #150)
- Add keyboard navigation for project-selector accessibility (#64, #68)
- Add org filter integration and org badge in project cards (#78, #53)

### Fixes

- Remove stale `eslint-disable` directives (#83, #168)
- Replace generic `Error` with custom error classes (#73, #167)
- Remove `security/detect-object-injection` ESLint rule overrides (#69, #160)
- Resolve pre-existing lint errors blocking merge (#71)

### Refactors

- Make project-route consumers read from URL via `usePathContext` (#68)

### Tests

- Add tablet and demo mode visual tests for daemon disconnected overlay (#76, #71)
