# Phase 1 – Admin Foundation: Checklist

Use this checklist to track completion of all tasks scoped for Phase 1 under the **Frontend-First** roadmap. Check items off as they are finished during the sprint.

## 1. Project Initialization

- [x] Bootstrap codebase (monorepo or separate front-/back-end repos).
- [x] Configure Continuous Integration (CI) pipeline (linting, unit tests, build).
- [x] Initialize environment configuration for **dev**, **staging**, **prod** (`.env` conventions).

## 2. Admin Authentication _(Back-End – deferred to Q2)_

> These tasks are listed here for completeness. They will be implemented once backend work begins. For now, front-end can rely on mock auth responses.

- [ ] Design database schema for `AdminUser` (email, hashed_password, role, status).
- [ ] Implement secure password hashing (bcrypt/argon2).
- [ ] Create login & logout API endpoints.
- [ ] Issue JWT / secure session cookies with refresh-token rotation.
- [ ] Implement “forgot password / reset password” flow.
- [ ] Seed migration for initial super-admin account.

## 3. Basic Dashboard UI Shell

- [x] Set up React admin app with routing and protected route guard.
- [x] Build layout components: **Side Navigation**, **Top Bar** (logo, user menu), **Main Content** area.
- [x] Integrate design system (**TailwindCSS**, **MUI**, or **Ant Design**).
- [x] Implement responsive behaviour for desktop, tablet, and mobile breakpoints.
- [x] Add placeholder pages/routes for upcoming modules: **Facilities**, **Users**, **Reports**, **Settings**.

## 4. Mock & Testing Setup

- [x] Configure **Mock Service Worker (MSW)** or equivalent for simulating API responses.
- [ ] Write unit tests for UI components (Jest + React Testing Library).
- [ ] Establish basic Cypress/Playwright end-to-end test for login flow using mocks.

---

### How to Use

1. Copy this checklist into your issue tracker or project board if desired.
2. Mark items as completed (`[x]`) during the sprint.
3. Anything tagged _Back-End_ should remain unchecked until backend development starts in Q2.
