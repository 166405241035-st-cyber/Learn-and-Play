# Windows / VS Code setup and web publishing plan

Updated 9 October 2026. Status: documentation only; this repository does not yet contain a runnable game or package.json.

## 1. Common proposed toolchain
| Tool | Direction |
| --- | --- |
| Node.js | 24.x LTS, preferably latest available patch in that LTS line |
| Package manager | npm bundled with Node; do not mix npm/yarn/pnpm lockfiles |
| Editor | VS Code |
| Language | TypeScript |
| Game | Phaser; exact version selected and recorded during scaffold |
| Dev/build | Vite; exact version selected during scaffold |
| Browser | Current Chrome or Edge on desktop for first tests |
| Source/versioning | Git + this GitHub repository |

Node is a development/build tool here; the player does not install Node to play the published browser game. GitHub stores the source; Pages or another static host serves the built game. No player account/backend is required for the first local-save prototype.

Official Vite guide checked on this date requires Node 20.19+ / 22.12+; Node 24 LTS is our proposed common baseline, not a requirement that the user install exactly the assistant's patch version. Exact package engines must be rechecked when installing.

## 2. Inspect your own Windows computer first
Open VS Code → Terminal → New Terminal. PowerShell is fine. Run:

```powershell
node --version
npm.cmd --version
git --version
where.exe node
where.exe npm
```

`npm.cmd` avoids PowerShell choosing npm.ps1 when script execution is restricted; no execution-policy change is necessary for these commands. Send the output to the assistant. Do not send access tokens or passwords.

Interpretation:
- `v24.x.x`: matches our Node major baseline; check patch/package engines when scaffolding.
- `v22.12.0` or later in 22.x: may satisfy current Vite, but agree whether to align on 24 LTS.
- Old Node (for example 18 or 22 below 22.12): update before current Vite.
- Command not found: install the relevant tool, close/reopen VS Code, retry.
- Multiple node paths: identify the active install before updating; do not remove paths blindly.
- npm errors other than a PowerShell script-policy issue: retain the actual message for diagnosis.

The assistant measured Node v24.19.0/npm 11.9.0 on its own environment, not yours. Since the repository has no package.json yet, no existing dependency compatibility/build has been verified.

## 3. Install if needed
1. Download Windows Node 24 LTS installer from https://nodejs.org/en/download . Select the architecture matching your computer, typically x64; keep npm/PATH options.
2. Install Git for Windows from https://git-scm.com/downloads/win if `git` is missing.
3. Install/open VS Code from https://code.visualstudio.com/ . TypeScript support is built in. Extensions are optional, not prerequisites.
4. Restart VS Code and rerun the checks above.

No Java/Gradle is required for this web project. Keep it separate from the Minecraft repository.

## 4. Clone and open
Example parent directory below; use a convenient location of your own. Skip clone if you already cloned this repository.

```powershell
New-Item -ItemType Directory -Force C:\projects
Set-Location C:\projects
git clone https://github.com/166405241035-st-cyber/Learn-and-Play.git
Set-Location Learn-and-Play
code .
```

If `code` is unavailable, use VS Code File → Open Folder → C:\projects\Learn-and-Play. Clone produces only repository files; it does not install Node packages.

Check the opened folder:

```powershell
git remote -v
git branch --show-current
git status
```

Expect this repository and normally main. Read AGENTS.md and docs before work. Only trust the workspace if you trust this project/source. Do not discard uncommitted changes to make a pull succeed.

After documentation is published and if the working tree is clean:

```powershell
git pull --ff-only origin main
```

Public cloning does not require a player login. Pushing source may require GitHub developer sign-in via a supported credential helper; never put credentials into the project.

## 5. Not runnable yet — commands for the later scaffold
Do not run `npm install` or `npm run dev` expecting a game until package.json exists. Do not run create-vite directly into this non-empty repository and accept file deletion prompts: it can conflict with README/docs.

When scaffold creation is requested, the assistant should prepare the template separately, merge the needed files without overwriting docs, add Phaser, pin compatible versions, and commit package.json/package-lock.json. Proposed scripts:

| Script | Purpose |
| --- | --- |
| npm run dev | Start local development server |
| npm run typecheck | Validate TypeScript; only when this script is added |
| npm run build | Type-check/build according to committed scripts |
| npm run preview | Inspect built output locally; not a production hosting service |

After a lockfile is committed:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by the terminal (often http://localhost:5173). Stop with Ctrl+C. On updates, pull safely and rerun npm ci if dependencies changed. Use the dev server rather than double-clicking index.html. Local play saves may be separate from deployed URL saves because browser storage is origin-specific.

Proposed project configuration to add during scaffold: Node version hint (.nvmrc or .node-version), engines in package.json, ignore node_modules/dist/local secrets, npm lockfile, formatting/editor rules, and checks. No such files are claimed to exist now.

## 6. GitHub settings for a future web build
Current repo is public/main. No need to enable Pages just to write docs or run locally.

Proposed first hosting: GitHub Pages for static prototype. When the runnable build is ready:
1. Repository Settings → Pages → Build and deployment → Source: GitHub Actions.
2. Add a reviewed Pages workflow that installs from lockfile, runs required checks/build, uploads dist, and deploys via the official Pages actions.
3. Workflow uses least required permissions: contents: read; pages: write; id-token: write for deployment, a github-pages environment and deployment concurrency.
4. Project URL would normally be https://166405241035-st-cyber.github.io/Learn-and-Play/ after successful setup/deployment. This URL is a prediction, not a live verified game.
5. Configure Vite base `/Learn-and-Play/` for that project URL; game loaders must use the correct base for assets too. A root custom domain requires a different base.
6. Verify image/audio loading, route refresh if applicable, save/import behavior and actual deployment result.

Avoid using Deploy from a branch on raw TypeScript source and expecting a compiled Vite game. Pages serves static files; it is not the later online-save database/auth service. Do not globally grant broader Actions permissions just to fix a workflow issue.

Do not enable auto-deploy blindly before agreeing when commits should publish. No Pages settings/workflow/deployment were changed by the documentation task.

## 7. Player saves
Proposed prototype: no login, IndexedDB, explicit save status, backup export/import. Clearing browser data/private browsing can remove saves. Different browser/profile/host has separate data; export before moving. Online accounts/cross-device sync are later scope. Player saves/identifying data never go into this public repository.

## 8. User preparation checklist
- [ ] Run and send Node/npm/Git checks.
- [ ] Clone/open the correct project in VS Code.
- [ ] Confirm no local edits are lost during updates.
- [ ] Keep original external artwork with IDs and usage terms.
- [ ] Agree prototype rules before coding.
- [ ] Later, run committed setup/build commands and report exact errors.

## 9. Official references
- Node download/LTS: https://nodejs.org/en/download
- Vite prerequisites/scaffold: https://vite.dev/guide/
- Phaser: https://docs.phaser.io/phaser/getting-started/making-your-first-phaser-game
- Pages workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

These are setup references checked for guidance; recheck version-sensitive details when actual dependencies are selected.
