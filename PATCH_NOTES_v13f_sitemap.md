# v13f: sitemap + robots

- Adds `app/sitemap.ts` (served as `/sitemap.xml`).
- Adds `app/robots.ts` (served as `/robots.txt`).

Uses `NEXT_PUBLIC_SITE_URL` if set, otherwise `VERCEL_URL`, otherwise localhost.
