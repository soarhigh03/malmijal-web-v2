# malmijal-web-v2

Website for MALMIJAL, the Korean speaking coach application.

## Development

```bash
npm install
npm run dev
```

## SEO / Google Search Console setup

This repo is prepared for Google Search Console URL-prefix verification.

### Environment variables

Set these in Vercel or your hosting provider:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=google-site-verification-token
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is used for canonical URLs, `robots.txt`, and `sitemap.xml`.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` should be the content value from Google Search Console's HTML tag verification method. Example: if Google gives `<meta name="google-site-verification" content="abc123" />`, set the env var to `abc123`.
- If the env var is absent, the site still builds; it just does not emit the Google verification meta tag.

### After deployment

1. Open Google Search Console.
2. Add a URL-prefix property for the production domain, for example `https://your-production-domain.com`.
3. Choose **HTML tag** verification.
4. Copy the `content` token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
5. Redeploy the site.
6. Confirm that the home page HTML includes `google-site-verification`.
7. Submit the sitemap:

```text
https://your-production-domain.com/sitemap.xml
```

### Generated SEO routes

- `/robots.txt`
- `/sitemap.xml`

Blog posts also emit `BlogPosting` JSON-LD structured data.
