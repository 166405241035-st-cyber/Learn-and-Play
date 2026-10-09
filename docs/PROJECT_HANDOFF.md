# Learn-and-Play — project handoff and design baseline

Updated: 9 October 2026 (Asia/Bangkok). Design baseline: 0.6. Repository: https://github.com/166405241035-st-cyber/Learn-and-Play

## 1. Purpose of this file
This is the starting point for a new assistant/chat when the original conversation is unavailable. Read this file, `AGENTS.md`, and the current repository before continuing. This document preserves the user's intent, constraints, proposals, work status and next steps. It is not a claim that the designed game already exists.

## 2. Current verified repository status
- At inspection before this documentation change, the public repository used `main` and contained only a 35-byte README (`# Learn-and-Play`, `Educational games`). The connection reported push permission.
- Verified main at `335e06b` before this continuation: six tracked documentation files only, clean working tree. No game implementation.
- Added design contracts, synthetic save example, recovery design, six-screen copy, draft rubric examples, and a small external art prompt/registry set. These remain documentation, not runtime features.
- No game scaffold, `package.json`, package lock, Phaser scenes, game save system, production assets or deployment workflow has been added by this task.
- User confirmed Node 22.19.0, npm 10.9.3, Git 2.55.0.windows.4, Node/npm under C:\\Program Files\\nodejs; clone succeeded after initial parent-directory Git errors. Keep Node 22.19.0 as starting baseline and recheck actual package engines. Assistant environment is separate.
- A detailed Word report was delivered earlier, but the repository documents should carry the continuing project context. The Word report is not present in this repository unless subsequently added.

## 3. Original intent and agreed scope
The user wants an educational game where playing can support substantive learning, rather than memorizing formulas alone. Initial audience: secondary-school students. Current subject: mathematics, with curriculum coverage and later preparation for competitive upper-secondary and university entrance.

Every topic should answer: what does it calculate; why is that quantity needed; what principle applies; how is it calculated and checked; how does the result inform a real decision?

The user chose sandbox freedom: personal goals, different activities/routes, experimentation, revision, and capabilities that grow with knowledge. Explicit instruction should be mixed into play. Subtle exposure alone is insufficient. A portfolio should show application, reasoning and development, not just scores.

Future subjects include Thai, foreign languages, science and social studies. Prepare shared data/interfaces now; do not expand first-release curriculum production to those subjects. New subjects may require new tools and graders, not merely replacing text.

## 4. Decisions versus proposals
| Status | Item |
| --- | --- |
| Agreed direction | Mathematics first; sandbox freedom; explicit teaching; systematic reasoning; meaningful assessment; portfolio; future subject support |
| Accepted development direction | Browser game, Phaser + TypeScript, VS Code, separate GitHub repository |
| Starting toolchain | Vite + npm proposed; user Node 22.19.0/npm 10.9.3 confirmed; dependency versions not locked |
| Agreed visual direction | Living 2D angled world; point-and-click and drag placement; two-frame animation baseline |
| Proposed specifics | Warm community theme, starting map, NPC roles, palette, dimensions, particular rewards and time cycle |
| Proposed save baseline | No login; IndexedDB with save export/import; online accounts later |
| User production preference | Generate artwork externally; write specifications/prompts in GitHub before producing many assets |
| Not implemented | All game systems, final art/audio, online hosting and full curriculum |

The user expects the assistant to design proactively, accept corrections, and point out conflicts with earlier goals. The current task authorizes documentation/setup guidance, not immediate full game development.

## 5. Game identity and loop
Proposed identity: an inviting community that develops through the player's projects. The player is a new member with a personal plot. Possible interests: building/decorating, selling, planning, investigating data. Interests are not permanent class selections.

Loop: choose a goal → inspect data → learn/practice what is needed → plan → act → inspect consequences → revise/expand → collect work and evidence.

Two valid routes: start with a desired project and discover needed knowledge; or learn a topic first and find an application. Connect both to the same curriculum map. Recommend missing learning without forcing all players down one linear quest.

If prerequisites are lacking: offer instruction, hints, smaller projects, another activity, or assessment to demonstrate existing knowledge. Basic help remains available. Practice should allow inspection/revision before spending resources and understandable recovery after mistakes.

