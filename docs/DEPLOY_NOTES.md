# Deploy notes (Vercel) — researched 2026-11-05

Read from the official Vercel documentation on 2026-11-05 (each page's own "last updated" date in brackets). Plans and features change: re-check before relying on this.

## Deployment Protection (https://vercel.com/docs/deployment-protection — updated 2026-09-15)

- **Methods:** Vercel Authentication (only Vercel users with access), Passport (Enterprise), **Password Protection (Pro: $20 per month per protected project; Enterprise: included; not available on Hobby)**, Trusted IPs (Enterprise).
- **Scopes:** *Standard Protection* (all plans) protects every URL **except production domains**; *All Deployments* (all plans) also protects the production domain; *Only production* needs Trusted IPs (Enterprise).
- "Vercel Authentication for All Deployments and Deployment Protection Exceptions do not require a paid add-on."

## Bypass and sharing (https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection — updated 2026-09-15; https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/sharable-links — updated 2026-08-28)

- **Shareable Links** (all plans; Hobby: one link per account) give external people access through a secure query parameter. **The docs say nothing about link-preview crawlers** (WhatsApp, Instagram, Facebook, Twitter/X) being able to read a protected page through such a link.
- **Protection Bypass for Automation** (all plans) uses a secret header or query parameter — meant for tests and webhooks; putting a secret into a link sent to people is not appropriate.
- **Deployment Protection Exceptions** make chosen preview domains fully public.

**Conclusion for this pitch:** no documented option keeps a password/login on the page *and* lets chat-app preview bots read it. As decided by the owner (default deploy mode), the site is deployed as an **unlisted production URL with an unguessable name, no password, `noindex`** (robots meta + `robots.txt` + `X-Robots-Tag`). With Standard Protection (the default scope) the production domain stays public while preview/deployment URLs stay protected.

## Build and deploy from this machine (https://vercel.com/docs/cli/build — updated 2026-10-07; https://vercel.com/docs/cli/deploy — updated 2026-09-18; https://vercel.com/docs/cli/link — updated 2026-08-11)

- `vercel build` builds locally into `.vercel/output` (Build Output API); "it is recommended to run the `vercel pull` command before invoking `vercel build`". `vercel build --prod` uses Production environment variables.
- `vercel deploy --prebuilt` uploads the result of `vercel build` "without sharing the Vercel Project's source code with Vercel"; `--prod` deploys to the production domain; "the first deployment of a new project is always a production deployment". `--archive=tgz` reduces the number of uploaded files.
- `--name` is **deprecated**: link the folder to a project with `vercel link` (interactive) or `vercel link --yes --project <name>`.
- `stdout` of `vercel deploy` is always the deployment URL; the production domain is shown in the CLI output and the dashboard (normally `<project-name>.vercel.app` when that name is free).

Why prebuilt: creator photos are gitignored, so a Git-connected Vercel build would not contain them; the local build does (only the three duo photos — `npm run check` verifies `dist/`).

`vercel.json` pins `framework: vite`, `installCommand: npm install --no-audit --no-fund` (not `npm ci`: on this machine's FUSE-mounted drive `npm ci` cannot delete `node_modules` while a dev server holds a file — it failed once with `ENOTEMPTY`), `buildCommand: npm run build`, `outputDirectory: dist`, plus the rewrites and headers.

## What happened on the first deploy (2026-11-05)

The owner imported the GitHub repository into Vercel ("Deployed via Project import", branch `main`, commit `1b95ef1`): project **hipz-website**, team **anevio** (Hobby), production domain **https://hipz-website-snowy.vercel.app**. Because creator photos are gitignored, that Git build had **no creator photos** (confirmed on the owner's phone). Fix: disconnect Git in Vercel (Settings → Git → Disconnect) and deploy only local prebuilt builds to the same project. The planned new project name `hipz-o1uo7l` was not used.

## Commands (run them yourself; never paste tokens into a chat)

```bash
cd "<path-to>/hipz-website"
npm i -g vercel@latest          # if not installed (or prefix commands with: npx vercel@latest)
vercel login                    # opens the browser; nothing to paste anywhere
vercel whoami
vercel link                     # Set up? Y → scope: anevio → Link to existing project? Y → hipz-website
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod # production domain: https://hipz-website-snowy.vercel.app

```

Check in the dashboard → Settings → Git that **no repository is connected**. Keep **Standard Protection** in Settings → Deployment Protection (production domain public, other deployment URLs protected).

Redeploy after any change: `npm run check` → `vercel build --prod` → `vercel deploy --prebuilt --prod`. Never re-connect Git.

## Lesson: no `cleanUrls` (2026-11-05)

The first local deploy served unknown paths (`/flavors/mango`, `/no/such/page`) as Vercel's own 404 instead of the app. Vercel's generated routes (`.vercel/output/config.json`) showed why: with `"cleanUrls": true` the file `index.html` is registered as `/`, so the SPA fallback rewrite to `/index.html` failed its filesystem check. `cleanUrls` was removed (the per-route rewrites already point at real files); a unit test keeps it out. The local stand-in `scripts/serve-vercel.mjs` does not model `cleanUrls`, which is why it had not caught this.

