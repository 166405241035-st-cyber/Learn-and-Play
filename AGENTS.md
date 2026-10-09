# Learn-and-Play — instructions for project assistants

## Start here
1. Read `docs/PROJECT_HANDOFF.md` completely before designing or changing this project.
2. Read `docs/SETUP_WINDOWS.md` for the development environment and hosting plan.
3. Read `docs/game-design/PROTOTYPE_RULES.md` and `docs/game-design/DIFFICULTY.md` before activity/assessment changes.
4. Inspect the actual repository, branch, working tree and current files. Repository state is authoritative for implemented features; the design document is not evidence that a feature exists.
5. Preserve the distinction between agreed requirements, proposed details, implemented work, and unresolved decisions.

## Project requirements
- Current subject: secondary-school mathematics. Prepare extension points for Thai, foreign languages, science and social studies without building those curricula now.
- A living 2D sandbox: angled world, point-and-click movement/interactions, drag-and-place construction. Two-frame animation is the baseline, with continuous movement.
- Teach explicitly: why a quantity is needed, relevant data/units, principle/formula, calculation/check, interpretation/decision.
- Separate world success, assessed mastery, and portfolio evidence. Never infer mastery from money, play time, appearance, or a lucky random outcome.
- Keep basic learning assistance accessible. Record hints/tools used in assessments. Pending review is not confirmed mastery.
- User generates artwork externally. Maintain asset specifications and prompts in GitHub; do not bulk-generate artwork unless requested.
- Earlier on 9 October 2026, the user authorized the initial placeholder prototype. Latest clarification supersedes continuation authorization: for the seven game-experience corrections, research and document a systematic design BEFORE further runtime edits. Current scope is documentation only; preserve the existing prototype and wait for a new explicit implementation instruction after design review. Read `docs/ui/GAME_EXPERIENCE_REDESIGN_PLAN.md`; next work is design review and detailed wireframes, not automatic S3 implementation. Hosting, online accounts and paid services remain outside this scope.

## Continuity
- Update the handoff's current status, next actions and decision log after meaningful changes.
- Link detailed documents from the handoff as they are added. Keep enough context for a new chat to continue without the old transcript.
- Explain conflicts with prior requirements and propose a resolution; do not silently discard the user's goal.
- Do not invent completed curriculum verification, installed dependencies, test results, deployment URLs or the user's local Node version.
- Never commit credentials, personal player saves, `node_modules`, or generated build output. Review current repository rules before edits.

## Proposed technical direction
Desktop-browser first; TypeScript + Phaser for the world, HTML/CSS for text-heavy learning/portfolio panels, Vite for development/build, npm for dependencies. The user's confirmed starting toolchain is Node 22.19.0 and npm 10.9.3; check package engines when scaffolding. Node 24 is optional, not required. The first scaffold pins Vite 8.3.4, TypeScript 5.9.3 and Phaser 3.90.0 with npm lockfile. Recheck engines before future upgrades.
Local IndexedDB saves plus export/import first. No player login initially; online identity/sync is later work. Keep grading, reward rules, world logic and subject content separate.

## Language
Communicate with the user in Thai. Use readable English identifiers/filenames. Prefer concrete explanations and distinguish plans from verified behavior.
