# Security

Security fixes target the latest code on `main`. Update your fork regularly; older forks and deployments are not maintained here.

## Report a vulnerability

Use GitHub's [private vulnerability reporting](https://github.com/valenradovich/agustinegea/security/advisories/new) for this repository. Include the affected revision, reproduction steps, impact, and a suggested fix if you have one. Do not open a public issue containing exploit details or credentials.

This is a small community project; response times are not guaranteed. If a credential is exposed, revoke it immediately—removing it in a later commit does not remove it from Git history.

## Deployments

No secrets or database are needed for the default site. Everything in `lib/portfolio.ts` and any `NEXT_PUBLIC_*` variables is public. Keep local configuration in ignored `.env.local` files and configure deployment secrets through your hosting provider. Analytics is optional and disabled by default.

Dependabot checks dependencies weekly. Run `pnpm audit` locally when updating packages; no separate CI audit workflow is configured.