## 6. World and control design
- 2D angled/isometric-like view, fixed camera angle initially, panning and zoom.
- Click ground to move; click an object/NPC to approach its interaction point and act.
- Drag/place, move, rotate and store objects during construction; show occupancy and invalid-placement reasons.
- Switch to a top-down plan for measurement. Do not measure from the angled drawing itself.
- Reference display 1600×900, angled tile 128×64 px, character height roughly 100–120 px at reference zoom, candidate frame canvas 160×192 px. These are trial sizes, not final standards.
- One logical cell is 1×1 metre for the first activity. Artwork height and footprint are separate data.
- Four walking directions, two frames per direction proposed. Continuous position interpolation; aligned foot anchors. Standing/work poses are extra assets.
- Maintain a clear path, fade obstructing foreground structures, hide roofs/walls as needed in build mode.

## 7. Starting map proposal
Logical grid: 32×24 cells. x increases east, y south; bounds below are inclusive. Angled rendering is a projection of this grid.

| Area | x | y | Function |
| --- | --- | --- | --- |
| Personal plot | 2–11 | 13–22 | Build, plan, storage |
| First activity floor | 4–7 | 15–20 | Exactly 4×6 cells/metres |
| Market | 21–29 | 9–20 | Materials and comparison |
| Central square | 13–18 | 10–15 | NPCs and work board |
| Learning centre | 3–10 | 2–8 | Lessons/practice |
| Portfolio corner | 21–28 | 3–7 | Display/access portfolio |
| Main vertical path | 15–16 | 2–22 | Connection |
| Main horizontal path | 2–29 | 11–12 | Connection |

Paths may overlap square areas. Main paths are two cells wide. Interaction points need a reachable standing cell; final collision layout remains to be validated with assets.

Interaction references: planning desk (9,15); storage (9,19); project sign (4,14); shop A (23,14); shop B (27,14); work board (13,10); learning point (7,7); portfolio board (23,6); bench (18,14); personal entrance (11,13).

## 8. Curriculum plan and coverage status
Initial mapping covers units/conversion, fractions/decimals, ratios/proportion/scale, percentages, area/volume, equations, simultaneous equations, functions/graphs, statistics and probability. This is a starter activity map, not the complete secondary curriculum.

Earlier planning described 15 IPST book indexes and 59 chapter occurrences, with overlap between basic/advanced books. Their detailed evidence and subtopic mapping are not stored here; verify and document before treating those counts as a curriculum audit.

Planned groups: prerequisite foundations; M1–M3; upper-secondary basic; upper-secondary additional; real applications; entrance preparation. Each objective needs stable ID, source/version, prerequisites, depth, lesson, practice, activity, assessment, grading guidance and review status. Use a coverage matrix to find omissions; chapter names alone are insufficient.

Initial target universities mentioned: Chulalongkorn, Mahidol, Thammasat, Kasetsart, Srinakharinwirot, Silpakorn, KMUTT, KMUTNB, KMITL, Suranaree, Chiang Mai, Khon Kaen, Prince of Songkla, Naresuan and Burapha. School targets: Triam Udom Suksa, MWIT, KVIS and Princess Chulabhorn Science High Schools. These are starting targets, not a verified ranking or current admission audit. Check program, round, year and other admission requirements; game scores do not guarantee admission.

Reference starting points:
- https://www.ipst.ac.th/curriculum
- https://proj14.ipst.ac.th/
- https://www.mytcas.com/blueprint/a-level-61-math1/
- https://www.mytcas.com/blueprint/a-level-62-math2/
- https://www.oecd.org/en/publications/pisa-2022-assessment-and-analytical-framework_dfe0bf9c-en/full-report/component-3.html

## 9. Explicit teaching and assessment
Shared reasoning routine: identify quantity/purpose → select data/units/assumptions → choose principle/model and explain → calculate/check → interpret/compare/decide.

Hint levels: prompting question; principle; setup assistance; full worked example. Record help used, especially in evidence tasks. A calculator may support arithmetic while the learner still selects data/model; allowed tools depend on what is assessed.

