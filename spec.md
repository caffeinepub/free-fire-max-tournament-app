# Specification

## Summary
**Goal:** Deliver an MVP Free Fire Max Tournament app with core navigation, Internet Identity authentication, tournament/registration management, and basic organizer tools including brackets, all with a cohesive esports-themed UI and required static branding assets.

**Planned changes:**
- Create app routes/pages and navigation for: Home (upcoming tournaments), Tournaments (browse/search), Tournament Details, Create Tournament (organizer), My Registrations, and Profile.
- Integrate Internet Identity sign-in; show signed-in/out state and gate organizer/admin actions and player registration behind authentication.
- Implement a single-actor Motoko backend with persistent tournament data models and CRUD/query methods, including validated tournament status transitions.
- Implement tournament registration flows (IGN, optional team name, squad member IGNs up to team size), plus view/cancel registration while open; add organizer view of registrations.
- Add basic manual bracket/round management: create rounds, create matches, assign registrations, record results, and show read-only rounds/matches on Tournament Details.
- Provide an organizer/admin dashboard for editing tournament info, changing statuses (open/close/lock/start/complete/cancel), and posting text announcements visible on Tournament Details.
- Apply a consistent esports visual theme using Tailwind and existing UI components by composition, avoiding blue/purple as primary brand colors.
- Add generated static images under `frontend/public/assets/generated` and use them in the header and/or Home hero.

**User-visible outcome:** Users can browse tournaments, sign in with Internet Identity, register for open tournaments, view and manage their registrations, and see brackets/results and announcements; organizers can create and manage tournaments, registrations, rounds/matches, and tournament status via authenticated controls.