Five assessment methods:
1. Comparable pre/post tasks for baseline/development.
2. New situations for application.
3. Reasoning rubric.
4. Delayed tasks for retention, with intervening revision recorded.
5. Timed target-exam challenges, optional for general progression.

Main evidence: new task plus reasoning. Four rubric dimensions: understand problem/data; select principle/model; calculate/check; interpret/decide. Thresholds, task counts, rubric examples and delay periods require teacher review/pilot. Changed numbers in the same scenario are an initial step, not proof of broad transfer.

Mastery labels proposed: no evidence; succeeds with guidance; succeeds independently; applies in a new situation; confirmed after delay. Preserve conditions, tools, hint level, task/content version, first/latest attempts and pending-review status. Automated numeric checks are feasible; free reasoning needs a defined reviewing approach. AI is not a required dependency or assumed reliable grader.

Do not claim causal learning effectiveness from pre/post gain alone. A suitable comparison and records of other learning may be needed for such claims.

## 10. Prototype activity: Design My Space
Goal options: reading room, small shop, resting area. Let player choose arrangement and materials.

Given: 4×6 m floor; budget 4,000 fictional coins; activity-specific 10% allowance; whole-box purchases.
- Actual area = 24 m².
- Required material coverage including allowance = 26.4 m².
- A: 1.5 m²/box, 180 coins/box → 18 boxes, 3,240 coins, 27 m² purchased.
- B: 2 m²/box, 250 coins/box → 14 boxes, 3,500 coins, 28 m² purchased.
- Both meet budget/coverage. Choice reasoning can involve money remaining and stated preferences. Do not invent quality/durability data.
- Teach rounding up because purchases are whole boxes. The allowance is an activity condition, not a universal construction standard.
- Actual floor remains 24 m². Purchased coverage, material consumed, leftovers and required reserve must be represented distinctly. Reserve/inventory/refund/reset design is now recorded in [prototype rules](game-design/PROTOTYPE_RULES.md).

Initial assessment: 3×5 m, 10% allowance, budget 2,100; C 1.2 m²/box at 140; D 1.5 m²/box at 180. Required 16.5 m². C: 14 boxes, 1,960; D: 11 boxes, 1,980. Both feasible. Add a changed-context task later.

Stages: choose goal; inspect; plan/learn; compare; purchase; arrange; inspect/revise; assess; reflect; portfolio. Accepted rule baseline: separate project budget, return sealed boxes at purchase price, opened material cannot be returned, recover placed coverage for experimentation, reset without duplicate rewards. Read [prototype rules](game-design/PROTOTYPE_RULES.md). Numerical mastery thresholds and rubric examples remain unresolved.

## 11. Progression, rewards and portfolio
Track separately: world/project state; assessed skills; selected portfolio works. Money, hours, project beauty and random outcomes are not mastery.

Rewards should offer further use: new tools/designs, more complex projects, special exam-challenge opportunities, decoration/display. Base help is never gated behind timed exam success. Exact unlock conditions remain proposals.

Portfolio overview: featured works, skill evidence, development, suggested practice, filters by subject/skill/project/date. Work page: image/name/goal; constraints; plan/calculation; skills; revisions; result; assessment/help; reflection; task version/evidence.

Player may edit captions/reflection and select/reorder works. System assessment records stay separate; editing a caption must not change confirmed mastery. One project may link to several skills/subjects with separate assessment results. Export/share is later scope, with preview before disclosure.

## 12. Six-screen UX baseline
| Screen | Content/actions |
| --- | --- |
| World | Location/time/map top-left, resources/settings top-right, collapsible goal right, inventory/knowledge/portfolio bottom-left, contextual actions bottom-centre |
| Shop | Product list, detail/units/prices, comparison and cart; send to plan, quantity, purchase confirmation; distinguish project cost from total money |
| Plan/lesson | Top-down dimensions left, reasoning/calculation right, constraints header; lessons/hints/check/save/use-plan; preserve draft on navigation |
| Build | Select/place/move/rotate/store, undo/redo, plan view/grid toggle, photo and summary; show footprint and access-path constraints |
| Assessment | Purpose/tools/time before start; scenario/data, calculation/reason; draft/submit/help/pause per rules; dimension feedback and pending review |
| Portfolio | Featured works, evidence/development/practice; cover/reflection editing, evidence viewing, compare and continue-practice |

Common UX: clear back/close, prevent clicks passing through overlays, readable Thai/math/units, scale text, reduce motion, no color/audio-only status, explain unavailable actions. Background decoration/audio becomes less prominent when reading. Construction undo is not financial rollback unless explicitly designed.

## 13. Art, motion, audio and atmosphere
Proposed style: warm simple drawn cartoon; readable forms, soft outlines, restrained texture. Not committed to pixel art. Palette: cream #F6EEDC, green #79A879, blue #79B7C9, gold #E9BD62, terracotta #CB8065, dark text #384039. Check actual contrast, especially buttons/text; use symbols and words with status color.

Light upper-left, shadows lower-right; separate ground/contact shadows where needed. Keep all frames the same canvas/anchor. Angled world must remain consistent with top-down measurable dimensions.

Two-frame loops: feet/arms walking; small idle breath; work gestures; tree sway; cloth/flag; water; lamps. Different phases and pauses, not simultaneous whole-scene pulsing. A generated frame pair must be checked for geometry drift. Door/UI transitions may use code transforms rather than extra image frames. Rotated directional objects need appropriate artwork; do not mirror text/signs blindly.

Three prototype NPCs: material seller, learning guide, community member. Reachable interactions; no path blocking; ambient dialogue separate from retrievable task data. Projects may change how NPCs use the space.

Proposed morning/afternoon/evening visuals. Advance while exploring/building; pause resource-affecting time during planning/lessons/general assessments. Essential shops accessible initially. Exam clock separate. Exact cycle length unresolved.

Audio groups: music, ambience, world actions/footsteps, UI, learning feedback, rewards. Warm sparse music; area/distance-sensitive ambience; grass/stone/wood steps; place/move/open/buy; soft review cue on errors; meaningful completion cue. Limit repeated concurrent sounds, reduce background while reading, separate volume controls and visual equivalents.

## 14. Asset production workflow
User generates art externally. Store prompts/specs/registry in GitHub. Use IDs (CHAR-001, BUILD-001, OBJ-001 etc.) to link prompts and files.

Registry fields: purpose, prototype/later priority, frame/canvas size, transparency, view/anchor/footprint, light/reference, directions/frames, prompt/version, expected filenames, review notes, source/use terms and status.

Statuses: prompt not written → ready → generated → needs revision → approved → integrated. Start with a small style sample before full production. Keep original incoming files separate from approved runtime assets. Use code for labels, prices, formulas, graphs and simple UI shapes. Roof/wall layers and frame pairs must be specified before generation. Avoid giant composite scenes as the only usable asset.

Minimum prototype: floor/path variants; two material shops; learning centre; desk/storage/sign/bench/boards; floor material previews; one player and three NPC looks; two-frame trees/cloth; UI icons/panels; accurate plan visuals. Four directions × two walking frames = eight walking frames per character look, plus idle/work.

Proposed folders: docs/{overview,game-design,curriculum,assessment,ui,art-audio,technical,roadmap}; asset-prompts/{style,environment,characters,objects,animation}; assets/{incoming,approved,references}; src; public. These are planned categories, not a claim all folders exist. Final source/runtime asset convention to be selected during scaffolding.

## 15. Technical and save plan
Accepted: desktop web, TypeScript/Phaser, VS Code, GitHub. Proposed: Vite/npm and HTML/CSS learning/portfolio panels, no large UI framework initially. Pin actual dependencies and commit lockfile when implementing; do not generate into a non-empty root and accidentally delete docs.

Separate modules: world/movement; interactions/NPC; activities; inventory/shop/plans; curriculum; lessons/hints; tools; subject graders; mastery/rewards; portfolio; persistence; audio/time; settings.

Entity concepts: subject, skill/objective, lesson, activity/project, assessment task, attempt/result, evidence, reward, player progress. Stable IDs, content/schema versions, prerequisites and reference links. World submits work to grader; grader returns structured dimensions/evidence/help/review status; rewards consume confirmed results, not raw answers. Mock a small second-subject response shape to test extension, without producing its curriculum.

No login proposed initially. IndexedDB local save plus export/import backup. Local browser profile/origin matters: clearing site data, private browsing, or switching URL/domain may lose or separate saves. Display this and support backup before moving hosts. Online identity/sync, teacher access and multiplayer are later decisions. Never commit real player saves.

Save: project goals/drafts/layouts; money/inventory/purchases; activity state; attempts/evidence/help; confirmed skills/unlocks; portfolio captions/photos; settings; schema/content versions. Design photo storage/export size, validation, migration and backup recovery. Purchase/result/unlock changes must stay consistent; avoid duplicate reward on reload. Local saves are user-controlled and not tamper-proof credentials for high-stakes admissions.

Prototype project statuses: draft, active, ready to summarize, portfolio stored, paused. Evidence statuses separate: none, assisted, submitted, checked, partially pending.

## 16. Next steps in order

Comprehensive continuation: [end-to-end design 0.6](game-design/COMPREHENSIVE_DESIGN.md). Covers player journey, sandbox interactions, explicit lessons, assessment/pending review, portfolio, resources, art workflow, saves, extension and staged acceptance. All remain design.
1. Environment checks and clone completed by user report; verify current terminal when scaffolding.
2. Read accepted [prototype rules](game-design/PROTOTYPE_RULES.md) and [difficulty design](game-design/DIFFICULTY.md).
3. Drafts now written: [data contracts](technical/DATA_CONTRACTS.md), [save/recovery design](technical/SAVE_DESIGN.md), [synthetic example](technical/SAVE_EXAMPLE.json), [screen copy](ui/SCREEN_COPY.md), [rubric examples](assessment/RUBRIC_EXAMPLES.md). Review correctness/educator criteria before treating results as mastery.
4. Initial [asset registry](art-audio/ASSET_REGISTRY.md) and [external style sample prompts](../asset-prompts/style/STYLE_SAMPLE.md) prepared. User generates sample externally; review before expanding prompts/assets.
5. When authorized, scaffold Vite/TypeScript/Phaser with placeholder art, pin versions/lockfile, add Node/version configuration and appropriate checks.
6. Implement one end-to-end slice: explore → plan/lesson → shop → build → assess → portfolio → save/reload.
7. Validate curriculum/assessment with educator and test users; revise before expanding mathematics.
8. Add publishing workflow and deploy when requested; online accounts and further subjects follow evidence/need.

Acceptance: player chooses/revises a real goal; reasoning/instruction visible; new-task evidence and help recorded; pending results explicit; save/reload restores consistent state; portfolio distinguishes claims/evidence; small mock extension does not require rewriting shared reward/world logic.

## 17. Decision log and unresolved questions
- 9 Oct 2026: repository supplied; documentation/setup task starts; main/public confirmed.
- 9 Oct 2026: user confirmed Windows Node/npm/Git and successful clone. Exact package versions not selected.
- Theme/map/palette/dimensions remain adjustable.
- 9 Oct 2026: prototype rules 0.4 accepted, three difficulty axes accepted as 0.5. Documents added; advanced scenarios are designed, not implemented.
- 9 Oct 2026 continuation: documentation contracts use integer cm²/basis points/whole coins; proposed import uses staged validation and backup before replace. No runtime validator or saving implemented. Rubric/mastery thresholds remain pending educator review.
- Next concrete work: review the comprehensive design and external style sample; then scaffold when game implementation is explicitly requested. Read new detailed docs before activity changes.
- Need educator review and approach for free-text reasoning.
- Need exact unlock thresholds, rubric examples and retention schedule. Difficulty should be skill-specific, user-selectable and evidence-based; never silently raise it.
- Need handling of portfolio screenshots/storage/export.
- Need preferred art service/reference and asset rights records.
- Need hosting selection; GitHub Pages is a suitable proposed static prototype route, not yet enabled or deployed.

## 18. Message to start a new chat
> Continue Learn-and-Play: https://github.com/166405241035-st-cyber/Learn-and-Play . Read AGENTS.md, docs/PROJECT_HANDOFF.md and docs/SETUP_WINDOWS.md, then inspect the current files/branch. Summarize implemented versus planned work and continue the recorded next task. Preserve math-first sandbox, explicit teaching, evidence-based portfolio and external asset generation. Do not assume the old chat or claimed implementations exist.
